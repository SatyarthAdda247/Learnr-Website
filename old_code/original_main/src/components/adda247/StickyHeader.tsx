import { useState, useEffect } from 'react';
import logoLight from '@/assets/adda_gold_logo_light.png';
import gplayBadge from '@/assets/gplay_download_badge.png';

export const StickyHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-soft py-2 translate-y-0 opacity-100'
          : 'bg-transparent py-4 -translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="transition-all duration-300">
          <img
            src={logoLight}
            alt="Adda247 Gold"
            className="h-8 md:h-10"
          />
        </div>

        {/* Google Play Badge - Right */}
        <a
          href="https://play.google.com/store/apps/details?id=com.adda247"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105"
        >
          <img
            src={gplayBadge}
            alt="Get it on Google Play"
            className="h-8 md:h-10"
          />
        </a>
      </div>
    </header>
  );
};

export default StickyHeader;
