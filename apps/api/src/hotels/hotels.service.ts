import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchHotelsDto } from './dto/search-hotels.dto';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchHotelsDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    if (checkOut <= checkIn) {
      throw new BadRequestException('La fecha de salida debe ser posterior a la de entrada');
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const rooms = dto.rooms ?? 1;

    let cityId = dto.destination;
    const city = await this.prisma.city.findFirst({
      where: {
        OR: [
          { id: dto.destination },
          { iataCode: { equals: dto.destination.toUpperCase(), mode: 'insensitive' } },
          { nameEs: { equals: dto.destination, mode: 'insensitive' } },
        ],
      },
    });
    if (city) cityId = city.id;

    const hotels = await this.prisma.hotel.findMany({
      where: {
        cityId,
        isActive: true,
        ...(dto.minStars ? { stars: { gte: dto.minStars } } : {}),
      },
      include: {
        city: { include: { country: true } },
      },
      orderBy: [{ stars: 'desc' }, { pricePerNightUsd: 'asc' }],
    });

    return {
      nights,
      rooms,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      hotels: hotels.map((h) => {
        const perNight = Number(h.pricePerNightUsd);
        const total = Math.round(perNight * nights * rooms * 100) / 100;
        return {
          id: h.id,
          name: h.name,
          stars: h.stars,
          address: h.address,
          lat: h.lat,
          lng: h.lng,
          description: h.description,
          amenities: h.amenities,
          imageUrl: h.imageUrl,
          pricePerNightUsd: perNight,
          totalPriceUsd: total,
          currency: h.currency,
          city: {
            id: h.city.id,
            name: h.city.nameEs,
            country: h.city.country.nameEs,
          },
        };
      }),
    };
  }

  async getById(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: { city: { include: { country: true } } },
    });
    if (!hotel) throw new NotFoundException('Hotel no encontrado');
    return hotel;
  }
}
