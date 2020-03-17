export interface Car {
  marca: string;
  modelo: string;
  year: number[];
  rendimientoLitro: number;
}

export interface Marca {
  marca: string;
  modelos: Car[];
}
