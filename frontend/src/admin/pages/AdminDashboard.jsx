// src/admin/pages/AdminDashboard.jsx

import { Helmet } from 'react-helmet-async';
import {
  LuImages,
  LuVideo,
  LuSchool,
  LuArrowRight,
} from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const stats = [
   
    {
      title: 'Schools',
      value: '2',
      icon: LuSchool,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | GITF Admin</title>
      </Helmet>

      <div className="min-h-screen">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#7E5CAD] font-bold">
              Administration
            </p>

            <h1 className="mt-1 text-3xl md:text-4xl font-serif text-gray-900">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-500 text-sm">
              Manage the Bhilai Ispat Vikas Vidyalaya website.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 md:px-10 py-10">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-4xl font-serif text-[#7E5CAD]">
                        {stat.value}
                      </p>
                    </div>

                    <div className="w-11 h-11 bg-[#7E5CAD]/10 text-[#7E5CAD] flex items-center justify-center">
                      <Icon size={21} />
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Quick Actions */}
          <section className="mt-10">

            <h2 className="font-serif text-2xl text-gray-900">
              Quick Actions
            </h2>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

              <Link
                to="/admin/gallery"
                className="group bg-[#7E5CAD] text-white p-7 flex items-center justify-between hover:bg-[#6d4e9d] transition-colors"
              >
                <div>
                  <LuImages size={25} className="mb-4" />

                  <h3 className="font-serif text-2xl">
                    Manage Gallery
                  </h3>

                  <p className="mt-2 text-sm text-white/70">
                    Upload and manage photos and videos for Sector 6 and Sector 11.
                  </p>
                </div>

                <LuArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/website-media"
                className="group bg-[#66BB6A] text-white p-7 flex items-center justify-between hover:opacity-90 transition-opacity"
              >
                <div>
                  <LuSchool size={25} className="mb-4" />

                  <h3 className="font-serif text-2xl">
                    Website Media
                  </h3>

                  <p className="mt-2 text-sm text-white/80">
                    Manage images used throughout the website.
                  </p>
                </div>

                <LuArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

            </div>

          </section>

        </div>
      </div>
    </>
  );
}