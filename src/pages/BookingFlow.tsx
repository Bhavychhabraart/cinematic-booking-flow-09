import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { getVenueBySlug } from '@/data/venues';
import BookingStepOne from '@/components/BookingStepOne';
import BookingStepTwo from '@/components/BookingStepTwo';
import BookingStepThree from '@/components/BookingStepThree';
import BookingStepFour from '@/components/BookingStepFour';
import BookingStepFive from '@/components/BookingStepFive';
const BookingSteps = () => {
  const {
    booking
  } = useBooking();
  const {
    venueName
  } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  useEffect(() => {
    if (!venue) {
      navigate('/');
    }
  }, [venue, navigate]);
  if (!venue) return null;
  const steps = [<BookingStepOne key="step1" />, <BookingStepTwo key="step2" />, <BookingStepThree key="step3" />, <BookingStepFour key="step4" />, <BookingStepFive key="step5" />];
  return <div className="min-h-screen pt-20 my-0 px-0 py-[47px]">
      <div className="container-center mb-10">
        <div className="text-center mb-12">
          <h1 className="font-medium tracking-widest text-4xl">{venue.name}</h1>
          <p className="text-white/60 font-light text-lg">Booking Experience</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8 px-6">
          {[0, 1, 2, 3, 4].map(step => <div key={step} className="flex flex-col items-center">
              <motion.div className={`w-3 h-3 rounded-full mb-1 ${step === booking.step ? 'bg-gold animate-pulse-gold' : step < booking.step ? 'bg-gold/80' : 'bg-white/20'}`} animate={step === booking.step ? {
            scale: [1, 1.2, 1]
          } : {}} transition={{
            repeat: Infinity,
            duration: 2
          }} />
              <div className={`h-[1px] w-12 ${step === 4 ? 'hidden' : 'block'} ${step < booking.step ? 'bg-gold/80' : 'bg-white/20'}`} />
            </div>)}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div key={booking.step} initial={{
        opacity: 0,
        x: 100
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: -100
      }} transition={{
        duration: 0.5
      }}>
          {steps[booking.step]}
        </motion.div>
      </AnimatePresence>
    </div>;
};
const BookingFlow = () => {
  return <BookingProvider>
      <BookingSteps />
    </BookingProvider>;
};
export default BookingFlow;