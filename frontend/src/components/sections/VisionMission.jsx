import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function VisionMission({ vision, mission }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.vm-text', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="w-full py-24 md:py-32 px-6 md:px-12 bg-brand-off-white flex flex-col items-center justify-center text-center min-h-[800px]">
      <div className="max-w-4xl mx-auto w-full">

        {/* Intro Header matching the reference style */}
        <div className="vm-text mb-20 md:mb-28">
          <h3 className="text-2xl md:text-3xl font-serif italic text-brand-charcoal leading-relaxed">
            While others adapt, <br className="hidden md:block" />
            Bhilai Ispat Vikas Vidyalaya is founded on this.
          </h3>
        </div>

        {/* Vision Section */}
        <div className="vm-text mb-20 md:mb-24">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-32"></div>
            <h2 className="px-6 text-[#7E5CAD] font-serif text-3xl md:text-4xl tracking-wide uppercase">
              VISION
            </h2>
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-32"></div>
          </div>
          <p className="text-[#7E5CAD] text-xl md:text-3xl font-serif italic leading-relaxed max-w-3xl mx-auto">
            {vision}
          </p>
        </div>

        {/* Mission Section */}
        <div className="vm-text">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-32"></div>
            <h2 className="px-6 text-[#7E5CAD] font-serif text-3xl md:text-4xl tracking-wide uppercase">
              MISSION
            </h2>
            <div className="h-[1px] bg-[#7E5CAD]/30 w-16 md:w-32"></div>
          </div>
          <p className="text-[#7E5CAD] text-xl md:text-3xl font-serif italic leading-relaxed max-w-3xl mx-auto">
            {mission}
          </p>
        </div>

      </div>
    </section>
  );
}