import { Instagram, Youtube } from 'lucide-react';
import logoDark from '@/assets/adda_gold_logo_dark.png';
export const Footer = () => {
  return <footer className="bg-carbon-grey py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div>
            <img src={logoDark} alt="Adda247 Gold" className="h-10 md:h-12" />
          </div>
          
          {/* Center - Links */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-cool-grey text-sm">
              © 2025 Adda247 Gold. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="https://www.adda247.com/gold/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-cool-grey hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-slate-grey">|</span>
              <a href="https://www.adda247.com/gold/term-of-use.html" target="_blank" rel="noopener noreferrer" className="text-cool-grey hover:text-white transition-colors">
                Terms of Use
              </a>
              <span className="text-slate-grey">|</span>
              <a href="https://www.adda247.com/gold/delete-account.html" target="_blank" rel="noopener noreferrer" className="text-cool-grey hover:text-white transition-colors">
                Delete Account
              </a>
            </div>
          </div>
          
          {/* Social Icons */}
          
        </div>
      </div>
    </footer>;
};
export default Footer;