
import { Photo } from './types';

export const getHighResUrl = (photo: Photo): string => {
  // Prioritize the explicit high-resolution source if available.
  if (photo.highResSrc) {
    return photo.highResSrc;
  }
  
  // Otherwise, fall back to the first available source image.
  // This gracefully handles uploaded images (data URIs) and placeholders
  // without needing specific URL parsing logic.
  return photo.src[0];
};
