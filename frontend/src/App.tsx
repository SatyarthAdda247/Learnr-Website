import { useEffect, useState } from 'react';
import { apiStore } from './api/mockData';
import { Menu } from 'lucide-react';
import { fetchSections } from './api/sections';
import { SectionRenderer } from './components/SectionRenderer';
import { DownloadPopup } from './components/DownloadPopup';

function App() {
  const [data, setData] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [profile, sections] = await Promise.all([
        apiStore.fetchProfile(),
        fetchSections(),
      ]);

      let orderedSections = [...sections];

      const polityMap = new Map();
      const flashMap = new Map();
      const modernHistoryMap = new Map();
      const famousPersonMap = new Map();
      const reasoningMap = new Map();

      orderedSections.forEach(sec => {
        sec.items?.forEach(item => {
           const cat = (item.categoryName || '').toLowerCase();
           const name = (item.name || '').toLowerCase();

           if (cat.includes('polity') || name.includes('preamble') || name.includes('constitution') || name.includes('rights')) {
              polityMap.set(item.name || item.id, item);
           } else if (cat.includes('reasoning') || name.includes('dice') || name.includes('series') || name.includes('verb')) {
              reasoningMap.set(item.name || item.id, item);
           } else if (name.includes('history') || cat.includes('history') || name.includes('s400') || name.includes('business')) {
              modernHistoryMap.set(item.name || item.id, item);
           } else if (name.includes('bhagat') || name.includes('singh') || name.includes('personality') || name.includes('rank 12')) {
              famousPersonMap.set(item.name || item.id, item);
           } else if (cat.includes('biology') || cat.includes('geography') || cat.includes('economics')) {
              flashMap.set(item.name || item.id, item);
           }
        });
      });

      const synthFlashSection = { id: "synth-flash", sectionName: "Flash Learning", sectionType: "CHAPTER_TYPE", items: Array.from(flashMap.values()).slice(0, 8) };
      const synthPolitySection = { id: "synth-polity", sectionName: "Polity | राजनीति", sectionType: "CHAPTER_TYPE", items: Array.from(polityMap.values()).slice(0, 8) };
      const synthModernHistory = { id: "synth-modern", sectionName: "Modern History", sectionType: "CHAPTER_TYPE", items: Array.from(modernHistoryMap.values()).slice(0, 8) };
      const synthFamous = { id: "synth-famous", sectionName: "Famous Personalities", sectionType: "CHAPTER_TYPE", items: Array.from(famousPersonMap.values()).slice(0, 8) };
      const synthReasoning = { id: "synth-reason", sectionName: "Reasoning", sectionType: "CHAPTER_TYPE", items: Array.from(reasoningMap.values()).slice(0, 8) };

      // Make sure we have mock stand-ins if API returns explicitly empty arrays for these
      if (synthModernHistory.items.length === 0) synthModernHistory.items.push({ id: 'f2', name: 'Indian National Movement', type: 'SHOW', thumbnailUrl: '/images/ic_launcher.webp' });
      if (synthFamous.items.length === 0) synthFamous.items.push({ id: 'f3', name: 'Bhagat Singh', type: 'SHOW', thumbnailUrl: '/images/ic_launcher.webp' });
      if (synthReasoning.items.length === 0) synthReasoning.items.push({ id: 'f4', name: 'Syllogism Mastering', type: 'SHOW', thumbnailUrl: '/images/ic_launcher.webp' });

      const trendingIdx = orderedSections.findIndex((s) => s.sectionName?.toLowerCase() === 'trending');
      const trendingSection = trendingIdx !== -1 ? orderedSections[trendingIdx] : null;

      const subjectsIdx = orderedSections.findIndex((s) => s.sectionName?.toLowerCase() === 'subjects');
      const subjectsSection = subjectsIdx !== -1 ? orderedSections[subjectsIdx] : null;

      const finalSections = [];
      if (trendingSection) finalSections.push(trendingSection);
      if (subjectsSection) finalSections.push(subjectsSection);
      if (synthFlashSection.items.length > 0) finalSections.push(synthFlashSection);
      if (synthPolitySection.items.length > 0) finalSections.push(synthPolitySection);
      finalSections.push(synthModernHistory);
      finalSections.push(synthFamous);
      finalSections.push(synthReasoning);

      setData({ profile, sections: finalSections });
    }
    loadData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) return <div className="min-h-screen bg-[#FFFAF4] flex items-center justify-center text-xl font-bold text-[#666666]">Loading...</div>;

  return (
    <div className="bg-[#FFFAF4] min-h-screen font-sans text-[#2D2D2D] selection:bg-[#B18B3C] selection:text-white">
      
      {/* Top Header Navigation (Simple flex container with cream-to-white gradient) */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-4' : 'bg-gradient-to-b from-white via-white/95 to-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo & Brand (Learnr logo far left) */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <img src="/images/ic_launcher.webp" alt="Learnr App Logo" className="w-10 h-10 object-cover shadow-sm bg-black rounded-lg" />
            <span className="text-2xl font-black tracking-tight text-[#2D2D2D]">Learnr</span>
          </div>

          {/* User Features (Right side cluster) */}
          <div className="flex items-center gap-3">
            
            {/* Ticket/Streak Badge */}
            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full text-sm font-bold shadow-sm border border-gray-100">
               <img src="/images/png/streak_fire_icon.png" className="w-3.5 h-4 object-contain" alt="streak" />
               <span className="text-orange-500">{data.profile.streak}</span>
            </div>
            
            {/* Circular Gold Coin Badge */}
            <div className="flex items-center bg-white px-2.5 py-1.5 rounded-full text-sm font-bold shadow-sm border border-gray-100">
              <img src="/images/svg/coins_1.svg" alt="coins" className="w-4 h-4 mr-1.5 object-contain" onError={(e) => { e.currentTarget.src = "/images/png/adda_coins.png" }} />
              {data.profile.coins}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center cursor-pointer p-0.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <img src={data.profile.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
            </div>

            <div className="lg:hidden ml-2 bg-white shadow-sm p-2 rounded-xl cursor-pointer border border-gray-100">
              <Menu size={20} className="text-[#2D2D2D]" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dynamic API Sections */}
        {data.sections && data.sections.length > 0 ? (
          <SectionRenderer 
            sections={data.sections} 
            onItemClick={() => setIsPopupOpen(true)}
          />
        ) : (
          <p className="text-center text-gray-500 font-medium">Loading sections...</p>
        )}

      </main>

      <DownloadPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

    </div>
  );
}

export default App;
