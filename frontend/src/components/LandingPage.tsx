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
const PLAY_URL = 'https://app.adjust.com/1zetqonb?campaign=Website';
const BADGE_URL = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

export const LandingPage = (_: LandingPageProps) => {
  // Desktop slideshow state
  const [pos, setPos] = useState(N);
  const [skipAnim, setSkipAnim] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  // Mobile slideshow state
  const [mobPos, setMobPos] = useState(N);
  const [mobSkip, setMobSkip] = useState(false);
  const mobContainerRef = useRef<HTMLDivElement>(null);
  const [mobContainerW, setMobContainerW] = useState(0);

  // Measure desktop container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Measure mobile container
  useEffect(() => {
    const measure = () => {
      if (mobContainerRef.current) setMobContainerW(mobContainerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (mobContainerRef.current) ro.observe(mobContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Desktop card dimensions — portrait ratio, capped so it never overflows
  const dGap = containerW * 0.04;
  const dCardW = containerW * 0.40;
  const dCardH = Math.min(dCardW * 1.78, 480);
  const dXOffset = containerW / 2 - dCardW / 2 - pos * (dCardW + dGap);

  // Mobile card dimensions — width-driven, height auto from aspect ratio
  const mGap = 8;
  const mCardW = mobContainerW * 0.75;
  const mCardH = mCardW * 1.95; // ~9:17.5 portrait ratio matching the app screenshots
  const mXOffset = mobContainerW / 2 - mCardW / 2 - mobPos * (mCardW + mGap);

  const onDesktopAnimDone = () => {
    if (pos < N) { setSkipAnim(true); setPos(p => p + N); }
    else if (pos >= N * 2) { setSkipAnim(true); setPos(p => p - N); }
  };

  const onMobAnimDone = () => {
    if (mobPos < N) { setMobSkip(true); setMobPos(p => p + N); }
    else if (mobPos >= N * 2) { setMobSkip(true); setMobPos(p => p - N); }
  };

  useEffect(() => {
    if (skipAnim) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSkipAnim(false)));
      return () => cancelAnimationFrame(raf);
    }
  }, [skipAnim]);

  useEffect(() => {
    if (mobSkip) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMobSkip(false)));
      return () => cancelAnimationFrame(raf);
    }
  }, [mobSkip]);

  const advance = () => {
    setSkipAnim(false);
    setPos(p => p + 1);
    setMobSkip(false);
    setMobPos(p => p + 1);
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, 2000);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleDesktopClick = (i: number) => { setSkipAnim(false); setPos(i); resetInterval(); };
  const handleMobClick = (i: number) => { setMobSkip(false); setMobPos(i); resetInterval(); };

  const RatingRow = ({ size = 'sm' }: { size?: 'sm' | 'base' }) => (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4].map(i => <span key={i} className={`text-yellow-400 ${size === 'base' ? 'text-lg' : 'text-sm'}`}>★</span>)}
        <span className={`text-yellow-400 opacity-40 ${size === 'base' ? 'text-lg' : 'text-sm'}`}>★</span>
      </div>
      <span className={`text-white font-black ${size === 'base' ? 'text-sm' : 'text-xs'}`}>4.6</span>
      <span className={`text-gray-500 ${size === 'base' ? 'text-sm' : 'text-xs'}`}>· 10K+ downloads</span>
    </div>
  );

  const Stats = ({ gap = 'gap-8', textSize = 'text-2xl', labelSize = 'text-[10px]' }: { gap?: string; textSize?: string; labelSize?: string }) => (
    <div className={`flex ${gap} pt-3 border-t border-white/5`}>
      {[{ value: '10K+', label: 'Active Learners' }, { value: '12+', label: 'Languages' }, { value: '50K+', label: 'Hrs Content' }].map(s => (
        <div key={s.label}>
          <div className={`${textSize} font-black text-white`}>{s.value}</div>
          <div className={`${labelSize} text-gray-500 uppercase tracking-wider mt-0.5`}>{s.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#0B0C10]">
      <section className="w-full">

        {/* ══ MOBILE HERO ══ */}
        <div className="lg:hidden">
          {/* Text block */}
          <div className="px-6 pt-24 pb-6 space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-[2.6rem] font-black leading-[1.05] tracking-tighter text-white"
            >
              Roz ek <span className="text-[#B8964A]">kadam,</span><br />
              sapnon ki <span className="text-[#B8964A]">aur.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm text-gray-400 leading-relaxed max-w-sm"
            >
              Daily learning in 12+ Indian languages. Exam prep to life skills,
              powered by <span className="text-purple-400 font-medium">Riya AI.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3"
            >
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-[#B8964A] text-[#0B0C10] font-black text-sm rounded-full active:opacity-80"
                style={{ boxShadow: '0 4px 0 #7a5e28' }}
              >
                ↓ Download App - Free
              </a>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer">
                <img src={BADGE_URL} alt="Get it on Google Play" className="h-11 w-auto" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
              <RatingRow />
            </motion.div>
          </div>

          {/* Mobile image slideshow — full bleed, portrait cards with peek */}
          <motion.div
            ref={mobContainerRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full overflow-hidden"
            style={{ height: mobContainerW > 0 ? mCardH : 320 }}
          >
            {mobContainerW > 0 && (
              <>
                <motion.div
                  className="absolute top-0 h-full flex"
                  style={{ gap: mGap }}
                  animate={{ x: mXOffset }}
                  transition={mobSkip ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onAnimationComplete={onMobAnimDone}
                >
                  {STRIP.map((src, i) => {
                    const isActive = i === mobPos;
                    return (
                      <div
                        key={i}
                        className="flex-shrink-0 h-full rounded-2xl"
                        style={{
                          width: mCardW,
                          transform: isActive ? 'scale(1)' : 'scale(0.96)',
                          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: 'none',
                          padding: 0,
                        }}
                      >
                        <button
                          onClick={() => handleMobClick(i)}
                          className="w-full h-full rounded-2xl overflow-hidden focus:outline-none block relative"
                        >
                          <img src={src} alt="" className="w-full h-full object-contain" draggable={false} />
                          {!isActive && (
                            <div className="absolute inset-0 bg-black/25 rounded-2xl pointer-events-none" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none" />
              </>
            )}
          </motion.div>

          {/* Stats below images */}
          <div className="px-6 pb-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Stats />
            </motion.div>
          </div>
        </div>

        {/* ══ DESKTOP HERO ══ */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr] gap-10 items-center max-w-screen-2xl mx-auto px-8 xl:px-12 pt-32 pb-16 min-h-0">

          {/* Left */}
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="text-6xl xl:text-7xl font-black leading-[1.0] tracking-tighter text-white"
            >
              Roz ek <span className="text-[#B8964A]">kadam,</span><br />
              sapnon ki <span className="text-[#B8964A]">aur.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-gray-400 max-w-md leading-relaxed"
            >
              Build a daily learning habit with bite-sized content in 12+ Indian languages.
              From exam prep to life skills, powered by{' '}
              <span className="text-purple-400 font-medium">Riya, your AI assistant.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 bg-[#B8964A] text-[#0B0C10] font-black text-base rounded-full hover:opacity-90 transition-opacity"
                style={{ boxShadow: '0 6px 0 #7a5e28' }}
              >
                ↓ Download App
              </a>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                <img src={BADGE_URL} alt="Get it on Google Play" className="h-12 w-auto" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}>
              <RatingRow size="base" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Stats gap="gap-10" textSize="text-3xl xl:text-4xl" labelSize="text-xs" />
            </motion.div>
          </div>

          {/* Right — desktop slideshow */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ height: containerW > 0 ? dCardH : 420 }}
          >
            {containerW > 0 && (
              <>
                <motion.div
                  className="absolute top-0 h-full flex"
                  style={{ gap: dGap }}
                  animate={{ x: dXOffset }}
                  transition={skipAnim ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onAnimationComplete={onDesktopAnimDone}
                >
                  {STRIP.map((src, i) => {
                    const isActive = i === pos;
                    return (
                      <div
                        key={i}
                        className="flex-shrink-0 h-full rounded-3xl"
                        style={{
                          width: dCardW,
                          transform: isActive ? 'scale(1)' : 'scale(0.93)',
                          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: 'none',
                          padding: 0,
                        }}
                      >
                        <button
                          onClick={() => handleDesktopClick(i)}
                          className="w-full h-full rounded-3xl overflow-hidden focus:outline-none cursor-pointer block"
                        >
                          <img src={src} alt="" className="w-full h-full object-contain" draggable={false} />
                        </button>
                      </div>
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
    </div>
  );
};
