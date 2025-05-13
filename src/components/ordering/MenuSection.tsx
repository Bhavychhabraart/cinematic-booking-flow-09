
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOrder, MenuItem } from '@/context/OrderContext';
import MenuItemCard from './MenuItemCard';

type MenuSectionProps = {
  category: string;
  onItemClick: (itemId: string) => void;
};

const MenuSection: React.FC<MenuSectionProps> = ({ category, onItemClick }) => {
  const { menu, recentlyAddedItem } = useOrder();
  const items = menu.filter(item => item.category === category);
  
  // Early return if no items in this category
  if (items.length === 0) return null;
  
  // Arrange items strategically:
  // 1. First show premium/high-margin items (chef recommended)
  // 2. Then show popular items
  // 3. Then show new items
  // 4. Then show the rest
  const sortedItems = [...items].sort((a, b) => {
    // Chef recommended items first
    if (a.chefRecommended && !b.chefRecommended) return -1;
    if (!a.chefRecommended && b.chefRecommended) return 1;
    
    // Then popular items
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    
    // Then new items
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    
    // By default, sort by price (highest first for premium anchoring)
    return b.price - a.price;
  });
  
  // Create staggered animation for items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        {category}
        <span className="ml-2 text-sm text-white/60">({items.length})</span>
      </h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {sortedItems.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            layout
            animate={recentlyAddedItem === item.id ? { 
              scale: [1, 1.05, 1],
              boxShadow: ['0 0 0px rgba(145, 65, 16, 0)', '0 0 20px rgba(145, 65, 16, 0.8)', '0 0 0px rgba(145, 65, 16, 0)']
            } : {}}
            transition={{ duration: 0.6 }}
          >
            <MenuItemCard 
              item={item}
              onClick={() => onItemClick(item.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MenuSection;
