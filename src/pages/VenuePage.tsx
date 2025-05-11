
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVenueBySlug } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const VenuePage = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  
  useEffect(() => {
    if (!venue) {
      navigate('/');
    }
  }, [venue, navigate]);
  
  if (!venue) return null;

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={venue.imageUrl}
          alt={venue.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={venue.logoUrl} 
              alt={`${venue.name} logo`} 
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 z-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-2 tracking-widest">{venue.name}</h1>
            <p className="text-xl text-white/80 font-light mb-6">{venue.type}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={() => navigate(`/book/${venue.slug}`)}
              className="booking-button"
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </div>
      
      <div className="container-center py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-medium mb-4 tracking-wide">About</h2>
          <p className="text-white/80 font-light leading-relaxed">
            {venue.description}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">Location</h3>
            <p className="text-white/70 font-light">{venue.location}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">Hours</h3>
            <p className="text-white/70 font-light">{venue.openingHours}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VenuePage;
