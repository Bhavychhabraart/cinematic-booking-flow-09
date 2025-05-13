
import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  venueSlug?: string;
}

const VenueShowcase = ({ images = demoImages, venueSlug }: VenueShowcaseProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full"
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0 md:-ml-0">
          {images.map((image) => (
            <CarouselItem key={image.id} className="pl-0 md:pl-0 basis-full md:basis-full lg:basis-full">
              <div className="overflow-hidden">
                <AspectRatio ratio={21/9} className="bg-transparent">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-6 right-6 flex items-center space-x-4 bg-black/30 backdrop-blur-sm px-4 py-2">
          <CarouselPrevious className="relative inset-auto left-0 right-0 translate-y-0 h-8 w-8 bg-transparent border-white/20 hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext className="relative inset-auto left-0 right-0 translate-y-0 h-8 w-8 bg-transparent border-white/20 hover:bg-white/10">
            <ChevronRight className="h-4 w-4" />
          </CarouselNext>
        </div>
      </Carousel>
    </motion.div>
  );
};

export default VenueShowcase;
