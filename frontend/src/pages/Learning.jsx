import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import EditorialSplit from '../components/sections/EditorialSplit';
import { learningData } from '../data/learning';
import useWebsiteMedia from '../hooks/useWebsiteMedia';

export default function Learning() {


  const {media, loading} = useWebsiteMedia();
  return (
    <>
      <Helmet>
        <title>Learning & Development | Bhilai Ispat Vikas Vidyalaya</title>
        <meta name="description" content="Our approach to holistic, concept-based, and experiential learning." />
      </Helmet>

      {/* Purple Hero */}
      <PageHero
        title={learningData.hero}
        subtitle={learningData.subtitle}
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      {/* Render each section using EditorialSplit with alternating layouts */}
      {learningData.sections.map((section, index) => {
        const placementKey = `learning/${index + 1}`;
        const uploadedMedia = media?.[placementKey];

        return (
          <EditorialSplit
            key={section.heading}
            heading={section.heading}
            subheading={section.subheading}
            body={section.body}
            imageSrc={uploadedMedia?.mediaUrl || section.image}
            imageAlt={uploadedMedia?.altText || section.heading}
            reverse={index % 2 !== 0}
          />
        );
      })}
    </>
  );
}