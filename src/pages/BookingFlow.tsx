
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { getVenueBySlug } from '@/data/venues';
import BookingStepOne from '@/components/BookingStepOne';
import BookingStepTwo from '@/components/BookingStepTwo';
import BookingStepThree from '@/components/BookingStepThree';
import BookingAddOns from '@/components/BookingAddOns';
import BookingExperiences from '@/components/BookingExperiences';
import BookingContact from '@/components/BookingContact';
import BookingPreferences from '@/components/BookingPreferences';
import BookingStepFour from '@/components/BookingStepFour';
import BookingStepFive from '@/components/BookingStepFive';
import { Users, Clock, CalendarCheck, Package, Star } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { vibrate, vibrationPatterns, provideFeedback } from '@/utils/feedback';

// Determine the maximum number of steps based on booking type
const getMaxSteps = (bookingType: string): number => {
  // More complex booking types have more steps
  switch (bookingType) {
    case 'lunch':
    case 'dinner':
      return 8; // Type, Guests, Date/Time, Add-ons, Experiences, Preferences, Contact, Confirm
    case 'vip_standing':
    case 'vip_couch':
      return 8; // Type, Guests, Date/Time, Add-ons, Experiences, Preferences, Contact, Confirm
    case 'private':
      return 8; // Type, Guests, Date/Time, Add-ons, Experiences, Preferences, Contact, Confirm
    case 'guestlist':
    case 'event':
      return 6; // Type, Guests, Date/Time, Add-ons, Contact, Confirm
    default:
      return 5; // The original default flow
  }
};

// Get the progress percentage based on current step and max steps
const getProgressPercentage = (currentStep: number, maxSteps: number): number => {
  return Math.min(100, Math.round((currentStep / (maxSteps - 1)) * 100));
};

