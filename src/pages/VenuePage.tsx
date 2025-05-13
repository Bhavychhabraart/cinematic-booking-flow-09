
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Smartphone, Utensils, Gift } from 'lucide-react';
import { getVenueBySlug } from '@/data/venues';
import VenueShowcase from '@/components/VenueShowcase';
import LoyaltyPreview from '@/components/LoyaltyPreview';
import { provideFeedback, vibrationPatterns } from '@/utils/feedback';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GiftCardPurchase from '@/components/GiftCardPurchase';

const VenuePage: React.FC = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  const [giftCardOpen, setGiftCardOpen] = React.useState(false);

  if (!venue) {
    navigate('/');
    return null;
  }

  const handleExperienceClick = () => {
    provideFeedback('buttonPress');
    navigate(`/venue-experience/${venueName}`);
  };

  const handleOrderClick = () => {
    provideFeedback('buttonPress');
    navigate(`/order/${venueName}`);
  };

  const handleGiftCardClick = () => {
    provideFeedback('buttonPress');
    setGiftCardOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="h-screen">
        <VenueShowcase venueSlug={venueName || ''} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-16 py-24 bg-black"
      >
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {/* About Section */}
            <section>
              <h2 className="text-3xl font-light tracking-wider mb-12">About</h2>
              <p className="text-white/80 text-xl font-light leading-relaxed max-w-3xl mb-10">
                {venue.description}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-12">
                {venue.tags?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-transparent border-white/20 font-light text-xs px-3 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
            
            <Separator className="bg-white/10" />
            
            {/* Details Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="font-light text-xl mb-8">Details</h3>
                
                <div className="space-y-12">
                  <div>
                    <h4 className="text-white/60 uppercase text-xs tracking-wider mb-4">Location</h4>
                    <p className="text-white text-base font-light">{venue.address || 'Address not available'}</p>
                    <p className="text-white text-base font-light">{venue.city || 'City'}, {venue.zipCode || 'Zip code'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white/60 uppercase text-xs tracking-wider mb-4">Opening Hours</h4>
                    <p className="text-white text-base font-light">Monday - Thursday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekdays : 'Not specified'}</p>
                    <p className="text-white text-base font-light">Friday - Saturday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekends : 'Not specified'}</p>
                    <p className="text-white text-base font-light">Sunday: {typeof venue.openingHours === 'object' ? venue.openingHours.sunday : 'Not specified'}</p>
                  </div>
                  
                  {venue.dressCode && (
                    <div>
                      <h4 className="text-white/60 uppercase text-xs tracking-wider mb-4">Dress Code</h4>
                      <p className="text-white text-base font-light">{venue.dressCode}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-light text-xl mb-8">Amenities</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {venue.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1 h-1 bg-burntOrange mr-3"></div>
                      <span className="text-white/80 font-light">{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-16">
                  <h3 className="font-light text-xl mb-8">Your Loyalty Status</h3>
                  <LoyaltyPreview venueName={venueName} />
                </div>
              </div>
            </section>
            
            <Separator className="bg-white/10" />
            
            {/* Actions Section */}
            <section className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <h3 className="font-light text-xl mb-6">Experience {venue.name}</h3>
                <p className="text-white/60 font-light mb-6 max-w-md">
                  Discover our digital services and enhance your visit with our in-venue features.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleExperienceClick}
                  variant="outline"
                  className="bg-transparent border-white/20 hover:bg-white/5 text-sm font-light tracking-wider px-6 py-8 h-auto"
                >
                  <Smartphone className="h-4 w-4 mr-3" />
                  <span>In-Venue Experience</span>
                </Button>
                
                <Button
                  onClick={handleOrderClick}
                  variant="outline"
                  className="bg-transparent border-burntOrange text-burntOrange hover:bg-burntOrange hover:text-white text-sm font-light tracking-wider px-6 py-8 h-auto"
                >
                  <Utensils className="h-4 w-4 mr-3" />
                  <span>Order Now</span>
                </Button>
                
                <Button
                  onClick={() => navigate(`/book/${venueName}`)}
                  className="bg-burntOrange hover:bg-burntOrange/90 text-dark text-sm font-normal tracking-wider px-6 py-8 h-auto"
                >
                  Make a Reservation
                </Button>
              </div>
            </section>
            
            {/* Gift card section */}
            <div className="flex justify-end">
              <Button 
                onClick={handleGiftCardClick}
                variant="outline" 
                className="bg-transparent border-gold text-gold hover:bg-gold/10 text-sm font-light tracking-wider"
              >
                <Gift size={14} className="mr-2" />
                <span>Buy Gift Card</span>
              </Button>
            </div>
            
            {/* Back Button */}
            <div className="pt-8">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent hover:text-white/70 pl-0"
                asChild
              >
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm font-light">Back to Venues</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gift Card Dialog */}
      <Dialog open={giftCardOpen} onOpenChange={setGiftCardOpen}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider text-center">Purchase a Gift Card</DialogTitle>
          </DialogHeader>
          <GiftCardPurchase venueName={venueName || ''} onComplete={() => setGiftCardOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenuePage;
