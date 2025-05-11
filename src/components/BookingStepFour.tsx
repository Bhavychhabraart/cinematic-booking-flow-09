
import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingStepFour: React.FC = () => {
  const { booking, nextStep, prevStep, completeBooking } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      completeBooking();
      nextStep();
    }, 1500);
  };
  
  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').substring(0, 16);
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    setCardNumber(formattedValue);
  };
  
  // Format expiry date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
    } else {
      setExpiry(value);
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
      <h2 className="text-center mb-12 tracking-widest">Complete Your Booking</h2>
      
      <motion.div 
        className="mb-8 p-4 border border-gold/20 rounded-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-medium text-lg tracking-wide mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-white/70">Type:</span>
            <span className="font-medium">{booking.bookingType}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-white/70">Guests:</span>
            <span className="font-medium">{booking.guestCount} {booking.guestCount === 1 ? 'person' : 'people'}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-white/70">Date:</span>
            <span className="font-medium">{booking.date ? format(booking.date, 'MMMM d, yyyy') : ''}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-white/70">Time:</span>
            <span className="font-medium">{booking.time}</span>
          </p>
        </div>
      </motion.div>
      
      <motion.form 
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-2">
          <label className="text-sm text-white/70 tracking-wide">Card Number</label>
          <Input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className="bg-transparent border-white/20 focus:border-gold transition-colors"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-white/70 tracking-wide">Cardholder Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="bg-transparent border-white/20 focus:border-gold transition-colors"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70 tracking-wide">Expiry Date</label>
            <Input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              className="bg-transparent border-white/20 focus:border-gold transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/70 tracking-wide">CVC</label>
            <Input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
              placeholder="123"
              className="bg-transparent border-white/20 focus:border-gold transition-colors"
              required
              maxLength={3}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={prevStep}
            className="font-medium tracking-wide"
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="booking-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Complete Booking'}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default BookingStepFour;
