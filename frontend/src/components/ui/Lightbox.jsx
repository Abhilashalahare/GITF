import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';
import { useEffect } from 'react';

export default function Lightbox({ image, onClose }) {
  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (image) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [image]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal/95 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <button 
            className="absolute top-8 right-8 text-brand-white/50 hover:text-[#66BB6A] transition-colors"
            onClick={onClose}
          >
            <LuX className="w-10 h-10" strokeWidth={2} />
          </button>
          
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}