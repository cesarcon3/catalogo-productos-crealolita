import type { ImageMetadata } from 'astro';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  moneda: string;
  descripcion: string;
  categoria: string;
  destacado?: boolean;
  tags?: string[];
  ventaPor?: 'unidad' | 'docena';
  precioUnidad?: number;
  carpeta: string;
  primerImagen: string;
}

export interface ImageData {
  src: ImageMetadata;
  name: string;
  alt: string;
}

export interface ClientImageData {
  src: string;
  alt: string;
  highResSrc?: string;
}

export interface ProductGalleryProps {
  productId: string;
  images: string[];
  productName: string;
}

export interface MainImageProps {
  images: ImageData[];
  productName: string;
}

export interface ThumbnailGridProps {
  images: ImageData[];
  productName: string;
}

export const IMAGE_CONFIGS = {
  main: {
    width: 800,
    height: 600,
    format: 'webp' as const,
    quality: 90,
    widths: [400, 600, 800, 1200],
    sizes: '(max-width: 768px) 400px, (max-width: 1200px) 600px, 800px'
  },
  thumbnail: {
    width: 120,
    height: 120,
    format: 'webp' as const,
    quality: 80
  }
} as const;