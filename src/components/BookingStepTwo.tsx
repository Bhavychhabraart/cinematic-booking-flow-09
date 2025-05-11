
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

const BookingStepTwo: React.FC = () => {
  const { booking, setGuestCount, nextStep, prevStep } = useBooking();
  
  const increment = () => {
    setGuestCount(Math.min(20, booking.guestCount + 1));
  };
  
  const decrement = () => {
    setGuestCount(Math.max(1, booking.guestCount - 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center text-center py-10"
    >
      <h2 className="mb-12 tracking-widest">How many guests?</h2>
      
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
          
          <div className="mx-8 text-6xl font-light w-20 text-center">
            {booking.guestCount}
          </div>
          
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
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="font-medium tracking-wide"
        >
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="booking-button"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingStepTwo;
