import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Hero from './Hero.png';

export default function HeroCinematic({ heroMedia }) {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, { scope: container });

  // Use the uploaded image when available; otherwise use Hero.png.
  const heroImage =
    heroMedia?.mediaType === 'image' && heroMedia?.mediaUrl
      ? heroMedia.mediaUrl
      : Hero;

  const isVideo =
    heroMedia?.mediaType === 'video' && heroMedia?.mediaUrl;

  return (
    <section
      ref={container}
      className="relative w-full h-screen min-h-[600px] flex items-end pb-24 md:pb-32 px-6 md:px-12 overflow-hidden bg-brand-charcoal"
    >
      {/* Dynamic background media */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video
            src={heroMedia.mediaUrl}
            className="w-full h-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={heroImage}
            alt={
              heroMedia?.altText ||
              'Students learning at Bhilai Ispat Vikas Vidyalaya'
            }
            className="w-full h-full object-cover opacity-80"
            loading="eager"
            fetchPriority="high"
          />
        )}

        <div className="absolute inset-0 overlay-gradient"></div>
      </div>

      {/* Content aligned to lower-left */}
      <div className="relative z-10 max-w-5xl text-brand-white">
        <div className="hero-text mb-6 flex flex-col md:flex-row md:items-center gap-4 text-xs md:text-sm tracking-widest uppercase opacity-90">
          <span className="bg-brand-lime text-brand-charcoal px-3 py-1 font-medium">
            Sector-6 & Sector-11, Bhilai
          </span>
          <span>Grades 1–8</span>
        </div>

        <h1 className="hero-text text-6xl md:text-8xl lg:text-[120px] font-condensed leading-[0.85] tracking-tighter mb-6">
          GREAT INDIA <br />
          TALENT FOUNDATION
        </h1>

        <div className="hero-text mb-12">
          <p className="text-xl md:text-3xl font-condensed tracking-wide text-brand-lime mb-2">
            A Great India Talent School
          </p>

          <p className="text-sm md:text-base tracking-widest uppercase opacity-80 mb-6">
            Educate &bull; Enable &bull; Empower
          </p>

          <p className="text-lg md:text-2xl font-light max-w-2xl text-brand-off-white">
            Where every child gets a chance to learn, grow and dream.
          </p>
        </div>

        <div className="hero-text flex flex-col sm:flex-row gap-4">
          <Link
            to="/about"
            className="px-8 py-4 bg-brand-white text-brand-charcoal text-sm uppercase tracking-widest hover:bg-brand-lime transition-colors duration-300 text-center"
          >
            Explore Our School
          </Link>

          <Link
            to="/admissions"
            className="px-8 py-4 border border-brand-white text-brand-white text-sm uppercase tracking-widest hover:bg-brand-white hover:text-brand-charcoal transition-colors duration-300 text-center"
          >
            Admissions
          </Link>
        </div>
      </div>
    </section>
  );
}