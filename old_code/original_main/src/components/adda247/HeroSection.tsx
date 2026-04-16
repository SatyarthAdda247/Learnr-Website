import gplayBadge from '@/assets/gplay_download_badge.png';
import sarkariNaukri from '@/assets/sarkari_naukri.png';
import logoLight from '@/assets/adda_gold_logo_light.png';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-creamy-beige overflow-hidden pt-8 md:pt-16">
      {/* Subtle wave pattern */}
      <div className="wave-pattern" />
      
      {/* Abstract decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gold-light/10 blur-3xl" />
      <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-mustard-brown/10 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Logo above H1 */}
            <img
              src={logoLight}
              alt="Adda247 Gold"
              className="h-12 md:h-16 mx-auto lg:mx-0"
            />
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-chinese-black leading-tight">
              Sarkari Job Hai Toh Raub Hai
            </h1>
            
            <p className="text-lg md:text-xl text-graphite-grey max-w-xl mx-auto lg:mx-0">
              Bank, Police, Railway, Fauj, Teaching — 10 hazar+ sarkari naukri ki tayyari ab ek jagah.
            </p>
            
            {/* CTA */}
            <div className="pt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.adda247"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src={gplayBadge}
                  alt="Get it on Google Play"
                  className="h-14 md:h-16"
                />
              </a>
            </div>
          </div>
          
          {/* Right - Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={sarkariNaukri}
              alt="Sarkari Naukri - Government Job Aspirants"
              className="w-full max-w-[480px] lg:max-w-[560px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
