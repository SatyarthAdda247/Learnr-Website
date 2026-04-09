import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface LandingPageProps {
  onGetStarted?: () => void;
}

const IMAGES = [
  '/images/app-ref-1.jpeg',
  '/images/app-ref-2.jpeg',
  '/images/app-ref-3.jpeg',
  '/images/app-ref-4.jpeg',
  '/images/app-ref-5.jpeg',
];

const N = IMAGES.length;
const STRIP = [...IMAGES, ...IMAGES, ...IMAGES];
const MOB_H = 260;

const TESTIMONIALS = [
  { initials: 'PS', name: 'Priya Sharma', location: 'Delhi', stars: 5, text: 'Content shorts concept is 🔥! I watch 2-3 videos while commuting and I\'ve already improved my GK so much. Feels like scrolling reels but actually learning something!' },
  { initials: 'RV', name: 'Rahul Verma', location: 'Lucknow', stars: 5, text: 'SSC prep was so boring before Learnr. Now I take quizzes daily and it feels like playing a game. Scored 150+ in my last mock — all thanks to this app!' },
  { initials: 'AP', name: 'Ananya Patel', location: 'Ahmedabad', stars: 5, text: 'The Hindi + English mix makes it so easy to understand. History topics that I used to skip — now I actually enjoy watching them. Best learning app for Indian students.' },
  { initials: 'VS', name: 'Vikram Singh', location: 'Jaipur', stars: 4, text: 'Riya AI assistant is genuinely helpful. I ask doubts at 2 AM and get instant answers. Quiz after every topic makes sure I actually remember what I learned.' },
  { initials: 'SG', name: 'Sneha Gupta', location: 'Patna', stars: 5, text: 'Exam preparation has never been this fun. The bite-sized format is perfect — no more sitting through 2-hour lectures. My friends are hooked on the Art & Culture section!' },
];

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.adda247.gold';

