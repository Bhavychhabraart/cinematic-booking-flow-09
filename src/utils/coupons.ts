
/**
 * Utility functions for managing venue coupons
 */

// Generate a unique coupon ID based on drink type and current date
export function generateCouponId(drinkType: string): string {
  const date = new Date();
  const timestamp = date.getTime();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // First characters of the drink type
  const prefix = drinkType.substring(0, 2).toUpperCase();
  
  // Format date as YYMMDD
  const dateStr = date.getFullYear().toString().substring(2) + 
    (date.getMonth() + 1).toString().padStart(2, '0') + 
    date.getDate().toString().padStart(2, '0');
  
  return `${prefix}-${dateStr}-${randomPart}`;
}

// Store for tracking coupon redemptions (in a real app, this would be in a database)
const phoneRedemptions: Record<string, { count: number, date: string }> = {};

// Check if a phone number has already claimed coupons today
export function hasClaimedToday(phoneNumber: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  
  if (
    phoneRedemptions[phoneNumber] && 
    phoneRedemptions[phoneNumber].date === today &&
    phoneRedemptions[phoneNumber].count >= 3
  ) {
    return true;
  }
  
  return false;
}

// Record a coupon claim for a phone number
export function recordCouponClaim(phoneNumber: string): void {
  const today = new Date().toISOString().split('T')[0];
  
  if (!phoneRedemptions[phoneNumber]) {
    // First time claim today
    phoneRedemptions[phoneNumber] = {
      count: 1,
      date: today
    };
    console.log(`First claim for ${phoneNumber}: ${phoneRedemptions[phoneNumber].count} coupon on ${today}`);
  } else if (phoneRedemptions[phoneNumber].date === today) {
    // Add to existing count for today
    phoneRedemptions[phoneNumber].count += 1;
    console.log(`Additional claim for ${phoneNumber}: now has ${phoneRedemptions[phoneNumber].count} coupons on ${today}`);
  } else {
    // New day, reset count
    phoneRedemptions[phoneNumber] = {
      count: 1,
      date: today
    };
    console.log(`New day claim for ${phoneNumber}: ${phoneRedemptions[phoneNumber].count} coupon on ${today}`);
  }
}

// Get remaining coupons for a user today
export function getRemainingCoupons(phoneNumber: string): number {
  const today = new Date().toISOString().split('T')[0];
  
  if (phoneRedemptions[phoneNumber] && phoneRedemptions[phoneNumber].date === today) {
    // For this demo, we limit to 3 per day
    return Math.max(0, 3 - phoneRedemptions[phoneNumber].count);
  }
  
  return 3; // Default max
}
