interface ClientImageData {
  src: string;
  alt: string;
  highResSrc?: string;
}

class ProductGalleryController {
  private imageData: ClientImageData[] = [];
  private currentImageIndex: number = 0;
  private modal: HTMLElement | null = null;
  private modalImage: HTMLImageElement | null = null;
  private modalCaption: HTMLElement | null = null;
  private mainImage: HTMLImageElement | null = null;
  private thumbnails: NodeListOf<HTMLButtonElement> | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupGallery());
    } else {
      this.setupGallery();
    }
  }

  private setupGallery(): void {
    this.initializeElements();
    this.collectImageData();
    this.setupEventListeners();
  }

  private initializeElements(): void {
    this.modal = document.getElementById('imageModal');
    this.modalImage = document.querySelector('[data-modal-image]') as HTMLImageElement;
    this.modalCaption = document.querySelector('[data-modal-caption]');
    this.mainImage = document.querySelector('[data-main-image]') as HTMLImageElement;
    this.thumbnails = document.querySelectorAll('[data-thumbnail]');
  }

  private collectImageData(): void {
    this.imageData = [];
    
    // Verificar si tenemos thumbnails
    if (this.thumbnails && this.thumbnails.length > 0) {
      this.thumbnails.forEach((thumb, index) => {
        const img = thumb.querySelector('img') as HTMLImageElement;
        if (img?.src && img.src.trim() !== '') {
          const highResSrc = this.getHighResSrc(img.src);
          
          this.imageData.push({
            src: img.src,
            alt: img.alt || `Imagen ${index + 1}`,
            highResSrc: highResSrc
          });
        }
      });
    }

    // Si no hay thumbnails pero sí imagen principal, la agregamos
    if (this.imageData.length === 0 && this.mainImage?.src && this.mainImage.src.trim() !== '') {
      const highResSrc = this.getHighResSrc(this.mainImage.src);
      this.imageData.push({
        src: this.mainImage.src,
        alt: this.mainImage.alt || 'Imagen principal',
        highResSrc: highResSrc
      });
    }
    
    // Log para debugging si no hay imágenes
    if (this.imageData.length === 0) {
      console.warn('ProductGallery: No se encontraron imágenes válidas');
    }
  }

  private getHighResSrc(thumbnailSrc: string): string {
    if (thumbnailSrc.includes('?')) {
      const baseUrl = thumbnailSrc.split('?')[0];
      return baseUrl;
    }
    return thumbnailSrc;
  }

  private setupEventListeners(): void {
    // Event listeners para thumbnails
    this.thumbnails?.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeMainImage(index);
      });

      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.changeMainImage(index);
        }
      });
    });

    // Event listener para abrir modal (solo si hay imagen principal válida)
    if (this.mainImage && this.imageData.length > 0) {
      this.mainImage.addEventListener('click', () => {
        this.openModal(this.currentImageIndex);
      });
    }

    // Event listeners del modal
    this.setupModalEventListeners();

    // Navegación con teclado en el modal
    document.addEventListener('keydown', (e) => {
      if (this.isModalOpen()) {
        this.handleKeyboardNavigation(e);
      }
    });
  }

  private setupModalEventListeners(): void {
    const closeButton = document.querySelector('[data-modal-close]');
    const modalBackdrop = document.querySelector('[data-modal-backdrop]');

    closeButton?.addEventListener('click', () => this.closeModal());
    modalBackdrop?.addEventListener('click', () => this.closeModal());

    this.modalImage?.addEventListener('click', (e) => e.stopPropagation());
  }

  private changeMainImage(index: number): void {
    if (index < 0 || index >= this.imageData.length) return;

    this.currentImageIndex = index;
    const imageData = this.imageData[index];

    if (this.mainImage && imageData) {
      const newImg = new Image();
      newImg.onload = () => {
        if (this.mainImage) {
          this.mainImage.src = imageData.highResSrc || imageData.src;
          this.mainImage.alt = imageData.alt;
        }
      };
      newImg.onerror = () => {
        if (this.mainImage) {
          this.mainImage.src = imageData.src;
          this.mainImage.alt = imageData.alt;
        }
      };
      newImg.src = imageData.highResSrc || imageData.src;
    }

    this.updateActiveThumbnail(index);
  }

  private updateActiveThumbnail(activeIndex: number): void {
    this.thumbnails?.forEach((thumb, index) => {
      if (index === activeIndex) {
        thumb.classList.add('active');
        thumb.setAttribute('aria-current', 'true');
      } else {
        thumb.classList.remove('active');
        thumb.removeAttribute('aria-current');
      }
    });
  }

  private openModal(imageIndex: number): void {
    if (!this.modal || !this.modalImage) return;

    const imageData = this.imageData[imageIndex];
    if (!imageData) return;

    const imgSrc = imageData.highResSrc || imageData.src;
    
    const img = new Image();
    img.onload = () => {
      if (this.modalImage && this.modal) {
        this.modalImage.src = imgSrc;
        this.modalImage.alt = imageData.alt;
        
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        
        requestAnimationFrame(() => {
          this.modal?.classList.add('show');
        });

        const closeButton = document.querySelector('[data-modal-close]') as HTMLElement;
        closeButton?.focus();

        document.body.style.overflow = 'hidden';
      }
    };
    
    img.onerror = () => {
      if (this.modalImage && this.modal) {
        this.modalImage.src = imageData.src;
        this.modalImage.alt = imageData.alt;
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
          this.modal?.classList.add('show');
        });
        document.body.style.overflow = 'hidden';
      }
    };
    
    img.src = imgSrc;

    if (this.modalCaption) {
      this.modalCaption.textContent = imageData.alt;
    }
  }

  private closeModal(): void {
    if (!this.modal) return;

    this.modal.classList.remove('show');
    this.modal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      if (this.modal) {
        this.modal.style.display = 'none';
      }
      document.body.style.overflow = '';
    }, 300);

    this.mainImage?.focus();
  }

  private isModalOpen(): boolean {
    return this.modal?.style.display === 'flex';
  }

  private handleKeyboardNavigation(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.closeModal();
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        this.navigateImage(-1);
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        this.navigateImage(1);
        break;
    }
  }

  private navigateImage(direction: number): void {
    if (this.imageData.length <= 1) return;

    const newIndex = (this.currentImageIndex + direction + this.imageData.length) % this.imageData.length;
    
    if (this.isModalOpen()) {
      this.openModal(newIndex);
    }
    
    this.changeMainImage(newIndex);
  }

  public goToImage(index: number): void {
    this.changeMainImage(index);
  }

  public getCurrentIndex(): number {
    return this.currentImageIndex;
  }
}

let galleryController: ProductGalleryController;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    galleryController = new ProductGalleryController();
  });
} else {
  galleryController = new ProductGalleryController();
}

export { ProductGalleryController };