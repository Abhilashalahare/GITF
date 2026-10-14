import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function EditorialSplit({
  heading,
  subheading,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      '.reveal-image',
      { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
      }
    );

    gsap.from('.reveal-text', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      },
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      className="py-24 md:py-32 px-6 md:px-12 bg-brand-off-white"
    >
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}
      >
        <div
          className={`lg:col-span-7 ${
            reverse ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="border-b border-[#7E5CAD]/20 pb-8 mb-8">
            <h2 className="reveal-text text-4xl md:text-6xl font-serif italic text-[#7E5CAD] mb-4 leading-tight">
              {heading}
            </h2>

            {subheading && (
              <p className="reveal-text text-xl md:text-2xl text-[#66BB6A] font-bold">
                {subheading}
              </p>
            )}
          </div>

          <div className="reveal-text prose prose-lg text-brand-charcoal/80 space-y-6">
            {body.map((paragraph, index) => (
              <p key={index} className="leading-relaxed font-medium">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {imageSrc && (
          <div
            className={`lg:col-span-5 h-[400px] md:h-[600px] w-full ${
              reverse ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <div className="reveal-image w-full h-full overflow-hidden bg-[#7E5CAD]/10">
              <img
                src={imageSrc}
                alt={imageAlt || 'School activity'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}