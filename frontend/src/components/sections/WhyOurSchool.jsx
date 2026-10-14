import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function WhyOurSchool({ features }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.why-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-brand-off-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24 text-center">
          <p className="text-[#66BB6A] text-sm uppercase tracking-widest font-bold mb-4">
            More Than a Classroom. A Place to Grow.
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#7E5CAD] mb-6">
            Why Our School?
          </h2>
          <p className="text-brand-charcoal/80 max-w-2xl mx-auto text-lg font-medium">
            At BIVV, we believe that meaningful education should develop the whole child.
          </p>
        </div>

        {/* Flex layout matches the FeatureGrid style exactly */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="why-card w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] bg-white p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-500 group"
            >
              {/* Text Content */}
              <h3 className="font-serif text-2xl md:text-3xl text-[#7E5CAD] mb-4 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-brand-charcoal/70 text-sm font-medium leading-relaxed mb-8 flex-grow">
                {feature.desc}
              </p>

              {/* Image Container */}
              <div className="w-full aspect-[4/3] overflow-hidden bg-brand-off-white">
                <img 
                  // Uses feature.image if you add it to your data, otherwise falls back to this placeholder
                  src={feature.image || "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop"} 
                  alt={feature.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}