import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoutesService } from './routes.service';
import { Route } from './interfaces/routes.interface';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async create(@Body() createRouteDto: CreateRouteDto) {
    await this.routesService.create(createRouteDto);
  }

  @Get('')
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }
}
