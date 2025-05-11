
import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const timeSlots = [
  '18:00', '18:30', '19:00', '19:30', 
  '20:00', '20:30', '21:00', '21:30'
];

const BookingStepThree: React.FC = () => {
  const { booking, setDate, setTime, nextStep, prevStep } = useBooking();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) setDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setTime(time);
  };
  
  const handleNext = () => {
    if (booking.date && selectedTime) {
      nextStep();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center py-10"
    >
      <h2 className="text-center mb-12 tracking-widest">When would you like to visit?</h2>
      
      <div className="mb-8 flex justify-center">
        <Calendar
          mode="single"
          selected={booking.date || undefined}
          onSelect={handleDateSelect}
          className="rounded-md bg-dark/50 border border-gold/20 p-3 pointer-events-auto mx-auto"
          classNames={{
            day_selected: "bg-gold text-dark hover:bg-gold/90 hover:text-dark",
            day_today: "bg-accent text-accent-foreground",
            day: "hover:bg-gold/20 hover:text-white",
          }}
        />
      </div>
      
      {booking.date && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-xl text-center mb-4 font-medium">
            Available Times for {format(booking.date, 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((time) => (
              <motion.button
                key={time}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => handleTimeSelect(time)}
                className={`px-4 py-2 border ${
                  selectedTime === time 
                    ? 'border-gold bg-gold/10 text-white' 
                    : 'border-white/20 text-white/70'
                } rounded-sm transition-all duration-200`}
              >
                {time}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="font-medium tracking-wide"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!booking.date || !selectedTime}
          className={`booking-button ${!booking.date || !selectedTime ? 'opacity-50' : ''}`}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingStepThree;
