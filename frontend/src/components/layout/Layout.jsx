import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-off-white">
      <Navbar />
      
      {/* 
        The Outlet is where route content goes. 
        flex-grow ensures the footer is pushed to the bottom on short pages.
      */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      
      <Footer />

      <FloatingWhatsApp />
    </div>
  );
}