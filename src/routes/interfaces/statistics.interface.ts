import { Car } from './../dto/create-route.dto';
export default interface Statistics {
  totalRoutes: number;
  averageCarConsumption: number;
  averageRideConsumption: number;
  mostUsedCar: { car: Car; occurrences: number };
  averageDistance: number;
  averageDuration: number;
}
