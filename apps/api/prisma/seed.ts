import { PrismaClient, CabinClass, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type CountryRow = {
  code: string;
  name: string;
  nameEs: string;
  lat: number;
  lng: number;
  continent: string;
  popular?: boolean;
};

type CityRow = {
  name: string;
  nameEs: string;
  countryCode: string;
  lat: number;
  lng: number;
  iataCode?: string;
  popular?: boolean;
  description?: string;
};

type RouteRow = { from: string; to: string; hours: number; basePrice: number };

type HotelRow = {
  cityIata: string;
  name: string;
  stars: number;
  pricePerNightUsd: number;
  amenities: string[];
  address?: string;
  description?: string;
  roomsTotal?: number;
};

function loadJson<T>(rel: string): T {
  // From apps/api/prisma → repo root data/
  const candidates = [
    path.join(__dirname, '../../../data', rel),
    path.join(process.cwd(), 'data', rel),
    path.join(process.cwd(), '../../data', rel),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
    }
  }
  throw new Error(`No se encontró data file: ${rel} (cwd=${process.cwd()})`);
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function hoursLater(d: Date, h: number) {
  return new Date(d.getTime() + h * 3600000);
}

const AIRLINES = [
  { code: 'CM', name: 'Copa Airlines' },
  { code: 'AV', name: 'Avianca' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'IB', name: 'Iberia' },
  { code: 'LA', name: 'LATAM' },
  { code: 'UX', name: 'Air Europa' },
  { code: 'B6', name: 'JetBlue' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'AF', name: 'Air France' },
  { code: 'KL', name: 'KLM' },
];

async function main() {
  console.log('🌱 Seeding MG Mundo Turístico (catálogo data/)...');

  const countries = loadJson<CountryRow[]>('airports/countries-catalog.json');
  const cities = loadJson<CityRow[]>('airports/cities-catalog.json');
  const routes = loadJson<RouteRow[]>('airports/routes.json');
  const hotelCatalog = loadJson<HotelRow[]>('hotels/catalog.json');

  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.city.deleteMany();
  await prisma.country.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passengerProfile.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'AdminChangeMe123!';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@mundoturisticomg.com';

  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 12),
      firstName: 'Mariela',
      lastName: 'López',
      phone: '+584149119477',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'cliente@demo.com',
      passwordHash: await bcrypt.hash('Cliente123!', 12),
      firstName: 'Ana',
      lastName: 'Pérez',
      phone: '+584121234567',
      role: UserRole.CUSTOMER,
      emailVerified: true,
    },
  });

  const countryIdByCode = new Map<string, string>();
  for (const c of countries) {
    const row = await prisma.country.create({
      data: {
        code: c.code,
        name: c.name,
        nameEs: c.nameEs,
        lat: c.lat,
        lng: c.lng,
        continent: c.continent,
        popular: c.popular ?? false,
      },
    });
    countryIdByCode.set(c.code, row.id);
  }

  const cityIdByIata = new Map<string, string>();
  let cityCount = 0;
  for (const city of cities) {
    const countryId = countryIdByCode.get(city.countryCode);
    if (!countryId) {
      console.warn(`⚠️  País ${city.countryCode} no existe para ${city.nameEs}`);
      continue;
    }
    const created = await prisma.city.create({
      data: {
        name: city.name,
        nameEs: city.nameEs,
        lat: city.lat,
        lng: city.lng,
        iataCode: city.iataCode,
        popular: city.popular ?? false,
        description: city.description,
        countryId,
      },
    });
    cityCount++;
    if (city.iataCode) cityIdByIata.set(city.iataCode, created.id);
  }

  let hotelCount = 0;
  for (const h of hotelCatalog) {
    const cityId = cityIdByIata.get(h.cityIata);
    if (!cityId) continue;
    await prisma.hotel.create({
      data: {
        name: h.name,
        cityId,
        stars: h.stars,
        address: h.address,
        description: h.description,
        amenities: h.amenities,
        pricePerNightUsd: h.pricePerNightUsd,
        roomsTotal: h.roomsTotal ?? 50,
      },
    });
    hotelCount++;
  }

  const airlines = [];
  for (const a of AIRLINES) {
    airlines.push(await prisma.airline.create({ data: a }));
  }

  const cabins = [CabinClass.ECONOMY, CabinClass.PREMIUM_ECONOMY, CabinClass.BUSINESS];
  const today = new Date();
  today.setUTCHours(10, 0, 0, 0);

  let flightCount = 0;
  for (let day = 0; day < 60; day++) {
    for (const r of routes) {
      if ((day + r.from.charCodeAt(0) + r.to.charCodeAt(0)) % 2 === 0 && day % 3 === 0) continue;

      const originId = cityIdByIata.get(r.from);
      const destId = cityIdByIata.get(r.to);
      if (!originId || !destId) continue;

      const airline = airlines[flightCount % airlines.length];
      const cabin = cabins[flightCount % cabins.length];
      const dep = addDays(today, day);
      dep.setUTCHours(6 + (flightCount % 14), (flightCount * 7) % 60, 0, 0);
      const arr = hoursLater(dep, r.hours + Math.random() * 0.4);
      const mult =
        cabin === CabinClass.BUSINESS ? 2.4 : cabin === CabinClass.PREMIUM_ECONOMY ? 1.45 : 1;

      await prisma.flight.create({
        data: {
          flightNumber: `${airline.code}${100 + (flightCount % 800)}`,
          airlineId: airline.id,
          originCityId: originId,
          destinationCityId: destId,
          departureAt: dep,
          arrivalAt: arr,
          cabinClass: cabin,
          basePriceUsd: Math.round(r.basePrice * mult * (0.9 + Math.random() * 0.25)),
          seatsAvailable: 20 + Math.floor(Math.random() * 120),
          totalSeats: 180,
        },
      });
      flightCount++;
    }
  }

  console.log(`✅ Countries: ${countries.length}`);
  console.log(`✅ Cities: ${cityCount} (IATA mapped: ${cityIdByIata.size})`);
  console.log(`✅ Hotels: ${hotelCount}`);
  console.log(`✅ Routes: ${routes.length}`);
  console.log(`✅ Flights: ${flightCount}`);
  console.log(`✅ Admin: ${adminEmail}`);
  console.log(`✅ Demo: cliente@demo.com / Cliente123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
