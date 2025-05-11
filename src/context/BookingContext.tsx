
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingState {
  step: number;
  bookingType: string;
  guestCount: number;
  date: Date | null;
  time: string;
  completed: boolean;
  addOns: string[];
  specialRequests: string;
}

interface BookingContextType {
  booking: BookingState;
  setBookingType: (type: string) => void;
  setGuestCount: (count: number) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  addAddon: (addon: string) => void;
  removeAddon: (addon: string) => void;
  setSpecialRequests: (requests: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
  completeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingState>({
    step: 0,
    bookingType: '',
    guestCount: 1,
    date: null,
    time: '',
    completed: false,
    addOns: [],
    specialRequests: '',
  });

  const setBookingType = (type: string) => {
    setBooking(prev => ({ ...prev, bookingType: type }));
  };

  const setGuestCount = (count: number) => {
    setBooking(prev => ({ ...prev, guestCount: count }));
  };

  const setDate = (date: Date) => {
    setBooking(prev => ({ ...prev, date }));
  };

  const setTime = (time: string) => {
    setBooking(prev => ({ ...prev, time }));
  };

  const addAddon = (addon: string) => {
    setBooking(prev => ({
      ...prev,
      addOns: [...prev.addOns, addon]
    }));
  };

  const removeAddon = (addon: string) => {
    setBooking(prev => ({
      ...prev,
      addOns: prev.addOns.filter(item => item !== addon)
    }));
  };

  const setSpecialRequests = (requests: string) => {
    setBooking(prev => ({
      ...prev,
      specialRequests: requests
    }));
  };

  const nextStep = () => {
    setBooking(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setBooking(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const resetBooking = () => {
    setBooking({
      step: 0,
      bookingType: '',
      guestCount: 1,
      date: null,
      time: '',
      completed: false,
      addOns: [],
      specialRequests: '',
    });
  };

  const completeBooking = () => {
    setBooking(prev => ({ ...prev, completed: true }));
  };

  return (
    <BookingContext.Provider value={{
      booking,
      setBookingType,
      setGuestCount,
      setDate,
      setTime,
      addAddon,
      removeAddon,
      setSpecialRequests,
      nextStep,
      prevStep,
      resetBooking,
      completeBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
