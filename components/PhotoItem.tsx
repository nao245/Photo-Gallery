
import React from 'react';
import { Photo } from '../types';
import CollectionIcon from './icons/CollectionIcon';

interface PhotoItemProps {
  photo: Photo;
  onClick: () => void;
  isAnimating: boolean;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick, isAnimating }) => {
  const baseStyle = "break-inside-avoid relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-300";
  
  const neumorphicBase = "bg-gray-950 shadow-[5px_5px_10px_#0c0e14,_-5px_-5px_10px_#1a1e28]";
  const neumorphicHover = "hover:shadow-[8px_8px_16px_#0c0e14,_-8px_-8px_16px_#1a1e28] hover:scale-[1.03]";
  // Enhanced animating effect with a glow and larger scale
  const neumorphicAnimating = "shadow-[0_0_25px_rgba(250,204,21,0.4)] scale-[1.10] z-10";

  const combinedClassName = `
    ${baseStyle}
    ${isAnimating ? neumorphicAnimating : `${neumorphicBase} ${neumorphicHover}`}
  `;

  return (
    <div 
      className={combinedClassName}
      onClick={onClick}
    >
      {photo.src.length > 1 && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-black/50 p-1 rounded-full backdrop-blur-sm">
          <CollectionIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <img 
        src={photo.src[0]} 
        alt={photo.alt}
        className="w-full h-auto block transform transition-all duration-500 ease-in-out rounded-lg grayscale group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4 rounded-lg">
        <p className="text-amber-300 text-lg font-cormorant italic font-semibold opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-100 duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          {photo.alt}
        </p>
      </div>
    </div>
  );
};

export default PhotoItem;
