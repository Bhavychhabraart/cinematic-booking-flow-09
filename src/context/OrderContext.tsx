
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLoyalty } from '@/context/LoyaltyContext';
import { toast } from 'sonner';
import { provideFeedback, vibrationPatterns, sounds, playSound } from '@/utils/feedback';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  popular?: boolean;
  chefRecommended?: boolean;
  isNew?: boolean;
  tags?: string[];
  allergens?: string[];
  pairsWith?: string[];
  bonusPoints?: number;
  discounted?: boolean;
  originalPrice?: number;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  addOns?: {
    id: string;
    name: string;
    price: number;
  }[];
  isGiftCard?: boolean;
};

export type OrderDiscount = {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'freeItem';
  value: number;
  minOrderValue?: number;
  applicableItems?: string[];
  freeItemId?: string;
  code?: string;
};

interface OrderContextType {
  menu: MenuItem[];
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string, addOns?: any[], isGiftCard?: boolean) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  currentVenue: string | null;
  setCurrentVenue: (venue: string) => void;
  subtotal: number;
  discount: OrderDiscount | null;
  applyDiscount: (discount: OrderDiscount) => void;
  removeDiscount: () => void;
  total: number;
  pointsEarned: number;
  checkoutStep: 'cart' | 'details' | 'payment' | 'confirmation';
  setCheckoutStep: (step: 'cart' | 'details' | 'payment' | 'confirmation') => void;
  isCheckingOut: boolean;
  setIsCheckingOut: (isCheckingOut: boolean) => void;
  recentlyAddedItem: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock menu data
