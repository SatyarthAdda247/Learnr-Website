import { useEffect, useState } from 'react';
import { apiStore } from './api/mockData';
import { Menu, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSections } from './api/sections';
import { SectionRenderer } from './components/SectionRenderer';
import { LandingPage } from './components/LandingPage';
import { DownloadPopup } from './components/DownloadPopup';

function App() {
  const [data, setData] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true; // default
  });

  // Force dark mode always
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [profile, sections] = await Promise.all([
          apiStore.fetchProfile(),
          fetchSections(),
        ]);

        console.log('API Response - Sections:', sections);
        console.log('Total sections loaded:', sections.length);

        let orderedSections = [...sections];

        // Collect all items across all sections into named maps
        const famousMap = new Map();
        const ancientHistoryMap = new Map();
        const englishMap = new Map();
        const medievalMap = new Map();
        const geographyMap = new Map();
        const scienceMap = new Map();
        const artCultureMap = new Map();
        const toppersMap = new Map();
        const wonderMap = new Map();
        const beyondMap = new Map();

        orderedSections.forEach(sec => {
          sec.items?.forEach(item => {
            const cat = (item.categoryName || '').toLowerCase();
            const name = (item.name || '').toLowerCase();
            const secName = (sec.sectionName || '').toLowerCase();

            // Famous Personalities
            if (name.includes('bhagat') || name.includes('ambedkar') || name.includes('vivekananda') || name.includes('teresa') || secName.includes('famous') || cat.includes('personalit')) {
              famousMap.set(item.name || item.id, item);
            }
            // Ancient History
            else if (name.includes('prehistoric') || name.includes('indus valley') || name.includes('vedic') || name.includes('mauryan') || name.includes('mahajanapada') || name.includes('gupta') || name.includes('ancient') || name.includes('kushan') || name.includes('lineage') || name.includes('human lineage')) {
              ancientHistoryMap.set(item.name || item.id, item);
            }
            // English / Grammar
            else if (name.includes('noun') || name.includes('pronoun') || name.includes('verb') || name.includes('adjective') || name.includes('adverb') || name.includes('tense') || name.includes('conjunction') || name.includes('preposition') || name.includes('vocabulary') || name.includes('voice') || name.includes('speech') || cat.includes('english')) {
              englishMap.set(item.name || item.id, item);
            }
            // Medieval History
            else if (name.includes('delhi sultanate') || name.includes('mughal') || name.includes('maratha') || name.includes('vijayanagara') || name.includes('deccan') || name.includes('rajput') || name.includes('sikh') || name.includes('medieval') || name.includes('colonial') || name.includes('british') || name.includes('nationalism') || name.includes('home rule') || name.includes('gandhi') || name.includes('civil disobedience') || name.includes('independence')) {
              medievalMap.set(item.name || item.id, item);
            }
            // Geography
            else if (name.includes('earth') || name.includes('plate tectonic') || name.includes('volcano') || name.includes('earthquake') || name.includes('rock') || name.includes('river') || name.includes('atmosphere') || name.includes('cyclone') || name.includes('rainfall') || name.includes('solar system') || cat.includes('geography')) {
              geographyMap.set(item.name || item.id, item);
            }
            // Science
            else if (name.includes('cell') || name.includes('human body') || name.includes('nutrition') || name.includes('plant') || name.includes('genetics') || name.includes('chemistry') || name.includes('motion') || name.includes('energy') || name.includes('biology') || cat.includes('science')) {
              scienceMap.set(item.name || item.id, item);
            }
            // Art & Culture
            else if (name.includes('dance') || name.includes('folk') || name.includes('puppet') || name.includes('music') || name.includes('martial') || name.includes('painting') || name.includes('handicraft') || name.includes('sculpture') || name.includes('architecture') || name.includes('temple') || name.includes('cave') || cat.includes('art')) {
              artCultureMap.set(item.name || item.id, item);
            }
            // Topper's Playlist (reasoning-quiz style)
            else if (name.includes('coding-decoding') || name.includes('analogy') || name.includes('classification') || name.includes('directions') || name.includes('calendar') || name.includes('number series') || name.includes('dice') || cat.includes('reasoning')) {
              toppersMap.set(item.name || item.id, item);
            }
            // Wonder Buildings / Mysteries
            else if (name.includes('wonder') || name.includes('mystery') || name.includes('lost civiliz') || name.includes('unusual') || name.includes('dark secret') || name.includes('unsolved') || name.includes('prehistoric') || name.includes('mysterious') || name.includes('inside the human mind') || name.includes('भविष्य') || name.includes('ब्रह्मांड')) {
              wonderMap.set(item.name || item.id, item);
            }
            // Beyond Exams
            else if (name.includes('taaza') || name.includes('world news') || name.includes('job') || name.includes('notification') || name.includes('science fact') || name.includes('health') || name.includes('beyond') || name.includes('human life') || name.includes('secrets of life') || name.includes('inside') || name.includes('digital')) {
              beyondMap.set(item.name || item.id, item);
            }
          });
        });

        const trendingSection = orderedSections.find(s => s.sectionName?.toLowerCase() === 'trending') || null;
        const flashSection = orderedSections.find(s => s.sectionName?.toLowerCase().includes('flash')) || null;

        // Build final sections: Trending → Flash Learning → content categories → Famous Personalities
        const finalSections: any[] = [];
        if (trendingSection) finalSections.push(trendingSection);
        if (flashSection) finalSections.push({ ...flashSection, sectionName: 'Flash Learning | फ्लैश लर्निंग', sectionType: 'FLASH_TYPE' });
        if (ancientHistoryMap.size > 0) finalSections.push({ id: 'synth-ancient', sectionName: 'Ancient History | प्राचीन इतिहास',              sectionType: 'CHAPTER_TYPE', items: Array.from(ancientHistoryMap.values()) });
        if (englishMap.size > 0)      finalSections.push({ id: 'synth-english',  sectionName: 'English | अंग्रेजी',                              sectionType: 'CHAPTER_TYPE', items: Array.from(englishMap.values()) });
        if (medievalMap.size > 0)     finalSections.push({ id: 'synth-medieval', sectionName: 'Medieval History | मध्यकालीन इतिहास',            sectionType: 'CHAPTER_TYPE', items: Array.from(medievalMap.values()) });
        if (geographyMap.size > 0)    finalSections.push({ id: 'synth-geo',      sectionName: 'Geography | भूगोल',                              sectionType: 'CHAPTER_TYPE', items: Array.from(geographyMap.values()) });
        if (scienceMap.size > 0)      finalSections.push({ id: 'synth-science',  sectionName: 'Science | विज्ञान',                              sectionType: 'CHAPTER_TYPE', items: Array.from(scienceMap.values()) });
        if (artCultureMap.size > 0)   finalSections.push({ id: 'synth-art',      sectionName: 'Art & Culture | कला और संस्कृति',               sectionType: 'CHAPTER_TYPE', items: Array.from(artCultureMap.values()) });
        if (toppersMap.size > 0)      finalSections.push({ id: 'synth-toppers',  sectionName: "Topper's Playlist | टॉपर्स प्लेलिस्ट",           sectionType: 'CHAPTER_TYPE', items: Array.from(toppersMap.values()) });
        if (wonderMap.size > 0)       finalSections.push({ id: 'synth-wonder',   sectionName: 'Wonder & Mysteries | आश्चर्य और रहस्य',         sectionType: 'CHAPTER_TYPE', items: Array.from(wonderMap.values()) });
        if (beyondMap.size > 0)       finalSections.push({ id: 'synth-beyond',   sectionName: 'Beyond Exams | परीक्षा से परे',                  sectionType: 'CHAPTER_TYPE', items: Array.from(beyondMap.values()) });
        // Famous Personalities last
        if (famousMap.size > 0)       finalSections.push({ id: 'synth-famous',   sectionName: 'Famous Personalities | प्रसिद्ध व्यक्तित्व',    sectionType: 'CHAPTER_TYPE', items: Array.from(famousMap.values()) });

        console.log('Final processed sections:', finalSections.length);
        setData({ profile, sections: finalSections });
      } catch (error) {
        console.error('Error loading data:', error);
        setData({ profile: await apiStore.fetchProfile(), sections: [] });
      }
    }
    loadData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#B8964A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xl font-bold text-gray-500">Loading Learnr...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0B0C10] min-h-screen font-sans text-gray-100 selection:bg-[#B18B3C] selection:text-white">
      
      {/* Top Header Navigation */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B0C10] border-b border-white/10 shadow-sm py-4' : 'bg-gradient-to-b from-[#0B0C10] via-[#0B0C10]/95 to-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <img src="/images/learnrlogo.jpeg" alt="Learnr App Logo" className="w-10 h-10 object-cover rounded-xl" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">Learnr</span>
              <span className="text-xs font-semibold text-gray-300 leading-none mt-1">
                By <span className="text-red-500 font-black">Adda</span><span className="font-black">Education</span>
              </span>
            </div>
          </div>

          {/* User Features */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsPopupOpen(true)}
              className="px-4 py-1.5 bg-[#B8964A] text-[#0B0C10] text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all hidden sm:block"
            >
              Install App
            </motion.button>
            <div className="lg:hidden ml-2 bg-[#1A1A24] shadow-sm p-2 rounded-xl cursor-pointer border border-white/5">
              <Menu size={20} className="text-white" />
            </div>
          </div>
        </div>
      </header>
      <LandingPage onGetStarted={() => setIsPopupOpen(true)} />

      <main className="pb-24 max-w-7xl mx-auto px-8 xl:px-12 space-y-10">
        {data.sections && data.sections.length > 0 ? (
          <SectionRenderer sections={data.sections} onItemClick={() => setIsPopupOpen(true)} />
        ) : (
          <p className="text-center text-gray-500 font-medium">Loading sections...</p>
        )}
      </main>

      <DownloadPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Footer */}
      <footer className="relative overflow-hidden mt-16 px-6 sm:px-10 py-16 bg-[#0E0E16]">
        <svg className="absolute right-0 top-0 h-full opacity-5 pointer-events-none" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 20 L280 270 L20 270 Z" stroke="#B8964A" strokeWidth="3" fill="none" />
          <path d="M100 190 L200 190" stroke="#B8964A" strokeWidth="3" />
        </svg>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white mb-8">
            Roz ek kadam.<br />Bas rukna nahi hai.
          </h2>
          <p className="text-base md:text-lg font-semibold text-[#B8964A] flex items-center gap-2">
            Made with <span className="text-xl">♥</span> in BHARAT
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
