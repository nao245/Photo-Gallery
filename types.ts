
export interface Photo {
  id: string;
  src: string[]; // Can now be a single image or a set of images
  highResSrc?: string; // Optional high-resolution source for hero image
  alt: string; // Serves as the title
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  settings?: string;
  description?: string;
}
