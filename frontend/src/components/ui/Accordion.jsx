import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuMinus } from 'react-icons/lu';

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full border-t border-[#7E5CAD]/20">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-[#7E5CAD]/20 overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center py-6 text-left group transition-colors duration-300 hover:bg-[#7E5CAD]/5"
            >
              <span className="font-serif text-2xl md:text-3xl text-[#7E5CAD] group-hover:text-[#66BB6A] transition-colors">
                {item.title}
              </span>
              <span className="ml-4 flex-shrink-0 text-[#7E5CAD] opacity-50 group-hover:opacity-100 group-hover:text-[#66BB6A] transition-all">
                {isOpen ? <LuMinus strokeWidth={2} className="w-6 h-6" /> : <LuPlus strokeWidth={2} className="w-6 h-6" />}
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="pb-8 pr-12 text-brand-charcoal/80 text-lg leading-relaxed font-medium">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}