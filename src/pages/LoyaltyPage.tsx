
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import LoyaltyDashboard from '@/components/LoyaltyDashboard';

const LoyaltyPage: React.FC = () => {
  const { venueName } = useParams();
  
  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Header with back button */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            asChild
          >
            <Link to={venueName ? `/venues/${venueName}` : '/'}>
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoyaltyDashboard />
      </motion.div>
    </div>
  );
};

export default LoyaltyPage;
