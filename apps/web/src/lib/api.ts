const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
};

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('mtmg_access');
      this.refreshToken = localStorage.getItem('mtmg_refresh');
    }
  }

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mtmg_access', access);
      localStorage.setItem('mtmg_refresh', refresh);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mtmg_access');
      localStorage.removeItem('mtmg_refresh');
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    retry = true,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401 && retry && this.refreshToken) {
      const refreshed = await this.tryRefresh();
      if (refreshed) return this.request<T>(path, options, false);
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        json.message ||
        (Array.isArray(json.errors) ? json.errors.join(', ') : null) ||
        `Error ${res.status}`;
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }

    return (json.data !== undefined ? json.data : json) as T;
  }

  private async tryRefresh(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (!res.ok) {
        this.clearTokens();
        return false;
      }
      const json = await res.json();
      const data = json.data || json;
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }
}

export const api = new ApiClient();

// ── Domain helpers ───────────────────────────────────

export type SearchHit = {
  id: string;
  type: 'country' | 'city';
  name: string;
  nameEn?: string;
  code?: string | null;
  countryCode?: string;
  countryName?: string;
  lat: number;
  lng: number;
  popular?: boolean;
  imageUrl?: string | null;
};

export type Country = {
  id: string;
  code: string;
  name: string;
  nameEs: string;
  lat: number;
  lng: number;
  popular: boolean;
  cities?: City[];
  _count?: { cities: number };
};

export type City = {
  id: string;
  name: string;
  nameEs: string;
  lat: number;
  lng: number;
  iataCode?: string | null;
  popular: boolean;
  description?: string | null;
  country?: { id: string; code: string; name: string; nameEs: string };
  hotels?: Hotel[];
};

export type Flight = {
  id: string;
  flightNumber: string;
  airline: { code: string; name: string };
  origin: { id: string; name: string; iata: string | null; country: string; lat: number; lng: number };
  destination: { id: string; name: string; iata: string | null; country: string; lat: number; lng: number };
  departureAt: string;
  arrivalAt: string;
  durationMinutes: number;
  cabinClass: string;
  basePriceUsd: number;
  totalPriceUsd: number;
  seatsAvailable: number;
  currency: string;
};

export type Hotel = {
  id: string;
  name: string;
  stars: number;
  address?: string | null;
  description?: string | null;
  amenities: string[];
  imageUrl?: string | null;
  pricePerNightUsd: number;
  totalPriceUsd?: number;
  currency: string;
  city?: { id: string; name: string; country: string };
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string | null;
};

export const destinationsApi = {
  search: (q: string) => api.get<SearchHit[]>(`/destinations/search?q=${encodeURIComponent(q)}`),
  countries: (popular?: boolean) =>
    api.get<Country[]>(`/destinations/countries${popular ? '?popular=true' : ''}`),
  country: (code: string) => api.get<Country>(`/destinations/countries/${code}`),
  cities: (params?: { country?: string; popular?: boolean; q?: string }) => {
    const sp = new URLSearchParams();
    if (params?.country) sp.set('country', params.country);
    if (params?.popular) sp.set('popular', 'true');
    if (params?.q) sp.set('q', params.q);
    const qs = sp.toString();
    return api.get<City[]>(`/destinations/cities${qs ? `?${qs}` : ''}`);
  },
  city: (id: string) => api.get<City>(`/destinations/cities/${id}`),
};

export const flightsApi = {
  search: (params: Record<string, string | number>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)));
    return api.get<{
      passengers: { adults: number; children: number; infants: number; seniors: number };
      tripType: string;
      outbound: Flight[];
      inbound: Flight[];
    }>(`/flights/search?${sp.toString()}`);
  },
};

export const hotelsApi = {
  search: (params: Record<string, string | number>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)));
    return api.get<{
      nights: number;
      rooms: number;
      hotels: Hotel[];
    }>(`/hotels/search?${sp.toString()}`);
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password,
    }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', data),
  me: () => api.get<User>('/auth/me'),
  logout: () => {
    const refresh = typeof window !== 'undefined' ? localStorage.getItem('mtmg_refresh') : null;
    return api.post('/auth/logout', { refreshToken: refresh || '' }).finally(() => api.clearTokens());
  },
};

export const bookingsApi = {
  create: (body: unknown) => api.post('/bookings', body),
  list: () => api.get('/bookings'),
  get: (id: string) => api.get(`/bookings/${id}`),
  confirm: (id: string) => api.patch(`/bookings/${id}/confirm`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};
