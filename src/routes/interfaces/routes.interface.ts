import { Document } from 'mongoose';

export interface Route extends Document {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
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
