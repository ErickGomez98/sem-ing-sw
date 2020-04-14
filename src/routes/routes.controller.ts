import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoutesService } from './routes.service';
import { Route } from './interfaces/routes.interface';

@Controller('cats')
export class RoutesController {
  constructor(private readonly catsService: RoutesService) {}

  @Post()
  async create(@Body() createCatDto: CreateRouteDto) {
    await this.catsService.create(createCatDto);
  }

  @Get('')
  async findAll(): Promise<Route[]> {
    return this.catsService.findAll();
  }
}
