import { Center } from '../interfaces/routes.interface';
import { IsNotEmpty, IsBoolean } from 'class-validator';
export interface Place {
  placeName: string;
  center: Center;
}

export interface Car {
  marca: string;
  modelo: string;
  year: {
    year: number;
    rendimientoLitro: number;
  };
}

export class CreateRouteDto {
  @IsNotEmpty()
  startingPoint: Place;
  @IsNotEmpty()
  destination: Place;
  @IsNotEmpty()
  car: Car;
  @IsNotEmpty()
  @IsBoolean()
  statistics: boolean;
}
