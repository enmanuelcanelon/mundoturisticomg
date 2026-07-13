import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { SearchHotelsDto } from './dto/search-hotels.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Public()
  @Get('search')
  search(@Query() dto: SearchHotelsDto) {
    return this.hotels.search(dto);
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.hotels.getById(id);
  }
}
