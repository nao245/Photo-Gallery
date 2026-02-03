
import React from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  animatingPhotoId: string | null;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, animatingPhotoId }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
      {photos.map((photo) => (
        <PhotoItem 
          key={photo.id} 
          photo={photo} 
          onClick={() => onPhotoClick(photo)}
          isAnimating={photo.id === animatingPhotoId}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
