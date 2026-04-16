import gplayBadge from '@/assets/gplay_download_badge.png';
import logoDark from '@/assets/adda_gold_logo_dark.png';

export const CTABanner = () => {
  return <section className="relative py-16 md:py-24 overflow-hidden bg-[#720000]">
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">Sapno Tak Pahunchne Ka Raasta?</h2>
          
          <img src={logoDark} alt="Adda247 Gold" className="h-10 md:h-12" />
          
          <a href="https://play.google.com/store/apps/details?id=com.adda247" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
            <img src={gplayBadge} alt="Get it on Google Play" className="h-12 md:h-14" />
          </a>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
    </section>;
};
export default CTABanner;