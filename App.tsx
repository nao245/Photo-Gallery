
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from './types';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import UploadButton from './components/UploadButton';
import ExportButton from './components/ExportButton';
import Hero from './components/Hero';
import { getHighResUrl } from './utils';
import PasscodeModal from './components/PasscodeModal';
import { initialPhotos } from './data/photos'; // Import photos from the new file

const defaultHeroUrl = '/images/loyal-companion-high-res.jpg';
const PASSCODE = '1356';

const OwnerModeBanner: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black/80 font-semibold text-sm px-4 py-2 rounded-full shadow-lg backdrop-blur-sm animate-fade-in-down">
      編集モードが有効です (Shift+Eで終了)
       <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};


const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [animatingPhotoId, setAnimatingPhotoId] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  // Manage hero image URL with state
  const [heroImageUrl, setHeroImageUrl] = useState(defaultHeroUrl);

  // Expose photos state to window for easy debugging/exporting (kept for optional debugging)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).photos = photos;
    }
  }, [photos]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      if (window.scrollY > heroHeight * 0.9) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'E') {
        if (isOwnerMode) {
          setIsOwnerMode(false);
        } else {
          setPasscodeError(''); // Reset error on open
          setShowPasscodeModal(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOwnerMode]); // Add isOwnerMode to dependency array

  const handlePasscodeSubmit = (passcode: string) => {
    if (passcode === PASSCODE) {
      setIsOwnerMode(true);
      setShowPasscodeModal(false);
      setPasscodeError('');
    } else {
      setPasscodeError('パスコードが違います。');
    }
  };
  
  const handleSetHeroImage = (photo: Photo) => {
    const url = getHighResUrl(photo);
    setHeroImageUrl(url);
    closeModal(); // Close modal after setting the new hero for a smoother UX
  };

  const handleDeletePhoto = (id: string) => {
    const photoToDelete = photos.find(p => p.id === id);
    if (!photoToDelete) return;

    const isHero = getHighResUrl(photoToDelete) === heroImageUrl;
    
    const newPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(newPhotos);

    if (isHero) {
      if (newPhotos.length > 0) {
        setHeroImageUrl(getHighResUrl(newPhotos[0]));
      } else {
        setHeroImageUrl(defaultHeroUrl);
      }
    }

    closeModal();
  };

  const handleUpdatePhoto = (updatedPhoto: Photo) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(p => (p.id === updatedPhoto.id ? updatedPhoto : p))
    );
    // Also update the selected photo if it's the one being edited
    if (selectedPhoto && selectedPhoto.id === updatedPhoto.id) {
      setSelectedPhoto(updatedPhoto);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const newPhotos: Photo[] = [];
    const filePromises: Promise<void>[] = [];

    for (const file of files) {
        const promise = new Promise<void>((resolve, reject) => {
            if (file instanceof File && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newPhoto: Photo = {
                        id: `${new Date().toISOString()}-${file.name}`,
                        src: [e.target?.result as string],
                        alt: file.name.replace(/\.[^/.]+$/, ""),
                        date: new Date().toLocaleDateString(),
                        location: "Unknown",
                    };
                    newPhotos.push(newPhoto);
                    resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } else {
                console.warn(`Skipped unsupported file: ${file.name}`);
                resolve();
            }
        });
        filePromises.push(promise);
    }

    Promise.all(filePromises)
      .then(() => {
        if (newPhotos.length > 0) {
          setPhotos(prevPhotos => [...newPhotos.reverse(), ...prevPhotos]);
        }
      })
      .catch(error => {
          console.error("Error reading files:", error);
          alert("Could not upload some files. Please try again.");
      });

    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handlePhotoClick = (photo: Photo) => {
    setAnimatingPhotoId(photo.id);
    setTimeout(() => {
      setSelectedPhoto(photo);
      setAnimatingPhotoId(null);
    }, 300);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleExportData = async () => {
    const dataString = `import { Photo } from '../types';\n\nexport const initialPhotos: Photo[] = ${JSON.stringify(photos, null, 2)};`;
    try {
      await navigator.clipboard.writeText(dataString);
      return true;
    } catch (err) {
      console.error('Failed to copy data: ', err);
      alert('データのコピーに失敗しました。コンソールを確認してください。');
      return false;
    }
  };


  return (
    <>
      <Header isVisible={showHeader} />
      <OwnerModeBanner isVisible={isOwnerMode} />
      
      <Hero 
        key={heroImageUrl}
        onScrollClick={scrollToGallery} 
        backgroundImage={heroImageUrl} 
      />
      
      <main ref={galleryRef} className="relative bg-transparent text-gray-100">
        <div className="container mx-auto px-4 py-16">
          <PhotoGrid 
            photos={photos} 
            onPhotoClick={handlePhotoClick}
            animatingPhotoId={animatingPhotoId} 
          />
        </div>
      </main>
      
      {isOwnerMode && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
          <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex flex-col gap-4">
            <ExportButton onCopy={handleExportData} />
            <UploadButton onClick={triggerFileUpload} />
          </div>
        </>
      )}

      {selectedPhoto && (
        <Modal 
          photo={selectedPhoto} 
          onClose={closeModal}
          onSetHero={handleSetHeroImage}
          currentHeroUrl={heroImageUrl}
          onDelete={handleDeletePhoto}
          onUpdatePhoto={handleUpdatePhoto}
          isOwnerMode={isOwnerMode}
        />
      )}

      {showPasscodeModal && (
        <PasscodeModal 
          onClose={() => setShowPasscodeModal(false)}
          onSubmit={handlePasscodeSubmit}
          error={passcodeError}
        />
      )}
    </>
  );
};

export default App;
