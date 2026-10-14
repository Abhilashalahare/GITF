// src/admin/pages/AdminLogin.jsx

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LuLockKeyhole, LuMail, LuArrowRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });


      const data = await response.json();
      console.log('Login response:', {
        success: data.success,
        hasToken: Boolean(data.token),
        email: data.email,
      });

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed.');
      }


      if (!data.success || !data.admin) {
        throw new Error('Invalid login response from server.');
      }


      localStorage.setItem('adminEmail', data.admin.email);

      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <Helmet>
        <title>Admin Login | BIVV</title>
      </Helmet>

      <main className="min-h-screen bg-[#F8F7F3] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo / Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#7E5CAD] text-white mb-5">
              <LuLockKeyhole size={28} />
            </div>

            <h1 className="font-serif italic text-4xl text-[#7E5CAD]">
              GITF
            </h1>

            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500 font-bold">
              Admin Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#7E5CAD]/15 shadow-xl p-8 md:p-10">

            <div className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to manage the GITF website.
              </p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <LuMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="w-full border border-gray-200 bg-[#FAFAFA] py-3.5 pl-11 pr-4 outline-none focus:border-[#7E5CAD] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <LuLockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full border border-gray-200 bg-[#FAFAFA] py-3.5 pl-11 pr-4 outline-none focus:border-[#7E5CAD] transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7E5CAD] text-white py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs hover:bg-[#6d4e9d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Signing In...'
                ) : (
                  <>
                    Sign In
                    <LuArrowRight size={17} />
                  </>
                )}
              </button>

            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Great India Talent Foundation (GITF) | BIVV
          </p>

        </div>
      </main>
    </>
  );
}