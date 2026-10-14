import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function LeadershipGrid({ data }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.leader-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-brand-off-white text-center">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Style matching reference */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-24"></div>
            <h2 className="px-6 font-serif italic text-3xl md:text-5xl text-[#7E5CAD]">
              {data.sectionTitle}
            </h2>
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-24"></div>
          </div>
          <p className="text-xl md:text-2xl font-serif italic text-brand-charcoal/90 max-w-3xl mx-auto leading-relaxed mb-6">
            {data.subtitle}
          </p>
          <p className="text-brand-charcoal/70 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            {data.intro}
          </p>
        </div>

        {/* 3-Column Leader Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {data.leaders.map((leader, index) => (
            <div key={index} className="leader-card flex flex-col items-center text-center">
              
              {/* Portrait Image */}
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-8 bg-[#7E5CAD]/10 border-4 border-white shadow-md">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" 
                />
              </div>

              {/* Name & Designation */}
              <h3 className="font-serif text-2xl text-[#7E5CAD] mb-1">
                {leader.name}
              </h3>
              <p className="text-[#66BB6A] font-bold text-xs uppercase tracking-widest mb-4">
                {leader.designation}
              </p>

              {/* Bio */}
              <p className="text-brand-charcoal/80 text-sm md:text-base leading-relaxed px-2">
                {leader.bio}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}