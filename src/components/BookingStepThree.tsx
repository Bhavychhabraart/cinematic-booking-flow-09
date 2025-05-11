
import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { provideFeedback } from '@/utils/feedback';

const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

const BookingStepThree: React.FC = () => {
  const {
    booking,
    setDate,
    setTime,
    nextStep,
    prevStep
  } = useBooking();
  
  const [selectedTime, setSelectedTime] = useState<string | null>(booking.time || null);
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(), 
    addDays(new Date(), 1), 
    addDays(new Date(), 2), 
    addDays(new Date(), 3), 
    addDays(new Date(), 4), 
    addDays(new Date(), 5), 
    addDays(new Date(), 6)
  ]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      provideFeedback('selection');
    }
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setTime(time);
    provideFeedback('selection', '/sounds/select.mp3');
  };
  
  const handleNext = () => {
    if (booking.date && selectedTime) {
      provideFeedback('navigation');
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
  
  const toggleCalendarView = () => {
    setShowFullCalendar(!showFullCalendar);
    provideFeedback('buttonPress');
  };

  // Generate random slots for limited availability messaging
  const generateLimitedSlots = () => {
    const limited = [];
    for (let i = 0; i < 2; i++) {
      limited.push(timeSlots[Math.floor(Math.random() * timeSlots.length)]);
    }
    return limited;
  };
  
  const limitedSlots = generateLimitedSlots();
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center py-10"
    >
      <h2 className="text-center mb-8 tracking-widest">When would you like to visit?</h2>
      
      {/* Toggle between date slider and full calendar */}
      <div className="flex justify-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleCalendarView}
          className="text-xs"
          onMouseDown={() => provideFeedback('buttonPress')}
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          {showFullCalendar ? "Switch to Date Slider" : "View Full Calendar"}
        </Button>
      </div>
      
      {!showFullCalendar ? (
        // Date Selector Slider
        <div className="mb-8 px-4">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={handlePrevDate} 
              disabled={currentDateIndex === 0}
              className={`p-2 rounded-full ${currentDateIndex === 0 ? 'text-white/30' : 'text-white hover:text-gold'}`}
              onMouseDown={() => provideFeedback('buttonPress')}
            >
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
            
            <button 
              onClick={handleNextDate} 
              disabled={currentDateIndex === dateRange.length - 1}
              className={`p-2 rounded-full ${currentDateIndex === dateRange.length - 1 ? 'text-white/30' : 'text-white hover:text-gold'}`}
              onMouseDown={() => provideFeedback('buttonPress')}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="px-4 py-6 mt-4">
            <Slider 
              defaultValue={[currentDateIndex]} 
              max={dateRange.length - 1} 
              step={1} 
              value={[currentDateIndex]} 
              onValueChange={handleDateChange} 
              className="bg-dark border border-gold/30 p-1 rounded-full" 
            />
            
            <div className="flex justify-between mt-2 text-xs text-white/60">
              {dateRange.map((date, index) => (
                <div 
                  key={index} 
                  className={`${index === currentDateIndex ? 'text-gold' : ''}`}
                >
                  {format(date, 'd')}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Full Calendar View
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 px-4"
        >
          <Calendar
            mode="single"
            selected={booking.date || undefined}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            className="rounded-md border border-white/20 bg-white/5 p-3 mx-auto"
          />
        </motion.div>
      )}
      
      {booking.date && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4"
        >
          <h3 className="text-xl text-center mb-4 font-medium">
            Available Times for {format(booking.date, 'MMMM d, yyyy')}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map(time => (
              <motion.button 
                key={time}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => handleTimeSelect(time)}
                className={`relative px-4 py-2 border ${
                  selectedTime === time 
                    ? 'border-gold bg-gold/10 text-white' 
                    : 'border-white/20 text-white/70'
                } rounded-sm transition-all duration-200`}
              >
                {time}
                
                {/* Limited availability badge */}
                {limitedSlots.includes(time) && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gold text-black text-[10px] px-2 py-0.5 rounded-full shadow-md"
                  >
                    {Math.floor(Math.random() * 3) + 1} left
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-between px-4">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="font-medium tracking-wide"
          onMouseDown={() => provideFeedback('buttonPress')}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!booking.date || !selectedTime}
          className={`booking-button ${!booking.date || !selectedTime ? 'opacity-50' : ''}`}
          onMouseDown={() => provideFeedback('navigation')}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingStepThree;
