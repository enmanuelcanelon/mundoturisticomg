import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  @Public()
  @Get('search')
  search(@Query('q') q: string) {
    return this.destinations.search(q || '');
  }

  @Public()
  @Get('countries')
  countries(@Query('popular') popular?: string) {
    return this.destinations.listCountries(popular === 'true');
  }

  @Public()
  @Get('countries/:code')
  country(@Param('code') code: string) {
    return this.destinations.getCountry(code);
  }

  @Public()
  @Get('cities')
  cities(
    @Query('country') countryCode?: string,
    @Query('popular') popular?: string,
    @Query('q') q?: string,
  ) {
    return this.destinations.listCities({
      countryCode,
      popular: popular === 'true',
      q,
    });
  }

  @Public()
  @Get('cities/:id')
  city(@Param('id') id: string) {
    return this.destinations.getCity(id);
  }
}
