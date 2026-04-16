import trustIcon1 from '@/assets/trust-icon-1.png';
import trustIcon2 from '@/assets/trust-icon-2.png';
import trustIcon3 from '@/assets/trust-icon-3.png';

const badges = [
  {
    icon: trustIcon1,
    text: "10Cr+ students ka bharosa",
  },
  {
    icon: trustIcon2,
    text: "100+ exams ki tayyari",
  },
  {
    icon: trustIcon3,
    text: "1L+ students ka selection",
  },
];

export const TrustBadges = () => {
  return (
    <section className="py-12 md:py-16 bg-antique-white">
      <div className="container mx-auto px-4">
        <div className="trust-pill max-w-4xl mx-auto p-6 md:p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-chinese-black mb-2">
              Lakhon Ka Bharosa
            </h2>
            <p className="text-graphite-grey">
              Adda247 — Lakhon sapne poore karne ka saathi.
            </p>
          </div>
          
          {/* Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-creamy-beige rounded-lg p-4 transition-transform hover:scale-105"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-soft">
                  <img src={badge.icon} alt="" className="w-7 h-7" />
                </div>
                <span className="text-sm md:text-base font-semibold text-graphite-grey">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