export const LandingPage = (_: LandingPageProps) => {
  const [pos, setPos] = useState(N);
  const [skipAnim, setSkipAnim] = useState(false);
  const [mobIdx, setMobIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const gap = containerW * 0.04;
  const cardW = containerW * 0.52;
  const cardH = cardW * 2;
  const xOffset = containerW / 2 - cardW / 2 - pos * (cardW + gap);

  const onAnimDone = () => {
    if (pos < N) { setSkipAnim(true); setPos(p => p + N); }
    else if (pos >= N * 2) { setSkipAnim(true); setPos(p => p - N); }
  };

  useEffect(() => {
    if (skipAnim) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSkipAnim(false)));
      return () => cancelAnimationFrame(raf);
    }
  }, [skipAnim]);

  const advance = () => {
    setSkipAnim(false);
    setPos(p => p + 1);
    setMobIdx(i => (i + 1) % N);
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, 3000);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleClick = (i: number) => { setSkipAnim(false); setPos(i); resetInterval(); };

  const Stars = ({ n }: { n: number }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-sm ${i <= n ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#0B0C10]">

      {/* ══ HERO ══ */}
      <section className="w-full">

        {/* MOBILE */}
        <div className="lg:hidden flex flex-col pt-24 pb-10 px-8 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-4xl font-black leading-[1.05] tracking-tighter text-white"
          >
            Roz ek <span className="text-[#B8964A]">kadam,</span><br />
            sapnon ki <span className="text-[#B8964A]">ore.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ height: MOB_H }}
          >
            {IMAGES.map((src, i) => (
              <motion.img key={src} src={src} alt=""
                className="absolute inset-0 w-full h-full object-cover object-top rounded-2xl"
                animate={{ opacity: i === mobIdx ? 1 : 0, scale: i === mobIdx ? 1 : 1.04 }}
                transition={{ duration: 0.5 }} draggable={false}
              />
            ))}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {IMAGES.map((_, i) => (
                <button key={i} onClick={() => { setMobIdx(i); resetInterval(); }}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === mobIdx ? 18 : 5, height: 5, background: i === mobIdx ? '#B8964A' : 'rgba(255,255,255,0.4)' }}
                />
              ))}
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm text-gray-400 leading-relaxed"
          >
            Build a daily learning habit in 12+ indian languages. From exam prep to life skills, powered by{' '}
            <span className="text-purple-400 font-medium">Riya, your AI assistant.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#B8964A] text-[#0B0C10] font-black text-sm rounded-full"
              style={{ boxShadow: '0 5px 0 #7a5e28' }}
            >
              ↓ Download App
            </a>
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play" className="h-12 w-auto -ml-1" />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-0.5">{[1,2,3,4].map(i=><span key={i} className="text-yellow-400">★</span>)}<span className="text-yellow-400 opacity-50">★</span></div>
            <span className="text-white font-black text-xs">4.6</span>
            <span className="text-gray-500 text-xs">· 1 Cr+ downloads</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 pt-2 border-t border-white/5"
          >
            {[{ value: '10K+', label: 'learners' }, { value: '12+', label: 'languages' }, { value: '50K+', label: 'hrs content' }].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-8 xl:px-12 pt-36 pb-20">
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="text-6xl xl:text-7xl font-black leading-[1.0] tracking-tighter text-white"
            >
              Roz ek <span className="text-[#B8964A]">kadam,</span><br />
              sapnon ki <span className="text-[#B8964A]">ore.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-gray-400 max-w-md leading-relaxed font-light"
            >
              Build a daily learning habit with bite-sized content in 12+ indian languages.
              From exam prep to life skills, powered by{' '}
              <span className="text-purple-400 font-medium">Riya, your AI assistant.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 bg-[#B8964A] text-[#0B0C10] font-black text-base rounded-full hover:opacity-90 transition-opacity"
                style={{ boxShadow: '0 6px 0 #7a5e28' }}
              >
                ↓ Download App
              </a>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play" className="h-12 w-auto -ml-1" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-0.5">{[1,2,3,4].map(i=><span key={i} className="text-yellow-400 text-lg">★</span>)}<span className="text-yellow-400 text-lg opacity-50">★</span></div>
              <span className="text-white font-black text-sm">4.6</span>
              <span className="text-gray-500 text-sm">· 1 Cr+ downloads · 3,821 reviews</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-10 pt-2 border-t border-white/5"
            >
              {[{ value: '10K+', label: 'active learners' }, { value: '12+', label: 'languages' }, { value: '50K+', label: 'hours content' }].map(s => (
                <div key={s.label}>
                  <div className="text-3xl xl:text-4xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slideshow */}
          <motion.div ref={containerRef}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="relative w-full overflow-hidden"
            style={{ height: containerW > 0 ? cardH : 480 }}
          >
            {containerW > 0 && (
              <>
                <motion.div className="absolute top-0 h-full flex" style={{ gap }}
                  animate={{ x: xOffset }}
                  transition={skipAnim ? { duration: 0 } : { duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                  onAnimationComplete={onAnimDone}
                >
                  {STRIP.map((src, i) => {
                    const isActive = i === pos;
                    return (
                      <button key={i} onClick={() => handleClick(i)}
                        className="flex-shrink-0 h-full rounded-3xl overflow-hidden focus:outline-none cursor-pointer"
                        style={{
                          width: cardW,
                          boxShadow: isActive ? '0 0 0 2px #B8964A, 0 0 40px rgba(184,150,74,0.2)' : '0 0 0 1px rgba(255,255,255,0.06)',
                          transform: isActive ? 'scale(1)' : 'scale(0.93)',
                          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                        }}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover object-top" draggable={false} />
                      </button>
                    );
                  })}
                </motion.div>
                <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none" />
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 px-8 xl:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Learners <span className="text-[#B8964A]">Love Us</span> ❤️
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Join 1 Crore+ learners already on Learnr</p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 snap-start w-72 bg-[#141418] border border-white/5 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B8964A]/20 flex items-center justify-center text-[#B8964A] font-black text-xs flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.location}</div>
                </div>
              </div>
              <Stars n={t.stars} />
              <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="mx-8 xl:mx-12 mb-16 rounded-3xl bg-[#141418] border border-white/5 py-16 px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="space-y-5 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Sirf sapne mat dekho,<br />
            <span className="text-[#B8964A]">unhe poora bhi karo.</span>
          </h2>
          <p className="text-gray-500 text-base">Shuruaat aaj se karo. Learnr ke saath, roz thoda aage badho.</p>
          <div className="flex justify-center pt-2">
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play" className="h-14 w-auto" />
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
