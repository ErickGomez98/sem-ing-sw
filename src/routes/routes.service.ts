import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Route } from './interfaces/routes.interface';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
  constructor(@InjectModel('Route') private routeModel: Model<Route>) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const createdRoute = new this.routeModel(createRouteDto);
    console.log(createRouteDto);
    return createdRoute.save();
  }

  async findAll(): Promise<Route[]> {
    return this.routeModel.find().exec();
  }
}
