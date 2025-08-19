export interface ProductProps {
  id: string;
  nombre: string;
  precio: number;
  moneda: string;
  descripcion: string;
  imagen: string;
  destacado?: boolean;
  tags?: string[];
  ventaPor?: 'unidad' | 'docena';
  precioUnidad?: number;
}