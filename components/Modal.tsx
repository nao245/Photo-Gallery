
import React, { useEffect, useState, useRef } from 'react';
import { Photo } from '../types';
import XIcon from './icons/XIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import CalendarIcon from './icons/CalendarIcon';
import CameraIcon from './icons/CameraIcon';
import SettingsIcon from './icons/SettingsIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import LandscapeIcon from './icons/LandscapeIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import { getHighResUrl } from '../utils';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface ModalProps {
  photo: Photo;
  onClose: () => void;
  onSetHero: (photo: Photo) => void;
  currentHeroUrl: string;
  onDelete: (id: string) => void;
  onUpdatePhoto: (photo: Photo) => void;
  isOwnerMode: boolean;
}

const Modal: React.FC<ModalProps> = ({ photo, onClose, onSetHero, currentHeroUrl, onDelete, onUpdatePhoto, isOwnerMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [singleImageToDeleteIndex, setSingleImageToDeleteIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState<Photo>(photo);
  const addImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedPhoto(photo);
    setIsEditing(false);
    setCurrentIndex(0);
  }, [photo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (photo.src.length > 1) {
        if (event.key === 'ArrowLeft') {
          handlePrev();
        } else if (event.key === 'ArrowRight') {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, photo, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photo.src.length - 1 : prevIndex - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === photo.src.length - 1 ? 0 : prevIndex + 1));
  };

  const handleConfirmDelete = () => {
    onDelete(photo.id);
  };

  const handleSingleImageDelete = () => {
    if (singleImageToDeleteIndex === null) return;

    const currentPhotoData = isEditing ? editedPhoto : photo;
    const newSrc = currentPhotoData.src.filter((_, index) => index !== singleImageToDeleteIndex);

    if (newSrc.length === 0) {
        onDelete(currentPhotoData.id);
        setSingleImageToDeleteIndex(null);
        return;
    }

    const updatedPhoto = { ...currentPhotoData, src: newSrc };
    
    if (isEditing) {
        setEditedPhoto(updatedPhoto);
    }
    
    onUpdatePhoto(updatedPhoto);
    
    setCurrentIndex(prev => Math.min(prev, newSrc.length - 1));
    
    setSingleImageToDeleteIndex(null);
  };

  const handleInputChange = (field: keyof Photo, value: string) => {
    setEditedPhoto(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdatePhoto(editedPhoto);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPhoto(photo);
    setIsEditing(false);
  };

  const triggerAddImages = () => {
    addImageInputRef.current?.click();
  };

  const handleAddImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImageSrcs = await Promise.all(filePromises);
      const updatedPhoto = {
        ...editedPhoto,
        src: [...editedPhoto.src, ...newImageSrcs]
      };
      onUpdatePhoto(updatedPhoto);
    } catch (error) {
      console.error("Error reading new image files:", error);
    }

    event.target.value = '';
  };
  
  const potentialHeroUrl = getHighResUrl(photo);
  const isCurrentHero = potentialHeroUrl === currentHeroUrl;

  const InfoRow: React.FC<{ icon: React.ReactNode; field: keyof Photo; label: string; isTextarea?: boolean; }> = ({ icon, field, label, isTextarea = false }) => (
    <div className={`flex ${isTextarea ? 'items-start' : 'items-center'} `}>
      <div className="mr-3 text-gray-400 flex-shrink-0 mt-1">{icon}</div>
      {isEditing ? (
        isTextarea ? (
          <textarea
            value={editedPhoto[field] as string || ''}
            onChange={e => handleInputChange(field, e.target.value)}
            placeholder={label}
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm min-h-[80px]"
          />
        ) : (
          <input
            type="text"
            value={editedPhoto[field] as string || ''}
            onChange={e => handleInputChange(field, e.target.value)}
            placeholder={label}
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        )
      ) : (
        <span className="break-words w-full">{photo[field] || 'N/A'}</span>
      )}
    </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="relative bg-gray-950 border border-gray-800 rounded-lg shadow-2xl shadow-black/50 flex flex-col md:flex-row max-w-6xl w-full max-h-[95vh] md:max-h-[90vh] animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image container */}
          <div className="w-full md:w-2/3 h-[50vh] md:h-auto flex items-center justify-center bg-black/20 rounded-t-lg md:rounded-l-lg md:rounded-tr-none relative overflow-hidden group">
            <img 
              key={photo.src[currentIndex]}
              src={photo.src[currentIndex]}
              alt={photo.alt}
              className="max-w-full max-h-full object-contain p-2 animate-fade-in-slow"
            />
            {isOwnerMode && photo.src.length > 1 && (
                <button
                  onClick={() => setSingleImageToDeleteIndex(currentIndex)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:text-red-400 hover:bg-red-950/50 transition-colors"
                  aria-label="この画像を削除"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
            )}
            {isOwnerMode && (
              <>
                <input type="file" ref={addImageInputRef} onChange={handleAddImages} className="hidden" accept="image/*" multiple />
                <button 
                  onClick={triggerAddImages}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-4 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Add images to collection"
                >
                  <PlusCircleIcon className="w-10 h-10" />
                </button>
              </>
            )}
            {photo.src.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full hover:bg-black/70 transition-all transform hover:scale-110" aria-label="Previous image">
                  <ChevronLeftIcon />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full hover:bg-black/70 transition-all transform hover:scale-110" aria-label="Next image">
                  <ChevronRightIcon />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                  {currentIndex + 1} / {photo.src.length}
                </div>
              </>
            )}
          </div>

          {/* Info container */}
          <div className="w-full md:w-1/3 p-4 md:p-6 flex flex-col text-gray-300 overflow-y-auto bg-gray-900/20 md:backdrop-blur-lg rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
            <div className="flex justify-between items-start mb-2">
              {isEditing ? (
                 <input
                    type="text"
                    value={editedPhoto.alt || ''}
                    onChange={e => handleInputChange('alt', e.target.value)}
                    placeholder="Title"
                    className="flex-1 text-xl md:text-2xl font-bold text-white font-playfair bg-gray-800 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 mr-2"
                  />
              ) : (
                <h2 className="flex-1 text-xl md:text-2xl font-bold text-white font-playfair break-words pr-2">{photo.alt}</h2>
              )}
              {isOwnerMode && !isEditing && (
                <div className="flex items-center">
                  <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200" aria-label="Edit photo details">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowConfirmDelete(true)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/50 rounded-full transition-colors duration-200 ml-1" aria-label="Delete photo">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 my-2">
              {isOwnerMode && (
                <button
                  onClick={() => onSetHero(photo)}
                  disabled={isCurrentHero}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                  aria-label="Set as hero background"
                >
                  <LandscapeIcon className="w-4 h-4" />
                  <span>{isCurrentHero ? '現在の背景' : '背景に設定'}</span>
                </button>
              )}
            </div>

            <div className="space-y-4 text-sm mt-4">
              <InfoRow icon={<LocationMarkerIcon className="w-5 h-5" />} field="location" label="Location" />
              <InfoRow icon={<CalendarIcon className="w-5 h-5" />} field="date" label="Date" />
              <div className="flex items-start">
                  <CameraIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="w-full space-y-2">
                    <InfoRow icon={<></>} field="camera" label="Camera" />
                    <InfoRow icon={<></>} field="lens" label="Lens" />
                  </div>
              </div>
              <InfoRow icon={<SettingsIcon className="w-5 h-5" />} field="settings" label="Settings" />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
                <InfoRow icon={<></>} field="description" label="Description" isTextarea />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">キャンセル</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">保存</button>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-50 p-2 rounded-full bg-black/50"
          aria-label="Close"
        >
          <XIcon />
        </button>
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fade-in-slow { from { opacity: 0.5; } to { opacity: 1; } }
          @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-fade-in-slow { animation: fade-in-slow 0.4s ease-out forwards; }
          .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
        `}</style>
      </div>

      {showConfirmDelete && (
        <ConfirmDeleteModal 
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
        >
            <p>
                「{photo.alt}」
                {photo.src.length > 1 && `（${photo.src.length}枚の画像を含む）`}
                を削除しますか？
                <br/>
                この操作は元に戻せません。
            </p>
        </ConfirmDeleteModal>
      )}

      {singleImageToDeleteIndex !== null && (
        <ConfirmDeleteModal
            onClose={() => setSingleImageToDeleteIndex(null)}
            onConfirm={handleSingleImageDelete}
            title="画像の削除"
        >
            <p>この画像をコレクションから削除しますか？<br/>この操作は元に戻せません。</p>
        </ConfirmDeleteModal>
      )}
    </>
  );
};

export default Modal;
