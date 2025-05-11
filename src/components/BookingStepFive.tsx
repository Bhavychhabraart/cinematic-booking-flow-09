
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';
import { toast } from "@/components/ui/sonner";
import { vibrate, vibrationPatterns, playSound, sounds } from '@/utils/feedback';

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

const BookingStepFive: React.FC = () => {
  const navigate = useNavigate();
  const { venueName } = useParams();
  const { booking, resetBooking } = useBooking();
  const [bubbles, setBubbles] = useState<number[]>([]);
  const [qrCode, setQrCode] = useState<{ qrData: boolean[][]; size: number; cellSize: number } | null>(null);
  
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
    
    const intervalId = setInterval(() => {
      setBubbles(prev => [...prev, Date.now()]);
    }, 300);
    
    if (booking.date && booking.time) {
      const bookingData = `BOOKING:${venueName}:${booking.bookingType}:${format(booking.date, 'yyyyMMdd')}:${booking.time}:${booking.guestCount}:${Date.now().toString(36)}`;
      setQrCode(generateQR(bookingData));
    }
    
    return () => clearInterval(intervalId);
  }, [booking, venueName]);
  
  const handleDownloadQR = () => {
    // Add haptic feedback
    vibrate(vibrationPatterns.buttonPress);
    
    // In a real application, you would generate and download an actual QR code
    toast.success("Booking QR code saved to your device");
  };
  
  const handleDone = () => {
    // Add haptic feedback
    vibrate(vibrationPatterns.buttonPress);
    
    resetBooking();
    navigate(`/venues/${venueName}`);
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
        <CheckCircle size={60} className="text-gold" />
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
      </motion.div>
      
      {/* QR Code */}
      {qrCode && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 }}
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
            className="text-gold border-gold/50 hover:bg-gold/5"
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
        transition={{ delay: 1.4 }}
        className="text-white/60 text-sm mb-8"
      >
        A confirmation email with your booking details has been sent to your email address.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
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
