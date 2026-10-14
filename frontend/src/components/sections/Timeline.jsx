import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Timeline({ events }) {
  const container = useRef(null);

  useGSAP(() => {
    // Animate the central vertical line drawing downwards
    gsap.fromTo('.timeline-line', 
      { height: 0 },
      { 
        height: '100%', 
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        }
      }
    );

    // Fade in each timeline node as you scroll
    gsap.utils.toArray('.timeline-item').forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: item.classList.contains('left-node') ? -50 : 50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        }
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-brand-off-white relative overflow-hidden border-t border-[#7E5CAD]/10">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Updated Header */}
        <div className="text-center mb-24">
          <p className="text-brand-charcoal text-sm uppercase tracking-widest font-bold mb-4">
            From Opportunity to Possibility
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#7E5CAD]">
            Our Journey
          </h2>
        </div>

        {/* Central Vertical Line Container */}
        <div className="relative border-l md:border-l-0 md:border-l-transparent md:mx-auto">
          {/* The drawing line (Updated to purple) */}
          <div className="timeline-line absolute left-0 md:left-1/2 top-0 w-px bg-[#7E5CAD]/30 md:-translate-x-1/2 origin-top h-full z-0"></div>

          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`timeline-item relative z-10 w-full mb-16 md:mb-24 flex flex-col md:flex-row items-start ${isEven ? 'md:justify-start left-node' : 'md:justify-end right-node'} pl-8 md:pl-0`}>
                
                {/* Mobile Dot / Desktop Central Dot (Updated to Green & Purple) */}
                <div className="absolute left-[-6px] md:left-1/2 top-1 w-4 h-4 rounded-full bg-[#66BB6A] border-2 border-brand-off-white shadow-[0_0_0_2px_#7E5CAD] md:-translate-x-1/2 z-20"></div>

                {/* Content Box */}
                <div className={`md:w-5/12 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  {/* Date Badge (Updated to Green) */}
                  <span className="inline-block bg-[#66BB6A] text-brand-white text-xs font-bold px-3 py-1 uppercase tracking-widest mb-4">
                    {event.date}
                  </span>
                  
                  {/* Title (Updated to Purple Serif) */}
                  <h3 className="font-serif text-2xl md:text-3xl text-[#7E5CAD] mb-3">
                    {event.title}
                  </h3>
                  
                  <p className="text-brand-charcoal/80 leading-relaxed font-medium text-sm md:text-base">
                    {event.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}