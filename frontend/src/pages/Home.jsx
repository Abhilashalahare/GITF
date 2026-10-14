import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import HeroCinematic from '../components/sections/HeroCinematic';
import EditorialSplit from '../components/sections/EditorialSplit';
import FeatureGrid from '../components/sections/FeatureGrid';
import QuoteSection from '../components/sections/QuoteSection';
import VisionMission from '../components/sections/VisionMission';
import WhyOurSchool from '../components/sections/WhyOurSchool';
import Timeline from '../components/sections/Timeline';
import useWebsiteMedia from '../hooks/useWebsiteMedia';

import { homeData } from '../data/home';

const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  }/api/website-media`;

export default function Home() {
  // const [heroMedia, setHeroMedia] = useState(null);

  // useEffect(() => {
  //   let cancelled = false;

  //   const fetchHeroMedia = async () => {
  //     try {
  //       const response = await fetch(API_URL);
  //       const result = await response.json();

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch homepage media');
  //       }

  //       // Your API returns the media array inside "data".
  //       const items = Array.isArray(result.data) ? result.data : [];

  //       const activeHero = items.find(
  //         (item) =>
  //           item.key === 'home/hero' &&
  //           item.isActive === true
  //       );

  //       if (!cancelled && activeHero) {
  //         setHeroMedia(activeHero);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching homepage hero media:', error);
  //     }
  //   };

  //   fetchHeroMedia();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  const { media, loading } = useWebsiteMedia();

  return (
    <>
      <Helmet>
        <title>
          Bhilai Ispat Vikas Vidyalaya | A Great India Talent School
        </title>
        <meta
          name="description"
          content="Bhilai Ispat Vikas Vidyalaya, Sector-6, Bhilai, is a Great India Talent School focused on holistic education, learning, values, skills and opportunities for children."
        />
      </Helmet>

      <main className="w-full">
        {/* Homepage hero: use uploaded media when available */}
        <HeroCinematic
          heroMedia={media['home/hero']}
        />

        <EditorialSplit
          heading={homeData.intro.heading}
          subheading={homeData.intro.subheading}
          body={homeData.intro.body}
          imageSrc={
            media['home/intro']?.mediaUrl ||
            homeData.intro.image
          }
          imageAlt={
            media['home/intro']?.altText ||
            'Students in an Indian school learning'
          }
          reverse={false}
        />

        <FeatureGrid
          title="A Glimpse of Our School"
          features={homeData.glimpse.map((feature, index) => ({
            ...feature,
            image:
              media[`home/glimpse-${index + 1}`]?.mediaUrl ||
              feature.image,
          }))}
        />

        <QuoteSection
          quote={homeData.quote.text}
          author={homeData.quote.author}
        />

        <VisionMission
          vision={homeData.visionMission.vision}
          mission={homeData.visionMission.mission}
        />

        <WhyOurSchool
          features={homeData.whyOurSchool.map((feature, index) => ({
            ...feature,
            image:
              media[`home/why-${index + 1}`]?.mediaUrl ||
              feature.image,
          }))}
        />

        <Timeline
          events={homeData.journey}
        />
      </main>
    </>
  )
}