
import React from 'react';
import { motion } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { provideFeedback } from '@/utils/feedback';
import { Star } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type SpecialsCarouselProps = {
  onItemClick: (itemId: string) => void;
};

const SpecialsCarousel: React.FC<SpecialsCarouselProps> = ({ onItemClick }) => {
  const { menu } = useOrder();
  
  // Filter special items (chef recommended, popular, new, or discounted)
  const specialItems = menu.filter(item => 
    item.chefRecommended || item.popular || item.isNew || item.discounted
  ).slice(0, 5); // Limit to 5 items
  
  if (specialItems.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Special Offers</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {specialItems.map(item => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <div 
                className="p-1"
                onClick={() => {
                  onItemClick(item.id);
                  provideFeedback('selection');
                }}
              >
                <Card className="bg-black/40 border border-white/10 overflow-hidden hover:border-burntOrange/50 transition-all cursor-pointer group h-48">
                  <div className="relative h-full">
                    {/* Background image */}
                    <img 
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                      {/* Content overlay */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        {/* Badges */}
                        <div className="flex gap-2">
                          {item.chefRecommended && (
                            <Badge className="bg-burntOrange text-white border-0">Chef's Choice</Badge>
                          )}
                          {item.popular && !item.chefRecommended && (
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">Popular</Badge>
                          )}
                          {item.isNew && (
                            <Badge className="bg-white text-black border-0">New</Badge>
                          )}
                          {item.discounted && (
                            <Badge className="bg-red-500 text-white border-0">Sale</Badge>
                          )}
                        </div>
                        
                        {/* Item details at bottom */}
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-burntOrange transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-white/60 line-clamp-1 mb-1">
                            {item.description}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              {item.discounted ? (
                                <div className="flex items-center">
                                  <span className="text-white/60 line-through text-sm mr-2">
                                    {formatCurrency(item.originalPrice || 0)}
                                  </span>
                                  <span className="font-bold text-white">
                                    {formatCurrency(item.price)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold text-white">
                                  {formatCurrency(item.price)}
                                </span>
                              )}
                            </div>
                            
                            {item.bonusPoints && (
                              <div className="flex items-center bg-black/70 text-xs px-2 py-1 rounded">
                                <Star className="w-3 h-3 text-burntOrange mr-1" />
                                <span className="text-burntOrange font-semibold">+{item.bonusPoints}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/10 hover:bg-white/20 border-white/10" />
        <CarouselNext className="right-2 bg-white/10 hover:bg-white/20 border-white/10" />
      </Carousel>
    </div>
  );
};

export default SpecialsCarousel;
