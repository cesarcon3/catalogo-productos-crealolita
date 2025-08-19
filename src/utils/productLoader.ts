import fs from 'fs';
import path from 'path';
import type { Producto } from '../types/types';

export async function loadAllProducts(): Promise<Producto[]> {
  const productosDir = path.join(process.cwd(), 'src/content/productos');
  const productos: Producto[] = [];

  // Leer cada carpeta de producto
  const carpetas = fs.readdirSync(productosDir).filter(item => {
    const itemPath = path.join(productosDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  for (const carpeta of carpetas) {
    const infoPath = path.join(productosDir, carpeta, 'info.json');
    
    if (fs.existsSync(infoPath)) {
      const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
      
      // Obtener las imágenes disponibles
      const productPath = path.join(productosDir, carpeta);
      const archivos = fs.readdirSync(productPath);
      const imagenes = archivos
        .filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
      
      productos.push({
        ...info,
        carpeta,
        primerImagen: imagenes[0] || '1.jpg'
      });
    }
  }

  return productos;
}

export function sortProducts(productos: Producto[]): Producto[] {
  return productos.sort((a, b) => {
    return a.nombre.localeCompare(b.nombre);
  });
}

// Función simplificada - solo destacados y no destacados
export function categorizeProducts(productos: Producto[]) {
  const destacados = productos.filter(p => p.destacado);
  const noDestacados = productos.filter(p => !p.destacado);
  
  return {
    destacados,
    noDestacados // Todos los productos no destacados juntos
  };
}