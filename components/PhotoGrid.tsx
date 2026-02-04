
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';
import { getHighResUrl } from '../utils';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  isOwnerMode: boolean;
  onSetHero: (photo: Photo) => void;
  currentHeroUrl: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, isOwnerMode, onSetHero, currentHeroUrl, scrollContainerRef }) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.photoid;
            if (id) {
              // Use functional update to avoid stale state
              setVisiblePhotos((prev) => {
                if (prev.has(id)) return prev; // Avoid re-render if already visible
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: container,
        rootMargin: '0px 200px 0px 200px',
        threshold: 0.1,
      }
    );

    const elements = Array.from(grid.children);
    elements.forEach((el) => observer.observe(el as HTMLElement));

    return () => observer.disconnect();
  }, [photos, scrollContainerRef]);


  return (
    <div ref={gridRef} className="flex flex-nowrap h-[55vh] sm:h-[65vh] gap-16 sm:gap-32 items-center px-8 sm:px-[20vw]">
      {photos.map((photo) => {
        const isCurrentHero = getHighResUrl(photo) === currentHeroUrl;
        return (
          <PhotoItem 
            key={photo.id} 
            photo={photo} 
            onClick={() => onPhotoClick(photo)}
            isOwnerMode={isOwnerMode}
            onSetHero={() => onSetHero(photo)}
            isCurrentHero={isCurrentHero}
            isVisible={visiblePhotos.has(photo.id)}
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;
