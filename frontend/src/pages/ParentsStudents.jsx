import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import Accordion from '../components/ui/Accordion';
import { parentsData } from '../data/parents';
import { LuClock, LuCalendar, LuDownload } from 'react-icons/lu';

export default function ParentsStudents() {
  return (
    <>
      <Helmet>
        <title>Parents & Students | Bhilai Ispat Vikas Vidyalaya</title>
        <meta name="description" content="Important guidelines, rules, timings, and academic calendar for the students and parents of BIVV." />
      </Helmet>

      {/* Purple Page Hero */}
      <PageHero 
        title={parentsData.hero} 
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      {/* Guidelines Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* Parents (White Card with Purple Text) */}
          <div className="bg-brand-white p-10 md:p-14 border border-[#7E5CAD]/20 hover:shadow-xl transition-shadow duration-500">
            <p className="text-[#66BB6A] font-bold uppercase tracking-widest text-xs mb-3">For Parents</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#7E5CAD] mb-6">{parentsData.guidelinesParents.title}</h2>
            <p className="text-lg text-brand-charcoal/80 mb-8 font-medium">{parentsData.guidelinesParents.intro}</p>
            <ul className="space-y-4">
              {parentsData.guidelinesParents.list.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-2 h-2 mt-2.5 bg-[#66BB6A] mr-4 flex-shrink-0"></span>
                  <span className="text-brand-charcoal/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Students (Purple Card with White Text) */}
          <div className="bg-[#7E5CAD] text-brand-white p-10 md:p-14 shadow-lg hover:shadow-xl transition-shadow duration-500">
            <p className="text-[#66BB6A] font-bold uppercase tracking-widest text-xs mb-3">For Students</p>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-white mb-6">{parentsData.guidelinesStudents.title}</h2>
            <p className="text-lg text-brand-white/90 mb-8 font-medium">{parentsData.guidelinesStudents.intro}</p>
            <ul className="space-y-4">
              {parentsData.guidelinesStudents.list.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-2 h-2 mt-2.5 bg-[#66BB6A] mr-4 flex-shrink-0"></span>
                  <span className="text-brand-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Accordion Rules Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#66BB6A] font-bold uppercase tracking-widest text-sm mb-4">
              Code of Conduct
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#7E5CAD]">
              School Rules
            </h2>
          </div>
          <Accordion items={parentsData.rules} />
        </div>
      </section>

      {/* Attendance & Calendar Section (With strict Placeholders) */}
      <section className="py-24 px-6 md:px-12 bg-brand-off-white border-t border-[#7E5CAD]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Timings (White Card) */}
          <div className="bg-brand-white p-10 md:p-16 border border-[#7E5CAD]/20">
            <LuClock className="w-12 h-12 text-[#66BB6A] mb-6" />
            <h3 className="text-3xl font-serif text-[#7E5CAD] mb-4">Timings & Attendance</h3>
            <p className="text-brand-charcoal/80 mb-8 font-medium">{parentsData.rules[0].content}</p>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#7E5CAD]/20 pb-2">
                <span className="font-bold uppercase tracking-widest text-xs text-[#7E5CAD]">School Timing</span>
                <span className="text-[#66BB6A] font-bold">{parentsData.timing.school}</span>
              </div>
              <div className="flex justify-between border-b border-[#7E5CAD]/20 pb-2">
                <span className="font-bold uppercase tracking-widest text-xs text-[#7E5CAD]">Office Timing</span>
                <span className="text-[#66BB6A] font-bold">{parentsData.timing.office}</span>
              </div>
            </div>
          </div>

          {/* Calendar (Purple Card) */}
          <div className="bg-[#7E5CAD] text-brand-white p-10 md:p-16 shadow-lg">
            <LuCalendar className="w-12 h-12 text-[#66BB6A] mb-6" />
            <h3 className="text-3xl font-serif mb-4">{parentsData.calendar.title}</h3>
            <p className="text-brand-white/80 mb-8 leading-relaxed font-medium">{parentsData.calendar.body}</p>
            
            {/* The Polished Placeholder */}
            <div className="border border-dashed border-brand-white/30 bg-brand-white/10 p-8 flex flex-col items-center justify-center text-center group cursor-help transition-colors hover:bg-brand-white/20">
              <LuDownload className="w-8 h-8 text-[#66BB6A] mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm uppercase tracking-widest text-brand-white/80 mb-2">
                Academic Calendar {parentsData.calendar.year}
              </p>
              <p className="text-xs text-[#7E5CAD] font-bold bg-[#66BB6A] px-4 py-1.5 inline-block">
                [PDF TO BE UPLOADED]
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}