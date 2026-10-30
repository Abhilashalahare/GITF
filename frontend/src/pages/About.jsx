import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import EditorialSplit from '../components/sections/EditorialSplit';
import ChairmanMessage from '../components/sections/ChairmanMessage';
import VisionMission from '../components/sections/VisionMission';
import ValuesGrid from '../components/sections/ValuesGrid';
import { aboutData } from '../data/about';
import { homeData } from '../data/home'; // Reusing vision/mission from home
import useWebsiteMedia from '../hooks/useWebsiteMedia';


const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  }/api/website-media`;


export default function About() {
  const { media, loading: loadingMedia } = useWebsiteMedia();

  return (
    <>
      <Helmet>
        <title>About Us | Bhilai Ispat Vikas Vidyalaya</title>
        <meta name="description" content="Learn about BIVV, our partnership with Great India Talent Foundation, and our core values." />
      </Helmet>

      <PageHero
        title={aboutData.intro.heading}
        colorClass="bg-brand-sage text-brand-charcoal"
      />

      {!loadingMedia && (
        <EditorialSplit
          heading="Our School"
          subheading="A pathway to learning, hope and possibility."
          body={aboutData.intro.body}
          imageSrc={media['about/intro-1']?.mediaUrl || null}
          imageAlt={
            media['about/intro-1']?.altText || 'School building'
          }
          reverse={false}
        />
      )}


      {/* GITF Section with points */}
      <section className="border-t border-editorial bg-brand-off-white px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Text Content */}
          <div>
            <h2 className="mb-8 font-condensed text-4xl text-brand-charcoal md:text-6xl">
              {aboutData.gitf.heading}
            </h2>

            <div className="mb-8 space-y-6 text-lg leading-relaxed text-brand-charcoal/80">
              {aboutData.gitf.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="space-y-4 border-l-2 border-brand-lime pl-6">
              {aboutData.gitf.points.map((point, i) => (
                <li key={i} className="font-medium text-brand-deep-teal">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Image or Placeholder */}
          <div className="aspect-square w-full overflow-hidden bg-[#EAE5EE]">
            {!loadingMedia && media['about/intro-2']?.mediaUrl ? (
              <img
                src={media['about/intro-2'].mediaUrl}
                alt={media['about/intro-2']?.altText || 'Foundation work'}
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            <div
              className={`flex h-full w-full flex-col items-center justify-center px-8 text-center ${!loadingMedia && media['about/intro-2']?.mediaUrl
                  ? 'hidden'
                  : ''
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
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

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#7E5CAD]">
                Bhilai Ispat Vikas Vidyalaya
              </p>

              <p className="mt-3 text-lg text-gray-600">
                Our Foundation &amp; Community
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChairmanMessage data={aboutData.chairman} />

      <VisionMission
        vision={homeData.visionMission.vision}
        mission={homeData.visionMission.mission}
      />

      <ValuesGrid values={aboutData.values} />
    </>
  );
}