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
            className="relative z-10 w-[90%] max-w-md bg-[#FFFAF4] rounded-3xl p-6 shadow-2xl border border-[#A07E41]/20 flex flex-col items-center text-center overflow-hidden pointer-events-auto"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FEF6E8] to-transparent pointer-events-none"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors z-10"
            >
              <X size={20} className="text-[#666666]" />
            </button>

            <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-2 border-[#A07E41] flex items-center justify-center p-3 mb-4 relative z-10">
               <img src="/images/ic_launcher.webp" alt="Learnr App" className="w-full h-full object-cover rounded-xl" />
            </div>

            <h3 className="font-black text-2xl tracking-tight text-[#2D2D2D] mb-2 relative z-10">
               Switch to the App!
            </h3>
            
            <p className="text-[#666666] font-medium text-sm mb-6 leading-relaxed relative z-10">
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
            
            <p className="text-xs text-gray-400 mt-4 font-medium">Free forever · Native Experience</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
