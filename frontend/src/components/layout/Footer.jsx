import { Link } from 'react-router-dom';
import { footerLinks } from '../../data/navigation';

export default function Footer() {
  return (
    <footer className="bg-[#7E5CAD] text-brand-white pt-24 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
          
          {/* Brand Identity */}
          <div className="md:col-span-5 lg:col-span-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-brand-white font-condensed mb-6 leading-tight">
              BHILAI ISPAT <br />
              VIKAS VIDYALAYA
            </h2>
            <p className="text-[#66BB6A] font-medium text-lg mb-2">A Great India Talent School</p>
            <p className="tracking-widest uppercase text-sm opacity-90">
              Educate &bull; Enable &bull; Empower
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-condensed text-2xl mb-6 text-[#66BB6A]">Explore</h3>
            <ul className="flex flex-col gap-4">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-[#66BB6A] transition-colors duration-300 opacity-90 hover:opacity-100"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Partners */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="font-condensed text-2xl mb-6 text-[#66BB6A]">In Partnership With</h3>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-medium opacity-90">Great India Talent Foundation</p>
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Bhilai Steel Plant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70">
          <p>&copy; {new Date().getFullYear()} Bhilai Ispat Vikas Vidyalaya. All Rights Reserved.</p>
          <p>Sector-6, Bhilai, Chhattisgarh</p>
        </div>
      </div>
    </footer>
  );
}