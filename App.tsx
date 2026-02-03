
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from './types';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import UploadButton from './components/UploadButton';
import Hero from './components/Hero';
import { getHighResUrl } from './utils';
import PasscodeModal from './components/PasscodeModal';

// Initial placeholder photos with rich metadata
const initialPhotos: Photo[] = [
  {
    id: '2',
    src: ['https://picsum.photos/id/1025/800/600'],
    alt: 'Loyal Companion',
    location: 'Scottish Highlands',
    date: '2023-08-22',
    camera: 'Nikon Z6 II',
    lens: 'NIKKOR Z 50mm f/1.8 S',
    settings: 'f/2.2, 1/500s, ISO 100',
    description: 'A dog enjoying the majestic view of the Scottish Highlands. The soft light of the late afternoon perfectly captured his calm demeanor.'
  },
  {
    id: '3',
    src: [
        'https://picsum.photos/id/1040/800/600', 
        'https://picsum.photos/id/1041/800/600', 
        'https://picsum.photos/id/1042/800/600'
    ],
    alt: 'Castle Series',
    location: 'Bavaria, Germany',
    date: '2023-07-10',
    camera: 'Canon EOS R5',
    lens: 'RF 15-35mm F2.8 L IS USM',
    settings: 'f/11, 1/200s, ISO 100',
    description: 'A series capturing the timeless beauty of Neuschwanstein Castle from different perspectives. Each photo tells a part of the story.'
  },
   {
    id: '5',
    src: ['https://picsum.photos/id/1074/800/600'],
    alt: 'City of Lights',
    location: 'Tokyo, Japan',
    date: '2024-01-20',
    camera: 'Fujifilm X-T4',
    lens: 'XF 16-55mm F2.8 R LM WR',
    settings: 'f/2.8, 2s, ISO 160',
    description: 'The vibrant and sprawling metropolis of Tokyo at night, a dazzling display of neon and energy.'
  },
  {
    id: '4',
    src: ['https://picsum.photos/id/106/800/600'],
    alt: 'Into the Wild',
    location: 'Zion National Park, USA',
    date: '2023-05-30',
    camera: 'Leica Q2',
    lens: 'Summilux 28mm f/1.7 ASPH.',
    settings: 'f/5.6, 1/250s, ISO 100'
  },
  {
    id: '6',
    src: ['https://picsum.photos/id/108/800/600'],
    alt: 'Coastal Drive',
    location: 'Big Sur, California',
    date: '2023-06-18',
    camera: 'DJI Mavic 3',
    lens: 'Hasselblad L2D-20c',
    settings: 'f/2.8, 1/1000s, ISO 100',
    description: 'An aerial shot of a winding road clinging to the dramatic cliffs of Big Sur. The pacific ocean stretches out to the horizon.'
  },
  {
    id: '7',
    src: ['https://picsum.photos/id/21/800/600'],
    alt: 'Urban Reflection',
    location: 'Chicago, USA',
    date: '2023-11-05',
    camera: 'Canon EOS 6D Mark II',
    lens: 'EF 50mm f/1.8 STM',
    settings: 'f/4.0, 1/1000s, ISO 100',
    description: 'A reflection of the city skyline in a puddle after a rainstorm, capturing the duality of the urban landscape.'
  },
  {
    id: '8',
    src: ['https://picsum.photos/id/26/800/600', 'https://picsum.photos/id/35/800/600'],
    alt: 'Forest Floor Details',
    location: 'Black Forest, Germany',
    date: '2023-10-12',
    camera: 'Olympus OM-D E-M1 Mark III',
    lens: 'M.Zuiko Digital ED 60mm f/2.8 Macro',
    settings: 'f/3.5, 1/80s, ISO 400',
    description: 'A closer look at the intricate details of moss and mushrooms on the forest floor. Nature\'s tiny wonders.'
  },
  {
    id: '9',
    src: ['https://picsum.photos/id/42/800/600'],
    alt: 'Pensive Gaze',
    location: 'Paris, France',
    date: '2024-02-18',
    camera: 'Sony α7R IV',
    lens: 'FE 85mm f/1.4 GM',
    settings: 'f/1.4, 1/800s, ISO 100',
    description: 'A candid portrait capturing a moment of quiet contemplation on a Parisian street.'
  },
  {
    id: '10',
    src: ['https://picsum.photos/id/48/800/600'],
    alt: 'Geometric Lines',
    location: 'Berlin, Germany',
    date: '2023-12-01',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 32-64mm f/4 R LM WR',
    settings: 'f/8, 1/250s, ISO 100',
    description: 'The stark, repeating lines of a modern architectural facade, creating an abstract pattern.'
  },
  {
    id: '11',
    src: ['https://picsum.photos/id/60/800/600'],
    alt: 'Morning Brew',
    location: 'Kyoto, Japan',
    date: '2024-03-05',
    camera: 'Ricoh GR III',
    lens: '28mm f/2.8',
    settings: 'f/2.8, 1/60s, ISO 200',
    description: 'A quiet moment with a cup of freshly brewed coffee in a traditional Japanese cafe.'
  },
  {
    id: '12',
    src: ['https://picsum.photos/id/84/800/600', 'https://picsum.photos/id/85/800/600', 'https://picsum.photos/id/96/800/600'],
    alt: 'Market Hustle',
    location: 'Marrakech, Morocco',
    date: '2024-04-22',
    camera: 'Leica M11',
    lens: 'Summicron-M 35mm f/2 ASPH.',
    settings: 'f/5.6, 1/500s, ISO 125',
    description: 'The vibrant colors, textures, and energy of a bustling souk in Marrakech.'
  },
  {
    id: '13',
    src: ['https://picsum.photos/id/103/800/600'],
    alt: 'Shadow and Light',
    location: 'New York City, USA',
    date: '2023-08-30',
    camera: 'Nikon F3',
    lens: 'Nikkor 50mm f/1.2 AI-S',
    settings: 'f/11, 1/125s, ISO 400',
    description: 'A black and white street scene, focusing on the dramatic interplay of light and shadow on the city streets.'
  },
  {
    id: '14',
    src: ['https://picsum.photos/id/111/800/600'],
    alt: 'Ocean\'s Breath',
    location: 'Iceland',
    date: '2023-09-25',
    camera: 'Pentax K-1 Mark II',
    lens: 'D FA 15-30mm f/2.8 ED SDM WR',
    settings: 'f/16, 30s, ISO 100',
    description: 'A long exposure of the Icelandic coast, smoothing the waves into a mystical fog.'
  },
  {
    id: '15',
    src: ['https://picsum.photos/id/122/800/600'],
    highResSrc: 'https://picsum.photos/id/122/1920/1080',
    alt: 'Galactic Core',
    location: 'Atacama Desert, Chile',
    date: '2023-07-19',
    camera: 'Sony a7S III',
    lens: 'Sigma 14mm f/1.8 DG HSM Art',
    settings: 'f/1.8, 20s, ISO 3200',
    description: 'The Milky Way galaxy stretching across the pristine, dark skies of the Atacama Desert.'
  },
  {
    id: '16',
    src: ['https://picsum.photos/id/145/800/600'],
    alt: 'Liquid Gold',
    location: 'Studio',
    date: '2024-05-10',
    camera: 'Phase One XF IQ4',
    lens: 'Schneider Kreuznach 120mm LS f/4 Macro',
    settings: 'f/11, 1/125s, ISO 50',
    description: 'An abstract macro shot of oil and water, creating vibrant, swirling patterns.'
  },
];

const defaultHeroUrl = 'https://picsum.photos/id/1025/1920/1080';
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
          <UploadButton onClick={triggerFileUpload} />
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
