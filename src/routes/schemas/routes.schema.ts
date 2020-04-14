import * as mongoose from 'mongoose';

export const RouteSchema = new mongoose.Schema({
  createdAt: Date,
  startingPoint: {
    placeName: String,
    center: [Number, Number],
  },
  destination: {
    placeName: String,
    center: [Number, Number],
  },
  statistics: Boolean,
  car: {
    marca: String,
    modelo: String,
    year: {
      year: Number,
      rendimientoLitro: Number,
    },
  },
  routes: [
    {
      geometry: mongoose.Schema.Types.Mixed,
      legs: mongoose.Schema.Types.Mixed,
      weight: Number,
      duration: Number,
      distance: Number,
      bestOption: Boolean,
    },
  ],
});
