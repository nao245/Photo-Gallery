
import React from 'react';

interface HeaderProps {
  isVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <div className="bg-transparent backdrop-blur-md py-4 border-b border-gray-500/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold font-playfair tracking-wider text-gray-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            Photo Gallery
          </h1>
          <p className="text-sm text-gray-300/80 mt-1">A Gallery by Nao</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
