
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '@/context/LoyaltyContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from "lucide-react";
import { formatCurrency } from '@/utils/formatters';

type LoyaltyCardProps = {
  showDetails?: boolean;
  compact?: boolean;
  onFlip?: () => void;
};

const cardVariants = {
  front: { 
    rotateY: 0,
    transition: { duration: 0.5 }
  },
  back: { 
    rotateY: 180,
    transition: { duration: 0.5 }
  }
};

const contentVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.5 }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.5 }
  }
};

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ 
  showDetails = false,
  compact = false,
  onFlip 
}) => {
  const { 
    loyalty, 
    currentTier, 
    nextTier, 
    pointsToNextTier, 
    progressToNextTier 
  } = useLoyalty();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatePoints, setAnimatePoints] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  // Animate points when they change
  useEffect(() => {
    setAnimatePoints(true);
    const timer = setTimeout(() => setAnimatePoints(false), 1000);
    return () => clearTimeout(timer);
  }, [loyalty.currentPoints]);

  // Generate gradient based on tier
  const generateGradient = () => {
    switch (loyalty.tier) {
      case 'BRONZE':
        return 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900';
      case 'SILVER':
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
      case 'GOLD':
        return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600';
      case 'PLATINUM':
        return 'bg-gradient-to-br from-[#914110] via-[#B25121] to-[#D36231]';
      default:
        return 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900';
    }
  };

  const cardHeight = compact ? 'h-32' : 'h-56';
  const cardWidth = compact ? 'w-full max-w-xs' : 'w-full max-w-md';

  // Add holographic effect
  const holoClasses = "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:blur-sm before:animate-holo";

  return (
    <div className={`perspective-1000 ${cardWidth} mx-auto`}>
      <motion.div 
        className={`relative ${cardHeight} w-full`}
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <AnimatePresence mode="wait">
          {!isFlipped && (
            <motion.div
              className={`absolute inset-0 ${generateGradient()} rounded-xl p-5 shadow-xl overflow-hidden ${holoClasses} backdrop-blur-sm backdrop-filter border border-white/20`}
              variants={contentVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
              
              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <Badge className="h-4 w-4 text-white mr-1" />
                      <p className="text-xs font-light uppercase tracking-wider text-white/80">Loyalty Program</p>
                    </div>
                    {!compact && (
                      <h3 className="font-bold text-white text-xl mb-1">{loyalty.displayName}</h3>
                    )}
                    <div className="flex items-center">
                      <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                        {currentTier.name} Member
                      </span>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="text-right"
                    initial={{ scale: 1 }}
                    animate={{ scale: animatePoints ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-white/90 text-xs">POINTS</p>
                    <p className="text-white font-bold text-2xl">{loyalty.currentPoints}</p>
                  </motion.div>
                </div>
                
                {!compact && (
                  <div className="my-4">
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                      <span>Progress to {nextTier ? nextTier.name : 'Max Level'}</span>
                      {nextTier && <span>{pointsToNextTier} points needed</span>}
                    </div>
                    <Progress 
                      value={progressToNextTier} 
                      className="h-1.5 bg-white/20" 
                      indicatorColor="bg-white" 
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-end">
                  <div className={`${compact ? 'text-xs' : 'text-sm'} text-white/90`}>
                    <p>Member since {loyalty.joinedDate.toLocaleDateString()}</p>
                    {!compact && nextTier && (
                      <p className="text-xs mt-1">Tap to see benefits</p>
                    )}
                  </div>
                  
                  {!compact && (
                    <div className="text-white/80 text-xs flex items-center">
                      <span className="mr-1">{loyalty.consecutiveBookings} consecutive visits</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Back of card */}
          {isFlipped && (
            <motion.div
              className={`absolute inset-0 ${generateGradient()} rounded-xl p-5 shadow-xl overflow-hidden ${holoClasses} backdrop-blur-sm backdrop-filter border border-white/20`}
              style={{ transform: "rotateY(180deg)" }}
              variants={contentVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-xl -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-xl -mr-10 -mb-10"></div>
              
              <div className="relative h-full flex flex-col justify-between z-10">
                <div>
                  <h3 className="font-bold text-white text-lg mb-3">{currentTier.name} Benefits</h3>
                  <ul className="space-y-1.5">
                    {currentTier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1 h-1 bg-white rounded-full mt-1.5 mr-2"></span>
                        <span className="text-sm text-white/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {nextTier && (
                  <div className="mt-4">
                    <p className="text-white/80 text-xs mb-1">Next tier preview</p>
                    <h4 className="font-medium text-white/90 text-sm mb-2">{nextTier.name}</h4>
                    <div className="flex items-center text-xs text-white/70">
                      <span className="inline-block w-1 h-1 bg-white/70 rounded-full mr-2"></span>
                      <span>{nextTier.benefits[0]}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-2 italic">
                      {pointsToNextTier} more points to unlock
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoyaltyCard;
