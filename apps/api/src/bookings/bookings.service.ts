import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateReference(): string {
    const code = randomBytes(3).toString('hex').toUpperCase();
    return `MTMG-${code}`;
  }

  async create(userId: string, dto: CreateBookingDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('La reserva debe incluir al menos un ítem');
    }
    if ((dto.adults ?? 0) + (dto.seniors ?? 0) < 1) {
      throw new BadRequestException('Se requiere al menos un adulto o persona de tercera edad');
    }

    const itemRows: Prisma.BookingItemCreateWithoutBookingInput[] = [];
    let total = 0;

    for (const item of dto.items) {
      if (item.itemType === 'FLIGHT') {
        if (!item.flightId) throw new BadRequestException('flightId requerido');
        const flight = await this.prisma.flight.findUnique({ where: { id: item.flightId } });
        if (!flight || !flight.isActive) {
          throw new BadRequestException(`Vuelo no disponible: ${item.flightId}`);
        }
        const pax =
          (dto.adults ?? 0) * 1 +
          (dto.children ?? 0) * 0.75 +
          (dto.infants ?? 0) * 0.1 +
          (dto.seniors ?? 0) * 0.9;
        const unit = Number(flight.basePriceUsd);
        const lineTotal = Math.round(unit * pax * 100) / 100;
        total += lineTotal;
        itemRows.push({
          itemType: 'FLIGHT',
          flight: { connect: { id: flight.id } },
          quantity: 1,
          unitPriceUsd: unit,
          totalPriceUsd: lineTotal,
        });
      } else if (item.itemType === 'HOTEL') {
        if (!item.hotelId || !item.checkIn || !item.checkOut) {
          throw new BadRequestException('hotelId, checkIn y checkOut son requeridos');
        }
        const hotel = await this.prisma.hotel.findUnique({ where: { id: item.hotelId } });
        if (!hotel || !hotel.isActive) {
          throw new BadRequestException(`Hotel no disponible: ${item.hotelId}`);
        }
        const checkIn = new Date(item.checkIn);
        const checkOut = new Date(item.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
        if (nights < 1) throw new BadRequestException('Noches de hotel inválidas');
        const rooms = item.rooms ?? 1;
        const unit = Number(hotel.pricePerNightUsd);
        const lineTotal = Math.round(unit * nights * rooms * 100) / 100;
        total += lineTotal;
        itemRows.push({
          itemType: 'HOTEL',
          hotel: { connect: { id: hotel.id } },
          checkIn,
          checkOut,
          rooms,
          quantity: rooms,
          unitPriceUsd: unit,
          totalPriceUsd: lineTotal,
        });
      }
    }

    const booking = await this.prisma.booking.create({
      data: {
        reference: this.generateReference(),
        userId,
        type: dto.type,
        status: BookingStatus.PENDING,
        tripType: dto.tripType,
        departureDate: dto.departureDate ? new Date(dto.departureDate) : null,
        returnDate: dto.returnDate ? new Date(dto.returnDate) : null,
        adults: dto.adults,
        children: dto.children ?? 0,
        infants: dto.infants ?? 0,
        seniors: dto.seniors ?? 0,
        totalAmountUsd: total,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        notes: dto.notes,
        items: { create: itemRows },
      },
      include: {
        items: {
          include: {
            flight: {
              include: {
                airline: true,
                originCity: true,
                destinationCity: true,
              },
            },
            hotel: { include: { city: true } },
          },
        },
      },
    });

    return booking;
  }

  async listMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            flight: {
              include: { airline: true, originCity: true, destinationCity: true },
            },
            hotel: true,
          },
        },
      },
    });
  }

  async getOne(userId: string, id: string, isStaff = false) {
    const booking = await this.prisma.booking.findFirst({
      where: { OR: [{ id }, { reference: id }] },
      include: {
        items: {
          include: {
            flight: {
              include: { airline: true, originCity: true, destinationCity: true },
            },
            hotel: { include: { city: true } },
          },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
      },
    });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (!isStaff && booking.userId !== userId) {
      throw new ForbiddenException('No puedes ver esta reserva');
    }
    return booking;
  }

  async confirm(userId: string, id: string, isStaff = false) {
    const booking = await this.getOne(userId, id, isStaff);
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.DRAFT) {
      throw new BadRequestException('Solo se pueden confirmar reservas pendientes');
    }
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CONFIRMED, paymentStatus: 'PAID' },
      include: { items: true },
    });
  }

  async cancel(userId: string, id: string, isStaff = false) {
    const booking = await this.getOne(userId, id, isStaff);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('La reserva ya está cancelada');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('No se puede cancelar un viaje completado');
    }
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
