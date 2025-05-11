
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

const BookingSteps = () => {
  const { booking } = useBooking();
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const maxSteps = getMaxSteps(booking.bookingType);
  
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
    }, 120000); // Show a notification roughly every 2 minutes
    
    return () => {
      clearInterval(notificationInterval);
    };
  }, [venue, navigate]);
  
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

  return (
    <div className="min-h-screen pt-20 my-0 px-0 py-[47px]">
      <div className="container-center mb-10">
        <div className="text-center mb-12">
          <h1 className="font-medium tracking-widest text-4xl">{venue.name}</h1>
          <p className="text-white/60 font-light text-lg">Booking Experience</p>
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
