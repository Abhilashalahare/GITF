import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import EditorialSplit from '../components/sections/EditorialSplit';
import { learningData } from '../data/learning';

export default function Learning() {
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
      {learningData.sections.map((section, index) => (
        <EditorialSplit 
          key={index}
          heading={section.heading}
          subheading={section.subheading}
          body={section.body}
          imageSrc={section.image}
          imageAlt={section.heading}
          reverse={index % 2 !== 0} // Alternates left and right images
        />
      ))}
    </>
  );
}