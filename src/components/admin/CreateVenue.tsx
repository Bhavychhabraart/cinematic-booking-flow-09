
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import VenueForm from './VenueForm';
import { venues } from '@/data/venues';

type CreateVenueProps = {
  onBack: () => void;
};

const CreateVenue = ({ onBack }: CreateVenueProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (data: any) => {
    // In a real application, this would make an API call to save the venue
    console.log('Venue data submitted:', data);
    
    // For now, just show a success message and redirect
    toast({
      title: "Venue Created",
      description: `${data.name} has been successfully created.`,
    });
    
    // Go back to the venues list
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-xl font-medium tracking-wide">Create New Venue</h2>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-md p-6">
        <VenueForm onSubmit={handleSubmit} />
      </div>
    </motion.div>
  );
};

export default CreateVenue;
