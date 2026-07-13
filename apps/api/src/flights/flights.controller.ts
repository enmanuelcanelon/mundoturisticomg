import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flights: FlightsService) {}

  @Public()
  @Get('search')
  search(@Query() dto: SearchFlightsDto) {
    return this.flights.search(dto);
  }
}
