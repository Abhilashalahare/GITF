import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
  // Replace this with the school's actual WhatsApp Business number (include country code, omit + or spaces)
  // Example: 91 for India, followed by the 10 digit number
  const phoneNumber = "9301402595"; 
  
  // The pre-filled message the user will send to you
  const preFilledMessage = "Hi BIVV, I would like to know more about admissions and programs.";
  
  // URL encode the message so it works in a web link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(preFilledMessage)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
      
      {/* Tooltip that appears on hover */}
      <span className="absolute right-16 bg-brand-white text-brand-charcoal text-xs font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-[#7E5CAD]/10">
        Chat with us
      </span>
    </motion.a>
  );
}