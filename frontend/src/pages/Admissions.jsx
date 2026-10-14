import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/sections/PageHero';
import { admissionsData } from '../data/admissions';
import { LuInfo, LuArrowRight } from 'react-icons/lu';

export default function Admissions() {
  return (
    <>
      <Helmet>
        <title>Admissions | Bhilai Ispat Vikas Vidyalaya</title>
        <meta name="description" content="Admission guidelines and procedures for Bhilai Ispat Vikas Vidyalaya." />
      </Helmet>

      {/* Purple Page Hero */}
      <PageHero 
        title={admissionsData.hero} 
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      {/* Guidelines & Eligibility */}
      <section className="py-24 px-6 md:px-12 bg-brand-off-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-[#66BB6A] font-bold uppercase tracking-widest text-xs mb-3">Join Our School</p>
            <h2 className="text-4xl md:text-5xl font-serif italic text-[#7E5CAD] mb-6">
              {admissionsData.guidelines.title}
            </h2>
            <p className="text-lg text-brand-charcoal/80 leading-relaxed border-l-4 border-[#66BB6A] pl-6 py-2 font-medium">
              {admissionsData.guidelines.body}
            </p>
          </div>
          
          <div className="bg-brand-white p-10 border border-[#7E5CAD]/20 shadow-sm">
            <div className="flex items-center mb-6">
              <LuInfo className="w-8 h-8 text-[#66BB6A] mr-4" />
              <h2 className="text-3xl font-serif text-[#7E5CAD]">
                {admissionsData.eligibility.title}
              </h2>
            </div>
            {/* The required elegant placeholder */}
            <p className="text-brand-charcoal/80 italic text-lg leading-relaxed font-medium">
              "{admissionsData.eligibility.placeholder}"
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Procedure */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#7E5CAD] text-brand-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-brand-white mb-6">
              {admissionsData.procedure.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 lg:gap-8">
            {admissionsData.procedure.steps.map((step, index) => (
              <div key={index} className="flex flex-col relative group">
                
                {/* Visual Connector (Hidden on Mobile) */}
                {index !== admissionsData.procedure.steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-[1px] bg-brand-white/20 group-hover:bg-[#66BB6A] transition-colors duration-500 z-0"></div>
                )}
                
                {/* Step Block */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-brand-white/5 border border-brand-white/20 flex items-center justify-center font-serif italic text-3xl text-brand-white mb-8 group-hover:bg-[#66BB6A] group-hover:text-brand-white group-hover:border-[#66BB6A] transition-all duration-500">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-sm tracking-widest text-[#66BB6A] mb-4 uppercase">
                    {step.step}
                  </h3>
                  <p className="text-brand-white/80 text-sm leading-relaxed px-4 font-medium">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <p className="text-brand-white/50 text-sm uppercase tracking-widest mb-10">
              Note: {admissionsData.procedure.note}
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-[#66BB6A] text-brand-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-brand-white hover:text-[#7E5CAD] transition-all duration-300 group shadow-lg"
            >
              Admission Enquiry
              <LuArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}