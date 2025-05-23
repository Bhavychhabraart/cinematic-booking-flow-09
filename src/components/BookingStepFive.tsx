import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Receipt, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { format } from 'date-fns';
import { toast } from "@/components/ui/sonner";
import { vibrate, vibrationPatterns, playSound, sounds } from '@/utils/feedback';
import { formatCurrency, generateVoucherCode } from '@/utils/formatters';
import LoyaltyPointsEarned from './LoyaltyPointsEarned';

const generateQR = (data: string) => {
  // Mock function to "generate" a QR code
  // In a real application, you would use a library like qrcode.react
  const size = 200;
  const qrCodeSize = 10;
  const qrData = [];
  
  // Simple algorithm to create a QR-like pattern based on the data string
  for (let i = 0; i < qrCodeSize; i++) {
    const row = [];
    for (let j = 0; j < qrCodeSize; j++) {
      // Use the characters from the data to determine if a cell is filled
      const charIndex = (i * qrCodeSize + j) % data.length;
      const charCode = data.charCodeAt(charIndex);
      row.push(charCode % 2 === 0);
    }
    qrData.push(row);
  }
  
  // Fixed patterns for QR code corners
  // Top-left corner pattern
  qrData[0][0] = true;
  qrData[0][1] = true;
  qrData[0][2] = true;
  qrData[1][0] = true;
  qrData[1][2] = true;
  qrData[2][0] = true;
  qrData[2][1] = true;
  qrData[2][2] = true;
  
  // Top-right corner pattern
  qrData[0][qrCodeSize-3] = true;
  qrData[0][qrCodeSize-2] = true;
  qrData[0][qrCodeSize-1] = true;
  qrData[1][qrCodeSize-3] = true;
  qrData[1][qrCodeSize-1] = true;
  qrData[2][qrCodeSize-3] = true;
  qrData[2][qrCodeSize-2] = true;
  qrData[2][qrCodeSize-1] = true;
  
  // Bottom-left corner pattern
  qrData[qrCodeSize-3][0] = true;
  qrData[qrCodeSize-3][1] = true;
  qrData[qrCodeSize-3][2] = true;
  qrData[qrCodeSize-2][0] = true;
  qrData[qrCodeSize-2][2] = true;
  qrData[qrCodeSize-1][0] = true;
  qrData[qrCodeSize-1][1] = true;
  qrData[qrCodeSize-1][2] = true;

  return { qrData, size, cellSize: size / qrCodeSize };
};

const Bubble = ({ delay }: { delay: number }) => {
  const xPos = Math.random() * 100;
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0, x: xPos }}
      animate={{ 
        y: -100, 
        opacity: [0, 1, 0],
        x: xPos + (Math.random() * 20 - 10)
      }}
      transition={{ 
        duration: 2 + Math.random() * 2, 
        delay, 
        ease: "easeOut" 
      }}
      className="absolute bottom-0 w-3 h-3 rounded-full bg-gold/30"
    />
  );
};

interface Voucher {
  code: string;
  discountAmount: number;
  expiryDate: Date;
}

