import { Document } from 'mongoose';

export interface Route extends Document {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
