import { Helmet } from 'react-helmet-async';
import PageHero from '../components/sections/PageHero';
import { contactData } from '../data/contact';
import { LuMapPin, LuPhone, LuMail, LuNavigation, LuInstagram, LuFacebook } from 'react-icons/lu';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to send message'
        );
      }

      setStatus('Message sent successfully!');

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    } catch (error) {
      console.error('Contact form error:', error);
      setStatus(
        error.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Bhilai Ispat Vikas Vidyalaya</title>
        <meta name="description" content="Get in touch with Bhilai Ispat Vikas Vidyalaya, Sector-6." />
      </Helmet>

      <PageHero
        title={contactData.hero}
        subtitle={contactData.subtitle}
        colorClass="bg-[#7E5CAD] text-brand-white"
      />

      <section className="py-24 px-6 md:px-12 bg-brand-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

          {/* Contact Information */}
          <div>
            <h2 className="text-4xl md:text-5xl font-condensed text-brand-charcoal mb-12">Get in Touch</h2>

            <div className="space-y-12">
              <div className="flex items-start group">
                <LuMapPin className="w-6 h-6 text-[#66BB6A] mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-[#7E5CAD]">{contactData.address.title}</h3>
                  {contactData.address.lines.map((line, i) => (
                    <p key={i} className="text-xl text-brand-charcoal">{line}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start group">
                <LuPhone className="w-6 h-6 text-[#66BB6A] mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-[#7E5CAD]">Phone</h3>
                  <p className="text-brand-charcoal bg-[#66BB6A]/10 px-3 py-1 inline-block text-sm font-medium">
                    {contactData.placeholders.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <LuMail className="w-6 h-6 text-[#66BB6A] mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-[#7E5CAD]">Email</h3>
                  <p className="text-brand-charcoal bg-[#66BB6A]/10 px-3 py-1 inline-block text-sm font-medium">
                    {contactData.placeholders.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-brand-charcoal/20 flex gap-4">
              <div className="w-12 h-12 rounded-full border border-brand-charcoal/20 flex items-center justify-center text-brand-charcoal hover:bg-[#66BB6A] hover:text-brand-white transition-colors cursor-help" title={contactData.placeholders.facebook}>
                <LuFacebook className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full border border-brand-charcoal/20 flex items-center justify-center text-brand-charcoal hover:bg-[#66BB6A] hover:text-brand-white transition-colors cursor-help" title={contactData.placeholders.instagram}>
                <LuInstagram className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-brand-white p-10 md:p-14 border border-brand-charcoal/10 shadow-lg">
            <h3 className="font-condensed text-3xl mb-8 text-[#7E5CAD]">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full bg-brand-off-white border-b border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:border-[#66BB6A] transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-off-white border-b border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:border-[#66BB6A] transition-colors"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full bg-brand-off-white border-b border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:border-[#66BB6A] transition-colors"
                  placeholder="Enquiry Type"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-charcoal/60 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows="4"
                  className="w-full bg-brand-off-white border-b border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:border-[#66BB6A] transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              {status && (
                <p className="text-sm font-medium">
                  {status}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#66BB6A] text-brand-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#7E5CAD] transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] w-full bg-[#7E5CAD] flex flex-col items-center justify-center border-t border-brand-white/10 relative overflow-hidden">
        <LuNavigation className="w-16 h-16 text-brand-white/10 absolute -right-4 -bottom-4 scale-150" />
        <div className="text-center relative z-10 p-8 border border-dashed border-brand-white/30 bg-brand-white/5">
          <LuMapPin className="w-8 h-8 text-[#66BB6A] mx-auto mb-4" />
          <h3 className="font-condensed text-2xl text-brand-white mb-2 tracking-wide">LOCATION MAP</h3>
          <p className="text-brand-white text-sm font-medium tracking-widest uppercase bg-brand-white/10 px-4 py-2 mt-4 inline-block">
            {contactData.placeholders.map}
          </p>
        </div>
      </section>
    </>
  );
}