
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBooking } from '@/context/BookingContext';

// Loyalty tiers with their requirements and benefits
export const LOYALTY_TIERS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    color: '#CD7F32',
    discountRate: 5,
    benefits: ['5% discount on all bookings', 'Early access to event tickets']
  },
  SILVER: {
    name: 'Silver',
    minPoints: 100,
    color: '#C0C0C0',
    discountRate: 10,
    benefits: ['10% discount on all bookings', 'Complimentary welcome drink', 'Priority seating']
  },
  GOLD: {
    name: 'Gold',
    minPoints: 300,
    color: '#FFD700',
    discountRate: 15,
    benefits: ['15% discount on all bookings', 'VIP entry', 'Complimentary birthday gift', 'Exclusive event invitations']
  },
  PLATINUM: {
    name: 'Platinum',
    minPoints: 600,
    color: '#914110',
    discountRate: 20,
    benefits: ['20% discount on all bookings', 'Personal concierge service', 'Exclusive experiences', 'VIP parking', 'Priority reservation']
  }
};

// Points earned for different actions
export const POINTS_SYSTEM = {
  BOOKING: 10, // Base points for any booking
  PER_PERSON: 5, // Points per guest in a booking
  PER_DOLLAR: 0.5, // Points per dollar spent
  CONSECUTIVE_BOOKING: 15, // Extra points for consecutive bookings within 30 days
};

export type LoyaltyAchievement = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  achieved: boolean;
  date?: Date;
};

export type LoyaltyVenueStats = {
  venueId: string;
  venueName: string;
  visits: number;
  lastVisit?: Date;
  totalSpent: number;
  favoriteBookingType?: string;
};

export type LoyaltyReward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  expiryDate?: Date;
  redeemed: boolean;
  code?: string;
};

export interface LoyaltyState {
  userId: string;
  displayName: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: keyof typeof LOYALTY_TIERS;
  joinedDate: Date;
  achievements: LoyaltyAchievement[];
  venueStats: LoyaltyVenueStats[];
  availableRewards: LoyaltyReward[];
  redeemedRewards: LoyaltyReward[];
  lastBookingDate?: Date;
  consecutiveBookings: number;
}

interface LoyaltyContextType {
  loyalty: LoyaltyState;
  currentTier: typeof LOYALTY_TIERS[keyof typeof LOYALTY_TIERS];
  nextTier: typeof LOYALTY_TIERS[keyof typeof LOYALTY_TIERS] | null;
  pointsToNextTier: number;
  progressToNextTier: number;
  addLoyaltyPoints: (points: number, reason: string) => void;
  recordBooking: (venueId: string, venueName: string, amount: number, guestCount: number, bookingType: string) => number;
  redeemReward: (rewardId: string) => void;
  getLoyaltyDiscount: () => number;
  resetLoyalty: () => void;
}

