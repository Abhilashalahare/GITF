import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function QuoteSection({ quote, author }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.quote-content', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 md:py-40 px-6 md:px-12 bg-gradient-lime-sage text-brand-charcoal flex items-center justify-center relative overflow-hidden">
      {/* Subtle texture/overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-charcoal to-transparent"></div>
      
      <div className="quote-content max-w-5xl mx-auto text-center relative z-10">
        <span className="text-8xl md:text-[150px] font-condensed leading-none text-brand-white/40 absolute -top-12 md:-top-20 left-1/2 -translate-x-1/2">
          &ldquo;
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-condensed leading-tight mb-8 relative z-10">
          {quote}
        </h2>
        <p className="text-lg md:text-xl font-medium tracking-widest uppercase opacity-80">
          — {author}
        </p>
      </div>
    </section>
  );
}