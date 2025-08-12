// src/config/site.ts

export const SITE_CONFIG = {
  name: 'Creaciones Lolita',
  url: 'https://creacioneslolita.com',
  description: 'Especialistas en productos personalizados en MDF con corte y grabado láser. Creamos piezas únicas y artesanales para decoración y regalos en Venezuela.',
  
  // Contacto
  phone: '584161452966',
  whatsappMessage: 'Hola, me gustaría obtener información acerca de',
  
  // Redes sociales
  social: {
    instagram: 'https://www.instagram.com/crealolita/',
    facebook: 'https://www.facebook.com/people/Crealolita-Diseños-Personalizados-Regalos-Creativos/61578079074035/',
    twitter: '@crealolita'
  },
  
  // SEO
  keywords: [
    'corte láser MDF',
    'grabado láser Venezuela',
    'productos personalizados MDF',
    'decoración láser',
    'regalos personalizados',
    'artesanías MDF',
    'corte CNC Venezuela',
    'diseños personalizados',
    'creaciones artesanales',
    'productos únicos Venezuela'
  ],
  
  // Imágenes por defecto
  defaultImage: '/og-image.jpg',
  logo: '/logo.webp',
  
  // Horarios de atención
  openingHours: [
    'Monday 09:00-18:00',
    'Tuesday 09:00-18:00',
    'Wednesday 09:00-18:00',
    'Thursday 09:00-18:00',
    'Friday 09:00-18:00',
    'Saturday 09:00-14:00'
  ]
} as const;

// Helper functions
export const getWhatsAppUrl = (customMessage?: string) => {
  const message = customMessage || SITE_CONFIG.whatsappMessage;
  return `https://api.whatsapp.com/send?phone=${SITE_CONFIG.phone}&text=${encodeURIComponent(message)}`;
};

export const getFullImageUrl = (imagePath: string) => {
  return new URL(imagePath, SITE_CONFIG.url).toString();
};

export const getFullTitle = (pageTitle?: string) => {
  return pageTitle 
    ? `${pageTitle} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} - Corte y Grabado Láser en MDF`;
};