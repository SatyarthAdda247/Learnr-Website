import type { ApiSection, ApiItem } from '../api/sections';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionRendererProps {
  sections: ApiSection[];
  onItemClick: (item: ApiItem) => void;
}

export const SectionRenderer = ({ sections, onItemClick }: SectionRendererProps) => {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} onItemClick={onItemClick} />
      ))}
    </div>
  );
};

const SectionBlock = ({ section, onItemClick }: { section: ApiSection; onItemClick: (item: ApiItem) => void }) => {
  
  if (section.sectionName?.toLowerCase() === 'trending') {
    return (
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {section.sectionName}
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
          {section.items.map((item, i) => (
            <div
              key={item.id || i}
              onClick={() => onItemClick(item)}
              className="cursor-pointer group flex-shrink-0 snap-start w-[180px] md:w-[220px]"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden relative shadow-sm border border-white/5 group-hover:border-[#B8964A]/30 transition-all duration-300">
                {item.thumbnailUrl || item.videoThumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl || item.videoThumbnailUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                    <img src="/images/learnrlogo.jpeg" className="w-20 h-20 opacity-20 filter grayscale rounded-xl" />
                  </div>
                )}
                {/* Rank badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#B8964A] flex items-center justify-center z-10">
                  <span className="text-[10px] font-black text-[#0B0C10]">{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'FLASH_TYPE') {
    return (
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            ⚡ {section.sectionName}
          </h2>
          <span className="text-xs text-gray-500 font-medium">Swipe →</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x px-1">
          {section.items.map((item, i) => (
            <FlashCardItem key={item.id || i} item={item} onItemClick={onItemClick} />
          ))}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'LIST_TYPE' || section.sectionType === 'SUBJECT_TYPE' || section.sectionType === 'WRAPPER_TYPE') {
    const ICON_MAP: Record<string, { src: string; color: string }> = {
      'science':     { src: 'https://www.learnr.co.in/Science.png',   color: '#4CAF50' },
      'english':     { src: 'https://www.learnr.co.in/English.png',   color: '#29B6F6' },
      'reasoning':   { src: 'https://www.learnr.co.in/reasoning.png', color: '#EC407A' },
      'maths':       { src: 'https://www.learnr.co.in/Maths.png',     color: '#AB47BC' },
      'mathematics': { src: 'https://www.learnr.co.in/Maths.png',     color: '#AB47BC' },
      'geography':   { src: 'https://www.learnr.co.in/Geography.png', color: '#26A69A' },
    };

    const iconItems = section.items.filter(item => !!ICON_MAP[(item.name || '').toLowerCase()]);

    return (
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-bold text-white tracking-tight">{section.sectionName}</h2>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide flex-nowrap px-1 snap-x">
          {iconItems.map((item, i) => {
            const { src, color } = ICON_MAP[(item.name || '').toLowerCase()]!;
            return (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                key={item.id || i}
                onClick={() => onItemClick(item)}
                className="flex-shrink-0 snap-start cursor-pointer flex flex-col items-center justify-center w-[100px] h-[100px] bg-white rounded-[20px]"
                style={{ borderBottom: `5px solid ${color}`, boxShadow: `0 8px 20px -4px ${color}55` }}
              >
                <img src={src} alt={item.name} className="w-14 h-14 object-contain" />
                <span className="font-black text-[10px] uppercase tracking-wider mt-1.5" style={{ color }}>{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-1 mb-2">
           <div className="w-4 h-1.5 rounded-full bg-[#4A4D54] dark:bg-gray-400"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#D1D3D8] dark:bg-gray-600"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#D1D3D8] dark:bg-gray-600"></div>
        </div>
      </section>
    );
  }

  // Fallback for CHAPTER_TYPE, VIDEO_SUBJECT_TYPE, VIDEO, etc (Carousel)
  return (
    <section>
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {section.sectionName}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
        {section.items.map((item, i) => (
          <div key={item.id || i} onClick={() => onItemClick(item)} className="cursor-pointer group flex-shrink-0 snap-start w-[180px] md:w-[220px]">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden relative border border-white/5 group-hover:border-[#B8964A]/30 transition-all duration-300">
              {item.thumbnailUrl || item.videoThumbnailUrl ? (
                <img
                  src={item.thumbnailUrl || item.videoThumbnailUrl}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                  <img src="/images/learnrlogo.jpeg" className="w-20 h-20 opacity-20 filter grayscale rounded-xl" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Flash Learning card with scroll-triggered magnify effect
const FlashCardItem = ({ item, onItemClick }: { item: ApiItem; onItemClick: (item: ApiItem) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px -15% 0px -15%' });

  return (
    <motion.div
      ref={ref}
      onClick={() => onItemClick(item)}
      className="cursor-pointer group flex-shrink-0 snap-start w-[180px] md:w-[210px]"
      animate={{ scale: isInView ? 1 : 0.82, opacity: isInView ? 1 : 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden relative shadow-md border border-gray-700/40 group-hover:border-yellow-500/30 transition-all duration-300">
        {(item.thumbnailUrl || item.videoThumbnailUrl) ? (
          <img src={item.thumbnailUrl || item.videoThumbnailUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img src="/images/learnrlogo.jpeg" className="w-16 h-16 opacity-20 filter grayscale rounded-xl" />
          </div>
        )}

      </div>
    </motion.div>
  );
};
