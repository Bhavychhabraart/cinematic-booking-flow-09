
import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type ShowcaseImage = {
  id: string;
  url: string;
  alt: string;
};

const demoImages: ShowcaseImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue interior showcase 1'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue interior showcase 2'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue event showcase'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=600',
    alt: 'Venue experience showcase'
  }
];

interface VenueShowcaseProps {
  images?: ShowcaseImage[];
}

const VenueShowcase = ({ images = demoImages }: VenueShowcaseProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-10"
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image) => (
            <CarouselItem key={image.id} className="pl-2 md:pl-4 md:basis-2/3 lg:basis-1/2">
              <div className="overflow-hidden rounded-lg">
                <AspectRatio ratio={2/1} className="bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="relative inset-auto left-0 right-0 translate-y-0 h-8 w-8" />
          <CarouselNext className="relative inset-auto left-0 right-0 translate-y-0 h-8 w-8" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default VenueShowcase;
