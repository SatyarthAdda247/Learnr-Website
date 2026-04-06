import type { ApiSection, ApiItem } from '../api/sections';
import { motion } from 'framer-motion';

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
      <section className="bg-black py-10 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-4 overflow-hidden">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {section.sectionName}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide flex-nowrap snap-x px-4 sm:px-6 lg:px-8">
           {section.items.map((item, i) => (
              <div key={item.id || i} onClick={() => onItemClick(item)} className="cursor-pointer group flex-shrink-0 snap-start relative flex items-center w-[200px] md:w-[240px]">
                 
                 {/* Big stroke number behind everything */}
                 <span className="text-[140px] md:text-[180px] leading-[0.75] absolute top-1/2 -translate-y-1/2 -left-6 md:-left-10 font-black text-transparent opacity-80 pointer-events-none" style={{ WebkitTextStroke: '2px #333' }}>
                    {i + 1}
                 </span>

                 <div className="w-[160px] md:w-[190px] aspect-[4/5] bg-gradient-to-br from-gray-800 to-[#1a1a1a] rounded-3xl overflow-hidden relative shadow-2xl border border-gray-700 group-hover:border-gray-500 transition-all duration-300 ml-12 md:ml-16 z-10 hover:-translate-y-1">
                    {item.thumbnailUrl || item.videoThumbnailUrl ? (
                       <img 
                         src={item.thumbnailUrl || item.videoThumbnailUrl} 
                         alt={item.name}
                         className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
                       />
                    ) : (
                       <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                          <img src="/images/ic_launcher.webp" className="w-20 h-20 opacity-20 filter grayscale" />
                       </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                    {/* White Text Overlay matching screenshot */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                       <p className="text-white/90 font-bold text-[11px] md:text-xs mb-1 drop-shadow-md line-clamp-1">{item.name?.split(' ')[0] || "Topic"}</p>
                       <h3 className="font-black text-orange-400 text-sm md:text-base leading-tight line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.name || item.videoName}</h3>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>
    );
  }
  
  if (section.sectionType === 'LIST_TYPE' || section.sectionType === 'SUBJECT_TYPE' || section.sectionType === 'WRAPPER_TYPE') {
    return (
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-bold text-[#2D2D2D] tracking-tight">{section.sectionName}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide flex-nowrap px-1">
          {section.items.map((item, i) => (
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              key={item.id || i}
              onClick={() => onItemClick(item)}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer group w-20 md:w-24 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 min-h-[100px]"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                 <img src={item.iconUrl || item.thumbnailUrl || "/images/ic_launcher.webp"} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-center text-[#2D2D2D] text-xs leading-tight line-clamp-2">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback for CHAPTER_TYPE, VIDEO_SUBJECT_TYPE, VIDEO, etc (Carousel)
  return (
    <section>
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-xl font-bold text-[#2D2D2D] tracking-tight flex items-center">
            {section.sectionName}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
         {section.items.map((item, i) => (
            <div key={item.id || i} onClick={() => onItemClick(item)} className="cursor-pointer group flex-shrink-0 snap-start w-[180px] md:w-[220px]">
               {/* Typical 3:4 or 2:3 Aspect ratio video/chapter card */}
               <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-[#A07E41]/30 transition-all duration-300">
                  
                  {item.thumbnailUrl || item.videoThumbnailUrl ? (
                     <img 
                       src={item.thumbnailUrl || item.videoThumbnailUrl} 
                       alt={item.name}
                       className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
                     />
                  ) : (
                     <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                        <img src="/images/ic_launcher.webp" className="w-20 h-20 opacity-20 filter grayscale" />
                     </div>
                  )}
                  
                  <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* White Text Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="font-bold text-white text-base md:text-lg leading-tight line-clamp-3 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.name || item.videoName}</h3>
                     {item.videoDuration && (
                       <p className="text-[#A07E41] font-bold text-[10px] uppercase shadow-sm bg-black/40 inline-block px-1.5 py-0.5 rounded backdrop-blur-sm mt-1 border border-white/10">Video</p>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </section>
  );
};
