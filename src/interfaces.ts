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

export interface DataToBackend {
  startingPoint: {
    placeName: string;
    center: Center;
  };
  destination: {
    placeName: string;
    center: Center;
  };
  car: {
    marca: string;
    modelo: string;
    year: { year: number; rendimientoLitro: number };
  };
  statistics: boolean;
}

export type Center = [number, number];
