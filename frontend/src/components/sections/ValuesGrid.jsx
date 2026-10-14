import { LuLightbulb, LuHeart, LuShieldCheck, LuTarget, LuSmile, LuSparkles, LuAnchor } from 'react-icons/lu';

// Updated to use react-icons
const icons = [LuLightbulb, LuHeart, LuShieldCheck, LuTarget, LuSmile, LuSparkles, LuAnchor];

export default function ValuesGrid({ values }) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-brand-off-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Centered Header matching the new elegant aesthetic */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-brand-charcoal text-sm uppercase tracking-widest font-bold mb-4">
            Guiding Principles
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#7E5CAD]">
            Our Core Values
          </h2>
        </div>

        {/* 2-Column Grid matching the reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {values.map((value, i) => {
            const Icon = icons[i % icons.length];
            
            // If there's an odd number of values (like 7), make the last one span both columns on desktop for perfect symmetry
            const isLastOdd = i === values.length - 1 && values.length % 2 !== 0;

            return (
              <div 
                key={i} 
                className={`group flex justify-between items-center bg-[#7E5CAD] hover:bg-[#66BB6A] transition-colors duration-500 p-8 md:p-10 text-brand-white ${isLastOdd ? 'md:col-span-2' : ''}`}
              >
                {/* Text Content (Left aligned) */}
                <div className="pr-6 md:pr-10 w-4/5">
                  <h3 className="font-serif text-2xl md:text-3xl mb-3">
                    {value.title}
                  </h3>
                  <p className="text-brand-white/90 text-sm md:text-base leading-relaxed">
                    {value.desc}
                  </p>
                </div>
                
                {/* Icon (Right aligned) */}
                <div className="flex-shrink-0 w-1/5 flex justify-end">
                  <Icon 
                    className="w-12 h-12 md:w-16 md:h-16 text-brand-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" 
                    strokeWidth={1.5} 
                  />
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}