const BookingSteps = () => {
  const { booking } = useBooking();
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 5) + 2);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const maxSteps = getMaxSteps(booking.bookingType);
  const progressPercentage = getProgressPercentage(booking.step, maxSteps);
  
  useEffect(() => {
    if (!venue) {
      navigate('/');
    }
    
    // Show occasional toast notifications for FOMO - reduced frequency
    const notificationInterval = setInterval(() => {
      // Only show one type of notification with longer intervals
      if (Math.random() > 0.7) { // 30% chance to show notification
        const message = `${Math.floor(Math.random() * 2) + 1} new bookings in the last hour`;
        
        toast(message, {
          duration: 3000,
        });
      }
    }, 120000); // Show a notification roughly every 2 minutes instead of every minute
    
    // Simulate other active users - less frequent updates
    const userInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.7 ? 1 : -1;
        return Math.max(1, prev + change);
      });
    }, 60000); // Update every minute instead of every 45 seconds
    
    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // When timer ends, show warning but don't actually redirect
          toast.warning("Your booking session is about to expire!", {
            description: "We've extended your time by 10 minutes.",
            duration: 5000,
          });
          vibrate(vibrationPatterns.warning);
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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!venue) return null;
  
  // Dynamically choose which steps to show based on booking type
  const renderBookingStep = () => {
    // Basic steps for all booking types
    if (booking.step === 0) return <BookingStepOne key="step1" />;
    if (booking.step === 1) return <BookingStepTwo key="step2" />;
    if (booking.step === 2) return <BookingStepThree key="step3" />;
    
    // For booking types that have add-ons (all except 'event')
    if (booking.step === 3) {
      if (booking.bookingType === 'event') {
        return <BookingContact key="contact" />;
      }
      return <BookingAddOns key="addons" />;
    }
    
    // For booking types that have experiences
    if (booking.step === 4) {
      if (['lunch', 'dinner', 'vip_standing', 'vip_couch', 'private'].includes(booking.bookingType)) {
        return <BookingExperiences key="experiences" />;
      }
      if (['guestlist', 'event'].includes(booking.bookingType)) {
        return <BookingStepFour key="step4" />;
      }
      return <BookingContact key="contact" />;
    }
    
    // Different paths based on booking type
    if (booking.step === 5) {
      if (['lunch', 'dinner', 'vip_standing', 'vip_couch', 'private'].includes(booking.bookingType)) {
        return <BookingPreferences key="preferences" />;
      }
      return <BookingStepFive key="step5" />;
    }
    
    if (booking.step === 6) {
      if (['lunch', 'dinner', 'vip_standing', 'vip_couch', 'private'].includes(booking.bookingType)) {
        return <BookingContact key="contact" />;
      }
      return <BookingStepFive key="step5" />;
    }
    
    if (booking.step === 7) {
      return <BookingStepFour key="step4" />;
    }
    
    return <BookingStepFive key="step5" />;
  };

  // Determine which step icons to show based on booking type
  const getStepIcons = () => {
    if (['lunch', 'dinner', 'vip_standing', 'vip_couch', 'private'].includes(booking.bookingType)) {
      return [
        { icon: <Users size={16} />, label: "Type" },
        { icon: <Users size={16} />, label: "Guests" },
        { icon: <CalendarCheck size={16} />, label: "Date" },
        { icon: <Package size={16} />, label: "Add-ons" },
        { icon: <Star size={16} />, label: "Experiences" },
        { icon: <Users size={16} />, label: "Preferences" },
        { icon: <Users size={16} />, label: "Contact" },
        { icon: <Users size={16} />, label: "Confirm" }
      ];
    } else if (['guestlist', 'event'].includes(booking.bookingType)) {
      return [
        { icon: <Users size={16} />, label: "Type" },
        { icon: <Users size={16} />, label: "Guests" },
        { icon: <CalendarCheck size={16} />, label: "Date" },
        { icon: <Users size={16} />, label: "Contact" },
        { icon: <Users size={16} />, label: "Confirm" }
      ];
    } else {
      // Default
      return [
        { icon: <Users size={16} />, label: "Type" },
        { icon: <Users size={16} />, label: "Guests" },
        { icon: <CalendarCheck size={16} />, label: "Date" },
        { icon: <Users size={16} />, label: "Review" },
        { icon: <Users size={16} />, label: "Confirm" }
      ];
    }
  };
  
  const stepIcons = getStepIcons();
  
  return (
    <div className="min-h-screen pt-20 my-0 px-0 py-[47px]">
      <div className="container-center mb-10">
        <div className="text-center mb-12">
          <h1 className="font-medium tracking-widest text-4xl">{venue.name}</h1>
          <p className="text-white/60 font-light text-lg">Booking Experience</p>
        </div>
        
        {/* FOMO indicators - more subtle placement */}
        <div className="flex justify-between items-center mb-4 px-6 text-xs opacity-70">
          <motion.div 
            className="flex items-center text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Users className="mr-1 h-4 w-4" />
            <span>{activeUsers} people booking</span>
          </motion.div>
          
          <motion.div 
            className={`flex items-center ${timeLeft < 120 ? 'text-gold/70' : 'text-white/60'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Clock className="mr-1 h-4 w-4" />
            <span>Session: {formatTime(timeLeft)}</span>
          </motion.div>
        </div>
        
        {/* Progress bar instead of dots for a more fluid experience */}
        <div className="px-6 mb-6">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Step labels */}
          <div className="flex justify-between mt-2 text-xs">
            {stepIcons.slice(0, maxSteps).map((step, index) => (
              <motion.div 
                key={index}
                className={`flex flex-col items-center ${index === booking.step ? 'text-gold' : 'text-white/40'}`}
                animate={index === booking.step ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: 0, duration: 0.3 }}
              >
                <div 
                  className={`flex items-center justify-center w-6 h-6 rounded-full mb-1 ${
                    index === booking.step 
                      ? 'bg-gold/20' 
                      : index < booking.step 
                        ? 'bg-gold/10' 
                        : 'bg-white/5'
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-[10px]">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={booking.step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            if (booking.step > 0) {
              provideFeedback('subtle');
            }
          }}
        >
          {renderBookingStep()}
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
