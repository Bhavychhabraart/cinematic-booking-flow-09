
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useOrder } from '@/context/OrderContext';
import { provideFeedback } from '@/utils/feedback';
import { motion } from 'framer-motion';
import { Gift, Mail, ArrowRight } from 'lucide-react';
import { getVenueBySlug } from '@/data/venues';

interface GiftCardPurchaseProps {
  venueName: string;
  onComplete: () => void;
}

const GiftCardPurchase: React.FC<GiftCardPurchaseProps> = ({ venueName, onComplete }) => {
  const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'confirmation'>('amount');
  const [amount, setAmount] = useState<string>('50');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToCart } = useOrder();
  const venue = getVenueBySlug(venueName);

  const handleAmountContinue = () => {
    if (!amount || parseInt(amount) < 10) {
      toast.error('Please select a valid amount (minimum $10)');
      return;
    }
    provideFeedback('navigation');
    setStep('details');
  };

  const handleDetailsContinue = () => {
    if (!recipientName.trim()) {
      toast.error('Please enter recipient name');
      return;
    }
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    provideFeedback('navigation');
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    setIsProcessing(true);
    provideFeedback('confirm');

    // Simulate payment processing
    setTimeout(() => {
      // Create a gift card item
      const giftCardItem = {
        id: `giftcard-${Date.now()}`,
        name: `${venue?.name || 'Venue'} Gift Card`,
        description: `Gift card for ${recipientName}. Amount: $${amount}`,
        price: parseFloat(amount),
        category: 'Gift Cards',
        imageUrl: 'https://images.unsplash.com/photo-1557843540-182c022e9de4',
        tags: ['Gift Card'],
      };
      
      addToCart(giftCardItem, 1);

      setIsProcessing(false);
      setStep('confirmation');
      provideFeedback('success');
    }, 1500);
  };

  const getAmountColor = () => {
    const amountNum = parseInt(amount);
    if (amountNum >= 100) return 'text-gold';
    if (amountNum >= 50) return 'text-amber-400';
    return 'text-white';
  };

  return (
    <div className="py-4">
      {step === 'amount' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center mb-6">
            <p className="text-white/70 text-sm">Select the amount for your gift card</p>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="amount" className="text-white/70 mb-2 block">Amount ($)</Label>
            <Select
              value={amount}
              onValueChange={setAmount}
            >
              <SelectTrigger className="w-full bg-transparent border-white/20 text-lg">
                <SelectValue placeholder="Select an amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">$25</SelectItem>
                <SelectItem value="50">$50</SelectItem>
                <SelectItem value="75">$75</SelectItem>
                <SelectItem value="100">$100</SelectItem>
                <SelectItem value="150">$150</SelectItem>
                <SelectItem value="200">$200</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="my-4 flex items-center">
              <div className="h-px bg-white/20 flex-1"></div>
              <span className="px-3 text-white/60 text-xs">OR</span>
              <div className="h-px bg-white/20 flex-1"></div>
            </div>
            
            <div className="flex items-center">
              <span className="text-white/70 text-lg mr-2">$</span>
              <Input 
                type="number" 
                min="10"
                max="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-white/20 text-lg"
              />
            </div>
          </div>
          
          <Card className="border-0 bg-white/5 mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-white/70 text-sm mb-2">Gift Card Preview</p>
              <p className={`text-4xl font-bold ${getAmountColor()}`}>${amount}</p>
              <p className="text-white/70 mt-2">{venue?.name || 'Venue'} Gift Card</p>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full bg-gold hover:bg-gold/90 text-black" 
            size="lg"
            onClick={handleAmountContinue}
          >
            Continue
            <ArrowRight size={16} />
          </Button>
        </motion.div>
      )}

      {step === 'details' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center mb-6">
            <p className="text-white/70 text-sm">Recipient details</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input 
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="John Doe"
                className="bg-transparent border-white/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input 
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="john@example.com"
                type="email"
                className="bg-transparent border-white/20"
              />
              <p className="text-xs text-white/50">The gift card will be sent to this email</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (optional)</Label>
              <Textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                className="bg-transparent border-white/20 min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                provideFeedback('buttonPress');
                setStep('amount');
              }}
            >
              Back
            </Button>
            <Button 
              className="flex-1 bg-gold hover:bg-gold/90 text-black"
              onClick={handleDetailsContinue}
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center mb-6">
            <p className="text-white/70 text-sm">Review and pay</p>
          </div>
          
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Amount:</span>
                <span className="font-bold text-lg">${amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Recipient:</span>
                <span>{recipientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Email:</span>
                <span className="text-sm">{recipientEmail}</span>
              </div>
              {message && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/70 text-xs">Your message:</p>
                  <p className="text-sm italic">"{message}"</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-4 mb-6">
            {/* In a real implementation, you'd have payment fields here */}
            <p className="text-white/70 text-sm">
              Your gift card will be added to your cart for checkout.
            </p>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                provideFeedback('buttonPress');
                setStep('details');
              }}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button 
              className="flex-1 bg-gold hover:bg-gold/90 text-black"
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Add to Cart"}
              {!isProcessing && <ArrowRight size={16} />}
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'confirmation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-4"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Gift size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gift Card Added!</h3>
            <p className="text-white/70">
              Your gift card has been added to your cart.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 mt-8">
            <Button 
              onClick={() => onComplete()}
              className="bg-gold hover:bg-gold/90 text-black"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                onComplete();
                window.location.href = `/order/${venueName}`;
              }}
            >
              <Mail size={16} className="mr-2" />
              Go to Cart
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCardPurchase;
