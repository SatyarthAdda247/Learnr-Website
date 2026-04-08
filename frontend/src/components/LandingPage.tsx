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
// Triple the array: [0..4, 0..4, 0..4]
// We start in the middle copy (index N) so we can scroll both ways infinitely
const STRIP = [...IMAGES, ...IMAGES, ...IMAGES];

const MOB_H = 260;

export const LandingPage = (_: LandingPageProps) => {
  // pos is the index into STRIP; starts at N (first item of middle copy)
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
  const step = cardW + gap;
  // x so that card at `pos` is centered in the container
  const xOffset = containerW / 2 - cardW / 2 - pos * step;

  // After each animated move, if we've drifted into the first or last copy,
  // silently teleport back to the equivalent position in the middle copy
  const onAnimDone = () => {
    if (pos < N) {
      setSkipAnim(true);
      setPos(p => p + N);
    } else if (pos >= N * 2) {
      setSkipAnim(true);
      setPos(p => p - N);
    }
  };

  // Re-enable animation one frame after the silent jump
  useEffect(() => {
    if (skipAnim) {
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setSkipAnim(false))
      );
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

  const handleClick = (stripIdx: number) => {
    setSkipAnim(false);
    setPos(stripIdx);
    resetInterval();
  };

  return (
    <section className="w-full bg-[#0B0C10]">

      {/* ── MOBILE ── */}
      <div className="lg:hidden flex flex-col pt-24 pb-10 px-8 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-4xl font-black leading-[1.05] tracking-tighter text-white"
        >
          रोज़ एक <span className="text-[#B8964A]">kadam,</span><br />
          sapnon ki <span className="text-[#B8964A]">ore.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ height: MOB_H }}
        >
          {IMAGES.map((src, i) => (
            <motion.img
              key={src} src={src} alt=""
              className="absolute inset-0 w-full h-full object-cover object-top rounded-2xl"
              animate={{ opacity: i === mobIdx ? 1 : 0, scale: i === mobIdx ? 1 : 1.04 }}
              transition={{ duration: 0.5 }}
              draggable={false}
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

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="text-sm text-gray-400 leading-relaxed"
        >
          Build a daily learning habit in 12+ indian languages.
          From exam prep to life skills, powered by{' '}
          <span className="text-purple-400 font-medium">Riya, your AI assistant.</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
          <a href="https://play.google.com/store/apps/details?id=com.adda247.gold" target="_blank" rel="noopener noreferrer">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play" className="h-14 w-auto -ml-2" />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className="flex gap-8"
        >
          {[{ value: '10K+', label: 'learners' }, { value: '12+', label: 'languages' }, { value: '50K+', label: 'hrs content' }].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-8 xl:px-12 pt-36 pb-20">

        {/* LEFT */}
        <div className="space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-6xl xl:text-7xl font-black leading-[1.0] tracking-tighter text-white"
          >
            Roz ek<br />
            <span className="text-[#B8964A]">kadam,</span><br />
            sapnon ki<br />
            <span className="text-[#B8964A]">ore.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-400 max-w-md leading-relaxed font-light"
          >
            Build a daily learning habit with bite-sized content in 12+ indian languages.
            From exam prep to life skills, powered by{' '}
            <span className="text-purple-400 font-medium">Riya, your AI assistant.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}>
            <a href="https://play.google.com/store/apps/details?id=com.adda247.gold" target="_blank" rel="noopener noreferrer"
              className="inline-block hover:opacity-90 transition-opacity">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play" className="h-16 w-auto -ml-3" />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-10"
          >
            {[{ value: '10K+', label: 'active learners' }, { value: '12+', label: 'languages' }, { value: '50K+', label: 'hours content' }].map(s => (
              <div key={s.label}>
                <div className="text-3xl xl:text-4xl font-black text-white">{s.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: bulletproof infinite slideshow */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
          className="relative w-full overflow-hidden"
          style={{ height: containerW > 0 ? cardH : 480 }}
        >
          {containerW > 0 && (
            <>
              <motion.div
                className="absolute top-0 h-full flex"
                style={{ gap }}
                animate={{ x: xOffset }}
                transition={skipAnim ? { duration: 0 } : { duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                onAnimationComplete={onAnimDone}
              >
                {STRIP.map((src, i) => {
                  const isActive = i === pos;
                  return (
                    <button
                      key={i}
                      onClick={() => handleClick(i)}
                      className="flex-shrink-0 h-full rounded-3xl overflow-hidden focus:outline-none cursor-pointer"
                      style={{
                        width: cardW,
                        boxShadow: isActive
                          ? '0 0 0 2px #B8964A, 0 0 40px rgba(184,150,74,0.2)'
                          : '0 0 0 1px rgba(255,255,255,0.06)',
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
  );
};
