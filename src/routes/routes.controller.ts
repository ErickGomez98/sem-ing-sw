import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoutesService } from './routes.service';
import { RouteRequest } from './interfaces/routes.interface';
import Statistics from './interfaces/statistics.interface';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('/create')
  async create(@Body() createRouteDto: CreateRouteDto) {
    return await this.routesService.create(createRouteDto);
  }

  @Get('results/:id')
  async findOne(@Param() params): Promise<RouteRequest> {
    return this.routesService.findOne(params.id);
  }

  @Get('statistics')
  async statistics(): Promise<Statistics> {
    return this.routesService.statistics();
  }

  @Get('')
  async findAll(): Promise<RouteRequest[]> {
    return this.routesService.findAll();
  }
}
