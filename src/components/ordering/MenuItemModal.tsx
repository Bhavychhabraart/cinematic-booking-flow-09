
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useOrder, MenuItem } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from '@/utils/formatters';
import { provideFeedback } from '@/utils/feedback';
import { Badge } from '@/components/ui/badge';
import { MinusIcon, PlusIcon, Star } from 'lucide-react';

type MenuItemModalProps = {
  itemId: string | null;
  onClose: () => void;
};

const MenuItemModal: React.FC<MenuItemModalProps> = ({ itemId, onClose }) => {
  const { menu, addToCart } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<{id: string; name: string; price: number;}[]>([]);
  
  // Reset state when item changes
  useEffect(() => {
    setQuantity(1);
    setSpecialInstructions('');
    setSelectedAddOns([]);
  }, [itemId]);
  
  if (!itemId) return null;
  const item = menu.find(item => item.id === itemId);
  if (!item) return null;
  
  // Find suggested pairings
  const pairings = item.pairsWith ? menu.filter(menuItem => 
    item.pairsWith?.includes(menuItem.id)
  ).slice(0, 3) : [];
  
  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions, selectedAddOns);
    onClose();
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
    provideFeedback('subtle');
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      provideFeedback('subtle');
    }
  };
  
  // Calculate total price including add-ons
  const totalPrice = (item.price * quantity) + 
    selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0) * quantity;
  
  return (
    <Dialog open={Boolean(itemId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-white/10 text-white p-0 sm:max-w-lg max-h-[90vh] overflow-auto">
        {/* Item image */}
        <div className="relative h-64 w-full">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.chefRecommended && (
              <Badge className="bg-burntOrange text-white border-0">Chef's Choice</Badge>
            )}
            {item.popular && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">Popular</Badge>
            )}
            {item.isNew && (
              <Badge className="bg-white text-black border-0">New</Badge>
            )}
          </div>
          
          {/* Bonus points badge */}
          {item.bonusPoints && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-black/70 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-burntOrange mr-1" />
                <span className="text-burntOrange font-semibold">+{item.bonusPoints} bonus pts</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="text-white/70 mt-1">{item.description}</p>
            </div>
            <div className="text-right">
              {item.discounted ? (
                <>
                  <span className="text-white/60 line-through mr-2">{formatCurrency(item.originalPrice || 0)}</span>
                  <span className="text-xl font-bold">{formatCurrency(item.price)}</span>
                </>
              ) : (
                <span className="text-xl font-bold">{formatCurrency(item.price)}</span>
              )}
            </div>
          </div>
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map(tag => (
                <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="bg-white/5 p-4 rounded-lg mb-6">
            <label className="block font-medium mb-2">Quantity</label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-white/20"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="mx-4 font-bold text-lg w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-white/20"
                onClick={incrementQuantity}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Special instructions */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Special Instructions</label>
            <Textarea
              placeholder="Any allergies or special requests?"
              className="bg-white/5 border-white/20 resize-none"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
          
          {/* Pairings/suggested add-ons */}
          {pairings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Perfect Pairings</h3>
              <div className="space-y-2">
                {pairings.map(pairing => {
                  const isSelected = selectedAddOns.some(addOn => addOn.id === pairing.id);
                  
                  return (
                    <div 
                      key={pairing.id}
                      className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-burntOrange/20 border border-burntOrange/50' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        provideFeedback('subtle');
                        setSelectedAddOns(prev => {
                          if (isSelected) {
                            return prev.filter(item => item.id !== pairing.id);
                          } else {
                            return [...prev, {
                              id: pairing.id,
                              name: pairing.name,
                              price: pairing.price
                            }];
                          }
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={pairing.imageUrl} 
                            alt={pairing.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{pairing.name}</p>
                          <p className="text-sm text-white/60">{formatCurrency(pairing.price)}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${isSelected ? 'bg-burntOrange' : 'bg-white/10'} flex items-center justify-center`}>
                        {isSelected && <PlusIcon className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Total and Add to Order button */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-white/70">Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
            </div>
            <Button 
              className="bg-burntOrange hover:bg-burntOrange/90 text-black font-bold py-6 px-8"
              onClick={handleAddToCart}
            >
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;
