
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLoyalty } from '@/context/LoyaltyContext';
import LoyaltyCard from './LoyaltyCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

type LoyaltyPreviewProps = {
  venueName?: string;
  compact?: boolean;
};

const LoyaltyPreview: React.FC<LoyaltyPreviewProps> = ({ 
  venueName,
  compact = false
}) => {
  const { 
    loyalty, 
    currentTier,
    nextTier,
    pointsToNextTier,
    progressToNextTier
  } = useLoyalty();
  
  const navigate = useNavigate();
  
  const handleViewLoyalty = () => {
    navigate(`/loyalty${venueName ? `/${venueName}` : ''}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-black/20 backdrop-blur-sm rounded-xl p-4 ${compact ? 'max-w-sm mx-auto' : 'w-full'}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-5 w-5 text-[#914110]" />
        <h3 className="font-medium tracking-wide">Loyalty Program</h3>
      </div>
      
      {/* Preview of the loyalty card */}
      <div className="mb-4">
        <LoyaltyCard compact />
      </div>
      
      {/* Progress to next tier */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>{currentTier.name}</span>
          {nextTier && <span>{nextTier.name}</span>}
        </div>
        <Progress value={progressToNextTier} className="h-1.5" />
        {nextTier && (
          <p className="text-xs text-white/70 mt-1 text-right">
            {pointsToNextTier} more points to {nextTier.name}
          </p>
        )}
      </div>
      
      {/* Key benefits */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Current benefits:</p>
        <ul className="text-xs text-white/80 space-y-1">
          {currentTier.benefits.slice(0, 2).map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-1 h-1 bg-white/80 rounded-full mt-1.5 mr-2"></span>
              <span>{benefit}</span>
            </li>
          ))}
          {currentTier.benefits.length > 2 && (
            <li className="text-xs text-white/60">+ {currentTier.benefits.length - 2} more benefits</li>
          )}
        </ul>
      </div>
      
      <Button 
        onClick={handleViewLoyalty}
        className="w-full bg-[#914110] hover:bg-[#a14d1d] text-white"
      >
        View Loyalty Dashboard
      </Button>
    </motion.div>
  );
};

export default LoyaltyPreview;
