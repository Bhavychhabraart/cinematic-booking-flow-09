
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { venues } from '@/data/venues';

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-16 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 tracking-widest"
        >
          VenueFusion
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-xl font-light tracking-wide text-white/80 max-w-md mx-auto"
        >
          Premium booking for exceptional venues
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-6"
        >
          <Link 
            to="/venues-landing" 
            className="inline-block px-6 py-3 bg-burntOrange text-dark rounded-sm hover:translate-y-[-1px] transition-all duration-200 font-medium tracking-wider uppercase"
          >
            Venue Owners - Learn More
          </Link>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
      >
        {venues.map((venue, index) => (
          <motion.div 
            key={venue.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="venue-card group"
          >
            <Link to={`/venues/${venue.slug}`} className="block">
              <div className="relative h-64 mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img 
                  src={venue.imageUrl} 
                  alt={venue.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-2xl mb-2 tracking-wide">{venue.name}</h3>
                  <p className="text-sm text-white/70 tracking-wider">{venue.type}</p>
                </div>
              </div>
              <p className="text-white/80 mb-4 font-light line-clamp-2">{venue.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">{venue.location}</span>
                <motion.span 
                  className="text-gold text-sm tracking-wider"
                  whileHover={{ x: 5 }}
                >
                  View Details →
                </motion.span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-16 text-center"
      >
        <p className="text-white/50 text-sm">
          Are you a venue owner? <Link to="/owner-dashboard" className="text-gold hover:underline">Login</Link> or <Link to="/venues-landing" className="text-gold hover:underline">Learn More</Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Index;
