
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getVenueBySlug } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { QrCode, Ticket, Beer, AlertCircle } from 'lucide-react';
import { provideFeedback, sounds } from '@/utils/feedback';
import { generateCouponId, hasClaimedToday, recordCouponClaim, getRemainingCoupons } from '@/utils/coupons';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  drinkChoice: z.enum(["beer", "wine", "cocktail"], {
    required_error: "Please select a drink option.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Drink options
const drinkOptions = [
  {
    id: "beer",
    label: "Beer",
    description: "House draft beer selection",
  },
  {
    id: "wine",
    label: "Wine",
    description: "House red or white wine",
  },
  {
    id: "cocktail",
    label: "Cocktail",
    description: "House specialty cocktail",
  },
];

const InVenueCouponPage: React.FC = () => {
  const { venueName } = useParams();
  const venue = getVenueBySlug(venueName || '');
  const [step, setStep] = useState<'info' | 'drink' | 'coupons' | 'limit-reached'>('info');
  const [coupons, setCoupons] = useState<string[]>([]);
  
  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      drinkChoice: undefined,
    },
    mode: "onChange", // Enable validation as fields change
  });

  // Handle verification of user info
  const handleVerifyInfo = (values: FormValues) => {
    console.log("Verifying info:", values);
    provideFeedback('success', sounds.success);
    
    // Check if user has already claimed coupons today
    if (hasClaimedToday(values.phone)) {
      toast.error("Daily limit reached", {
        description: "You've already claimed your complimentary drinks today.",
      });
      setStep('limit-reached');
      return;
    }
    
    // Save form data and proceed to drink selection
    setStep('drink');
  };

  // Handle submission of drink choice
  const handleDrinkSubmit = (values: FormValues) => {
    console.log("Drink choice submitted:", values);
    provideFeedback('celebratory', sounds.victory);
    
    // Record this claim
    recordCouponClaim(values.phone);
    
    // Generate 3 unique coupon codes
    const newCoupons = [
      generateCouponId(values.drinkChoice),
      generateCouponId(values.drinkChoice),
      generateCouponId(values.drinkChoice)
    ];
    
    setCoupons(newCoupons);
    setStep('coupons');
    
    toast.success("Your coupons are ready!", {
      description: "Show these to the bartender to redeem your complimentary drinks.",
      duration: 5000,
    });
  };

  // Handle request for new coupons
  const handleNewCoupons = () => {
    // Reset form
    form.reset();
    setStep('info');
    setCoupons([]);
    provideFeedback('subtle');
  };

  if (!venue) {
    return (
      <div className="flex h-screen items-center justify-center bg-black p-4">
        <h1 className="text-xl text-white">Venue not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 p-4 pb-24">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 flex justify-center">
            {step === 'info' && <QrCode className="h-16 w-16 text-purple-500" />}
            {step === 'drink' && <Beer className="h-16 w-16 text-amber-500" />}
            {step === 'coupons' && <Ticket className="h-16 w-16 text-green-500" />}
            {step === 'limit-reached' && <AlertCircle className="h-16 w-16 text-red-500" />}
          </div>
          <h1 className="text-3xl font-bold text-white">{venue.name} Drinks</h1>
          <p className="mt-2 text-lg text-gray-300">
            {step === 'info' && "Claim your complimentary drinks"}
            {step === 'drink' && "Choose your drink preference"}
            {step === 'coupons' && "Your drink coupons"}
            {step === 'limit-reached' && "Daily limit reached"}
          </p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Collect user info */}
          {step === 'info' && (
            <motion.div
              key="info-form"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleVerifyInfo)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              provideFeedback('subtle');
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
                            placeholder="Your phone number" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              provideFeedback('subtle');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => provideFeedback('buttonPress')}
                  >
                    Verify & Continue
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {/* Step 2: Select drink preference */}
          {step === 'drink' && (
            <motion.div
              key="drink-selection"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleDrinkSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="drinkChoice"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Your Complimentary Drink</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              provideFeedback('buttonPress');
                            }}
                            value={field.value}
                            className="space-y-2"
                          >
                            {drinkOptions.map((option) => (
                              <Card 
                                key={option.id}
                                className={`border-2 cursor-pointer transition-all ${
                                  field.value === option.id 
                                    ? "border-purple-500 bg-purple-50" 
                                    : "border-transparent hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange(option.id)}
                              >
                                <CardContent className="flex items-center space-x-4 p-4">
                                  <RadioGroupItem value={option.id} />
                                  <div className="flex-1">
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-sm text-gray-500">{option.description}</div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        provideFeedback('subtle');
                        setStep('info');
                      }}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => provideFeedback('buttonPress')}
                    >
                      Get Coupons
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {/* Step 3: Display generated coupons */}
          {step === 'coupons' && (
            <motion.div
              key="coupons-display"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold">Your Drink Coupons</h2>
                <p className="text-sm text-gray-500">
                  Present these to the bartender to redeem your drinks
                </p>
              </div>
              
              <div className="space-y-4 my-6">
                {coupons.map((coupon, index) => (
                  <motion.div 
                    key={coupon}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="border-2 border-dashed border-purple-500 rounded-lg p-4 bg-purple-50"
                    onClick={() => provideFeedback('subtle')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-purple-800">{form.getValues().drinkChoice}</div>
                        <div className="text-xs text-gray-600">Valid today only</div>
                      </div>
                      <Ticket className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-2 bg-white p-2 rounded font-mono text-sm text-center">
                      {coupon}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6">
                <p>Limited to 3 complimentary drinks per person, per day</p>
              </div>
              
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleNewCoupons}
              >
                Start Over
              </Button>
            </motion.div>
          )}
          
          {/* Step 4: Daily limit reached */}
          {step === 'limit-reached' && (
            <motion.div
              key="limit-reached"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-red-100 p-4 flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Daily Limit Reached</h2>
                <p className="text-gray-600 mb-6">
                  You've already claimed your complimentary drinks today. Please come back tomorrow!
                </p>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleNewCoupons}
                >
                  Try Another Phone Number
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InVenueCouponPage;
