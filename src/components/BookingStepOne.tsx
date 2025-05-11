
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import { Utensils, Users, Ticket, Star } from 'lucide-react';

const BookingStepOne: React.FC = () => {
  const {
    setBookingType,
    nextStep
  } = useBooking();
  
  const handleSelectType = (type: string) => {
    setBookingType(type);
    nextStep();
  };
  
  const bookingOptions = [
    {
      id: 'lunch',
      label: 'Lunch Table',
      icon: <Utensils className="mr-2" size={18} />,
    },
    {
      id: 'dinner',
      label: 'Dinner Table',
      icon: <Utensils className="mr-2" size={18} />,
    },
    {
      id: 'guestlist',
      label: 'Guest List Entry',
      description: 'Couples & Female Stags - 3 drinks included',
      icon: <Users className="mr-2" size={18} />,
    },
    {
      id: 'vip_standing',
      label: 'VIP Standing Table',
      icon: <Star className="mr-2" size={18} />,
    },
    {
      id: 'vip_couch',
      label: 'VIP Couch Table',
      icon: <Star className="mr-2" size={18} />,
    },
    {
      id: 'event',
      label: 'Event Tickets',
      icon: <Ticket className="mr-2" size={18} />,
    },
    {
      id: 'private',
      label: 'Private Event Hosting',
      icon: <Users className="mr-2" size={18} />,
    },
  ];

  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5
      }} 
      className="container-center text-center py-10"
    >
      <h2 className="mb-12 tracking-widest text-base">What are you looking for?</h2>
      
      <div className="flex flex-col space-y-4">
        {bookingOptions.map((option) => (
          <motion.button 
            key={option.id}
            whileHover={{
              y: -2,
              boxShadow: '0 5px 10px rgba(255, 215, 0, 0.2)'
            }}
            whileTap={{
              y: 0
            }}
            onClick={() => handleSelectType(option.id)} 
            className="booking-pill flex items-center justify-center"
          >
            {option.icon}
            <span>{option.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Booking types description */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs text-white/60 font-light"
      >
        Select an option to continue with your booking
      </motion.p>
    </motion.div>
  );
};

export default BookingStepOne;
