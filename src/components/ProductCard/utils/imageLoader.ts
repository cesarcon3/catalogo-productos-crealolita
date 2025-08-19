import type { ImageMetadata } from 'astro';

export async function loadProductImage(id: string, imagen: string): Promise<ImageMetadata | null> {
  try {
    const images = import.meta.glob('/src/content/productos/*/*.{png,jpg,jpeg,webp,avif}');
    const imagePath = `/src/content/productos/${id}/${imagen}`;
    
    if (images[imagePath]) {
      const importedImage = await images[imagePath]() as { default: ImageMetadata };
      return importedImage.default;
    }
    return null;
  } catch (error) {
    console.warn(`No se pudo cargar la imagen: /src/content/productos/${id}/${imagen}`);
    return null;
  }
}