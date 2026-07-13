import { Injectable, BadRequestException } from '@nestjs/common';
import { CabinClass, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveCityId(codeOrId: string): Promise<string | null> {
    const city = await this.prisma.city.findFirst({
      where: {
        OR: [
          { id: codeOrId },
          { iataCode: { equals: codeOrId.toUpperCase(), mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });
    return city?.id ?? null;
  }

  async search(dto: SearchFlightsDto) {
    const adults = dto.adults ?? 1;
    const children = dto.children ?? 0;
    const infants = dto.infants ?? 0;
    const seniors = dto.seniors ?? 0;
    const totalPax = adults + children + seniors; // infants on lap

    if (totalPax < 1) {
      throw new BadRequestException('Se requiere al menos un pasajero adulto o senior');
    }
    if (infants > adults + seniors) {
      throw new BadRequestException('No puede haber más bebés que adultos/seniors');
    }

    const originId = await this.resolveCityId(dto.origin);
    const destId = await this.resolveCityId(dto.destination);

    if (!originId || !destId) {
      throw new BadRequestException('Origen o destino no válido');
    }
    if (originId === destId) {
      throw new BadRequestException('Origen y destino no pueden ser iguales');
    }

    const depStart = new Date(dto.departureDate);
    depStart.setUTCHours(0, 0, 0, 0);
    const depEnd = new Date(dto.departureDate);
    depEnd.setUTCHours(23, 59, 59, 999);

    const cabin = dto.cabinClass;

    const outbound = await this.findFlights({
      originCityId: originId,
      destinationCityId: destId,
      from: depStart,
      to: depEnd,
      seats: totalPax,
      cabin,
    });

    let inbound: typeof outbound = [];
    if (dto.tripType === 'roundtrip' && dto.returnDate) {
      const retStart = new Date(dto.returnDate);
      retStart.setUTCHours(0, 0, 0, 0);
      const retEnd = new Date(dto.returnDate);
      retEnd.setUTCHours(23, 59, 59, 999);

      if (retStart < depStart) {
        throw new BadRequestException('La fecha de regreso debe ser posterior a la de ida');
      }

      inbound = await this.findFlights({
        originCityId: destId,
        destinationCityId: originId,
        from: retStart,
        to: retEnd,
        seats: totalPax,
        cabin,
      });
    }

    const priceMultiplier = this.passengerMultiplier(adults, children, infants, seniors);

    return {
      passengers: { adults, children, infants, seniors },
      tripType: dto.tripType || 'roundtrip',
      outbound: outbound.map((f) => this.mapFlight(f, priceMultiplier)),
      inbound: inbound.map((f) => this.mapFlight(f, priceMultiplier)),
    };
  }

  private passengerMultiplier(adults: number, children: number, infants: number, seniors: number) {
    return adults * 1 + children * 0.75 + infants * 0.1 + seniors * 0.9;
  }

  private async findFlights(params: {
    originCityId: string;
    destinationCityId: string;
    from: Date;
    to: Date;
    seats: number;
    cabin?: CabinClass;
  }) {
    return this.prisma.flight.findMany({
      where: {
        originCityId: params.originCityId,
        destinationCityId: params.destinationCityId,
        departureAt: { gte: params.from, lte: params.to },
        seatsAvailable: { gte: params.seats },
        isActive: true,
        ...(params.cabin ? { cabinClass: params.cabin } : {}),
      },
      include: {
        airline: true,
        originCity: { include: { country: true } },
        destinationCity: { include: { country: true } },
      },
      orderBy: [{ basePriceUsd: 'asc' }, { departureAt: 'asc' }],
      take: 40,
    });
  }

  private mapFlight(
    f: Prisma.FlightGetPayload<{
      include: {
        airline: true;
        originCity: { include: { country: true } };
        destinationCity: { include: { country: true } };
      };
    }>,
    paxMultiplier: number,
  ) {
    const base = Number(f.basePriceUsd);
    return {
      id: f.id,
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: {
        id: f.originCity.id,
        name: f.originCity.nameEs,
        iata: f.originCity.iataCode,
        country: f.originCity.country.nameEs,
        lat: f.originCity.lat,
        lng: f.originCity.lng,
      },
      destination: {
        id: f.destinationCity.id,
        name: f.destinationCity.nameEs,
        iata: f.destinationCity.iataCode,
        country: f.destinationCity.country.nameEs,
        lat: f.destinationCity.lat,
        lng: f.destinationCity.lng,
      },
      departureAt: f.departureAt,
      arrivalAt: f.arrivalAt,
      durationMinutes: Math.round(
        (f.arrivalAt.getTime() - f.departureAt.getTime()) / 60000,
      ),
      cabinClass: f.cabinClass,
      basePriceUsd: base,
      totalPriceUsd: Math.round(base * paxMultiplier * 100) / 100,
      seatsAvailable: f.seatsAvailable,
      currency: f.currency,
    };
  }

  async getById(id: string) {
    return this.prisma.flight.findUnique({
      where: { id },
      include: {
        airline: true,
        originCity: { include: { country: true } },
        destinationCity: { include: { country: true } },
      },
    });
  }
}
