export interface Car {
  marca: string;
  modelo: string;
  year: { year: number; rendimientoLitro: number }[];
}

export interface Marca {
  marca: string;
  modelos: Car[];
}

export interface MapboxSearchFeature {
  text: string;
  placeName: string;
  center: [number, number];
}
