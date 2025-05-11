
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking, Coupon } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/sonner";
import { provideFeedback } from '@/utils/feedback';
import { formatCurrency } from '@/utils/formatters';
import { WalletCards, BadgePercent, Receipt } from 'lucide-react';

const BookingSummary: React.FC = () => {
  const { 
    booking, 
    availableCoupons, 
    getPriceBreakdown,
    applyCoupon, 
    removeCoupon,
    getValidCoupons 
  } = useBooking();
  
  const [couponCode, setCouponCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    subtotal, 
    addOnsTotal, 
    experiencesTotal, 
    basePrice, 
    discount, 
    total,
    appliedCoupon 
  } = getPriceBreakdown();
  
  const validCoupons = getValidCoupons();
  
  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    
    if (!coupon) {
      toast.error("Invalid coupon code");
      provideFeedback('error');
      return;
    }
    
    // Check if coupon is valid for this booking type
    if (!coupon.validBookingTypes.includes(booking.bookingType)) {
      toast.error(`This coupon is not valid for ${booking.bookingType.replace('_', ' ')} bookings`);
      provideFeedback('error');
      return;
    }
    
    // Check if meets minimum spend requirement
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      toast.error(`This coupon requires a minimum spend of ${formatCurrency(coupon.minSpend)}`);
      provideFeedback('error');
      return;
    }
    
    // Apply the coupon
    applyCoupon(coupon.id);
    setCouponCode('');
    toast.success("Coupon applied successfully!");
    provideFeedback('confirm', '/sounds/success.mp3');
  };
  
  const handleRemoveCoupon = () => {
    removeCoupon();
    provideFeedback('buttonPress');
    toast.success("Coupon removed");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 border border-white/10 rounded-lg overflow-hidden"
    >
      <div className="bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-[#914110]" />
            <h3 className="text-lg font-medium">Booking Summary</h3>
          </div>
          <div className="text-lg font-semibold">
            {formatCurrency(total)}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-white/60 mt-1 p-0 h-auto hover:bg-transparent hover:text-white"
        >
          {isExpanded ? "Hide details" : "Show details"}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2 text-sm">
            {basePrice > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Base price ({booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'})</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
            )}
            
            {addOnsTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Add-ons ({booking.addOns.length})</span>
                <span>{formatCurrency(addOnsTotal)}</span>
              </div>
            )}
            
            {experiencesTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Experiences ({booking.selectedExperiences.length})</span>
                <span>{formatCurrency(experiencesTotal)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium pt-2 border-t border-white/10">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-[#914110]">
                <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          {/* Coupon section */}
          <div className="mt-4 pt-4 border-t border-white/10">
            {appliedCoupon ? (
              <div className="bg-[#914110]/10 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BadgePercent className="h-4 w-4 mr-2 text-[#914110]" />
                      <span className="font-medium">{appliedCoupon.code}</span>
                    </div>
                    <p className="text-xs text-white/70 mt-1">{appliedCoupon.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="text-xs h-8"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-transparent border-white/20"
                    />
                  </div>
                  <Button 
                    onClick={handleApplyCoupon}
                    variant="outline"
                    className="border-[#914110] text-[#914110] hover:bg-[#914110]/10"
                  >
                    Apply
                  </Button>
                </div>
                
                {validCoupons.length > 0 && (
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="coupons" className="border-white/10">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-sm">
                          <WalletCards className="h-4 w-4 mr-2 text-[#914110]" />
                          <span>{validCoupons.length} available coupon{validCoupons.length !== 1 ? 's' : ''}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {validCoupons.map(coupon => (
                            <div 
                              key={coupon.id} 
                              className="border border-dashed border-white/20 rounded p-2 text-sm"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium">{coupon.code}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    applyCoupon(coupon.id);
                                    provideFeedback('selection');
                                  }}
                                  className="h-6 text-xs text-[#914110]"
                                >
                                  Apply
                                </Button>
                              </div>
                              <p className="text-xs text-white/70">{coupon.description}</p>
                              <p className="text-xs text-white/70 mt-1">
                                {coupon.discountType === 'percentage' 
                                  ? `${coupon.discountValue}% off` 
                                  : `${formatCurrency(coupon.discountValue)} off`}
                                {coupon.minSpend && ` (Min. spend: ${formatCurrency(coupon.minSpend)})`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookingSummary;
