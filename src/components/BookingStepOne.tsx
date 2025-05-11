
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { motion } from 'framer-motion';

const BookingStepOne: React.FC = () => {
  const { setBookingType, nextStep } = useBooking();
  
  const handleSelectType = (type: string) => {
    setBookingType(type);
    nextStep();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-center text-center py-10"
    >
      <h2 className="mb-12 tracking-widest">What are you looking for?</h2>
      <div className="flex flex-col space-y-6">
        <motion.button 
          whileHover={{ y: -2, boxShadow: '0 5px 10px rgba(255, 215, 0, 0.2)' }}
          whileTap={{ y: 0 }}
          className="booking-pill"
          onClick={() => handleSelectType('dinner')}
        >
          Dinner Table
        </motion.button>
        <motion.button 
          whileHover={{ y: -2, boxShadow: '0 5px 10px rgba(255, 215, 0, 0.2)' }}
          whileTap={{ y: 0 }}
          className="booking-pill"
          onClick={() => handleSelectType('daypass')}
        >
          Day Pass
        </motion.button>
        <motion.button 
          whileHover={{ y: -2, boxShadow: '0 5px 10px rgba(255, 215, 0, 0.2)' }}
          whileTap={{ y: 0 }}
          className="booking-pill"
          onClick={() => handleSelectType('event')}
        >
          Event Tickets
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookingStepOne;
