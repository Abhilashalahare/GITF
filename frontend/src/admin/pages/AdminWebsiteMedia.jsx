
import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = `${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')
  }/api/website-media`;

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return '';

  // Keep external URLs, such as Cloudinary URLs, unchanged.
  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  // Load local images from the backend.
  return `${BACKEND_URL}/${mediaUrl.replace(/^\/+/, '')}`;
};

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

const MAX_IMAGE_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
];

// Allows letters, numbers, /, _ and -
const VALID_KEY = /^[a-zA-Z0-9/_-]+$/;

async function readResponse(response) {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned an invalid response (HTTP ${response.status}).`
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed (HTTP ${response.status}).`
    );
  }

  return data;
}

export default function AdminWebsiteMedia() {
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fileInputRef = useRef(null);

  const fetchMedia = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) setFetching(true);

      try {
        const response = await fetch(`${API_URL}/admin`, {
          credentials: 'include',
        });

        const result = await readResponse(response);

        setMedia(Array.isArray(result.data) ? result.data : []);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load website media.');
      } finally {
        if (showLoading) setFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setMessage('');
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
    setError('');
    setMessage('');

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Only JPG, PNG, WebP and MP4 files are supported.');
      setFile(null);
      event.target.value = '';
      return;
    }

    const isVideo = selectedFile.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (selectedFile.size > maxSize) {
      setError(
        isVideo
          ? 'Video must be 100 MB or smaller.'
          : 'Image must be 100 MB or smaller.'
      );

      setFile(null);
      event.target.value = '';
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');

    const name = form.name.trim();
    const key = form.key.trim().toLowerCase();

    if (!name || !key) {
      setError('Media name and placement key are required.');
      return;
    }

    if (!VALID_KEY.test(key)) {
      setError(
        'Placement key can contain only letters, numbers, /, _ and -.'
      );
      return;
    }

    if (!file) {
      setError('Please select a valid image or video.');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, WebP and MP4 files are supported.');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      setError(
        isVideo
          ? 'Video must be 100 MB or smaller.'
          : 'Image must be 100 MB or smaller.'
      );
      return;
    }

    const formData = new FormData();

    // Append text fields BEFORE the file.
    // Multer needs the key before it chooses the upload directory.
    formData.append('name', name);
    formData.append('key', key);
    formData.append('placementKey', key);
    formData.append('section', form.section);
    formData.append('altText', form.altText.trim());

    // Append the file LAST.
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await readResponse(response);

      setMessage(
        result.message || 'Website media uploaded successfully.'
      );

      setForm({ ...initialForm });
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await fetchMedia({ showLoading: false });
    } catch (err) {
      setError(err.message || 'Unable to upload media.');
      console.error('Website media upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item) => {
    setError('');
    setMessage('');
    setBusyId(item._id);

    try {
      const response = await fetch(`${API_URL}/${item._id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !item.isActive,
        }),
      });

      const result = await readResponse(response);

      setMessage(
        result.message || 'Media status updated successfully.'
      );

      await fetchMedia({ showLoading: false });
    } catch (err) {
      setError(err.message || 'Unable to update media status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This will also attempt to delete its Cloudinary file.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');
    setBusyId(item._id);

    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await readResponse(response);

      setMessage(result.message || 'Media deleted successfully.');

      await fetchMedia({ showLoading: false });
    } catch (err) {
      setError(err.message || 'Unable to delete media.');
    } finally {
      setBusyId(null);
    }
  };

  const visibleMedia =
    filter === 'all'
      ? media
      : media.filter((item) => item.section === filter);

  const getSectionLabel = (value) =>
    sections.find((section) => section.value === value)?.label || value;

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Website Media Manager
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage images and videos used across the entire BIVV website.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}

            {(error.toLowerCase().includes('login') ||
              error.toLowerCase().includes('authorized') ||
              error.toLowerCase().includes('unauthorized')) && (
                <p className="mt-2">
                  Your session may have expired. Please log in again.
                </p>
              )}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* Upload Form */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Upload Website Media
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
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
                  className={inputClass}
                />
              </div>

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
                  className={inputClass}
                >
                  {sections.map((section) => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

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
                  required
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-500">
                  Use letters, numbers, /, _ or -. An existing key replaces
                  that placement.
                </p>
              </div>

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
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="website-media-file"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Select Image or Video
              </label>

              <input
                ref={fileInputRef}
                id="website-media-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={handleFileChange}
                required
                className="block w-full rounded-lg border border-gray-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium"
              />

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP or MP4. Maximum image size: 100 MB; video
                size: 100 MB.
              </p>
            </div>

            {file && (
              <p className="break-all text-sm text-gray-600">
                Selected: {file.name} (
                {(file.size / (1024 * 1024)).toFixed(2)} MB)
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

        {/* Uploaded Media */}
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
              onChange={(event) => setFilter(event.target.value)}
              className={inputClass}
            >
              <option value="all">All Sections</option>

              {sections.map((section) => (
                <option key={section.value} value={section.value}>
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
                  <div className="aspect-video bg-gray-100">
                    {item.mediaType === 'video' ? (
                      <video
                        src={getMediaUrl(item.mediaUrl)}
                        controls
                        preload="metadata"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img
                        src={getMediaUrl(item.mediaUrl)}
                        alt={item.altText || item.name || 'Uploaded media'}
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
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Section: {getSectionLabel(item.section)}</p>
                      <p>Type: {item.mediaType}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => handleToggle(item)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                      >
                        {busyId === item._id
                          ? 'Updating...'
                          : item.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                      </button>

                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => handleDelete(item)}
                        className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {busyId === item._id ? 'Updating...' : 'Delete'}
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
