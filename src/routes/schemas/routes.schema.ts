import * as mongoose from 'mongoose';

export const RouteSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
