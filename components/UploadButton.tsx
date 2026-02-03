
import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 md:w-16 md:h-16 bg-gray-950 text-gray-300 rounded-full flex items-center justify-center 
                 shadow-[5px_5px_10px_#0c0e14,_-5px_-5px_10px_#1a1e28] 
                 hover:text-white
                 hover:shadow-[8px_8px_16px_#0c0e14,_-8px_-8px_16px_#1a1e28]
                 active:shadow-[inset_5px_5px_10px_#0c0e14,_inset_-5px_-5px_10px_#1a1e28]
                 transition-all duration-200 ease-in-out"
      aria-label="Upload photo"
    >
      <PlusIcon className="h-7 w-7 md:h-8 md:h-8" />
    </button>
  );
};

export default UploadButton;
