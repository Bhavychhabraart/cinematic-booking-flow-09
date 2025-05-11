
import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarCheck } from "lucide-react";
import { provideFeedback } from '@/utils/feedback';
import { useParams } from 'react-router-dom';
import { getVenueBySlug } from '@/data/venues';
import { format } from "date-fns";
import BookingSummary from '@/components/BookingSummary';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(8, {
    message: "Phone number must be at least 8 characters.",
  }),
  agreedToTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

const BookingContact: React.FC = () => {
  const { booking, nextStep, prevStep, setContactInfo, setAgreedToTerms } = useBooking();
  const { venueName } = useParams();
  const venue = getVenueBySlug(venueName || '');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: booking.contactInfo.name || "",
      email: booking.contactInfo.email || "",
      phone: booking.contactInfo.phone || "",
      agreedToTerms: booking.agreedToTerms,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setContactInfo({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });
    setAgreedToTerms(values.agreedToTerms);
    
    provideFeedback('confirm', '/sounds/success.mp3');
    nextStep();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="container-center py-10"
    >
      <h2 className="text-center mb-6 tracking-widest">Almost There!</h2>
      
      <div className="px-4 mb-6">
        {/* Booking summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6"
        >
          <div className="flex items-start">
            <CalendarCheck className="text-[#914110] mr-3 mt-1 h-5 w-5" />
            <div>
              <h3 className="font-medium">{venue?.name}</h3>
              <p className="text-sm text-white/70">{booking.bookingType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Reservation</p>
              <p className="text-sm text-white/70">
                {booking.date ? format(booking.date, 'EEEE, MMMM d, yyyy') : ''} • {booking.time} 
                • {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
              </p>
              {(booking.addOns.length > 0 || booking.selectedExperiences.length > 0) && (
                <p className="text-xs text-[#914110] mt-1">
                  {booking.addOns.length > 0 && `${booking.addOns.length} add-on${booking.addOns.length !== 1 ? 's' : ''}`}
                  {booking.addOns.length > 0 && booking.selectedExperiences.length > 0 && ' • '}
                  {booking.selectedExperiences.length > 0 && `${booking.selectedExperiences.length} experience${booking.selectedExperiences.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Price Summary */}
        <BookingSummary />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.length % 10 === 0) {
                        provideFeedback('subtle');
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.length % 10 === 0) {
                        provideFeedback('subtle');
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.length % 5 === 0) {
                        provideFeedback('subtle');
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        provideFeedback('selection');
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the terms & conditions and privacy policy of {venue?.name}. I understand the cancellation policy and agree to the venue's house rules.
                  </FormLabel>
                  <FormMessage />
                </div>
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
              Review Booking
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default BookingContact;
