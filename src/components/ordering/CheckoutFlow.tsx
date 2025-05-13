import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { getVenueBySlug } from '@/data/venues';
import { provideFeedback, vibrationPatterns, playSound, sounds } from '@/utils/feedback';
import { X, ChevronLeft, ChevronRight, Clock, BadgeCheck, CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import LoyaltyPointsEarned from '../LoyaltyPointsEarned';

type CheckoutFlowProps = {
  onClose: () => void;
};

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const panelVariants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' }
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ onClose }) => {
  const { venueName } = useParams<{ venueName: string }>();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  
  const { 
    cartItems, 
    subtotal, 
    total, 
    clearCart, 
    discount,
    pointsEarned,
    checkoutStep,
    setCheckoutStep
  } = useOrder();
  
  const { loyalty, recordBooking } = useLoyalty();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  // Handle checkout steps
  const handlePrevStep = () => {
    provideFeedback('subtle');
    if (checkoutStep === 'details') {
      setCheckoutStep('cart');
    } else if (checkoutStep === 'payment') {
      setCheckoutStep('details');
    }
  };
  
  const handleNextStep = () => {
    provideFeedback('buttonPress');
    
    if (checkoutStep === 'cart') {
      setCheckoutStep('details');
    } else if (checkoutStep === 'details') {
      // Validate form
      if (!name || !tableNumber) {
        provideFeedback('error');
        return;
      }
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      // Process payment
      handleSubmitOrder();
    }
  };
  
  // Handle order submission
  const handleSubmitOrder = () => {
    setIsProcessing(true);
    provideFeedback('processing');
    
    // Simulate server call
    setTimeout(() => {
      // Generate random order number
      const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
      setOrderNumber(`#${randomOrderNum}`);
      
      // Set estimated time (10-30 mins)
      const time = Math.floor(10 + Math.random() * 20);
      setEstimatedTime(time);
      
      // Record in loyalty system
      if (venueName) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        recordBooking(
          venueName, 
          venue?.name || venueName, 
          total, 
          totalItems, 
          'in-venue-order'
        );
      }
      
      // Show success
      setIsProcessing(false);
      setProcessComplete(true);
      provideFeedback('celebratory');
      playSound(sounds.victory);
    }, 2000);
  };
  
  // Handle close checkout after order
  const handleComplete = () => {
    clearCart();
    onClose();
    if (venueName) {
      navigate(`/venue-experience/${venueName}`);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-black border-t border-white/10 rounded-t-xl overflow-hidden flex-1 max-h-screen overflow-auto"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-black z-10">
            <div className="flex items-center">
              {(checkoutStep === 'details' || checkoutStep === 'payment') && !processComplete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevStep}
                  className="mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <h2 className="text-xl font-bold">
                {processComplete ? 'Order Confirmed' : 'Checkout'}
              </h2>
            </div>
            
            {!processComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Cart Step */}
              {checkoutStep === 'cart' && (
                <motion.div
                  key="cart-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
                  
                  {/* Order items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-3 text-lg font-medium w-6 text-center">
                          {item.quantity}×
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItem.name}</p>
                          {item.specialInstructions && (
                            <p className="text-sm text-white/60 italic">"{item.specialInstructions}"</p>
                          )}
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="mt-1">
                              {item.addOns.map((addOn, idx) => (
                                <p key={idx} className="text-sm text-white/70">+ {addOn.name}</p>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {formatCurrency(item.menuItem.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order summary */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <p className="text-white/70">Subtotal</p>
                      <p>{formatCurrency(subtotal)}</p>
                    </div>
                    
                    {/* Discount if applicable */}
                    {discount && (
                      <div className="flex justify-between mb-2 text-burntOrange">
                        <p>{discount.name}</p>
                        <p>-{formatCurrency(subtotal - total)}</p>
                      </div>
                    )}
                    
                    <Separator className="my-3 bg-white/10" />
                    
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>{formatCurrency(total)}</p>
                    </div>
                  </div>
                  
                  {/* Loyalty points preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Loyalty Benefits</h4>
                    <div className="bg-burntOrange/10 border border-burntOrange/20 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-burntOrange">+{pointsEarned} Points</p>
                        <p className="text-xs text-white/60">Will be added to your loyalty card</p>
                      </div>
                      <div className="bg-burntOrange/20 rounded-full p-1">
                        <BadgeCheck className="h-5 w-5 text-burntOrange" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Details Step */}
              {checkoutStep === 'details' && (
                <motion.div
                  key="details-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h3 className="text-lg font-medium mb-4">Order Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-white/5 border-white/20"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email (Optional)</label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="bg-white/5 border-white/20"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (Optional)</label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your phone number"
                          className="bg-white/5 border-white/20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="table" className="block text-sm font-medium mb-1">Table Number</label>
                      <Input
                        id="table"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Enter your table number"
                        className="bg-white/5 border-white/20"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Order summary minimal */}
                  <div className="mt-6 p-4 bg-black rounded-lg border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white/70">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                        <p className="font-bold">{formatCurrency(total)}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCheckoutStep('cart')}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Payment Step */}
              {checkoutStep === 'payment' && !processComplete && (
                <motion.div
                  key="payment-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  
                  {/* Payment options */}
                  <div className="space-y-3 mb-6">
                    <div className="border border-burntOrange bg-burntOrange/10 rounded-lg p-4 flex items-center cursor-pointer">
                      <div className="h-5 w-5 rounded-full bg-burntOrange flex items-center justify-center mr-3">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Pay at Table</p>
                        <p className="text-sm text-white/60">A server will bring a card terminal to your table</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-burntOrange" />
                    </div>
                  </div>
                  
                  {/* Order summary */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <div className="mb-2">
                      <p className="text-sm text-white/70">Deliver to</p>
                      <p className="font-medium">Table {tableNumber}</p>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-white/70">Customer</p>
                      <p className="font-medium">{name}</p>
                    </div>
                    
                    <Separator className="my-3 bg-white/10" />
                    
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>{formatCurrency(total)}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Confirmation Step */}
              {processComplete && (
                <motion.div
                  key="confirmation-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 mx-auto"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-burntOrange/20 flex items-center justify-center mb-4">
                        <BadgeCheck className="h-12 w-12 text-burntOrange" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">Order Confirmed!</h3>
                      <p className="text-white/70 mb-6">Your order is being prepared</p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-sm text-white/70 mb-1">Order Number</p>
                      <p className="text-xl font-bold">{orderNumber}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-sm text-white/70 mb-1">Estimated Time</p>
                      <p className="text-xl font-bold flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-1" /> {estimatedTime} mins
                      </p>
                    </div>
                  </div>
                  
                  {/* Loyalty points earned - Fixed prop name from pointsEarned to points */}
                  <div className="mb-8">
                    <LoyaltyPointsEarned 
                      points={pointsEarned} 
                      newTotal={loyalty.currentPoints + pointsEarned} 
                      message="You earned loyalty points with your order!"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-white/10 sticky bottom-0 bg-black">
            {!processComplete && (
              <Button
                className="w-full bg-burntOrange hover:bg-burntOrange/90 text-black font-bold py-6 flex items-center justify-center"
                onClick={handleNextStep}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : checkoutStep === 'cart' ? (
                  <>
                    Continue to Details
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : checkoutStep === 'details' ? (
                  <>
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  'Confirm Order'
                )}
              </Button>
            )}
            
            {processComplete && (
              <Button
                className="w-full bg-burntOrange hover:bg-burntOrange/90 text-black font-bold py-6"
                onClick={handleComplete}
              >
                Continue to Venue Experience
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutFlow;
