
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

type LoyaltyPointsEarnedProps = {
  points: number;
  newTotal: number;
  message?: string;
};

const LoyaltyPointsEarned: React.FC<LoyaltyPointsEarnedProps> = ({ 
  points, 
  newTotal,
  message = "You earned loyalty points!" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      className="bg-[#914110]/10 border border-[#914110]/30 rounded-lg p-4 text-center"
    >
      <div className="flex justify-center mb-2">
        <div className="bg-[#914110]/20 p-2 rounded-full">
          <Star className="h-6 w-6 text-[#914110]" />
        </div>
      </div>
      
      <h4 className="font-medium text-lg mb-1">{message}</h4>
      
      <div className="flex items-center justify-center gap-3 mb-2">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-[#914110] font-bold text-3xl"
        >
          +{points}
        </motion.div>
        <span className="text-white/70">loyalty points</span>
      </div>
      
      <p className="text-sm text-white/80">
        Your new balance: <span className="font-medium">{newTotal} points</span>
      </p>
    </motion.div>
  );
};

export default LoyaltyPointsEarned;
