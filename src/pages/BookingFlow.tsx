
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { getVenueBySlug } from '@/data/venues';
import BookingStepOne from '@/components/BookingStepOne';
import BookingStepTwo from '@/components/BookingStepTwo';
import BookingStepThree from '@/components/BookingStepThree';
import BookingStepFour from '@/components/BookingStepFour';
import BookingStepFive from '@/components/BookingStepFive';
import { Users, Clock } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

const BookingSteps = () => {
  const { booking } = useBooking();
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 8) + 3);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  useEffect(() => {
    if (!venue) {
      navigate('/');
    }
    
    // Show occasional toast notifications for FOMO
    const notificationInterval = setInterval(() => {
      const notifications = [
        { message: "Someone just booked this venue!", delay: 15000 },
        { message: `Only ${Math.floor(Math.random() * 3) + 1} slots left for tonight!`, delay: 30000 },
        { message: `${Math.floor(Math.random() * 3) + 2} people just viewed this booking!`, delay: 45000 },
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      setTimeout(() => {
        toast(randomNotification.message, {
          duration: 5000,
        });
      }, randomNotification.delay);
    }, 60000); // Show a notification roughly every minute
    
    // Simulate other active users
    const userInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, prev + change);
      });
    }, 45000);
    
    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // When timer ends, show warning but don't actually redirect
          toast.warning("Your booking session is about to expire!", {
            description: "We've extended your time by 10 minutes.",
            duration: 5000,
          });
          return 600; // Reset to 10 minutes
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(notificationInterval);
      clearInterval(userInterval);
      clearInterval(timerInterval);
    };
  }, [venue, navigate]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!venue) return null;
  
  const steps = [
    <BookingStepOne key="step1" />,
    <BookingStepTwo key="step2" />,
    <BookingStepThree key="step3" />,
    <BookingStepFour key="step4" />,
    <BookingStepFive key="step5" />
  ];
  
  return (
    <div className="min-h-screen pt-20 my-0 px-0 py-[47px]">
      <div className="container-center mb-10">
        <div className="text-center mb-12">
          <h1 className="font-medium tracking-widest text-4xl">{venue.name}</h1>
          <p className="text-white/60 font-light text-lg">Booking Experience</p>
        </div>
        
        {/* FOMO indicators */}
        <div className="flex justify-between items-center mb-4 px-6 text-xs">
          <motion.div 
            className="flex items-center text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Users className="mr-1 h-4 w-4" />
            <span>{activeUsers} people booking right now</span>
          </motion.div>
          
          <motion.div 
            className={`flex items-center ${timeLeft < 120 ? 'text-red-400' : 'text-gold'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Clock className="mr-1 h-4 w-4" />
            <span>Session expires in {formatTime(timeLeft)}</span>
          </motion.div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8 px-6">
          {[0, 1, 2, 3, 4].map(step => (
            <div key={step} className="flex flex-col items-center">
              <motion.div 
                className={`w-3 h-3 rounded-full mb-1 ${
                  step === booking.step 
                    ? 'bg-gold animate-pulse-gold' 
                    : step < booking.step 
                      ? 'bg-gold/80' 
                      : 'bg-white/20'
                }`}
                animate={step === booking.step ? { scale: [1, 1.2, 1] } : {}} 
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div 
                className={`h-[1px] w-12 ${step === 4 ? 'hidden' : 'block'} ${
                  step < booking.step ? 'bg-gold/80' : 'bg-white/20'
                }`} 
              />
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={booking.step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {steps[booking.step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BookingFlow = () => {
  return (
    <BookingProvider>
      <BookingSteps />
    </BookingProvider>
  );
};

export default BookingFlow;
