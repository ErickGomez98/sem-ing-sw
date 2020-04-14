import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Route, Center, MapboxRoute } from './interfaces/routes.interface';
import { CreateRouteDto, Car } from './dto/create-route.dto';
// tslint:disable-next-line: no-var-requires
const fetch = require('node-fetch');

@Injectable()
export class RoutesService {
  constructor(@InjectModel('Route') private routeModel: Model<Route>) {}

  async create(createRouteDto: CreateRouteDto): Promise<{}> {
    // const createdRoute = new this.routeModel(createRouteDto);
    // return createdRoute.save();
    const routesFound = await this.getRoutesFromAPI([
      createRouteDto.startingPoint.center,
      createRouteDto.destination.center,
    ]);

    const rutasOptimizadas = this.procesamientoAlgoritmo(
      routesFound,
      createRouteDto.car,
    );

    console.log('rutas optimizadas', rutasOptimizadas);

    // Guardar un objeto que tenga toda la info y aparte las rutas optimizadas dejando claro
    // cual fue la mejor ruta

    return new Promise(r => r({}));
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

  async findAll(): Promise<Route[]> {
    return this.routeModel.find().exec();
  }
}
