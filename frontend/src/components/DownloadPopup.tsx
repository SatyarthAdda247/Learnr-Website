import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadPopup = ({ isOpen, onClose }: DownloadPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-[90%] max-w-md bg-[#0B0C10] rounded-3xl p-6 shadow-2xl border border-white/5 flex flex-col items-center text-center overflow-hidden pointer-events-auto"
          >
            {/* No background gradient */}
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <img src="/images/learnrlogo.jpeg" alt="Learnr App" className="w-20 h-20 object-cover rounded-2xl mb-4 relative z-10" />

            <h3 className="font-black text-2xl tracking-tight text-white mb-2 relative z-10">
               Switch to the App!
            </h3>
            
            <p className="text-gray-400 font-medium text-sm mb-6 leading-relaxed relative z-10">
              For the best learning experience, to play videos, access mock tests, and track your daily progress seamlessly, please download our app.
            </p>

            <a 
              href="https://app.adjust.com/1ze4hzgh?campaign=Learnr_Website" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#B18B3C] to-[#C9A355] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 relative z-10 group"
            >
              <Download size={22} className="group-hover:animate-bounce" />
              Download the App
            </a>
            
            <p className="text-xs text-gray-500 mt-4 font-medium">Native Experience</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
