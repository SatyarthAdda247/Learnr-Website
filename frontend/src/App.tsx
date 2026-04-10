import { useEffect, useState } from 'react';
import { apiStore } from './api/mockData';
import { motion } from 'framer-motion';
import { fetchSections } from './api/sections';
import { SectionRenderer } from './components/SectionRenderer';
import { LandingPage } from './components/LandingPage';
import { DownloadPopup } from './components/DownloadPopup';

function App() {
  const [data, setData] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B0C10] border-b border-white/10 py-4' : 'bg-gradient-to-b from-[#0B0C10] via-[#0B0C10]/95 to-transparent py-4'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/images/learnrlogo.jpeg" alt="Learnr App Logo" className="w-11 h-11 object-cover rounded-xl" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">Learnr</span>
              <span className="text-xs font-semibold text-gray-300 leading-none mt-1">
                By <span className="text-red-500 font-black">Adda</span><span className="font-black">Education</span>
              </span>
            </div>
          </div>

          {/* Play Store badge */}
          <a
            href="https://app.adjust.com/1zetqonb?campaign=Website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity hidden sm:block"
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="h-12 w-auto"
            />
          </a>
        </div>
      </header>
      <LandingPage onGetStarted={() => setIsPopupOpen(true)} />

      <main className="pb-16 max-w-screen-2xl mx-auto px-6 sm:px-8 xl:px-12 space-y-10">
        {data.sections && data.sections.length > 0 ? (
          <SectionRenderer sections={data.sections} onItemClick={() => setIsPopupOpen(true)} />
        ) : (
          <p className="text-center text-gray-500 font-medium">Loading sections...</p>
        )}
      </main>

      <DownloadPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-16 px-6 sm:px-8 xl:px-12 max-w-screen-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Learners <span className="text-[#B8964A]">Love Us</span> ❤️
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Join 1 Crore+ learners already on Learnr</p>
        </motion.div>

        {/* Auto-scrolling strip */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 pb-4"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ width: 'max-content' }}
          >
            {[
              { initials: 'PS', name: 'Priya Sharma',   location: 'Delhi',     stars: 5, text: 'Content shorts concept is 🔥! I watch 2-3 videos while commuting and I\'ve already improved my GK so much. Feels like scrolling reels but actually learning something!' },
              { initials: 'RV', name: 'Rahul Verma',    location: 'Lucknow',   stars: 5, text: 'SSC prep was so boring before Learnr. Now I take quizzes daily and it feels like playing a game. Scored 150+ in my last mock — all thanks to this app!' },
              { initials: 'AP', name: 'Ananya Patel',   location: 'Ahmedabad', stars: 5, text: 'The Hindi + English mix makes it so easy to understand. History topics that I used to skip — now I actually enjoy watching them. Best learning app for Indian students.' },
              { initials: 'VS', name: 'Vikram Singh',   location: 'Jaipur',    stars: 4, text: 'Riya AI assistant is genuinely helpful. I ask doubts at 2 AM and get instant answers. Quiz after every topic makes sure I actually remember what I learned.' },
              { initials: 'SG', name: 'Sneha Gupta',    location: 'Patna',     stars: 5, text: 'Exam preparation has never been this fun. The bite-sized format is perfect — no more sitting through 2-hour lectures. My friends are hooked on the Art & Culture section!' },
              { initials: 'AM', name: 'Arjun Mishra',   location: 'Bhopal',    stars: 5, text: 'I failed my last two attempts at SSC CGL. After using Learnr for 3 months, I finally cleared it. The daily quiz habit made all the difference. Highly recommend!' },
              { initials: 'NK', name: 'Neha Kumari',    location: 'Ranchi',    stars: 5, text: 'Geography and History used to be my weakest subjects. Learnr\'s short videos explained everything so clearly. My score jumped from 45 to 78 in just 6 weeks!' },
              { initials: 'RT', name: 'Rohan Tiwari',   location: 'Kanpur',    stars: 4, text: 'The Hinglish content is a game changer. I never felt comfortable with pure English apps. Learnr speaks my language and that makes learning so much more natural.' },
              { initials: 'DM', name: 'Divya Mehta',    location: 'Surat',     stars: 5, text: 'I use Learnr during my lunch break every day. 15 minutes of focused learning and I feel so productive. The streak feature keeps me coming back every single day!' },
              { initials: 'KS', name: 'Karan Sharma',   location: 'Chandigarh',stars: 5, text: 'Best investment of my time. The content quality is top-notch and Riya AI answers my doubts instantly. It\'s like having a personal tutor available 24/7 for free.' },
              // duplicate for seamless loop
              { initials: 'PS', name: 'Priya Sharma',   location: 'Delhi',     stars: 5, text: 'Content shorts concept is 🔥! I watch 2-3 videos while commuting and I\'ve already improved my GK so much. Feels like scrolling reels but actually learning something!' },
              { initials: 'RV', name: 'Rahul Verma',    location: 'Lucknow',   stars: 5, text: 'SSC prep was so boring before Learnr. Now I take quizzes daily and it feels like playing a game. Scored 150+ in my last mock — all thanks to this app!' },
              { initials: 'AP', name: 'Ananya Patel',   location: 'Ahmedabad', stars: 5, text: 'The Hindi + English mix makes it so easy to understand. History topics that I used to skip — now I actually enjoy watching them. Best learning app for Indian students.' },
              { initials: 'VS', name: 'Vikram Singh',   location: 'Jaipur',    stars: 4, text: 'Riya AI assistant is genuinely helpful. I ask doubts at 2 AM and get instant answers. Quiz after every topic makes sure I actually remember what I learned.' },
              { initials: 'SG', name: 'Sneha Gupta',    location: 'Patna',     stars: 5, text: 'Exam preparation has never been this fun. The bite-sized format is perfect — no more sitting through 2-hour lectures. My friends are hooked on the Art & Culture section!' },
              { initials: 'AM', name: 'Arjun Mishra',   location: 'Bhopal',    stars: 5, text: 'I failed my last two attempts at SSC CGL. After using Learnr for 3 months, I finally cleared it. The daily quiz habit made all the difference. Highly recommend!' },
              { initials: 'NK', name: 'Neha Kumari',    location: 'Ranchi',    stars: 5, text: 'Geography and History used to be my weakest subjects. Learnr\'s short videos explained everything so clearly. My score jumped from 45 to 78 in just 6 weeks!' },
              { initials: 'RT', name: 'Rohan Tiwari',   location: 'Kanpur',    stars: 4, text: 'The Hinglish content is a game changer. I never felt comfortable with pure English apps. Learnr speaks my language and that makes learning so much more natural.' },
              { initials: 'DM', name: 'Divya Mehta',    location: 'Surat',     stars: 5, text: 'I use Learnr during my lunch break every day. 15 minutes of focused learning and I feel so productive. The streak feature keeps me coming back every single day!' },
              { initials: 'KS', name: 'Karan Sharma',   location: 'Chandigarh',stars: 5, text: 'Best investment of my time. The content quality is top-notch and Riya AI answers my doubts instantly. It\'s like having a personal tutor available 24/7 for free.' },
            ].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-72 bg-[#141418] border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B8964A]/20 flex items-center justify-center text-[#B8964A] font-black text-xs flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.location}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= t.stars ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>)}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </motion.div>
          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0B0C10] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0B0C10] to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="mx-6 sm:mx-8 xl:mx-12 mb-0 rounded-3xl bg-[#141418] border border-white/5 py-14 px-6 sm:px-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="space-y-5 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Sirf sapne mat dekho,<br />
            <span className="text-[#B8964A]">unhe poora bhi karo.</span>
          </h2>
          <p className="text-gray-500 text-base">Shuruaat aaj se karo. Learnr ke saath, roz thoda aage badho.</p>
          <div className="flex justify-center pt-2">
            <a href="https://app.adjust.com/1zetqonb?campaign=Website" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play" className="h-14 w-auto" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 px-6 sm:px-8 border-t border-white/5 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src="/images/learnrlogo.jpeg" alt="Learnr" className="w-10 h-10 rounded-xl object-cover" />
          <span className="text-white font-black text-2xl">Learnr</span>
        </div>
        <p className="text-gray-500 text-sm">By METIS EDUVENTURES PRIVATE LIMITED (Adda Education)</p>
        <p className="text-gray-500 text-sm">
          <a href="mailto:support.learnr@adda247.com" className="hover:text-white transition-colors">support.learnr@adda247.com</a>
          {' · '}Gurugram, Haryana, India
        </p>
      </footer>

    </div>
  );
}

export default App;
