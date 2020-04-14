import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RouteRequest,
  Center,
  MapboxRoute,
} from './interfaces/routes.interface';
import { CreateRouteDto, Car } from './dto/create-route.dto';
// tslint:disable-next-line: no-var-requires
const fetch = require('node-fetch');

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel('RouteRequest') private routeModel: Model<RouteRequest>,
  ) {}

  /**
   * Crea un nuevo registro de solicitud de ruta optimizada, consulta las rutas de la
   * api de mapbox, pasa las rutas al algoritmo de optimización, captura los registros
   * en la base de datos, y finalmente regresa el nuevo registro capturado devuelta al front
   * @param createRouteDto {CreateRouteDto} información que viene del front
   */
  async create(createRouteDto: CreateRouteDto): Promise<RouteRequest> {
    const routesFound = await this.getRoutesFromAPI([
      createRouteDto.startingPoint.center,
      createRouteDto.destination.center,
    ]);

    const rutasOptimizadas = this.procesamientoAlgoritmo(
      routesFound,
      createRouteDto.car,
    );

    const dataToStore = {
      ...createRouteDto,
      createdAt: new Date(),
      routes: rutasOptimizadas,
    };

    const createdRouteRequest = new this.routeModel(dataToStore);
    return await createdRouteRequest.save();
  }

  /**
   * Consultar con la API de Mapbox para sacar todas las rutas posibles.
   * @param coordinates [Center, Center] coordenadas que conforman inicio y fin de una ruta
   */
  async getRoutesFromAPI(
    coordinates: [Center, Center],
  ): Promise<MapboxRoute[]> {
    const accessToken = process.env.MAPBOX_API;
    return new Promise(r => {
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${encodeURIComponent(
          coordinates.join(';'),
        )}?alternatives=true&geometries=geojson&language=es&steps=true&access_token=${accessToken}`,
        {
          method: 'GET',
        },
      )
        .then(res => res.json())
        .then(a => r(a.routes))
        .catch(err => {
          throw new InternalServerErrorException(err);
        });
    });
  }

  /**
   * Algoritmo encargado de determinar cual es la mejor ruta optimizando el consumo de combustible
   * @param r {MapboxRoute}
   */
  procesamientoAlgoritmo(routes: MapboxRoute[], car: Car) {
    for (let i = 0; i < routes.length; i++) {
      if (i === 0) {
        routes[i].bestOption = true;
      } else {
        routes[i].bestOption = false;
      }
    }
    return routes;
  }

  async findAll(): Promise<RouteRequest[]> {
    return this.routeModel.find().exec();
  }

  async findOne(id: string): Promise<RouteRequest> {
    return this.routeModel.findById(id).exec();
  }
}