const BookingStepFive: React.FC = () => {
  const navigate = useNavigate();
  const { venueName } = useParams();
  const { booking, resetBooking, getPriceBreakdown } = useBooking();
  const { recordBooking, loyalty } = useLoyalty();
  
  const [bubbles, setBubbles] = useState<number[]>([]);
  const [qrCode, setQrCode] = useState<{ qrData: boolean[][]; size: number; cellSize: number } | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  const { total, appliedCoupon } = getPriceBreakdown();
  
  const getBookingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      lunch: "Lunch Table",
      dinner: "Dinner Table",
      guestlist: "Guest List Entry",
      vip_standing: "VIP Standing Table",
      vip_couch: "VIP Couch Table",
      event: "Event Tickets",
      private: "Private Event",
      daypass: "Day Pass"
    };
    return types[type] || type;
  };
  
  useEffect(() => {
    // Play victory sound and vibration when component mounts
    playSound(sounds.victory);
    vibrate(vibrationPatterns.success);
    
    // Record the booking in the loyalty system and get points earned
    if (venueName) {
      const pointsEarned = recordBooking(
        venueName,
        venueName,
        total,
        booking.guestCount,
        booking.bookingType
      );
      
      setEarnedPoints(pointsEarned);
    }
    
    const intervalId = setInterval(() => {
      setBubbles(prev => [...prev, Date.now()]);
    }, 300);
    
    if (booking.date && booking.time) {
      const bookingData = `BOOKING:${venueName}:${booking.bookingType}:${format(booking.date, 'yyyyMMdd')}:${booking.time}:${booking.guestCount}:${Date.now().toString(36)}`;
      setQrCode(generateQR(bookingData));
    }
    
    // Generate 5 vouchers for future visits
    const newVouchers: Voucher[] = [];
    const discounts = [10, 15, 20, 25, 30]; // Percentage discounts
    
    // Create expiry date (3 months from now)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    
    // Generate vouchers
    for (let i = 0; i < 5; i++) {
      newVouchers.push({
        code: generateVoucherCode(),
        discountAmount: discounts[i],
        expiryDate: new Date(expiryDate)
      });
    }
    
    setVouchers(newVouchers);
    
    // Show vouchers after a short delay to focus on booking confirmation first
    setTimeout(() => {
      setShowVouchers(true);
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, [booking, venueName, total, recordBooking]);
  
  const handleDownloadQR = () => {
    // Add haptic feedback
    vibrate(vibrationPatterns.buttonPress);
    
    // In a real application, you would generate and download an actual QR code
    toast.success("Booking QR code saved to your device");
  };
  
  const handleCopyVoucher = (voucherCode: string) => {
    // Copy voucher code to clipboard
    navigator.clipboard.writeText(voucherCode);
    vibrate(vibrationPatterns.subtle);
    toast.success("Voucher code copied to clipboard!");
  };
  
  const handleDone = () => {
    // Add haptic feedback
    vibrate(vibrationPatterns.buttonPress);
    
    resetBooking();
    navigate(`/venues/${venueName}`);
  };
  
  const handleViewLoyalty = () => {
    resetBooking();
    navigate(`/loyalty/${venueName}`);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container-center text-center py-8 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 0.2
        }}
        className="mb-6 flex justify-center"
      >
        <CheckCircle size={60} className="text-[#914110]" />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-4 tracking-widest"
      >
        Booking Confirmed!
      </motion.h2>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-6 max-w-xs mx-auto"
      >
        <p className="text-white/80 mb-2">
          Your {getBookingTypeLabel(booking.bookingType)} for {booking.guestCount} {booking.guestCount === 1 ? 'person' : 'people'} on {booking.date ? format(booking.date, 'MMMM d') : ''} at {booking.time} has been confirmed.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-center mt-4 mb-2"
        >
          <Receipt className="h-4 w-4 mr-1 text-[#914110]" />
          <span className="text-lg font-medium">{formatCurrency(total)}</span>
          {appliedCoupon && (
            <span className="ml-2 text-xs bg-[#914110]/10 text-[#914110] px-2 py-0.5 rounded-full">
              {appliedCoupon.discountType === 'percentage' 
                ? `${appliedCoupon.discountValue}% OFF` 
                : `${formatCurrency(appliedCoupon.discountValue)} OFF`}
            </span>
          )}
        </motion.div>
      </motion.div>
      
      {/* Loyalty Points Earned */}
      {earnedPoints > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-6"
        >
          <LoyaltyPointsEarned 
            points={earnedPoints} 
            newTotal={loyalty.currentPoints}
            message="You earned loyalty points!"
          />
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 border-[#914110]/50 text-[#914110] hover:bg-[#914110]/5"
            onClick={handleViewLoyalty}
          >
            View Loyalty Dashboard
          </Button>
        </motion.div>
      )}
      
      {/* QR Code */}
      {qrCode && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="bg-white p-4 rounded-lg mb-2 mx-auto">
            <div 
              className="relative" 
              style={{ 
                width: qrCode.size, 
                height: qrCode.size,
                backgroundColor: "white",
              }}
            >
              {qrCode.qrData.map((row, i) => 
                row.map((cell, j) => 
                  cell && (
                    <div 
                      key={`${i}-${j}`} 
                      style={{
                        position: 'absolute',
                        left: j * qrCode.cellSize,
                        top: i * qrCode.cellSize,
                        width: qrCode.cellSize,
                        height: qrCode.cellSize,
                        backgroundColor: 'black',
                      }}
                    />
                  )
                )
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#914110] border-[#914110]/50 hover:bg-[#914110]/5"
            onClick={handleDownloadQR}
          >
            <Download size={16} className="mr-1" />
            Download QR Code
          </Button>
        </motion.div>
      )}
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-white/60 text-sm mb-6"
      >
        A confirmation email with your booking details has been sent to your email address.
      </motion.p>
      
      {/* Vouchers Section */}
      {showVouchers && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mb-8 max-w-xs mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-3 text-[#914110]">
            <Gift className="h-5 w-5" />
            <h3 className="font-medium">Your VIP Vouchers</h3>
          </div>
          
          <p className="text-white/70 text-sm mb-4">
            We've added 5 special vouchers to your account. Use them on your next visits!
          </p>
          
          <div className="space-y-2">
            {vouchers.map((voucher, index) => (
              <motion.div 
                key={voucher.code}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.8 + (index * 0.1) }}
                className="flex items-center justify-between bg-gradient-to-r from-[#151515] to-[#1f1f1f] p-3 rounded-lg border border-[#914110]/20 text-left"
                onClick={() => handleCopyVoucher(voucher.code)}
              >
                <div>
                  <div className="font-mono text-sm text-white/90">{voucher.code}</div>
                  <div className="text-xs text-white/60">
                    Expires: {format(voucher.expiryDate, 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="text-[#914110] font-medium">
                  {voucher.discountAmount}% OFF
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-2">
            Click on a voucher to copy its code
          </p>
        </motion.div>
      )}
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: showVouchers ? 2.2 : 1.6 }}
      >
        <Button onClick={handleDone} className="booking-button">
          Done
        </Button>
      </motion.div>
      
      {/* Animated bubbles effect */}
      {bubbles.slice(-20).map((id, i) => (
        <Bubble key={id} delay={i * 0.1} />
      ))}
    </motion.div>
  );
};

export default BookingStepFive;
