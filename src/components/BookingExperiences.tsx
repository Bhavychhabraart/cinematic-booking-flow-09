
import React from 'react';
import { useBooking, Experience } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Plus, Clock } from 'lucide-react';
import { provideFeedback } from '@/utils/feedback';
import { toast } from "@/components/ui/sonner";

const BookingExperiences: React.FC = () => {
  const { 
    booking, 
    nextStep, 
    prevStep, 
    addExperience, 
    removeExperience,
    getFilteredExperiences 
  } = useBooking();
  
  const availableExperiences = getFilteredExperiences();

  const handleToggleExperience = (experienceId: string) => {
    if (booking.selectedExperiences.includes(experienceId)) {
      removeExperience(experienceId);
      provideFeedback('buttonPress');
    } else {
      addExperience(experienceId);
      provideFeedback('selection', '/sounds/select.mp3');
      
      // Show toast for added item
      const experience = availableExperiences.find(e => e.id === experienceId);
      if (experience) {
        toast.success(`Added: ${experience.name}`, {
          description: `$${experience.price.toFixed(2)} - ${experience.duration}`,
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
      <h2 className="text-center mb-8 tracking-widest">Exclusive Experiences</h2>
      
      <p className="text-center text-white/70 mb-8">
        Elevate your visit with these unique offerings curated by our team
      </p>
      
      {availableExperiences.length === 0 ? (
        <div className="text-center text-white/60 my-8 p-6 border border-white/10 rounded-md">
          No experiences available for this booking type
        </div>
      ) : (
        <div className="space-y-6 mb-10 px-4">
          {availableExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-lg border ${
                booking.selectedExperiences.includes(experience.id) 
                  ? 'border-gold' 
                  : 'border-white/20'
              }`}
            >
              {/* Popular badge */}
              {experience.popular && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 z-10 bg-gold text-black text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  Popular Choice
                </motion.span>
              )}
              
              {/* Image placeholder - In a real app, this would be a real image */}
              <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
                <span className="text-white/40">Experience Image</span>
              </div>
              
              <div className="p-4 bg-black/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-lg">{experience.name}</h3>
                  <span className="text-gold font-medium">${experience.price.toFixed(2)}</span>
                </div>
                
                {experience.duration && (
                  <div className="flex items-center text-sm text-white/60 mb-2">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{experience.duration}</span>
                  </div>
                )}
                
                <p className="text-sm text-white/70 mb-4">{experience.description}</p>
                
                <Button
                  className={`w-full ${
                    booking.selectedExperiences.includes(experience.id) 
                      ? 'bg-gold text-black hover:bg-gold/80' 
                      : 'border border-gold/60 bg-transparent hover:bg-gold/10'
                  }`}
                  onClick={() => handleToggleExperience(experience.id)}
                >
                  {booking.selectedExperiences.includes(experience.id) ? (
                    <><Check className="mr-2 h-4 w-4" /> Selected</>
                  ) : (
                    <><Plus className="mr-2 h-4 w-4" /> Add This Experience</>
                  )}
                </Button>
              </div>
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
          {booking.selectedExperiences.length > 0 ? 'Continue' : 'Skip Experiences'}
        </Button>
      </div>
      
      {booking.selectedExperiences.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-gold text-sm">
            {booking.selectedExperiences.length} {booking.selectedExperiences.length === 1 ? 'experience' : 'experiences'} selected
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingExperiences;
