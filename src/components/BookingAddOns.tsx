
import React from 'react';
import { useBooking, AddOn } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { provideFeedback } from '@/utils/feedback';
import { toast } from "@/components/ui/sonner";

const BookingAddOns: React.FC = () => {
  const { 
    booking, 
    nextStep, 
    prevStep, 
    addAddon, 
    removeAddon,
    getFilteredAddOns 
  } = useBooking();
  
  const availableAddOns = getFilteredAddOns();

  const handleToggleAddon = (addonId: string) => {
    if (booking.addOns.includes(addonId)) {
      removeAddon(addonId);
      provideFeedback('buttonPress');
    } else {
      addAddon(addonId);
      provideFeedback('addToCart', '/sounds/addcart.mp3');
      
      // Show toast for added item
      const addon = availableAddOns.find(a => a.id === addonId);
      if (addon) {
        toast.success(`Added: ${addon.name}`, {
          description: `$${addon.price.toFixed(2)} - ${addon.description.substring(0, 40)}...`,
          duration: 2000,
        });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center py-10"
    >
      <h2 className="text-center mb-8 tracking-widest">Enhance Your Experience</h2>
      
      <p className="text-center text-white/70 mb-8">
        Select from our premium add-ons to make your visit even more special
      </p>
      
      {availableAddOns.length === 0 ? (
        <div className="text-center text-white/60 my-8 p-6 border border-white/10 rounded-md">
          No add-ons available for this booking type
        </div>
      ) : (
        <div className="space-y-4 mb-10 px-4">
          {availableAddOns.map((addon, index) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center p-4 border rounded-lg ${
                booking.addOns.includes(addon.id) 
                  ? 'border-gold bg-gold/10' 
                  : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-lg">{addon.name}</h3>
                  <span className="text-gold font-medium">${addon.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-white/70">{addon.description}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className={`ml-4 rounded-full ${
                  booking.addOns.includes(addon.id) 
                    ? 'bg-gold text-black hover:bg-gold/80' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => handleToggleAddon(addon.id)}
              >
                {booking.addOns.includes(addon.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>

              {/* Popular badge */}
              {addon.popular && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gold text-black text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  Popular Choice
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between px-4">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="font-medium tracking-wide"
          onMouseDown={() => provideFeedback('buttonPress')}
        >
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="booking-button"
          onMouseDown={() => provideFeedback('navigation')}
        >
          {booking.addOns.length > 0 ? 'Continue with Add-ons' : 'Skip Add-ons'}
        </Button>
      </div>
      
      {booking.addOns.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-gold text-sm">
            {booking.addOns.length} {booking.addOns.length === 1 ? 'item' : 'items'} added
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingAddOns;
