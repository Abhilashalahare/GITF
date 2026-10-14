import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PageHero({ title, subtitle, colorClass = "bg-brand-charcoal text-brand-white" }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.ph-text', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: container });

  return (
    <section ref={container} className={`pt-40 pb-20 px-6 md:px-12 ${colorClass}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="ph-text text-6xl md:text-8xl lg:text-9xl font-condensed leading-[0.9] tracking-tighter mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="ph-text text-xl md:text-3xl font-condensed tracking-wide opacity-80 max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}