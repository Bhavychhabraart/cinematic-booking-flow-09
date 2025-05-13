
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVenueBySlug } from '@/data/venues';
import { useOrder, OrderProvider } from '@/context/OrderContext';
import { provideFeedback } from '@/utils/feedback';
import MenuSection from '@/components/ordering/MenuSection';
import Cart from '@/components/ordering/Cart';
import LoyaltyGains from '@/components/ordering/LoyaltyGains';
import { ChevronLeft, ShoppingCart, Clock, Info, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MenuItemModal from '@/components/ordering/MenuItemModal';
import CheckoutFlow from '@/components/ordering/CheckoutFlow';
import SpecialsCarousel from '@/components/ordering/SpecialsCarousel';

const TableOrderingContent = () => {
  const { venueName } = useParams<{ venueName: string }>();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const { cartItems, menu, setCurrentVenue, isCheckingOut, setIsCheckingOut } = useOrder();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  
  // Refs for scroll positions
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  useEffect(() => {
    if (venueName) {
      setCurrentVenue(venueName);
      provideFeedback('buttonPress');
    }
    
    if (!venue) {
      navigate('/');
    }
  }, [venueName, venue, navigate, setCurrentVenue]);
  
  useEffect(() => {
    if (menu.length > 0) {
      const uniqueCategories = Array.from(new Set(menu.map(item => item.category)));
      setCategories(uniqueCategories);
      
      // Set first category as default selected
      if (uniqueCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(uniqueCategories[0]);
      }
    }
  }, [menu, selectedCategory]);
  
  // Handle menu item click
  const handleMenuItemClick = (itemId: string) => {
    setSelectedMenuItem(itemId);
    provideFeedback('selection');
  };
  
  // Cart count badge
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <div className="pb-16 min-h-screen bg-gradient-to-b from-black to-black/90">
      {/* Header */}
      <div className="bg-black sticky top-0 z-30 border-b border-white/10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/venues/${venueName}`)}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{venue?.name}</h1>
              <p className="text-xs text-white/60">Table Order</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowCart(true)}
              className="text-white hover:bg-white/10 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-burntOrange text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                >
                  {cartCount}
                </motion.div>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container px-4 py-6">
        {/* Specials Carousel */}
        <SpecialsCarousel onItemClick={handleMenuItemClick} />
        
        {/* Loyalty Points Preview */}
        {cartItems.length > 0 && (
          <div className="my-4">
            <LoyaltyGains />
          </div>
        )}
        
        {/* Menu Categories */}
        <div className="sticky top-[73px] z-20 bg-black/90 backdrop-blur-sm py-2 -mx-4 px-4">
          <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full h-auto bg-black/30 p-1 overflow-x-auto flex space-x-1 border border-white/10 rounded-lg">
              {categories.map(category => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  className="py-2 px-4 data-[state=active]:bg-burntOrange data-[state=active]:text-white flex-shrink-0"
                  onClick={() => {
                    provideFeedback('subtle');
                    const element = categoryRefs.current[category];
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Menu Sections */}
        <div className="mt-6 space-y-8">
          {categories.map(category => (
            <div 
              key={category} 
              ref={el => categoryRefs.current[category] = el}
              className="scroll-mt-40"
            >
              <MenuSection 
                category={category} 
                onItemClick={handleMenuItemClick} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed bottom checkout bar when items in cart */}
      {cartItems.length > 0 && !showCart && !isCheckingOut && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-bold">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
            <p className="text-sm text-white/70">View your order</p>
          </div>
          <Button 
            className="bg-burntOrange hover:bg-burntOrange/90 text-white"
            onClick={() => {
              setShowCart(true);
              provideFeedback('buttonPress');
            }}
          >
            View Cart
          </Button>
        </motion.div>
      )}
      
      {/* Menu Item Modal */}
      <MenuItemModal 
        itemId={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />
      
      {/* Cart Overlay */}
      <AnimatePresence>
        {showCart && (
          <Cart onClose={() => setShowCart(false)} onCheckout={() => {
            setShowCart(false);
            setIsCheckingOut(true);
          }} />
        )}
      </AnimatePresence>
      
      {/* Checkout Flow */}
      <AnimatePresence>
        {isCheckingOut && <CheckoutFlow onClose={() => setIsCheckingOut(false)} />}
      </AnimatePresence>
    </div>
  );
};

const TableOrderingPage = () => (
  <OrderProvider>
    <TableOrderingContent />
  </OrderProvider>
);

export default TableOrderingPage;
