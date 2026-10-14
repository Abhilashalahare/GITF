import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMenu, LuX } from 'react-icons/lu';
import { navLinks } from '../../data/navigation'; 

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        // bg-transparent and pointer-events-none allow the page content below to be clicked 
        // if the user clicks in the empty space between the menu and the enquire button
        className="fixed top-0 w-full z-50 bg-transparent py-6 md:py-8 pointer-events-none transition-all duration-300"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center pointer-events-auto">
          
          {/* Left Side: Green Hamburger Circle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className={`flex justify-center items-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-500 z-50 shadow-sm ${
              isMobileMenuOpen 
                ? 'bg-transparent text-brand-white hover:rotate-90 shadow-none' 
                : 'bg-[#66BB6A] text-brand-white hover:scale-105 hover:shadow-lg'
            }`}
          >
            {isMobileMenuOpen ? (
              <LuX className="w-8 h-8" strokeWidth={2} />
            ) : (
              <LuMenu className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
            )}
          </button>

          {/* Right Side: Simple Text Link */}
        <Link
            to="/admissions"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 z-50 shadow-sm hover:shadow-md ${
              isMobileMenuOpen 
                ? 'bg-brand-white text-[#7E5CAD] hover:bg-[#66BB6A] hover:text-brand-white' 
                : 'bg-[#7E5CAD] text-brand-white hover:bg-[#66BB6A]'
            }`}
          >
            Enquire Now
          </Link>
          
        </div>
      </header>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#7E5CAD] flex flex-col justify-center px-6 md:px-12 overflow-y-auto"
          >
            {/* Logo added inside the menu for brand context */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                 <span className="font-serif italic text-2xl text-brand-white opacity-50 hover:opacity-100 transition-opacity">
                   GITF
                 </span>
               </Link>
            </div>

            {/* Centered Navigation Links */}
            <nav className="flex flex-col gap-4 md:gap-5 max-w-4xl mx-auto w-full text-center my-auto pt-24 pb-12">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif italic text-2xl md:text-2xl lg:text-3xl text-brand-white hover:text-[#66BB6A] transition-colors duration-300 block"
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}