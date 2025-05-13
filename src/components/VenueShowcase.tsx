
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Full screen image */}
      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full"
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="object-cover w-full h-full"
        />
      </motion.div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-16 bg-gradient-to-t from-black/80 to-transparent">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-light tracking-wider text-white mb-2">{venueSlug}</h1>
            <h2 className="text-xl md:text-2xl font-extralight tracking-widest text-white/80 uppercase mb-8">
              {venueSlug === 'mirage' ? 'nightclub' : venueSlug === 'aurelia' ? 'restaurant' : 'venue'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="self-start px-12 py-4 bg-burntOrange text-dark text-base uppercase tracking-wider font-normal"
            >
              Book Now
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Navigation controls */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-6 z-30">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="text-white/80 hover:text-white focus:outline-none"
        >
          <ChevronLeft className="h-8 w-8" />
        </motion.button>
        <div className="flex space-x-2">
          {images.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-[2px] w-6 transition-all duration-300",
                idx === currentIndex ? "bg-white" : "bg-white/40"
              )}
            />
          ))}
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="text-white/80 hover:text-white focus:outline-none"
        >
          <ChevronRight className="h-8 w-8" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VenueShowcase;
