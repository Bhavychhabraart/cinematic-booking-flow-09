
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Users } from 'lucide-react';
import { provideFeedback } from '@/utils/feedback';

const BookingStepTwo: React.FC = () => {
  const { booking, setGuestCount, nextStep, prevStep } = useBooking();
  
  const increment = () => {
    provideFeedback('buttonPress');
    setGuestCount(Math.min(20, booking.guestCount + 1));
  };
  
  const decrement = () => {
    provideFeedback('buttonPress');
    setGuestCount(Math.max(1, booking.guestCount - 1));
  };
  
  // Different guest count recommendations based on booking type
  const getRecommendation = () => {
    switch(booking.bookingType) {
      case 'vip_couch':
        return "Recommended: 4-8 guests for optimal VIP experience";
      case 'vip_standing':
        return "Recommended: 2-6 guests for standing tables";
      case 'private':
        return "Minimum 10 guests required for private events";
      default:
        return null;
    }
  };
  
  const recommendation = getRecommendation();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center text-center py-10"
    >
      <h2 className="mb-8 tracking-widest">How many guests?</h2>
      
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-sm text-gold bg-gold/10 px-4 py-2 rounded-md inline-flex items-center"
        >
          <Users className="mr-2 h-4 w-4" />
          {recommendation}
        </motion.div>
      )}
      
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="flex items-center justify-center mb-8">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            className="p-2"
          >
            <ChevronDown className="h-8 w-8 text-gold" />
          </motion.button>
          
          <motion.div 
            key={booking.guestCount}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-8 text-6xl font-light w-20 text-center"
          >
            {booking.guestCount}
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            className="p-2"
          >
            <ChevronUp className="h-8 w-8 text-gold" />
          </motion.button>
        </div>
        
        <p className="text-white/60 font-light text-sm tracking-wider">
          {booking.guestCount === 1 ? 'PERSON' : 'PEOPLE'}
        </p>
      </div>
      
      <div className="flex justify-between px-4">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="font-medium tracking-wide"
          onMouseDown={() => provideFeedback('buttonPress')}
        >
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="booking-button"
          onMouseDown={() => provideFeedback('navigation')}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingStepTwo;
