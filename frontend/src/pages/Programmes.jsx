
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import EditorialSplit from '../components/sections/EditorialSplit';
import { programmesData } from '../data/programmes';
import useWebsiteMedia from '../hooks/useWebsiteMedia';

export default function Programmes() {
  const { media, loading } = useWebsiteMedia();

  return (
    <>
      <Helmet>
        <title>Programmes & Activities | Bhilai Ispat Vikas Vidyalaya</title>
        <meta
          name="description"
          content="Explore academic, co-curricular activities, abacus, sports, and special learning initiatives at BIVV."
        />
      </Helmet>

      {/* Purple Hero Section */}
      <PageHero
        title={programmesData.hero}
        subtitle={programmesData.subtitle}
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      {/* Render each programme with admin-managed images */}
      {programmesData.items.map((item, index) => {
        const placementKey = `programmes/${index + 1}`;
        const uploadedMedia = media?.[placementKey];

        return (
          <EditorialSplit
            key={item.heading}
            heading={item.heading}
            subheading={item.subheading}
            body={item.body}
            imageSrc={uploadedMedia?.mediaUrl || item.image}
            imageAlt={uploadedMedia?.altText || item.heading}
            reverse={index % 2 !== 0}
          />
        );
      })}

      {/* Special Learning Initiatives Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#7E5CAD] text-brand-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#66BB6A] font-bold uppercase tracking-widest text-sm mb-4">
              Holistic Support
            </p>

            <h2 className="text-4xl md:text-6xl font-serif italic mb-6">
              {programmesData.initiatives.heading}
            </h2>

            <p className="text-brand-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-sans font-medium">
              {programmesData.initiatives.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {programmesData.initiatives.list.map((initiative, index) => (
              <div
                key={index}
                className="bg-brand-white/10 border border-brand-white/20 p-6 flex items-center space-x-4 hover:bg-brand-white/20 transition-colors duration-300"
              >
                <span className="font-serif text-lg tracking-wide">
                  {initiative}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
