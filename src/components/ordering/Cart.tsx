
import React from 'react';
import { motion } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { provideFeedback } from '@/utils/feedback';
import { X, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type CartProps = {
  onClose: () => void;
  onCheckout: () => void;
};

const Cart: React.FC<CartProps> = ({ onClose, onCheckout }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity,
    subtotal,
    discount,
    total,
    pointsEarned
  } = useOrder();
  
  const handleCheckout = () => {
    provideFeedback('buttonPress');
    onCheckout();
  };
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="bg-black border border-white/10 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-white/60 text-center mb-6">
              Add some delicious items to get started with your order!
            </p>
            <Button variant="default" className="w-full" onClick={onClose}>
              Browse Menu
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-black border border-white/10 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Order</h2>
            <Button
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.menuItem.id} className="flex items-start">
                <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={item.menuItem.imageUrl} 
                    alt={item.menuItem.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.menuItem.name}</h3>
                    <p className="font-medium">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center border border-white/20 rounded-md">
                      <button
                        className="px-2 py-1 text-white/70 hover:text-white"
                        onClick={() => {
                          provideFeedback('subtle');
                          updateCartItemQuantity(item.menuItem.id, item.quantity - 1);
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        className="px-2 py-1 text-white/70 hover:text-white"
                        onClick={() => {
                          provideFeedback('subtle');
                          updateCartItemQuantity(item.menuItem.id, item.quantity + 1);
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      className="ml-2 p-1 text-white/50 hover:text-red-500 transition-colors"
                      onClick={() => {
                        provideFeedback('subtle');
                        removeFromCart(item.menuItem.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {item.specialInstructions && (
                    <p className="text-sm text-white/60 mt-1 italic">
                      "{item.specialInstructions}"
                    </p>
                  )}
                  
                  {/* Add-ons */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-2 pl-2 border-l border-white/10">
                      {item.addOns.map((addOn, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <p className="text-white/70">+ {addOn.name}</p>
                          <p className="text-white/70">{formatCurrency(addOn.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="bg-white/5 rounded-lg p-4">
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
            
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>{formatCurrency(total)}</p>
            </div>
            
            <div className="mt-2 text-xs text-white/60 text-right">
              Earn {pointsEarned} loyalty points with this order!
            </div>
          </div>
          
          {/* Checkout Button */}
          <Button
            className="w-full mt-6 bg-burntOrange hover:bg-burntOrange/90 text-black font-bold py-6"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