// Create a mock user for demo purposes
const createMockLoyaltyState = (): LoyaltyState => {
  const now = new Date();
  const joinedDate = new Date();
  joinedDate.setMonth(joinedDate.getMonth() - 3);
  
  return {
    userId: 'user-' + Math.random().toString(36).substring(2, 9),
    displayName: 'Guest User',
    currentPoints: 75,
    lifetimePoints: 75,
    tier: 'BRONZE',
    joinedDate,
    achievements: [
      {
        id: 'first-booking',
        title: 'First Booking',
        description: 'Made your first venue booking',
        points: 25,
        icon: 'trophy',
        achieved: true,
        date: new Date(now.setDate(now.getDate() - 30))
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Book a venue after 10 PM',
        points: 15,
        icon: 'moon',
        achieved: true,
        date: new Date(now.setDate(now.getDate() - 20))
      },
      {
        id: 'venue-explorer',
        title: 'Venue Explorer',
        description: 'Visit 3 different venues',
        points: 50,
        icon: 'map',
        achieved: false
      }
    ],
    venueStats: [
      {
        venueId: 'bulach',
        venueName: 'Bülach',
        visits: 2,
        lastVisit: new Date(now.setDate(now.getDate() - 10)),
        totalSpent: 350,
        favoriteBookingType: 'dinner'
      }
    ],
    availableRewards: [
      {
        id: 'welcome-drink',
        title: 'Complimentary Welcome Drink',
        description: 'Get a free welcome drink on your next visit',
        pointsCost: 20,
        redeemed: false
      },
      {
        id: 'discount-15',
        title: '15% Off Next Booking',
        description: 'Get 15% off your next booking at any venue',
        pointsCost: 50,
        expiryDate: new Date(now.setMonth(now.getMonth() + 2)),
        redeemed: false
      }
    ],
    redeemedRewards: [],
    consecutiveBookings: 2
  };
};

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loyalty, setLoyalty] = useState<LoyaltyState>(() => {
    // Try to load from localStorage in a real app
    // For now, use mock data
    return createMockLoyaltyState();
  });

  // Determine the current tier based on points
  const getCurrentTier = () => {
    const tiers = Object.entries(LOYALTY_TIERS).reverse();
    for (const [tierKey, tierData] of tiers) {
      if (loyalty.currentPoints >= tierData.minPoints) {
        return { key: tierKey as keyof typeof LOYALTY_TIERS, ...tierData };
      }
    }
    return { key: 'BRONZE' as keyof typeof LOYALTY_TIERS, ...LOYALTY_TIERS.BRONZE };
  };

  // Current tier information
  const currentTier = LOYALTY_TIERS[loyalty.tier];

  // Determine the next tier
  const getNextTier = () => {
    const tiers = Object.entries(LOYALTY_TIERS);
    const currentTierIndex = tiers.findIndex(([key]) => key === loyalty.tier);
    
    if (currentTierIndex < tiers.length - 1) {
      const [nextTierKey, nextTierData] = tiers[currentTierIndex + 1];
      return { key: nextTierKey as keyof typeof LOYALTY_TIERS, ...nextTierData };
    }
    return null;
  };

  const nextTier = getNextTier();

  // Calculate points needed for next tier
  const pointsToNextTier = nextTier ? Math.max(0, nextTier.minPoints - loyalty.currentPoints) : 0;
  
  // Calculate progress percentage to next tier
  const calculateProgressToNextTier = () => {
    if (!nextTier) return 100; // Already at highest tier
    
    const currentTierPoints = LOYALTY_TIERS[loyalty.tier].minPoints;
    const nextTierPoints = nextTier.minPoints;
    const pointsRange = nextTierPoints - currentTierPoints;
    const userProgress = loyalty.currentPoints - currentTierPoints;
    
    return Math.min(100, Math.round((userProgress / pointsRange) * 100));
  };
  
  const progressToNextTier = calculateProgressToNextTier();

  // Add points to user's loyalty account
  const addLoyaltyPoints = (points: number, reason: string) => {
    setLoyalty(prev => {
      const newPoints = prev.currentPoints + points;
      const newLifetimePoints = prev.lifetimePoints + points;
      
      // Determine if user leveled up
      let newTier = prev.tier;
      const tiers = Object.entries(LOYALTY_TIERS).sort((a, b) => b[1].minPoints - a[1].minPoints);
      
      for (const [tierKey, tierData] of tiers) {
        if (newPoints >= tierData.minPoints) {
          newTier = tierKey as keyof typeof LOYALTY_TIERS;
          break;
        }
      }
      
      return {
        ...prev,
        currentPoints: newPoints,
        lifetimePoints: newLifetimePoints,
        tier: newTier
      };
    });
  };

  // Record a booking in the loyalty system
  const recordBooking = (venueId: string, venueName: string, amount: number, guestCount: number, bookingType: string) => {
    // Calculate points earned from this booking
    const basePoints = POINTS_SYSTEM.BOOKING;
    const guestPoints = guestCount * POINTS_SYSTEM.PER_PERSON;
    const spendPoints = Math.round(amount * POINTS_SYSTEM.PER_DOLLAR);
    
    // Check if this is a consecutive booking (within 30 days of last booking)
    let consecutiveBonus = 0;
    const now = new Date();
    if (loyalty.lastBookingDate) {
      const daysSinceLastBooking = Math.floor((now.getTime() - loyalty.lastBookingDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastBooking <= 30) {
        consecutiveBonus = POINTS_SYSTEM.CONSECUTIVE_BOOKING;
      }
    }
    
    const totalPointsEarned = basePoints + guestPoints + spendPoints + consecutiveBonus;
    
    // Update loyalty state
    setLoyalty(prev => {
      // Update venue stats
      const existingVenueIndex = prev.venueStats.findIndex(vs => vs.venueId === venueId);
      let updatedVenueStats = [...prev.venueStats];
      
      if (existingVenueIndex >= 0) {
        // Update existing venue
        updatedVenueStats[existingVenueIndex] = {
          ...updatedVenueStats[existingVenueIndex],
          visits: updatedVenueStats[existingVenueIndex].visits + 1,
          lastVisit: now,
          totalSpent: updatedVenueStats[existingVenueIndex].totalSpent + amount,
        };
      } else {
        // Add new venue
        updatedVenueStats.push({
          venueId,
          venueName,
          visits: 1,
          lastVisit: now,
          totalSpent: amount,
          favoriteBookingType: bookingType
        });
      }
      
      // Check for achievements
      const updatedAchievements = [...prev.achievements];
      
      // Example: Check if user has visited 3 different venues
      if (updatedVenueStats.length >= 3) {
        const venueExplorerAchievement = updatedAchievements.find(a => a.id === 'venue-explorer');
        if (venueExplorerAchievement && !venueExplorerAchievement.achieved) {
          const achievementIndex = updatedAchievements.findIndex(a => a.id === 'venue-explorer');
          updatedAchievements[achievementIndex] = {
            ...venueExplorerAchievement,
            achieved: true,
            date: now
          };
          
          // Add the achievement points to total points earned
          totalPointsEarned += venueExplorerAchievement.points;
        }
      }
      
      // Update the loyalty state with new points and data
      const newPoints = prev.currentPoints + totalPointsEarned;
      const newLifetimePoints = prev.lifetimePoints + totalPointsEarned;
      
      // Determine if user leveled up
      let newTier = prev.tier;
      const tiers = Object.entries(LOYALTY_TIERS).sort((a, b) => b[1].minPoints - a[1].minPoints);
      
      for (const [tierKey, tierData] of tiers) {
        if (newPoints >= tierData.minPoints) {
          newTier = tierKey as keyof typeof LOYALTY_TIERS;
          break;
        }
      }
      
      return {
        ...prev,
        currentPoints: newPoints,
        lifetimePoints: newLifetimePoints,
        tier: newTier,
        lastBookingDate: now,
        consecutiveBookings: prev.lastBookingDate ? 
          (now.getTime() - prev.lastBookingDate.getTime()) / (1000 * 60 * 60 * 24) <= 30 ?
          prev.consecutiveBookings + 1 : 1 : 1,
        achievements: updatedAchievements,
        venueStats: updatedVenueStats
      };
    });
    
    return totalPointsEarned;
  };

  // Redeem a loyalty reward
  const redeemReward = (rewardId: string) => {
    setLoyalty(prev => {
      const reward = prev.availableRewards.find(r => r.id === rewardId);
      if (!reward || reward.redeemed || prev.currentPoints < reward.pointsCost) {
        return prev; // Cannot redeem
      }
      
      // Generate a unique code for the reward
      const rewardWithCode = {
        ...reward,
        redeemed: true,
        code: `LYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };
      
      return {
        ...prev,
        currentPoints: prev.currentPoints - reward.pointsCost,
        availableRewards: prev.availableRewards.filter(r => r.id !== rewardId),
        redeemedRewards: [...prev.redeemedRewards, rewardWithCode]
      };
    });
  };

  // Get discount based on loyalty tier
  const getLoyaltyDiscount = () => {
    return LOYALTY_TIERS[loyalty.tier].discountRate;
  };

  // Reset loyalty (for testing)
  const resetLoyalty = () => {
    setLoyalty(createMockLoyaltyState());
  };

  // Save loyalty data when it changes (in a real app would save to backend)
  useEffect(() => {
    // In a real app, you might sync with a backend here
    console.log('Loyalty updated:', loyalty);
  }, [loyalty]);

  return (
    <LoyaltyContext.Provider value={{
      loyalty,
      currentTier,
      nextTier,
      pointsToNextTier,
      progressToNextTier,
      addLoyaltyPoints,
      recordBooking,
      redeemReward,
      getLoyaltyDiscount,
      resetLoyalty
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
