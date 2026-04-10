import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAY_URL = 'https://app.adjust.com/1zetqonb?campaign=Website';
// QR code via Google Charts API — encodes the Play Store URL
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PLAY_URL)}&bgcolor=0B0C10&color=ffffff&margin=10`;

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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-[90%] max-w-sm bg-[#0B0C10] rounded-3xl p-7 shadow-2xl border border-white/8 flex flex-col items-center text-center pointer-events-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>

            {/* App icon */}
            <img src="/images/learnrlogo.jpeg" alt="Learnr" className="w-16 h-16 object-cover rounded-2xl mb-4" />

            {/* Hinglish headline */}
            <h3 className="font-black text-2xl text-white mb-2 leading-tight">
              App pe switch karo!
            </h3>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Videos dekhne ke liye, mock tests dene ke liye, aur apni daily progress track karne ke liye — Learnr app download karo.
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-3 mb-4">
              <img
                src={QR_URL}
                alt="Scan to download Learnr"
                className="w-40 h-40"
              />
            </div>

            <p className="text-gray-500 text-xs mb-5">
              📱 Phone se scan karo — seedha Play Store pe jayega
            </p>

            {/* Fallback direct link */}
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#B18B3C] to-[#C9A355] text-[#0B0C10] py-3.5 rounded-full font-black text-base hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 5px 0 #7a5e28' }}
            >
              ↓ Abhi Download Karo
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
