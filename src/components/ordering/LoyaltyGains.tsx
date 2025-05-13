
import React from 'react';
import { motion } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoyaltyGains: React.FC = () => {
  const { pointsEarned } = useOrder();
  const { loyalty, currentTier, nextTier, pointsToNextTier, progressToNextTier } = useLoyalty();
  
  // Calculate new progress after this order
  const newPoints = loyalty.currentPoints + pointsEarned;
  const newProgress = nextTier 
    ? Math.min(100, Math.round(((newPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100;
  
  // Calculate if the user will level up with this order
  const willLevelUp = nextTier && newPoints >= nextTier.minPoints;
  
  return (
    <motion.div 
      className="bg-white/5 border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-2">
        <Star className="h-4 w-4 text-burntOrange mr-1" />
        <h3 className="font-medium text-sm">Loyalty Reward</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold flex items-center">
            +{pointsEarned} points
            {willLevelUp && (
              <Badge className="ml-2 bg-burntOrange text-white border-0">Level Up!</Badge>
            )}
          </p>
          <p className="text-xs text-white/60">with this order</p>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-white/60 mb-1">
            {willLevelUp 
              ? `You'll reach ${nextTier?.name}!` 
              : nextTier 
                ? `${pointsToNextTier - pointsEarned > 0 ? pointsToNextTier - pointsEarned : 0} more to ${nextTier.name}`
                : 'Max tier reached'
            }
          </div>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="relative w-full h-full">
              {/* Current progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                style={{ width: `${progressToNextTier}%` }}
              />
              {/* New progress */}
              <motion.div 
                className="absolute top-0 left-0 h-full bg-burntOrange rounded-full"
                initial={{ width: `${progressToNextTier}%` }}
                animate={{ width: `${newProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyGains;
