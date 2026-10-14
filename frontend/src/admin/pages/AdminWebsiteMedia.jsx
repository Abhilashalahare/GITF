
import { useCallback, useEffect, useState } from 'react';

const API_URL = `${
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
}/api/website-media`;

const sections = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'learning-development', label: 'Learning & Development' },
  { value: 'programmes-activities', label: 'Programmes & Activities' },
  { value: 'our-people', label: 'Our People' },
  { value: 'parents-students', label: 'Parents & Students' },
  { value: 'admissions', label: 'Admissions' },
];

const initialForm = {
  name: '',
  key: '',
  section: 'home',
  altText: '',
};

export default function AdminWebsiteMedia() {
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all media for the admin panel.
  const fetchMedia = useCallback(async () => {
    setFetching(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to load website media.'
        );
      }

      setMedia(result.data || []);
    } catch (err) {
      setError(
        err.message || 'Unable to load website media.'
      );
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handle text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle file selection.
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  // Upload new media or replace an existing placement.
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!file) {
      setError('Please select an image or video.');
      return;
    }

    if (!form.name.trim() || !form.key.trim()) {
      setError('Media name and placement key are required.');
      return;
    }

    const formData = new FormData();

    formData.append('file', file);
    formData.append('name', form.name.trim());
    formData.append('key', form.key.trim().toLowerCase());
    formData.append('section', form.section);
    formData.append('altText', form.altText.trim());

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to upload media.'
        );
      }

      setMessage(
        result.message || 'Website media uploaded successfully.'
      );

      setForm(initialForm);
      setFile(null);

      const fileInput = document.getElementById(
        'website-media-file'
      );

      if (fileInput) {
        fileInput.value = '';
      }

      await fetchMedia();
    } catch (err) {
      setError(err.message || 'Unable to upload media.');
    } finally {
      setLoading(false);
    }
  };

  // Activate or deactivate a media item.
  const handleToggle = async (item) => {
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        `${API_URL}/${item._id}/status`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isActive: !item.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to update media status.'
        );
      }

      setMessage(
        result.message || 'Media status updated successfully.'
      );

      await fetchMedia();
    } catch (err) {
      setError(err.message || 'Unable to update media status.');
    }
  };

  // Delete media from MongoDB and Cloudinary.
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This will also attempt to delete its Cloudinary file.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to delete media.'
        );
      }

      setMessage(
        result.message || 'Media deleted successfully.'
      );

      await fetchMedia();
    } catch (err) {
      setError(err.message || 'Unable to delete media.');
    }
  };

  // Filter media by website section.
  const visibleMedia =
    filter === 'all'
      ? media
      : media.filter((item) => item.section === filter);

  const getSectionLabel = (value) =>
    sections.find((section) => section.value === value)?.label ||
    value;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Website Media Manager
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage images and videos used across the entire BIVV website.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}

            {error.toLowerCase().includes('login') ||
            error.toLowerCase().includes('authorized') ? (
              <p className="mt-2">
                Your session may have expired. Please log in again.
              </p>
            ) : null}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* Upload form */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Upload Website Media
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Media name */}
              <div>
                <label
                  htmlFor="media-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Media Name
                </label>

                <input
                  id="media-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Homepage Hero"
                  maxLength={150}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Website section */}
              <div>
                <label
                  htmlFor="media-section"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Website Section
                </label>

                <select
                  id="media-section"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                >
                  {sections.map((section) => (
                    <option
                      key={section.value}
                      value={section.value}
                    >
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Placement key */}
              <div>
                <label
                  htmlFor="media-key"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Placement Key
                </label>

                <input
                  id="media-key"
                  name="key"
                  value={form.key}
                  onChange={handleChange}
                  placeholder="home/hero"
                  maxLength={150}
                  pattern="[a-zA-Z0-9/_-]+"
                  title="Use letters, numbers, slashes, underscores, or hyphens."
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Use a unique key for each placement. An existing key
                  replaces that placement.
                </p>
              </div>

              {/* Alt text */}
              <div>
                <label
                  htmlFor="media-alt"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Image Description (optional)
                </label>

                <input
                  id="media-alt"
                  name="altText"
                  value={form.altText}
                  onChange={handleChange}
                  placeholder="Students participating in activities"
                  maxLength={300}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </div>
            </div>

            {/* File input */}
            <div>
              <label
                htmlFor="website-media-file"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Select Image or Video
              </label>

              <input
                id="website-media-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={handleFileChange}
                required
                className="block w-full rounded-lg border border-gray-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium"
              />

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP or MP4. Maximum 50 MB.
              </p>
            </div>

            {file && (
              <p className="break-all text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Uploading...' : 'Upload / Replace Media'}
            </button>
          </form>
        </section>

        {/* Uploaded media */}
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Uploaded Media
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {visibleMedia.length} item(s)
              </p>
            </div>

            <select
              aria-label="Filter media by website section"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5"
            >
              <option value="all">All Sections</option>

              {sections.map((section) => (
                <option
                  key={section.value}
                  value={section.value}
                >
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          {fetching ? (
            <p className="py-10 text-center text-gray-500">
              Loading website media...
            </p>
          ) : visibleMedia.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              No media found. Upload your first image or video above.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleMedia.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Media preview */}
                  <div className="aspect-video bg-gray-100">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        preload="metadata"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.altText || item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 break-all text-xs text-gray-500">
                          {item.key}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        Section: {getSectionLabel(item.section)}
                      </p>

                      <p>Type: {item.mediaType}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
