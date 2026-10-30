import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureGrid({ title, features = [] }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.feature-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
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
      className="px-6 py-24 bg-brand-off-white md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-24">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#66BB6A]">
            Discover Our School
          </p>

          <h2 className="font-serif text-4xl italic text-[#7E5CAD] md:text-5xl lg:text-6xl">
            {title}
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id || index}
              className="feature-card group flex w-full flex-col items-center bg-white p-6 text-center shadow-sm transition-shadow duration-500 hover:shadow-lg md:w-[calc(50%-1rem)] md:p-8 lg:w-[calc(33.333%-1.35rem)]"
            >
              {/* Text Content */}
              <h3 className="mb-4 font-serif text-2xl leading-tight text-[#7E5CAD] md:text-3xl">
                {feature.title}
              </h3>

              <p className="mb-8 flex-grow text-sm font-medium leading-relaxed text-brand-charcoal/70">
                {feature.description ||
                  'Providing a comprehensive learning experience that nurtures young minds.'}
              </p>

              {/* Image or Placeholder */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAE5EE]">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title || 'School activity'}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                      event.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}

                <div
                  className={`flex h-full min-h-0 w-full flex-col items-center justify-center bg-[#EAE5EE] px-4 text-center ${
                    feature.image ? 'hidden' : ''
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7E5CAD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#7E5CAD]">
                    Bhilai Ispat Vikas Vidyalaya
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    School Life &amp; Learning
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}