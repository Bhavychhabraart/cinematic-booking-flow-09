import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
const BookingStepThree: React.FC = () => {
  const {
    booking,
    setDate,
    setTime,
    nextStep,
    prevStep
  } = useBooking();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date[]>([new Date(), addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 3), addDays(new Date(), 4), addDays(new Date(), 5), addDays(new Date(), 6)]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const handleDateSelect = (date: Date | undefined) => {
    if (date) setDate(date);
    setSelectedTime(null);
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
  const handleDateChange = (values: number[]) => {
    const index = values[0];
    setCurrentDateIndex(index);
    handleDateSelect(dateRange[index]);
  };
  const handlePrevDate = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      handleDateSelect(dateRange[currentDateIndex - 1]);
    }
  };
  const handleNextDate = () => {
    if (currentDateIndex < dateRange.length - 1) {
      setCurrentDateIndex(currentDateIndex + 1);
      handleDateSelect(dateRange[currentDateIndex + 1]);
    }
  };
  return <motion.div initial={{
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
  }} className="container-center py-10">
      <h2 className="text-center mb-12 tracking-widest">When would you like to visit?</h2>
      
      {/* Date Selector Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevDate} disabled={currentDateIndex === 0} className={`p-2 rounded-full ${currentDateIndex === 0 ? 'text-white/30' : 'text-white hover:text-gold'}`}>
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gold">
              {booking.date ? format(booking.date, 'EEEE') : format(dateRange[currentDateIndex], 'EEEE')}
            </p>
            <h3 className="text-2xl font-medium">
              {booking.date ? format(booking.date, 'MMMM d, yyyy') : format(dateRange[currentDateIndex], 'MMMM d, yyyy')}
            </h3>
          </div>
          
          <button onClick={handleNextDate} disabled={currentDateIndex === dateRange.length - 1} className={`p-2 rounded-full ${currentDateIndex === dateRange.length - 1 ? 'text-white/30' : 'text-white hover:text-gold'}`}>
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="px-4 py-6 mt-4">
          <Slider defaultValue={[currentDateIndex]} max={dateRange.length - 1} step={1} value={[currentDateIndex]} onValueChange={handleDateChange} className="bg-dark border border-gold/30 p-1 rounded-full" />
          
          <div className="flex justify-between mt-2 text-xs text-white/60">
            {dateRange.map((date, index) => <div key={index} className={`${index === currentDateIndex ? 'text-gold' : ''}`}>
                {format(date, 'd')}
              </div>)}
          </div>
        </div>
      </div>
      
      {/* Show traditional calendar as an alternative */}
      
      
      {booking.date && <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-8">
          <h3 className="text-xl text-center mb-4 font-medium">
            Available Times for {format(booking.date, 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map(time => <motion.button key={time} whileHover={{
          y: -2
        }} whileTap={{
          y: 0
        }} onClick={() => handleTimeSelect(time)} className={`px-4 py-2 border ${selectedTime === time ? 'border-gold bg-gold/10 text-white' : 'border-white/20 text-white/70'} rounded-sm transition-all duration-200`}>
                {time}
              </motion.button>)}
          </div>
        </motion.div>}
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="font-medium tracking-wide">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!booking.date || !selectedTime} className={`booking-button ${!booking.date || !selectedTime ? 'opacity-50' : ''}`}>
          Next
        </Button>
      </div>
    </motion.div>;
};
export default BookingStepThree;