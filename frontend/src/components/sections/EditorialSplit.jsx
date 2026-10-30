import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function EditorialSplit({
  heading,
  subheading,
  body = [],
  imageSrc,
  imageAlt,
  reverse = false,
}) {
  const container = useRef(null);

  useGSAP(() => {
    const image = container.current?.querySelector('.reveal-image');
    const text = container.current?.querySelectorAll('.reveal-text');

    if (image) {
      gsap.fromTo(
        image,
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
    }

    if (text?.length) {
      gsap.from(text, {
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
    }
  }, { scope: container });

  return (
    <section
      ref={container}
      className="px-6 py-24 bg-brand-off-white md:px-12 md:py-32"
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:gap-20 lg:grid-cols-12 ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* TEXT CONTENT: Always visible */}
        <div
          className={`lg:col-span-7 ${
            reverse ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="mb-8 border-b border-[#7E5CAD]/20 pb-8">
            <h2 className="reveal-text mb-4 font-serif text-4xl italic leading-tight text-[#7E5CAD] md:text-6xl">
              {heading}
            </h2>

            {subheading && (
              <p className="reveal-text text-xl font-bold text-[#66BB6A] md:text-2xl">
                {subheading}
              </p>
            )}
          </div>

          <div className="reveal-text prose prose-lg space-y-6 text-brand-charcoal/80">
            {body.map((paragraph, index) => (
              <p key={index} className="font-medium leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* IMAGE OR PLACEHOLDER: Column always exists */}
        <div
          className={`lg:col-span-5 w-full ${
            reverse ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div className="reveal-image relative h-[400px] w-full overflow-hidden bg-[#7E5CAD]/10 md:h-[600px]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt || 'School life at Bhilai Ispat Vikas Vidyalaya'}
                className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.parentElement?.classList.add(
                    'image-unavailable'
                  );
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#EAE5EE] px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#7E5CAD]/10 text-[#7E5CAD]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7E5CAD]">
                  Bhilai Ispat Vikas Vidyalaya
                </p>

                <p className="mt-3 text-lg text-gray-600">
                  School Life &amp; Learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}