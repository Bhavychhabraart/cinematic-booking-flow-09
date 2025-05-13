
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from '@/utils/formatters';
import { ScrollArea } from "@/components/ui/scroll-area";

type ShowcaseImage = {
  id: string;
  url: string;
  alt: string;
  title?: string;
  price?: number;
  description?: string;
};

const demoImages: ShowcaseImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue interior showcase 1',
    title: 'Main Dining Area',
    price: 0,
    description: 'Elegant space perfect for dining with friends and family'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue interior showcase 2',
    title: 'Private VIP Section',
    price: 150,
    description: 'Exclusive area with premium service and amazing views'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue event showcase',
    title: 'Live Performance Space',
    price: 0,
    description: 'Featuring weekly live music and special events'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue experience showcase',
    title: 'Bar Experience',
    price: 0,
    description: 'Craft cocktails and premium spirits'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&h=600', 
    alt: 'Outdoor patio',
    title: 'Outdoor Terrace',
    price: 0,
    description: 'Beautiful open-air seating with city views'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&h=600',
    alt: 'Restaurant ambiance', 
    title: 'Special Events Space',
    price: 300,
    description: 'Perfect for celebrations and corporate gatherings'
  }
];

interface VenueShowcaseProps {
  images?: ShowcaseImage[];
}

const VenueShowcase = ({ images = demoImages }: VenueShowcaseProps) => {
  const [api, setApi] = React.useState<any>(null);
  const [current, setCurrent] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);

  // Handle changing of the current slide
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Start autoplay
    let interval: NodeJS.Timeout;
    if (autoplay) {
      interval = setInterval(() => {
        api.scrollNext();
      }, 4000);
    }
    
    return () => {
      api.off("select", onSelect);
      clearInterval(interval);
    };
  }, [api, autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => (
            <CarouselItem 
              key={image.id} 
              className="pl-2 md:pl-4 md:basis-3/4 lg:basis-2/3 xl:basis-1/2"
            >
              <div className={`overflow-hidden rounded-lg ${current === index ? 'ring-2 ring-gold ring-opacity-80' : ''} transition-all`}>
                <AspectRatio ratio={16/9} className="bg-black/20">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {(image.title || image.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="flex justify-between items-end">
                        <div>
                          {image.title && (
                            <h3 className="text-lg font-medium mb-1">{image.title}</h3>
                          )}
                          {image.description && (
                            <p className="text-sm text-white/80 line-clamp-2">{image.description}</p>
                          )}
                        </div>
                        {image.price > 0 && (
                          <span className="text-gold font-medium text-sm bg-black/30 px-2 py-1 rounded">
                            {formatCurrency(image.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious />
        <CarouselNext />

        {/* Custom indicator dots */}
        <div className="flex justify-center gap-1 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                current === index 
                  ? 'bg-gold w-4' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </motion.div>
  );
};

export default VenueShowcase;
