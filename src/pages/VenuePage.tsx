
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
import VenueShowcase from '@/components/VenueShowcase';
import BottomNavigation from '@/components/BottomNavigation';

const VenuePage = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [activeSection, setActiveSection] = useState('menus');
  
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
  
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'menus':
        return (
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-10">
            <h3 className="text-xl font-medium mb-4 tracking-wide">Our Menu</h3>
            <p className="text-white/70 mb-4">
              Discover our chef-curated selection of dishes and drinks, made with the finest ingredients.
            </p>
            <VenueShowcase />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Signature Dishes</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex justify-between">
                    <span>Truffle Risotto</span>
                    <span className="text-gold">$24</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wagyu Steak</span>
                    <span className="text-gold">$48</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Seafood Platter</span>
                    <span className="text-gold">$36</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Specialty Drinks</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex justify-between">
                    <span>Golden Margarita</span>
                    <span className="text-gold">$16</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Smoked Old Fashioned</span>
                    <span className="text-gold">$18</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Signature Martini</span>
                    <span className="text-gold">$14</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'experiences':
        return (
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-10">
            <h3 className="text-xl font-medium mb-4 tracking-wide">Experiences</h3>
            <p className="text-white/70 mb-4">
              Unique experiences that make your visit memorable and special.
            </p>
            <VenueShowcase />
            <div className="space-y-4">
              <div className="p-3 border border-white/10 rounded-md relative">
                <span className="absolute -right-2 -top-2 bg-gold text-black text-xs px-2 py-0.5 rounded-full shadow-md">
                  Popular Choice
                </span>
                <h4 className="font-medium text-gold mb-2">VIP Package</h4>
                <p className="text-sm text-white/70">
                  Skip the line, get priority seating, and enjoy complimentary champagne.
                </p>
              </div>
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Chef's Table</h4>
                <p className="text-sm text-white/70">
                  An intimate dining experience with a personalized menu by our head chef.
                </p>
              </div>
              <div className="p-3 border border-white/10 rounded-md relative">
                <span className="absolute -right-2 -top-2 bg-gold text-black text-xs px-2 py-0.5 rounded-full shadow-md">
                  Only 2 left!
                </span>
                <h4 className="font-medium text-gold mb-2">Mixology Class</h4>
                <p className="text-sm text-white/70">
                  Learn to craft our signature cocktails with our expert bartenders.
                </p>
              </div>
            </div>
          </div>
        );
      case 'collabs':
        return (
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-10">
            <h3 className="text-xl font-medium mb-4 tracking-wide">Collaborations</h3>
            <p className="text-white/70 mb-4">
              Special events and collaborations with artists, chefs, and brands.
            </p>
            <VenueShowcase />
            <div className="space-y-4">
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Guest DJ Nights</h4>
                <p className="text-sm text-white/70">
                  Monthly events featuring renowned DJs from around the world.
                </p>
                <div className="mt-2 flex items-center text-xs text-white/60">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Next event: This Friday</span>
                </div>
              </div>
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Pop-Up Kitchen</h4>
                <p className="text-sm text-white/70">
                  Collaborations with celebrity chefs bringing unique dining experiences.
                </p>
                <div className="mt-2 flex items-center text-xs text-white/60">
                  <Users className="mr-1 h-3 w-3" />
                  <span>6 people booked today</span>
                </div>
              </div>
              <div className="p-3 border border-white/10 rounded-md">
                <h4 className="font-medium text-gold mb-2">Art Exhibitions</h4>
                <p className="text-sm text-white/70">
                  Rotating gallery featuring local and international artists.
                </p>
                <div className="mt-2 flex items-center text-xs text-white/60">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Current exhibition ends in 3 days</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
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
      
      <div className="container-center py-10">
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
        
        {/* Section Content */}
        {renderSectionContent()}
        
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
      
      {/* Bottom Navigation */}
      <BottomNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
};

export default VenuePage;
