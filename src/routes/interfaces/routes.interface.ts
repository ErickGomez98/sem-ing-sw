import { Place, Car } from './../dto/create-route.dto';
import { Document } from 'mongoose';

export interface RouteRequest extends Document {
  readonly createdAt: Date;
  readonly startingPoint: Place;
  readonly destination: Place;
  readonly statistics: boolean;
  readonly car: Car;
  readonly routes: MapboxRoute[];
}

export type Center = [number, number];

export interface MapboxRoute {
  geometry: any;
  legs: any;
  weight: number;
  duration: number;
  distance: number;
  bestOption: boolean;
}
