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

      {!loadingMedia && media['about/intro-1']?.mediaUrl && (
        <EditorialSplit
          heading="Our School"
          subheading="A pathway to learning, hope and possibility."
          body={aboutData.intro.body}
          imageSrc={media['about/intro-1'].mediaUrl }
          imageAlt={media['about/intro-1']?.altText || 'School building'}
          reverse={false}
        />
      )}


      {/* GITF Section with points */}
      <section className="py-24 px-6 md:px-12 bg-brand-off-white border-t border-editorial">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-condensed text-brand-charcoal mb-8">{aboutData.gitf.heading}</h2>
            <div className="space-y-6 text-brand-charcoal/80 text-lg leading-relaxed mb-8">
              {aboutData.gitf.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <ul className="space-y-4 border-l-2 border-brand-lime pl-6">
              {aboutData.gitf.points.map((point, i) => (
                <li key={i} className="text-brand-deep-teal font-medium">{point}</li>
              ))}
            </ul>
          </div>
          <div className="aspect-square bg-brand-pale-blue overflow-hidden">
            {!loadingMedia && media['about/intro-2']?.mediaUrl && (
              <img
                src={media['about/intro-2'].mediaUrl}
                alt={media['about/intro-2']?.altText || 'Foundation work'}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            )}
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