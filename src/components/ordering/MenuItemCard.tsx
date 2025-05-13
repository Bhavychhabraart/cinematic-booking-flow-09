
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MenuItem } from '@/context/OrderContext';
import { formatCurrency } from '@/utils/formatters';
import { Star } from 'lucide-react';

type MenuItemCardProps = {
  item: MenuItem;
  onClick: () => void;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onClick }) => {
  return (
    <Card 
      className="bg-black/40 border border-white/10 overflow-hidden hover:border-burntOrange/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        {/* Image with overlay gradient */}
        <div className="h-48 overflow-hidden">
          <motion.img 
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>
        
        {/* Badges overlaid on image */}
        <div className="absolute top-2 left-2 flex gap-2">
          {item.chefRecommended && (
            <Badge className="bg-burntOrange text-white border-0">Chef's Choice</Badge>
          )}
          {item.popular && !item.chefRecommended && (
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">Popular</Badge>
          )}
          {item.isNew && (
            <Badge className="bg-white text-black border-0">New</Badge>
          )}
        </div>
        
        {/* Price with discount if applicable */}
        <div className="absolute top-2 right-2">
          {item.discounted ? (
            <div className="flex flex-col items-end">
              <Badge className="bg-red-500 text-white border-0 mb-1">
                Sale
              </Badge>
              <div className="text-right">
                <span className="text-white/60 line-through text-sm mr-1">
                  {formatCurrency(item.originalPrice || 0)}
                </span>
                <span className="font-bold text-white bg-black/60 rounded px-2 py-1">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-bold text-white bg-black/60 rounded px-2 py-1">
              {formatCurrency(item.price)}
            </span>
          )}
        </div>
        
        {/* Bonus points badge if applicable */}
        {item.bonusPoints && (
          <div className="absolute bottom-2 right-2">
            <div className="flex items-center bg-black/70 text-xs px-2 py-1 rounded">
              <Star className="w-3 h-3 text-burntOrange mr-1" />
              <span className="text-burntOrange font-semibold">+{item.bonusPoints} pts</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg group-hover:text-burntOrange transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-white/60 line-clamp-2 mt-1">
          {item.description}
        </p>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuItemCard;
