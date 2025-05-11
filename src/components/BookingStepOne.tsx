
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import { Utensils, Users, Ticket, Star, Share } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getVenueBySlug } from '@/data/venues';
import { toast } from "@/components/ui/sonner";
import { provideFeedback } from '@/utils/feedback';

const BookingStepOne: React.FC = () => {
  const { setBookingType, nextStep } = useBooking();
  const { venueName } = useParams();
  const venue = getVenueBySlug(venueName || '');
  
  const handleSelectType = (type: string) => {
    provideFeedback('buttonPress');
    setBookingType(type);
    nextStep();
    
    // Show toast for selected booking type
    toast.success(`Selected: ${getBookingTypeLabel(type)}`, {
      description: "Let's customize your experience",
      duration: 2000,
    });
  };
  
  const handleShareBooking = () => {
    provideFeedback('subtle');
    
    if (navigator.share) {
      navigator.share({
        title: `I'm booking ${venue?.name} on VenueFusion!`,
        text: `Join me at ${venue?.name}! I'm making a booking through VenueFusion.`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Booking link copied!", {
        description: "Share it with your friends to join you!",
      });
    }
  };
  
  const getBookingTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      lunch: 'Lunch Table',
      dinner: 'Dinner Table',
      guestlist: 'Guest List Entry',
      vip_standing: 'VIP Standing Table',
      vip_couch: 'VIP Couch Table',
      event: 'Event Tickets',
      private: 'Private Event Hosting'
    };
    
    return labels[type] || type;
  };
  
  const bookingOptions = [
    {
      id: 'lunch',
      label: 'Lunch Table',
      icon: <Utensils className="mr-2" size={18} />,
      social: null,
      description: 'Perfect for business meetings or casual daytime dining'
    },
    {
      id: 'dinner',
      label: 'Dinner Table',
      icon: <Utensils className="mr-2" size={18} />,
      social: 'Popular choice',
      description: 'Our full dinner service with complete menu access'
    },
    {
      id: 'guestlist',
      label: 'Guest List Entry',
      description: 'Couples & Female Stags - 3 drinks included',
      icon: <Users className="mr-2" size={18} />,
      social: null
    },
    {
      id: 'vip_standing',
      label: 'VIP Standing Table',
      icon: <Star className="mr-2" size={18} />,
      social: null,
      description: 'Premium location with dedicated service'
    },
    {
      id: 'vip_couch',
      label: 'VIP Couch Table',
      icon: <Star className="mr-2" size={18} />,
      social: 'Limited availability',
      description: 'Our most premium experience with bottle service'
    },
    {
      id: 'event',
      label: 'Event Tickets',
      icon: <Ticket className="mr-2" size={18} />,
      social: null,
      description: 'Special events, performances and themed nights'
    },
    {
      id: 'private',
      label: 'Private Event Hosting',
      icon: <Users className="mr-2" size={18} />,
      social: null,
      description: 'Host your own event with customized packages'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-center text-center py-10"
    >
      <h2 className="mb-6 tracking-widest text-base">What are you looking for?</h2>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <button
          onClick={handleShareBooking}
          className="flex items-center text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-full hover:bg-gold/20 transition-colors"
        >
          <Share size={14} className="mr-1.5" />
          Share this booking with friends
        </button>
      </motion.div>
      
      <div className="flex flex-col space-y-4 px-[30px]">
        {bookingOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative"
          >
            <motion.button
              whileHover={{
                y: -2,
                boxShadow: '0 5px 10px rgba(255, 215, 0, 0.2)',
              }}
              whileTap={{ y: 0 }}
              onClick={() => handleSelectType(option.id)}
              className="booking-pill flex items-center justify-center w-full"
            >
              {option.icon}
              <span>{option.label}</span>
            </motion.button>
            
            {/* Only show descriptions on hover */}
            {option.description && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute left-0 right-0 -bottom-8 text-xs text-white/70"
              >
                {option.description}
              </motion.div>
            )}
            
            {/* Only show social proof on select items */}
            {option.social && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                className="absolute -right-2 -top-2 bg-gold text-black text-[10px] px-2 py-0.5 rounded-full shadow-md"
              >
                {option.social}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Booking types description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-xs text-white/60 font-light"
      >
        Select an option to continue with your booking
      </motion.p>
    </motion.div>
  );
};

export default BookingStepOne;
