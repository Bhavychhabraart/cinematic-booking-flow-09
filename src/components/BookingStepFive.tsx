
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';

const Bubble = ({ delay }: { delay: number }) => {
  const xPos = Math.random() * 100;
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0, x: xPos }}
      animate={{ 
        y: -100, 
        opacity: [0, 1, 0],
        x: xPos + (Math.random() * 20 - 10)
      }}
      transition={{ 
        duration: 2 + Math.random() * 2, 
        delay, 
        ease: "easeOut" 
      }}
      className="absolute bottom-0 w-3 h-3 rounded-full bg-gold/30"
    />
  );
};

const BookingStepFive: React.FC = () => {
  const navigate = useNavigate();
  const { venueName } = useParams();
  const { booking, resetBooking } = useBooking();
  const [bubbles, setBubbles] = useState<number[]>([]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBubbles(prev => [...prev, Date.now()]);
    }, 300);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleDone = () => {
    resetBooking();
    navigate(`/venues/${venueName}`);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container-center text-center py-16 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 0.2
        }}
        className="mb-8 flex justify-center"
      >
        <CheckCircle size={80} className="text-gold" />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6 tracking-widest"
      >
        Booking Confirmed!
      </motion.h2>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-12 max-w-xs mx-auto"
      >
        <p className="text-white/80 mb-4">
          Your {booking.bookingType} for {booking.guestCount} {booking.guestCount === 1 ? 'person' : 'people'} on {booking.date ? format(booking.date, 'MMMM d') : ''} at {booking.time} has been confirmed.
        </p>
        <p className="text-white/60 text-sm">
          A confirmation email with your booking details has been sent to your email address.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button onClick={handleDone} className="booking-button">
          Done
        </Button>
      </motion.div>
      
      {/* Animated bubbles effect */}
      {bubbles.slice(-20).map((id, i) => (
        <Bubble key={id} delay={i * 0.1} />
      ))}
    </motion.div>
  );
};

export default BookingStepFive;
