import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCountries(popularOnly = false) {
    return this.prisma.country.findMany({
      where: popularOnly ? { popular: true } : undefined,
      orderBy: { nameEs: 'asc' },
      include: {
        _count: { select: { cities: true } },
      },
    });
  }

  async getCountry(codeOrId: string) {
    const country = await this.prisma.country.findFirst({
      where: {
        OR: [{ id: codeOrId }, { code: codeOrId.toUpperCase() }],
      },
      include: {
        cities: {
          orderBy: [{ popular: 'desc' }, { nameEs: 'asc' }],
        },
      },
    });
    if (!country) throw new NotFoundException('País no encontrado');
    return country;
  }

  async listCities(params: { countryCode?: string; popular?: boolean; q?: string }) {
    return this.prisma.city.findMany({
      where: {
        ...(params.countryCode
          ? { country: { code: params.countryCode.toUpperCase() } }
          : {}),
        ...(params.popular ? { popular: true } : {}),
        ...(params.q
          ? {
              OR: [
                { name: { contains: params.q, mode: 'insensitive' } },
                { nameEs: { contains: params.q, mode: 'insensitive' } },
                { iataCode: { contains: params.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        country: {
          select: { id: true, code: true, name: true, nameEs: true },
        },
      },
      orderBy: [{ popular: 'desc' }, { nameEs: 'asc' }],
      take: 50,
    });
  }

  async getCity(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        country: true,
        hotels: {
          where: { isActive: true },
          take: 12,
          orderBy: { stars: 'desc' },
        },
      },
    });
    if (!city) throw new NotFoundException('Ciudad no encontrada');
    return city;
  }

  /** Unified search for globe autocomplete */
  async search(q: string) {
    if (!q || q.trim().length < 2) return [];

    const term = q.trim();
    const [countries, cities] = await Promise.all([
      this.prisma.country.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { nameEs: { contains: term, mode: 'insensitive' } },
            { code: { equals: term.toUpperCase() } },
          ],
        },
        take: 8,
      }),
      this.prisma.city.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { nameEs: { contains: term, mode: 'insensitive' } },
            { iataCode: { contains: term, mode: 'insensitive' } },
          ],
        },
        include: {
          country: { select: { code: true, nameEs: true, name: true } },
        },
        take: 12,
      }),
    ]);

    return [
      ...countries.map((c) => ({
        id: c.id,
        type: 'country' as const,
        name: c.nameEs,
        nameEn: c.name,
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        popular: c.popular,
        imageUrl: c.imageUrl,
      })),
      ...cities.map((c) => ({
        id: c.id,
        type: 'city' as const,
        name: c.nameEs,
        nameEn: c.name,
        code: c.iataCode,
        countryCode: c.country.code,
        countryName: c.country.nameEs,
        lat: c.lat,
        lng: c.lng,
        popular: c.popular,
        imageUrl: c.imageUrl,
      })),
    ];
  }
}
