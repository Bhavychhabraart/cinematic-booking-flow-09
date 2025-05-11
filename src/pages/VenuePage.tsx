
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVenueBySlug } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, Share, Heart, Star, Calendar, Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";

const VenuePage = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  
  useEffect(() => {
    if (!venue) {
      navigate('/');
      return;
    }
    
    // Simulate view count increasing
    const randomViews = Math.floor(Math.random() * 10) + 15;
    setViewCount(randomViews);
    
    // Simulate view counter increment
    const interval = setInterval(() => {
      setViewCount(prev => prev + 1);
    }, 45000);
    
    return () => clearInterval(interval);
  }, [venue, navigate]);
  
  if (!venue) return null;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} - Book now on VenueFusion`,
        text: `Check out ${venue.name} on VenueFusion!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        description: "Share it with your friends!",
      });
    }
  };
  
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success("Added to wishlist!", {
        description: "We'll notify you about special offers.",
      });
    } else {
      toast("Removed from wishlist");
    }
  };
  
  const getRandomTimeSlot = () => {
    const hours = ['18', '19', '20', '21'];
    const minutes = ['00', '30'];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    const randomMinute = minutes[Math.floor(Math.random() * minutes.length)];
    return `${randomHour}:${randomMinute}`;
  };
  
  // Generate random data for FOMO elements
  const peopleViewing = Math.floor(Math.random() * 8) + 3;
  const bookingsToday = Math.floor(Math.random() * 15) + 5;
  const availableSlots = Math.floor(Math.random() * 5) + 1;
  const popularTimeSlot = getRandomTimeSlot();
  
  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src={venue.imageUrl} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="bg-black/40 text-white hover:bg-black/60 transition-colors">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleWishlist}
                    className="bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={isWishlisted ? "fill-red-500 text-red-500" : ""} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleShare}
                    className="bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <Share size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share this venue</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center overflow-hidden">
              <img src={venue.logoUrl} alt={`${venue.name} logo`} className="w-10 h-10 object-contain" />
            </div>
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
            className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <Button 
              onClick={() => navigate(`/book/${venue.slug}`)} 
              className="booking-button bg-slate-50"
            >
              Book Now
            </Button>
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <Eye size={16} />
              <span className="animate-pulse">{viewCount} people viewing this page</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* FOMO Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gold/10 border-t border-b border-gold/30 py-3 px-4 flex items-center justify-center text-sm"
      >
        <Clock className="mr-2 h-4 w-4 text-gold" />
        <p className="text-gold">
          <span className="font-medium">{availableSlots} slots left</span> for tonight! {bookingsToday} bookings made today.
        </p>
      </motion.div>
      
      <div className="container-center py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium tracking-wide">About</h2>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < 4 ? "text-gold fill-gold" : "text-white/30"} />
              ))}
              <span className="ml-1 text-sm">4.2</span>
            </div>
          </div>
          <p className="text-white/80 font-light leading-relaxed">
            {venue.description}
          </p>
        </motion.div>
        
        {/* Social Proof Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-10 bg-white/5 p-4 rounded-lg border border-white/10"
        >
          <h3 className="text-lg font-medium mb-4 tracking-wide">What's Happening</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-gold" />
              <p><span className="font-medium text-gold">{peopleViewing} people</span> are currently browsing this venue</p>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-gold" />
              <p>Most popular time slot today: <span className="font-medium text-gold">{popularTimeSlot}</span></p>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gold" />
              <p>This venue was booked <span className="font-medium text-gold">{bookingsToday} times</span> in the last 24 hours</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
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
