import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';

import { motion, AnimatePresence } from 'framer-motion';

import PageHero from '../components/sections/PageHero';

import Lightbox from '../components/ui/Lightbox';

import Pagination from '../components/ui/Pagination';

import { galleryData } from '../data/gallery';

import { LuVideo, LuImage } from 'react-icons/lu';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Gallery() {
  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  const PAGE_SIZE = 9;

  const [photoPage, setPhotoPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);

  const [photoItems, setPhotoItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);

  const [photoPagination, setPhotoPagination] = useState({});
  const [videoPagination, setVideoPagination] = useState({});

  const [availableYears, setAvailableYears] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [activeSchool, setActiveSchool] = useState('Sector 6');

  const [activeYear, setActiveYear] = useState('');

  const [activeCategory, setActiveCategory] = useState('All');

  const [selectedImage, setSelectedImage] = useState(null);

  const [loadingGallery, setLoadingGallery] = useState(true);

  const [galleryError, setGalleryError] = useState('');

  // ---------------------------------------------------------
  // FETCH GALLERY FROM BACKEND
  // ---------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    const fetchMedia = async (mediaType, page) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        school: activeSchool,
        mediaType,
      });

      if (mediaType === 'image') {
        if (activeYear) {
          params.set('year', activeYear);
        }

        params.set('category', activeCategory);
      }

      const response = await fetch(
        `${API_URL}/api/gallery?${params.toString()}`,
        {
          signal: controller.signal,
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load gallery.');
      }

      return data;
    };

    const fetchGallery = async () => {
      setLoadingGallery(true);
      setGalleryError('');

      try {
        const [photos, videos] = await Promise.all([
          fetchMedia('image', photoPage),
          fetchMedia('video', videoPage),
        ]);

        setPhotoItems(photos.items || []);
        setVideoItems(videos.items || []);

        setPhotoPagination(photos.pagination || {});
        setVideoPagination(videos.pagination || {});

        setAvailableYears(photos.filters?.years || []);
        setAvailableCategories(photos.filters?.categories || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Public Gallery Error:', error);

          setGalleryError(
            error.message || 'Failed to load gallery.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingGallery(false);
        }
      }
    };

    fetchGallery();

    return () => controller.abort();
  }, [
    activeSchool,
    activeYear,
    activeCategory,
    photoPage,
    videoPage,
  ]);

  // ---------------------------------------------------------
  // AVAILABLE YEARS FROM DATABASE
  // ---------------------------------------------------------


  // ---------------------------------------------------------
  // SET DEFAULT YEAR
  // ---------------------------------------------------------

  useEffect(() => {
    if (availableYears.length === 0) {
      if (activeYear !== '') {
        setActiveYear('');
      }
      return;
    }

    if (!availableYears.includes(activeYear)) {
      setActiveYear(availableYears[0]);
      setActiveCategory('All');
      setPhotoPage(1);
    }
  }, [availableYears, activeYear]);

  // ---------------------------------------------------------
  // AVAILABLE CATEGORIES
  // ---------------------------------------------------------



  // ---------------------------------------------------------
  // FILTER IMAGES
  // ---------------------------------------------------------

  const filteredImages = photoItems;

  // ---------------------------------------------------------
  // FILTER VIDEOS
  // ---------------------------------------------------------

  const filteredVideos = videoItems;

  const BACKEND_URL = (
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  const getMediaUrl = (url) => {
    if (!url) return "";

    // If the URL is already absolute, use it directly
    if (/^https?:\/\//i.test(url)) return url;

    // Convert a relative backend path into a complete URL
    return `${BACKEND_URL}/${url.replace(/^\/+/, "")}`;
  };
  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <>
      <Helmet>
        <title>
          Gallery | Bhilai Ispat Vikas Vidyalaya
        </title>

        <meta
          name="description"
          content="Explore our visual collection of students learning, exploring, and participating at BIVV."
        />
      </Helmet>

      {/* Purple Page Hero */}

      <PageHero
        title={galleryData.hero}
        subtitle={galleryData.subtitle}
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      {/* ---------------------------------------------------------
          SCHOOL SELECTOR
      --------------------------------------------------------- */}

      <section className="pt-16 pb-8 px-6 md:px-12 bg-brand-off-white flex justify-center">
        <div className="inline-flex bg-brand-white p-1.5 rounded-none shadow-sm border border-[#7E5CAD]/20">

          <button
            onClick={() => {
              setActiveSchool('Sector 6');
              setActiveCategory('All');
              setPhotoPage(1);
              setVideoPage(1);
            }}
            className={`px-10 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeSchool === 'Sector 6'
              ? 'bg-[#7E5CAD] text-brand-white shadow-md'
              : 'text-[#7E5CAD] hover:bg-[#7E5CAD]/10'
              }`}
          >
            Sector 6
          </button>

          <button
            onClick={() => {
              setActiveSchool('Sector 11');
              setActiveCategory('All');
              setPhotoPage(1);
              setVideoPage(1);
            }}
            className={`px-10 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeSchool === 'Sector 11'
              ? 'bg-[#7E5CAD] text-brand-white shadow-md'
              : 'text-[#7E5CAD] hover:bg-[#7E5CAD]/10'
              }`}
          >
            Sector 11
          </button>

        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 1: ALBUMS / ACTIVITIES
      --------------------------------------------------------- */}

      <section className="py-12 px-6 md:px-12 bg-brand-off-white border-b border-[#7E5CAD]/20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#7E5CAD] mb-3">
              Learning Activities & Albums ({activeSchool})
            </h2>

            <p className="text-brand-charcoal/70 text-sm uppercase tracking-widest font-bold">
              Explore specialized institutional domains
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">

            <button
              onClick={() => {
                setActiveYear(year);
                setActiveCategory('All');
                setPhotoPage(1);
              }}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${activeCategory === 'All'
                ? 'bg-[#7E5CAD] text-brand-white shadow-md'
                : 'bg-brand-white text-brand-charcoal border border-[#7E5CAD]/20 hover:border-[#7E5CAD]'
                }`}

            >
              All Albums
            </button>

            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setPhotoPage(1)
                }}
                className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${activeCategory === category
                  ? 'bg-[#66BB6A] text-brand-white shadow-md'
                  : 'bg-brand-white text-brand-charcoal border border-[#7E5CAD]/20 hover:border-[#66BB6A]'
                  }`}
              >
                {category}
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2: PHOTO GALLERY
      --------------------------------------------------------- */}

      <section className="py-24 px-6 md:px-12 bg-brand-off-white">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-6 border-b border-[#7E5CAD]/20 gap-6">

            <div className="flex items-center space-x-3">
              <LuImage className="w-8 h-8 text-[#66BB6A]" />

              <h2 className="font-serif italic text-3xl text-[#7E5CAD]">
                Photo Gallery - {activeSchool}
              </h2>
            </div>


            {/* Academic Years */}

            <div className="flex gap-3 flex-wrap">

              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setActiveYear(year);
                    setActiveCategory('All');
                  }}
                  className={`font-condensed px-5 py-2 text-xl md:text-2xl transition-colors duration-300 ${activeYear === year
                    ? 'bg-[#7E5CAD] text-brand-white'
                    : 'bg-brand-white text-brand-charcoal/60 hover:text-brand-charcoal border border-[#7E5CAD]/20'
                    }`}
                >
                  {year}
                </button>
              ))}

            </div>
          </div>

          {/* Event / Category Filters */}

          <div className="flex flex-wrap gap-2 mb-12">

            <span className="text-xs uppercase tracking-widest font-bold text-[#7E5CAD] self-center mr-2">
              Events ({activeYear || '—'}):
            </span>

            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${activeCategory === 'All'
                ? 'bg-[#66BB6A] text-brand-white font-bold'
                : 'bg-brand-white/80 text-brand-charcoal hover:bg-brand-white'
                }`}
            >
              All Events
            </button>

            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${activeCategory === category
                  ? 'bg-[#66BB6A] text-brand-white font-bold'
                  : 'bg-brand-white/80 text-brand-charcoal hover:bg-brand-white'
                  }`}
              >
                {category}
              </button>
            ))}

          </div>

          {/* Loading */}

          {loadingGallery && (
            <div className="text-center py-20 text-[#7E5CAD] font-serif italic text-2xl">
              Loading gallery...
            </div>
          )}

          {/* Error */}

          {!loadingGallery && galleryError && (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm">
                {galleryError}
              </p>
            </div>
          )}

          {/* Images */}

          {!loadingGallery &&
            !galleryError &&
            filteredImages.length > 0 && (
              <motion.div
                layout
                className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
              >
                <AnimatePresence>

                  {filteredImages.map((img, idx) => (
                    <motion.div
                      key={`${img._id}-${idx}`}
                      layout
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="relative group overflow-hidden bg-[#7E5CAD] cursor-pointer break-inside-avoid shadow-md"
                      onClick={() =>
                        setSelectedImage({
                          src: getMediaUrl(img.mediaUrl),
                          alt: img.title,
                          year: img.year,
                          title: img.title,
                        })
                      }
                    >


                      <img
                        src={getMediaUrl(img.mediaUrl)}
                        alt={img.title || 'Gallery image'}
                        className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-[#7E5CAD]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">

                        <span className="text-brand-white font-serif italic text-xl mb-1">
                          {img.title}
                        </span>

                        <span className="text-[#66BB6A] text-xs uppercase tracking-widest font-bold">
                          {img.year}
                        </span>

                      </div>

                    </motion.div>
                  ))}

                </AnimatePresence>
              </motion.div>

            )}
          {!loadingGallery && !galleryError && (
            <Pagination
              currentPage={photoPagination.currentPage || 1}
              totalPages={photoPagination.totalPages || 0}
              onPageChange={setPhotoPage}
            />
          )}

          {/* Empty */}

          {!loadingGallery &&
            !galleryError &&
            filteredImages.length === 0 && (
              <div className="text-center py-20 text-[#7E5CAD]/60 font-serif italic text-2xl">
                {availableYears.length === 0
                  ? `No photos uploaded yet for ${activeSchool}.`
                  : `No photos uploaded yet for ${activeSchool} (${activeYear}).`}
              </div>
            )}

        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 3: VIDEO GALLERY
      --------------------------------------------------------- */}

      <section className="py-24 px-6 md:px-12 bg-[#7E5CAD] text-brand-white">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center space-x-3 mb-6">

            <LuVideo className="w-8 h-8 text-[#66BB6A]" />

            <h2 className="font-serif italic text-3xl md:text-4xl">
              Video Gallery - {activeSchool}
            </h2>

          </div>

          <p className="text-brand-white/80 max-w-2xl mb-16 text-lg">
            Immerse in recordings of school events, student performances,
            sports tournaments, and special initiatives from {activeSchool}.
          </p>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {filteredVideos.map((vid) => (
                <div
                  key={vid._id}
                  className="bg-brand-white/5 border border-brand-white/20 p-8 flex flex-col justify-between hover:bg-brand-white/10 transition-colors duration-300 group"
                >

                  <div>

                    <div className="flex justify-between items-center mb-6">

                      <span className="text-xs font-bold uppercase tracking-widest text-[#66BB6A] bg-[#66BB6A]/10 px-3 py-1">
                        Video Archive
                      </span>

                      <LuVideo className="w-5 h-5 text-brand-white/60 group-hover:text-[#66BB6A] transition-colors" />

                    </div>

                    <h3 className="font-serif text-2xl mb-3 text-brand-white">
                      {vid.title}
                    </h3>

                    <video
                      src={getMediaUrl(vid.mediaUrl)}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full aspect-video object-cover mb-6"
                    >

                    </video>

                    <p className="text-brand-white/70 text-sm leading-relaxed">
                      {vid.category}
                    </p>

                  </div>

                  <div className="pt-4 border-t border-brand-white/10 flex justify-between items-center text-xs uppercase tracking-widest text-brand-white/50">

                    <span>
                      {vid.year}
                    </span>

                    <span className="text-[#66BB6A] font-bold">
                      Video
                    </span>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-10 text-brand-white/50 font-serif italic text-xl">
              No videos available for {activeSchool} yet.
            </div>
          )}

                      {/* Video Gallery Pagination */}
            {!loadingGallery && !galleryError && (
              <Pagination
                currentPage={videoPagination.currentPage || 1}
                totalPages={videoPagination.totalPages || 0}
                onPageChange={setVideoPage}
                light
              />
            )}

        </div>
      </section>

      {/* ---------------------------------------------------------
          LIGHTBOX
      --------------------------------------------------------- */}

      <Lightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}