const generateMenu = (venue: string): MenuItem[] => {
  return [
    {
      id: "1",
      name: "Truffle Infused Filet Mignon",
      description: "Premium cut filet mignon with black truffle butter, served with roasted potatoes and seasonal vegetables",
      price: 42.99,
      category: "Mains",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
      chefRecommended: true,
      tags: ["Premium", "Signature"],
      pairsWith: ["7", "12"],
      bonusPoints: 20
    },
    {
      id: "2",
      name: "Pan Seared Scallops",
      description: "Fresh sea scallops seared to perfection, served on a bed of risotto with lemon butter sauce",
      price: 36.99,
      category: "Mains",
      imageUrl: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6",
      popular: true,
      tags: ["Seafood", "Gluten Free"],
      pairsWith: ["8"]
    },
    {
      id: "3",
      name: "Artisanal Cheese Platter",
      description: "Selection of premium cheeses with honey, fruit preserves, and artisanal crackers",
      price: 18.99,
      category: "Appetizers",
      imageUrl: "https://images.unsplash.com/photo-1536624009922-c2d05883a8fc",
      popular: true,
      tags: ["Shareable", "Vegetarian"],
      pairsWith: ["7", "9", "10"]
    },
    {
      id: "4",
      name: "Lobster Bisque",
      description: "Creamy lobster soup with a hint of sherry, garnished with fresh chives and lobster meat",
      price: 16.99,
      category: "Soups",
      imageUrl: "https://images.unsplash.com/photo-1577906096429-f73c2c312435",
      tags: ["Seafood"],
      pairsWith: ["8", "11"]
    },
    {
      id: "5",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream and raspberry coulis",
      price: 12.99,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      popular: true,
      tags: ["Sweet", "Hot"],
      pairsWith: ["13"]
    },
    {
      id: "6",
      name: "Wagyu Beef Sliders",
      description: "Three miniature burgers made with premium Wagyu beef, truffle aioli, and caramelized onions",
      price: 24.99,
      category: "Appetizers",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
      isNew: true,
      popular: true,
      tags: ["Premium", "Shareable"],
      bonusPoints: 15
    },
    {
      id: "7",
      name: "Vintage Red Wine",
      description: "Selected premium vintage red wine",
      price: 14.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d",
      tags: ["Alcoholic", "Wine"]
    },
    {
      id: "8",
      name: "Sauvignon Blanc",
      description: "Crisp white wine with notes of citrus and green apple",
      price: 12.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1600757242684-5715c2af9e9f",
      tags: ["Alcoholic", "Wine"]
    },
    {
      id: "9",
      name: "Craft Beer Selection",
      description: "Rotating selection of local craft beers",
      price: 8.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1518176258769-f227c798150e",
      tags: ["Alcoholic", "Beer"]
    },
    {
      id: "10",
      name: "Signature Cocktail",
      description: "House specialty cocktail with premium spirits and fresh ingredients",
      price: 16.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a",
      popular: true,
      tags: ["Alcoholic", "Signature"],
      bonusPoints: 10
    },
    {
      id: "11",
      name: "Truffle Parmesan Fries",
      description: "Crispy fries tossed with truffle oil, parmesan cheese, and fresh herbs",
      price: 10.99,
      category: "Sides",
      imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
      popular: true,
      tags: ["Vegetarian", "Shareable"],
      discounted: true,
      originalPrice: 12.99
    },
    {
      id: "12",
      name: "Grilled Asparagus",
      description: "Tender asparagus grilled with olive oil, lemon, and sea salt",
      price: 9.99,
      category: "Sides",
      imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
      tags: ["Vegan", "Gluten Free"]
    },
    {
      id: "13",
      name: "Espresso Martini",
      description: "A sophisticated blend of vodka, coffee liqueur, and freshly brewed espresso",
      price: 14.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1619604373586-56832deb5e30",
      chefRecommended: true,
      tags: ["Alcoholic", "Coffee"]
    },
    {
      id: "14",
      name: "Seasonal Fruit Tart",
      description: "Buttery pastry shell filled with vanilla custard and topped with fresh seasonal fruits",
      price: 11.99,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1605205547586-35ae7f7efcd5",
      isNew: true,
      tags: ["Seasonal", "Sweet"]
    },
    {
      id: "15",
      name: "Premium Sushi Platter",
      description: "Chef's selection of premium sushi including nigiri and specialty rolls",
      price: 34.99,
      category: "Mains",
      imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4917c92d",
      isNew: true,
      chefRecommended: true,
      tags: ["Seafood", "Premium"],
      bonusPoints: 25
    }
  ];
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentVenue, setCurrentVenue] = useState<string | null>(null);
  const [discount, setDiscount] = useState<OrderDiscount | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'confirmation'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<string | null>(null);

  const { loyalty, addLoyaltyPoints, recordBooking } = useLoyalty();

  // Load menu when venue changes
  useEffect(() => {
    if (currentVenue) {
      setMenu(generateMenu(currentVenue));
    }
  }, [currentVenue]);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => 
      sum + (item.menuItem.price * item.quantity) + 
      (item.addOns?.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0) || 0),
    0
  );

  // Apply discount
  const calculateDiscountAmount = () => {
    if (!discount) return 0;
    
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    } else if (discount.type === 'fixed') {
      return discount.value;
    } else if (discount.type === 'freeItem') {
      const freeItem = cartItems.find(item => item.menuItem.id === discount.freeItemId);
      return freeItem ? freeItem.menuItem.price : 0;
    }
    return 0;
  };

  const discountAmount = calculateDiscountAmount();
  const total = Math.max(0, subtotal - discountAmount);

  // Calculate loyalty points to be earned
  const pointsEarned = Math.floor(total * 2); // 2 points per dollar

  // Add item to cart
  const addToCart = (menuItem: MenuItem, quantity = 1, specialInstructions = '', addOns = [], isGiftCard = false) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.menuItem.id === menuItem.id);
      
      if (existingItemIndex >= 0 && !isGiftCard) {
        // Update existing item quantity only for non-gift card items
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { menuItem, quantity, specialInstructions, addOns, isGiftCard }];
      }
    });
    
    // Trigger haptic feedback and show toast
    provideFeedback('addToCart');
    playSound(sounds.addCart || '/sounds/add.mp3');
    setRecentlyAddedItem(menuItem.id);
    setTimeout(() => setRecentlyAddedItem(null), 3000);
    
    const itemDescription = isGiftCard ? 'Gift Card' : menuItem.name;
    
    toast(`Added: ${itemDescription}`, {
      description: `${quantity}× added to your order`,
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.menuItem.id !== itemId));
    provideFeedback('subtle');
  };

  // Update item quantity
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
    provideFeedback('subtle');
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Apply discount
  const applyDiscount = (newDiscount: OrderDiscount) => {
    // Validate if discount can be applied
    if (newDiscount.minOrderValue && subtotal < newDiscount.minOrderValue) {
      toast.error(`Minimum order of $${newDiscount.minOrderValue.toFixed(2)} required for this discount`);
      return;
    }
    
    setDiscount(newDiscount);
    toast.success(`Discount applied: ${newDiscount.name}`);
    provideFeedback('success');
  };

  // Remove discount
  const removeDiscount = () => {
    setDiscount(null);
  };

  return (
    <OrderContext.Provider
      value={{
        menu,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        currentVenue,
        setCurrentVenue,
        subtotal,
        discount,
        applyDiscount,
        removeDiscount,
        total,
        pointsEarned,
        checkoutStep,
        setCheckoutStep,
        isCheckingOut,
        setIsCheckingOut,
        recentlyAddedItem
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
