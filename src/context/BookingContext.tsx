import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for different booking add-ons based on booking type
export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  popular?: boolean;
  bookingTypes: string[]; // Which booking types this add-on is applicable to
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  popular?: boolean;
  bookingTypes: string[]; // Which booking types this experience is applicable to
  duration?: string;
}

export interface MenuSelection {
  category: string;
  items: string[];
}

export interface SpecialRequest {
  type: string;
  details: string;
}

export interface TablePreference {
  location: string;
  notes: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validBookingTypes: string[];
  expiryDate?: Date;
  minSpend?: number;
}

interface BookingState {
  step: number;
  bookingType: string;
  guestCount: number;
  date: Date | null;
  time: string;
  completed: boolean;
  addOns: string[];
  selectedExperiences: string[];
  specialRequests: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  tablePreference?: TablePreference;
  celebration?: {
    type: string;
    details: string;
  };
  menuSelections?: MenuSelection[];
  dietaryRestrictions?: string[];
  paymentMethod?: string;
  agreedToTerms: boolean;
  appliedCouponId?: string;
}

interface BookingContextType {
  booking: BookingState;
  availableAddOns: AddOn[];
  availableExperiences: Experience[];
  availableCoupons: Coupon[];
  setBookingType: (type: string) => void;
  setGuestCount: (count: number) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  addAddon: (addon: string) => void;
  removeAddon: (addon: string) => void;
  addExperience: (experience: string) => void;
  removeExperience: (experience: string) => void;
  setSpecialRequests: (requests: string) => void;
  setContactInfo: (info: { name: string; email: string; phone: string }) => void;
  setTablePreference: (preference: TablePreference) => void;
  setCelebration: (celebration: { type: string; details: string }) => void;
  setMenuSelections: (selections: MenuSelection[]) => void;
  setDietaryRestrictions: (restrictions: string[]) => void;
  setPaymentMethod: (method: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  applyCoupon: (couponId: string) => void;
  removeCoupon: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
  completeBooking: () => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getPriceBreakdown: () => { 
    subtotal: number; 
    addOnsTotal: number;
    experiencesTotal: number;
    basePrice: number;
    discount: number;
    total: number;
    appliedCoupon: Coupon | null;
  };
  getFilteredAddOns: () => AddOn[];
  getFilteredExperiences: () => Experience[];
  getValidCoupons: () => Coupon[];
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
    selectedExperiences: [],
    specialRequests: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
    },
    agreedToTerms: false
  });

  // Sample add-ons - in a real app, these would come from an API or backend
  const [availableAddOns] = useState<AddOn[]>([
    {
      id: 'welcome_champagne',
      name: 'Welcome Champagne',
      description: 'Start your evening with a complimentary glass of premium champagne for each guest',
      price: 15.00,
      available: true,
      popular: true,
      bookingTypes: ['lunch', 'dinner', 'vip_standing', 'vip_couch']
    },
    {
      id: 'birthday_cake',
      name: 'Birthday Cake',
      description: 'Celebrate with a custom cake with personalized message',
      price: 45.00,
      available: true,
      bookingTypes: ['lunch', 'dinner', 'private']
    },
    {
      id: 'flowers',
      name: 'Flower Arrangement',
      description: 'Beautiful floral centerpiece for your table',
      price: 35.00,
      available: true,
      bookingTypes: ['lunch', 'dinner', 'vip_couch', 'private']
    },
    {
      id: 'premium_spirits',
      name: 'Premium Spirits Package',
      description: 'Upgrade to top-shelf spirits for your party',
      price: 75.00,
      available: true,
      popular: true,
      bookingTypes: ['vip_standing', 'vip_couch', 'guestlist', 'private']
    },
    {
      id: 'priority_entry',
      name: 'Priority Entry',
      description: 'Skip the line with our VIP host',
      price: 25.00,
      available: true,
      bookingTypes: ['guestlist', 'event']
    },
    {
      id: 'photographer',
      name: 'Personal Photographer',
      description: '1-hour session with our professional photographer',
      price: 120.00,
      available: true,
      bookingTypes: ['vip_couch', 'private']
    },
    {
      id: 'parking',
      name: 'VIP Parking',
      description: 'Reserved parking spot close to entrance',
      price: 30.00,
      available: true,
      bookingTypes: ['lunch', 'dinner', 'vip_couch', 'private', 'event']
    }
  ]);

  // Sample experiences - in a real app, these would come from an API or backend
  const [availableExperiences] = useState<Experience[]>([
    {
      id: 'chef_table',
      name: 'Chef\'s Table Experience',
      description: 'Private dining with direct interaction with our head chef',
      price: 150.00,
      available: true,
      popular: true,
      duration: '3 hours',
      bookingTypes: ['dinner', 'private']
    },
    {
      id: 'wine_tasting',
      name: 'Wine Tasting Flight',
      description: 'Selection of premium wines with expert sommelier guidance',
      price: 65.00,
      available: true,
      duration: '45 minutes',
      bookingTypes: ['lunch', 'dinner']
    },
    {
      id: 'cocktail_class',
      name: 'Mixology Class',
      description: 'Learn to craft signature cocktails with our master bartender',
      price: 85.00,
      available: true,
      popular: true,
      duration: '1 hour',
      bookingTypes: ['vip_standing', 'vip_couch', 'private']
    },
    {
      id: 'dj_booth',
      name: 'DJ Booth Experience',
      description: 'Join our DJ in the booth and select songs for the crowd',
      price: 100.00,
      available: true,
      duration: '30 minutes',
      bookingTypes: ['vip_standing', 'vip_couch', 'guestlist']
    },
    {
      id: 'vip_tour',
      name: 'Behind-the-Scenes Tour',
      description: 'Exclusive look at our venue\'s restricted areas',
      price: 45.00,
      available: true,
      duration: '20 minutes',
      bookingTypes: ['vip_couch', 'private', 'event']
    }
  ]);

  // Sample coupons - in a real app, these would come from an API or backend
  const [availableCoupons] = useState<Coupon[]>([
    {
      id: 'welcome10',
      code: 'WELCOME10',
      description: 'Welcome Discount',
      discountType: 'percentage',
      discountValue: 10,
      validBookingTypes: ['lunch', 'dinner', 'vip_standing', 'vip_couch', 'guestlist', 'private', 'event'],
      minSpend: 50
    },
    {
      id: 'vip20',
      code: 'VIP20',
      description: 'VIP Special Offer',
      discountType: 'percentage',
      discountValue: 20,
      validBookingTypes: ['vip_standing', 'vip_couch'],
      minSpend: 150
    },
    {
      id: 'dinner25',
      code: 'DINNER25',
      description: '$25 Off Dinner',
      discountType: 'fixed',
      discountValue: 25,
      validBookingTypes: ['dinner', 'private'],
      minSpend: 100
    }
  ]);

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

  const addExperience = (experience: string) => {
    setBooking(prev => ({
      ...prev,
      selectedExperiences: [...prev.selectedExperiences, experience]
    }));
  };

  const removeExperience = (experience: string) => {
    setBooking(prev => ({
      ...prev,
      selectedExperiences: prev.selectedExperiences.filter(item => item !== experience)
    }));
  };

  const setSpecialRequests = (requests: string) => {
    setBooking(prev => ({
      ...prev,
      specialRequests: requests
    }));
  };

  const setContactInfo = (info: { name: string; email: string; phone: string }) => {
    setBooking(prev => ({
      ...prev,
      contactInfo: info
    }));
  };

  const setTablePreference = (preference: TablePreference) => {
    setBooking(prev => ({
      ...prev,
      tablePreference: preference
    }));
  };

  const setCelebration = (celebration: { type: string; details: string }) => {
    setBooking(prev => ({
      ...prev,
      celebration
    }));
  };

  const setMenuSelections = (selections: MenuSelection[]) => {
    setBooking(prev => ({
      ...prev,
      menuSelections: selections
    }));
  };

  const setDietaryRestrictions = (restrictions: string[]) => {
    setBooking(prev => ({
      ...prev,
      dietaryRestrictions: restrictions
    }));
  };

  const setPaymentMethod = (method: string) => {
    setBooking(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const setAgreedToTerms = (agreed: boolean) => {
    setBooking(prev => ({
      ...prev,
      agreedToTerms: agreed
    }));
  };

  const applyCoupon = (couponId: string) => {
    setBooking(prev => ({
      ...prev,
      appliedCouponId: couponId
    }));
  };

  const removeCoupon = () => {
    setBooking(prev => ({
      ...prev,
      appliedCouponId: undefined
    }));
  };

  // Updated navigation functions with loading state
  const nextStep = async () => {
    // Trigger loading state in BookingFlow component via event
    const event = new CustomEvent('booking-transition-start');
    window.dispatchEvent(event);
    
    // Small delay to allow animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setBooking(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = async () => {
    // Trigger loading state in BookingFlow component via event
    const event = new CustomEvent('booking-transition-start');
    window.dispatchEvent(event);
    
    // Small delay to allow animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
      selectedExperiences: [],
      specialRequests: '',
      contactInfo: {
        name: '',
        email: '',
        phone: '',
      },
      agreedToTerms: false
    });
  };

  const completeBooking = () => {
    setBooking(prev => ({ ...prev, completed: true }));
  };

  const getFilteredAddOns = () => {
    if (!booking.bookingType) return [];
    return availableAddOns.filter(addon => 
      addon.bookingTypes.includes(booking.bookingType)
    );
  };

  const getFilteredExperiences = () => {
    if (!booking.bookingType) return [];
    return availableExperiences.filter(exp => 
      exp.bookingTypes.includes(booking.bookingType)
    );
  };

  const getValidCoupons = () => {
    if (!booking.bookingType) return [];
    return availableCoupons.filter(coupon => 
      coupon.validBookingTypes.includes(booking.bookingType) && 
      (!coupon.minSpend || getSubtotal() >= coupon.minSpend) &&
      (!coupon.expiryDate || coupon.expiryDate >= new Date())
    );
  };

  const getSubtotal = () => {
    let subtotal = 0;
    
    // Add price for selected add-ons
    const addOnsTotal = booking.addOns.reduce((total, addonId) => {
      const addon = availableAddOns.find(a => a.id === addonId);
      return addon ? total + addon.price : total;
    }, 0);
    
    // Add price for selected experiences
    const experiencesTotal = booking.selectedExperiences.reduce((total, expId) => {
      const experience = availableExperiences.find(e => e.id === expId);
      return experience ? total + experience.price : total;
    }, 0);
    
    // Base price depending on booking type
    let basePrice = 0;
    if (['lunch', 'dinner', 'vip_standing', 'vip_couch'].includes(booking.bookingType)) {
      // Base price is per person for these booking types
      const basePriceRate = {
        'lunch': 0, // No cover charge for lunch
        'dinner': 0, // No cover charge for dinner
        'vip_standing': 45, // Cover charge for VIP standing
        'vip_couch': 75 // Cover charge for VIP couch
      }[booking.bookingType] || 0;
      
      basePrice = basePriceRate * booking.guestCount;
    }
    
    subtotal = addOnsTotal + experiencesTotal + basePrice;
    
    return subtotal;
  };

  const getDiscount = () => {
    if (!booking.appliedCouponId) return 0;
    
    const coupon = availableCoupons.find(c => c.id === booking.appliedCouponId);
    if (!coupon) return 0;
    
    const subtotal = getSubtotal();
    
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    } else {
      return Math.min(subtotal, coupon.discountValue);
    }
  };

  const getTotalPrice = () => {
    return getSubtotal() - getDiscount();
  };

  const getPriceBreakdown = () => {
    // Calculate add-ons total
    const addOnsTotal = booking.addOns.reduce((total, addonId) => {
      const addon = availableAddOns.find(a => a.id === addonId);
      return addon ? total + addon.price : total;
    }, 0);
    
    // Calculate experiences total
    const experiencesTotal = booking.selectedExperiences.reduce((total, expId) => {
      const experience = availableExperiences.find(e => e.id === expId);
      return experience ? total + experience.price : total;
    }, 0);
    
    // Calculate base price
    let basePrice = 0;
    if (['lunch', 'dinner', 'vip_standing', 'vip_couch'].includes(booking.bookingType)) {
      const basePriceRate = {
        'lunch': 0,
        'dinner': 0,
        'vip_standing': 45,
        'vip_couch': 75
      }[booking.bookingType] || 0;
      
      basePrice = basePriceRate * booking.guestCount;
    }
    
    const subtotal = addOnsTotal + experiencesTotal + basePrice;
    const discount = getDiscount();
    const total = subtotal - discount;
    
    // Get applied coupon if any
    const appliedCoupon = booking.appliedCouponId 
      ? availableCoupons.find(c => c.id === booking.appliedCouponId) || null
      : null;
    
    return {
      subtotal,
      addOnsTotal,
      experiencesTotal,
      basePrice,
      discount,
      total,
      appliedCoupon
    };
  };

  return (
    <BookingContext.Provider value={{
      booking,
      availableAddOns,
      availableExperiences,
      availableCoupons,
      setBookingType,
      setGuestCount,
      setDate,
      setTime,
      addAddon,
      removeAddon,
      addExperience,
      removeExperience,
      setSpecialRequests,
      setContactInfo,
      setTablePreference,
      setCelebration,
      setMenuSelections,
      setDietaryRestrictions,
      setPaymentMethod,
      setAgreedToTerms,
      applyCoupon,
      removeCoupon,
      nextStep,
      prevStep,
      resetBooking,
      completeBooking,
      getTotalPrice,
      getSubtotal,
      getDiscount,
      getPriceBreakdown,
      getFilteredAddOns,
      getFilteredExperiences,
      getValidCoupons
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
