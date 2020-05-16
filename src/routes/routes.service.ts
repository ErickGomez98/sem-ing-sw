import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RouteRequest,
  Center,
  MapboxRoute,
} from './interfaces/routes.interface';
import { CreateRouteDto, Car } from './dto/create-route.dto';
import Statistics from './interfaces/statistics.interface';
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
    const sortedRoutes = routes.sort(
      (a, b) =>
        +(a.distance / 1000 / car.year.rendimientoLitro).toFixed(2) -
        +(b.distance / 1000 / car.year.rendimientoLitro).toFixed(2),
    );
    return sortedRoutes;
  }

  async findAll(): Promise<RouteRequest[]> {
    return await this.routeModel.find().exec();
  }

  async findOne(id: string): Promise<RouteRequest> {
    return await this.routeModel.findById(id).exec();
  }

  async statistics(): Promise<Statistics> {
    const routes = await this.routeModel.find().exec();
    const filteredRoutes = routes.filter(r => r.statistics);
    const totalRoutes = filteredRoutes.length;
    const averageCarConsumption =
      filteredRoutes.reduce((a, b) => a + b.car.year.rendimientoLitro, 0) /
      totalRoutes;
    const totalConsumptions = [];
    filteredRoutes.forEach(r =>
      r.routes.forEach(rr =>
        totalConsumptions.push(
          +(rr.distance / 1000 / r.car.year.rendimientoLitro).toFixed(2),
        ),
      ),
    );
    const averageRideConsumption =
      totalConsumptions.reduce((a, b) => a + b, 0) / totalRoutes;

    const isSameCar = (carA: Car, carB: Car) =>
      carA.marca === carB.marca && carA.modelo === carB.modelo;
    const cars: Array<{ car: Car; occurrences: number }> = [];
    filteredRoutes.forEach(r => {
      const found = cars.findIndex(c => isSameCar(r.car, c.car));
      if (found === -1) {
        cars.push({ car: r.car, occurrences: 1 });
      } else {
        cars[found] = {
          ...cars[found],
          occurrences: cars[found].occurrences + 1,
        };
      }
    });
    const mostUsedCar = cars.sort((a, b) => b.occurrences - a.occurrences)[0];
    const distances: number[] = [];
    filteredRoutes.forEach(r =>
      r.routes.forEach(a => distances.push(a.distance)),
    );

    const averageDistance = distances.reduce((a, b) => a + b) / totalRoutes;

    const durations: number[] = [];
    filteredRoutes.forEach(r =>
      r.routes.forEach(a => durations.push(a.duration)),
    );
    const averageDuration = durations.reduce((a, b) => a + b) / totalRoutes;

    return {
      totalRoutes,
      averageCarConsumption,
      averageRideConsumption,
      mostUsedCar,
      averageDistance, // meters
      averageDuration, // seconds
    };
  }
}
