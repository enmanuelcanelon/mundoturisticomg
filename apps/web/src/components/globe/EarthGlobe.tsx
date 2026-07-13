'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { destinationsApi, type Country, type SearchHit, type City } from '@/lib/api';
import { useBookingStore } from '@/store/booking-store';
import {
  featureCentroid,
  getFeatureName,
  namesMatch,
} from '@/lib/country-match';

type Marker = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'country' | 'city';
  size: number;
  color: string;
  raw: Country | City | SearchHit;
};

type GeoFeature = {
  type?: string;
  properties?: Record<string, unknown>;
  geometry?: { type?: string; coordinates?: unknown };
};

export function EarthGlobe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [polygons, setPolygons] = useState<GeoFeature[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  /** País resaltado por clic (nombre del GeoJSON) */
  const [highlightedGeoName, setHighlightedGeoName] = useState<string | null>(null);
  /** Hover ligero sobre polígono */
  const [hoveredGeoName, setHoveredGeoName] = useState<string | null>(null);

  const focusPoint = useBookingStore((s) => s.focusPoint);
  const selectedCountry = useBookingStore((s) => s.selectedCountry);
  const selectedCity = useBookingStore((s) => s.selectedCity);
  const flyToDestination = useBookingStore((s) => s.flyToDestination);
  const setSelectedCountry = useBookingStore((s) => s.setSelectedCountry);
  const setPanelOpen = useBookingStore((s) => s.setPanelOpen);
  const setStep = useBookingStore((s) => s.setStep);
  const setFocusPoint = useBookingStore((s) => s.setFocusPoint);

  // Tamaño del contenedor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Datos + polígonos del mundo
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cList, cityList] = await Promise.all([
          destinationsApi.countries(),
          destinationsApi.cities({ popular: true }),
        ]);
        if (cancelled) return;
        setCountries(cList);
        setCities(cityList);
        setDataReady(true);

        try {
          const geo = await fetch(
            'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
          ).then((r) => r.json());
          if (!cancelled) setPolygons((geo.features || []) as GeoFeature[]);
        } catch {
          /* sin polígonos */
        }
      } catch (e) {
        console.error('Globe data load failed', e);
        if (!cancelled) setDataReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sincronizar highlight con país seleccionado del store (búsqueda, etc.)
  useEffect(() => {
    if (!selectedCountry) return;
    const match = polygons.find((f) => {
      const n = getFeatureName(f);
      return (
        namesMatch(n, selectedCountry.name) || namesMatch(n, selectedCountry.nameEs)
      );
    });
    if (match) setHighlightedGeoName(getFeatureName(match));
  }, [selectedCountry, polygons]);

  // Cámara inicial
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const g = globeRef.current;
    g.pointOfView({ lat: 10, lng: -66, altitude: 2.2 }, 0);
    const controls = g.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
    }
  }, [globeReady]);

  // Fly-to animado
  useEffect(() => {
    if (!globeRef.current || !focusPoint) return;
    const g = globeRef.current;
    const controls = g.controls();
    if (controls) controls.autoRotate = false;
    g.pointOfView(
      {
        lat: focusPoint.lat,
        lng: focusPoint.lng,
        altitude: focusPoint.altitude ?? 0.55,
      },
      1600,
    );
  }, [focusPoint]);

  const findCatalogCountry = useCallback(
    (geoName: string): Country | undefined => {
      return countries.find(
        (c) => namesMatch(geoName, c.name) || namesMatch(geoName, c.nameEs),
      );
    },
    [countries],
  );

  /** Clic en cualquier zona del mapa (polígono de país) */
  const handlePolygonClick = useCallback(
    async (poly: object) => {
      const feat = poly as GeoFeature;
      const geoName = getFeatureName(feat);
      if (!geoName) return;

      setHighlightedGeoName(geoName);
      const center = featureCentroid(feat);

      // Match con catálogo MTMG
      const catalog = findCatalogCountry(geoName);

      if (catalog) {
        try {
          const full = await destinationsApi.country(catalog.code);
          setSelectedCountry(full);
          flyToDestination(
            {
              id: full.id,
              type: 'country',
              name: full.nameEs,
              lat: full.lat,
              lng: full.lng,
              code: full.code,
            },
            full,
          );
        } catch {
          setSelectedCountry(catalog);
          flyToDestination(
            {
              id: catalog.id,
              type: 'country',
              name: catalog.nameEs,
              lat: catalog.lat,
              lng: catalog.lng,
              code: catalog.code,
            },
            catalog,
          );
        }
        return;
      }

      // País fuera del catálogo: igual resalta y vuela
      setSelectedCountry({
        id: `geo-${geoName}`,
        code: '',
        name: geoName,
        nameEs: geoName,
        lat: center.lat,
        lng: center.lng,
        popular: false,
        cities: [],
      });
      setFocusPoint({ lat: center.lat, lng: center.lng, altitude: 1.1 });
      setPanelOpen(true);
      setStep('dates');
    },
    [
      findCatalogCountry,
      flyToDestination,
      setSelectedCountry,
      setFocusPoint,
      setPanelOpen,
      setStep,
    ],
  );

  const handleMarkerClick = useCallback(
    async (m: Marker) => {
      if (m.type === 'country') {
        const country = m.raw as Country;
        setHighlightedGeoName(country.name);
        try {
          const full = await destinationsApi.country(country.code);
          setSelectedCountry(full);
          flyToDestination(
            {
              id: full.id,
              type: 'country',
              name: full.nameEs,
              lat: full.lat,
              lng: full.lng,
              code: full.code,
            },
            full,
          );
        } catch {
          setSelectedCountry(country);
          flyToDestination(
            {
              id: country.id,
              type: 'country',
              name: country.nameEs,
              lat: country.lat,
              lng: country.lng,
              code: country.code,
            },
            country,
          );
        }
      } else {
        const city = m.raw as City;
        flyToDestination(
          {
            id: city.id,
            type: 'city',
            name: city.nameEs,
            lat: city.lat,
            lng: city.lng,
            code: city.iataCode ?? undefined,
            countryCode: city.country?.code,
            countryName: city.country?.nameEs,
          },
          selectedCountry,
        );
        setPanelOpen(true);
        setStep('dates');
      }
    },
    [flyToDestination, setSelectedCountry, setPanelOpen, setStep, selectedCountry],
  );

  const isFeatureHighlighted = useCallback(
    (feat: GeoFeature) => {
      const name = getFeatureName(feat);
      if (!name) return false;
      if (highlightedGeoName && namesMatch(name, highlightedGeoName)) return true;
      if (
        selectedCountry &&
        (namesMatch(name, selectedCountry.name) ||
          namesMatch(name, selectedCountry.nameEs))
      ) {
        return true;
      }
      return false;
    },
    [highlightedGeoName, selectedCountry],
  );

  const isFeatureHovered = useCallback(
    (feat: GeoFeature) => {
      const name = getFeatureName(feat);
      return !!(hoveredGeoName && name && namesMatch(name, hoveredGeoName));
    },
    [hoveredGeoName],
  );

  const polygonCapColor = useCallback(
    (feat: object) => {
      const f = feat as GeoFeature;
      if (isFeatureHighlighted(f)) return 'rgba(255, 90, 0, 0.40)'; // naranja MG
      if (isFeatureHovered(f)) return 'rgba(0, 102, 204, 0.30)'; // azul MG
      return 'rgba(0, 74, 153, 0.07)';
    },
    [isFeatureHighlighted, isFeatureHovered],
  );

  const polygonAltitude = useCallback(
    (feat: object) => {
      const f = feat as GeoFeature;
      if (isFeatureHighlighted(f)) return 0.028;
      if (isFeatureHovered(f)) return 0.014;
      return 0.004;
    },
    [isFeatureHighlighted, isFeatureHovered],
  );

  const polygonStrokeColor = useCallback(
    (feat: object) => {
      const f = feat as GeoFeature;
      if (isFeatureHighlighted(f)) return 'rgba(255, 102, 0, 0.9)';
      if (isFeatureHovered(f)) return 'rgba(77, 179, 255, 0.6)';
      return 'rgba(0, 102, 204, 0.15)';
    },
    [isFeatureHighlighted, isFeatureHovered],
  );

  const markers: Marker[] = useMemo(() => {
    // Solo ciudades cuando hay un país del catálogo seleccionado
    // (evita saturar el globo; el país se ve por polígono)
    const list: Marker[] = [];

    if (selectedCountry?.code && selectedCountry.cities?.length) {
      selectedCountry.cities.forEach((city) => {
        const isSelected =
          selectedCity && 'id' in selectedCity && selectedCity.id === city.id;
        list.push({
          id: city.id,
          lat: city.lat,
          lng: city.lng,
          name: city.nameEs,
          type: 'city',
          size: isSelected ? 0.55 : 0.28,
          color: isSelected ? '#FF5A00' : '#FFFFFF',
          raw: city,
        });
      });
    } else if (dataReady) {
      // Marcadores de ciudades populares sutiles
      cities.forEach((city) => {
        list.push({
          id: city.id,
          lat: city.lat,
          lng: city.lng,
          name: city.nameEs,
          type: 'city',
          size: 0.18,
          color: 'rgba(77,179,255,0.65)',
          raw: city,
        });
      });
    }
    return list;
  }, [selectedCountry, selectedCity, cities, dataReady]);

  const showGlobe = size.w > 0 && size.h > 0;

  const ringLat = selectedCity?.lat ?? selectedCountry?.lat;
  const ringLng = selectedCity?.lng ?? selectedCountry?.lng;

  return (
    <div ref={containerRef} className="absolute inset-0 stars overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(2,6,23,0.9)_100%)]" />

      {showGlobe && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          atmosphereColor="#4DB3FF"
          atmosphereAltitude={0.2}
          animateIn
          onGlobeReady={() => setGlobeReady(true)}
          // ── Países clicables ──────────────────────
          polygonsData={polygons}
          polygonAltitude={polygonAltitude}
          polygonCapColor={polygonCapColor}
          polygonSideColor={(feat: object) =>
            isFeatureHighlighted(feat as GeoFeature)
              ? 'rgba(255, 90, 0, 0.22)'
              : 'rgba(0, 74, 153, 0.05)'
          }
          polygonStrokeColor={polygonStrokeColor}
          polygonsTransitionDuration={400}
          polygonLabel={(feat: object) => {
            const name = getFeatureName(feat as GeoFeature);
            return `<div style="padding:6px 10px;background:rgba(4,16,24,0.92);border:1px solid rgba(255,90,0,0.45);border-radius:10px;color:#fff;font:12px system-ui">
              <strong style="color:#FF5A00">${name}</strong>
              <div style="opacity:.65;font-size:10px;margin-top:2px">Clic para explorar</div>
            </div>`;
          }}
          onPolygonHover={(poly: object | null) => {
            if (!poly) {
              setHoveredGeoName(null);
              return;
            }
            setHoveredGeoName(getFeatureName(poly as GeoFeature) || null);
          }}
          onPolygonClick={(poly: object) => handlePolygonClick(poly)}
          // ── Ciudades ──────────────────────────────
          pointsData={markers}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.012}
          pointRadius="size"
          pointColor="color"
          pointLabel={(d: object) => {
            const m = d as Marker;
            return `<div style="padding:6px 10px;background:rgba(4,16,24,0.92);border:1px solid rgba(255,90,0,0.45);border-radius:10px;color:#fff;font-size:12px;font-family:system-ui">
              <strong style="color:#FF5A00">${m.name}</strong>
              <div style="opacity:0.7;font-size:10px;margin-top:2px">${m.type === 'country' ? 'País' : 'Ciudad'}</div>
            </div>`;
          }}
          onPointClick={(p: object) => handleMarkerClick(p as Marker)}
          ringsData={
            ringLat != null && ringLng != null
              ? [
                  {
                    lat: ringLat,
                    lng: ringLng,
                    maxR: selectedCity ? 3 : 5,
                    propagationSpeed: 2.2,
                    repeatPeriod: 1100,
                  },
                ]
              : []
          }
          ringColor={() => (t: number) => `rgba(255,90,0,${Math.max(0, 1 - t)})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      )}

      {(!showGlobe || !globeReady) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
            <p className="text-sm text-white/60">Cargando el planeta…</p>
          </div>
        </div>
      )}
    </div>
  );
}
