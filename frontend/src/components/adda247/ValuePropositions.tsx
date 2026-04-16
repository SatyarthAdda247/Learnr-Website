import easyLearnImg from '@/assets/01easylearn.png';
import practiceImg from '@/assets/02practice.png';
import sarkariImg from '@/assets/03sarkari.png';

const valueProps = [{
  title: "Chhote Videos, Asaan Learning",
  image: easyLearnImg
}, {
  title: "Practice Karo, Confident Bano",
  image: practiceImg
}, {
  title: "Sarkari Naukri Ab Hogi Pakki",
  image: sarkariImg
}];

export const ValuePropositions = () => {
  return <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-chinese-black">
            Bas 3 Steps Aur Sarkari Naukri Aapki
          </h2>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => <div key={index} className="adda-card overflow-hidden" style={{
          animationDelay: `${index * 0.2}s`
        }}>
              {/* Step number */}
              <div className="relative">
                <div className="absolute top-4 left-4 w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft z-10">
                  {index + 1}
                </div>
                
                {/* Content Visual */}
                <div className="h-64 bg-antique-white flex items-center justify-center p-4">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
              
              {/* Text */}
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-bold text-chinese-black mb-2">
                  {prop.title}
                </h3>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};

export default ValuePropositions;
