// src/admin/pages/AdminGallery.jsx

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  LuImages,
  LuPlus,
  LuTrash2,
  LuVideo,
  LuX,
  LuUpload,
} from 'react-icons/lu';

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return '';

  // Keep external URLs, such as older Cloudinary URLs, unchanged.
  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  // Resolve local uploads against the backend server.
  return `${API_URL}/${mediaUrl.replace(/^\/+/, '')}`;
};

const schools = ['Sector 6', 'Sector 11'];

const categories = [
  'Sports',
  'Science Exhibition',
  'Cultural Activities',
  'Academic',
  'Olympiad',
  'Events',
  'Other',
];

export default function AdminGallery() {
  const [activeSchool, setActiveSchool] = useState('Sector 6');

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(null);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear().toString(),
    category: '',
    files: [],
  });

  // --------------------------------------------------
  // FETCH GALLERY
  // --------------------------------------------------

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/gallery`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch gallery.'
        );
      }

      setItems(data.items || []);
    } catch (error) {
      console.error('Gallery Fetch Error:', error);
      setError(error.message || 'Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 10) {
      setError('You can upload a maximum of 10 files at a time.');
      e.target.value = '';
      setFormData((prev) => ({ ...prev, files: [] }));
      return;
    }

    setError('');

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles,
    }));
  };
  // --------------------------------------------------
  // UPLOAD
  // --------------------------------------------------


  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a title.');
      return;
    }

    if (!formData.year.trim()) {
      setError('Please enter a year.');
      return;
    }

    if (!formData.category) {
      setError('Please select a category.');
      return;
    }

    if (!formData.files || formData.files.length === 0) {
      setError('Please select at least one image or video.');
      return;
    }

    if (formData.files.length > 10) {
      setError('You can upload a maximum of 10 files at a time.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const uploadData = new FormData();

      uploadData.append('title', formData.title.trim());
      uploadData.append('school', activeSchool);
      uploadData.append('year', formData.year.trim());
      uploadData.append('category', formData.category);

      formData.files.forEach((file) => {
        uploadData.append('files', file);
      });

      const response = await fetch(
        `${API_URL}/api/gallery/upload`,
        {
          method: 'POST',
          credentials: 'include',
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Upload failed.');
      }

      setShowUploadModal(false);

      setFormData({
        title: '',
        year: new Date().getFullYear().toString(),
        category: '',
        files: [],
      });

      // Clear the file input so the same files can be selected again.
      const fileInput = document.querySelector(
        'input[type="file"]'
      );
      if (fileInput) fileInput.value = '';

      await fetchGallery();
    } catch (error) {
      console.error('Gallery Upload Error:', error);
      setError(error.message || 'Failed to upload media.');
    } finally {
      setUploading(false);
    }
  };


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this media?'
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);

      const response = await fetch(
        `${API_URL}/api/gallery/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete media.'
        );
      }

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (error) {
      console.error('Delete Gallery Error:', error);

      setError(
        error.message || 'Failed to delete media.'
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const schoolItems = items.filter(
    (item) => item.school === activeSchool
  );

  return (
    <>
      <Helmet>
        <title>Gallery Management | GITF Admin</title>
      </Helmet>

      <div className="min-h-screen">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6">
          <p className="text-xs uppercase tracking-widest text-[#7E5CAD] font-bold">
            Content Management
          </p>

          <h1 className="mt-1 text-3xl md:text-4xl font-serif text-gray-900">
            Gallery
          </h1>

          <p className="mt-2 text-gray-500 text-sm">
            Manage photos and videos for GITF Sector 6 and Sector 11.
          </p>
        </header>

        <div className="px-6 md:px-10 py-10">

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 text-sm flex items-center justify-between">
              <span>{error}</span>

              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700"
              >
                <LuX size={18} />
              </button>
            </div>
          )}

          {/* SCHOOL SELECTOR */}
          <div className="bg-white border border-gray-200 p-1 inline-flex">

            {schools.map((school) => (
              <button
                key={school}
                onClick={() => setActiveSchool(school)}
                className={`px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeSchool === school
                  ? 'bg-[#7E5CAD] text-white'
                  : 'text-[#7E5CAD] hover:bg-[#7E5CAD]/10'
                  }`}
              >
                {school}
              </button>
            ))}

          </div>

          {/* TOOLBAR */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>
              <h2 className="font-serif text-2xl text-gray-900">
                {activeSchool}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {schoolItems.length} media item
                {schoolItems.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={() => {
                setError('');
                setShowUploadModal(true);
              }}
              className="bg-[#66BB6A] text-white px-6 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-90"
            >
              <LuPlus size={17} />
              Upload Media
            </button>

          </div>

          {/* GALLERY */}
          <div className="mt-8">

            {loading ? (
              <div className="bg-white border border-gray-200 min-h-[350px] flex items-center justify-center">
                <p className="text-[#7E5CAD] font-serif italic text-xl">
                  Loading gallery...
                </p>
              </div>
            ) : schoolItems.length === 0 ? (

              <div className="bg-white border border-dashed border-gray-300 min-h-[350px] flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 bg-[#7E5CAD]/10 text-[#7E5CAD] flex items-center justify-center">
                  <LuImages size={28} />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-gray-800">
                  No media yet
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-md">
                  No photos or videos have been uploaded for {activeSchool}.
                </p>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-6 bg-[#7E5CAD] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest"
                >
                  Upload First Media
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {schoolItems.map((item) => (

                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 overflow-hidden"
                  >

                    {/* MEDIA */}
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      {item.mediaType === 'video' ? (
                        <video
                          src={getMediaUrl(item.mediaUrl)}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={getMediaUrl(item.mediaUrl)}
                          alt={item.title || 'Gallery image'}
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            console.error(
                              'Admin Gallery image failed to load:',
                              event.currentTarget.src
                            );
                          }}
                        />
                      )}

                      {/* MEDIA TYPE */}
                      <div className="absolute top-3 left-3 bg-[#7E5CAD] text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                        {item.mediaType === 'video' ? (
                          <LuVideo size={13} />
                        ) : (
                          <LuImages size={13} />
                        )}

                        {item.mediaType}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-5">

                      <h3 className="font-serif text-xl text-gray-900">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="bg-[#7E5CAD]/10 text-[#7E5CAD] px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                          {item.year}
                        </span>

                        <span className="bg-[#66BB6A]/10 text-[#4d9850] px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                          {item.category}
                        </span>

                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleteLoading === item._id}
                        className="mt-5 w-full border border-red-200 text-red-600 py-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold hover:bg-red-50 disabled:opacity-50"
                      >
                        <LuTrash2 size={15} />

                        {deleteLoading === item._id
                          ? 'Deleting...'
                          : 'Delete Media'}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5 py-8 overflow-y-auto">

          <div
            className="bg-white w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-y-contain"
            onWheel={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-widest text-[#7E5CAD] font-bold">
                  {activeSchool}
                </p>

                <h2 className="font-serif text-2xl text-gray-900">
                  Upload Media
                </h2>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <LuX size={22} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpload}
              className="p-6 space-y-5"
            >

              {/* SCHOOL */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
                  School
                </label>

                <div className="w-full border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600">
                  {activeSchool}
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Annual Sports Day"
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7E5CAD]"
                />
              </div>

              {/* YEAR */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
                  Year
                </label>

                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2026"
                  maxLength={4}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7E5CAD]"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7E5CAD] bg-white"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* FILE */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
                  Image / Video
                </label>

                <label className="border-2 border-dashed border-gray-300 hover:border-[#7E5CAD] min-h-[150px] flex flex-col items-center justify-center cursor-pointer transition-colors">

                  <LuUpload
                    size={28}
                    className="text-[#7E5CAD]"
                  />

                  <span className="mt-3 text-sm font-bold text-gray-700">
                    {formData.files.length > 0
                      ? `${formData.files.length} file(s) selected`
                      : 'Choose up to 10 files'}
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    JPG, PNG, WEBP, MP4, MOV or WEBM
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </label>
              </div>

              {/* BUTTONS */}
              <div className="pt-3 flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 border border-gray-200 py-3 text-xs uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-[#7E5CAD] text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#6d4e9d] disabled:opacity-60"
                >
                  {uploading
                    ? 'Uploading...'
                    : 'Upload Media'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  );
}