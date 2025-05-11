
import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { provideFeedback } from '@/utils/feedback';

const formSchema = z.object({
  tableLocation: z.string(),
  specialOccasion: z.string().optional(),
  additionalNotes: z.string().max(500, {
    message: "Additional notes must not exceed 500 characters.",
  }),
});

const BookingPreferences: React.FC = () => {
  const { booking, nextStep, prevStep, setTablePreference, setCelebration } = useBooking();
  const [specialOccasion, setSpecialOccasion] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableLocation: "no_preference",
      additionalNotes: booking.specialRequests || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Save table preferences
    setTablePreference({
      location: values.tableLocation,
      notes: values.additionalNotes
    });
    
    // Save celebration info if applicable
    if (specialOccasion && values.specialOccasion) {
      setCelebration({
        type: specialOccasion,
        details: values.specialOccasion
      });
    }
    
    provideFeedback('confirm');
    nextStep();
  };

  const tableLocations = [
    { id: "window", label: "By the window", description: "Enjoy a view while you dine" },
    { id: "quiet", label: "Quiet area", description: "Away from speakers and high traffic" },
    { id: "center", label: "Center of venue", description: "Great for people watching" },
    { id: "bar", label: "Near the bar", description: "Easy access to drinks" },
    { id: "booth", label: "Booth seating", description: "More private and comfortable" },
    { id: "no_preference", label: "No preference", description: "Let the venue decide" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center py-10"
    >
      <h2 className="text-center mb-8 tracking-widest">Your Preferences</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
          <FormField
            control={form.control}
            name="tableLocation"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg">Table Location</FormLabel>
                <FormDescription>
                  Choose your preferred seating location
                </FormDescription>
                <div className="grid gap-3">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {tableLocations.map((location) => (
                      <FormItem
                        key={location.id}
                        className={`flex items-center space-x-3 space-y-0 rounded-md border p-4 ${field.value === location.id ? 'border-gold' : 'border-white/20'}`}
                      >
                        <FormControl>
                          <RadioGroupItem 
                            value={location.id} 
                            onClick={() => provideFeedback('selection')} 
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">{location.label}</FormLabel>
                          <FormDescription className="text-xs text-white/60">
                            {location.description}
                          </FormDescription>
                        </div>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel className="text-lg">Special Occasion?</FormLabel>
            <FormDescription>
              Let us know if you're celebrating something special
            </FormDescription>
            <div className="flex flex-wrap gap-2">
              {["Birthday", "Anniversary", "Business", "Date Night", "Other"].map((occasion) => (
                <Button
                  key={occasion}
                  type="button"
                  variant="outline"
                  className={`rounded-full ${
                    specialOccasion === occasion 
                      ? 'bg-gold/20 border-gold text-white' 
                      : 'bg-transparent'
                  }`}
                  onClick={() => {
                    setSpecialOccasion(occasion);
                    provideFeedback('selection');
                  }}
                >
                  {occasion}
                </Button>
              ))}
            </div>
          </div>

          {specialOccasion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="specialOccasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us more about your {specialOccasion}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Please provide details about your ${specialOccasion.toLowerCase()}...`}
                        className="resize-none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length % 10 === 0) {
                            provideFeedback('subtle');
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes or Requests</FormLabel>
                <FormDescription>
                  Any dietary restrictions, accessibility needs, or other preferences?
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Please provide any additional information that would help us serve you better..."
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.length % 15 === 0) {
                        provideFeedback('subtle');
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={prevStep}
              className="font-medium tracking-wide"
              onMouseDown={() => provideFeedback('buttonPress')}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="booking-button"
              onMouseDown={() => provideFeedback('navigation')}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default BookingPreferences;
