
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      <div className="h-[75vh]">
        <VenueShowcase venueSlug={venueName || ''} />
      </div>

      <div className="container mx-auto px-8 -mt-20 mb-16">
        <div className="bg-black/70 backdrop-blur-md p-10 max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 hover:bg-transparent hover:text-white/70 pl-0"
            asChild
          >
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-light">Back to Venues</span>
            </Link>
          </Button>

          <h1 className="text-2xl md:text-3xl font-light tracking-wider mb-4">{venue.name}</h1>

          <div className="flex gap-3 mb-8 flex-wrap">
            {venue.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-transparent border-white/20 font-light text-xs px-3 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-white/70 mb-10 font-light max-w-2xl leading-relaxed">{venue.description}</p>

          <Separator className="my-10 bg-white/10" />

          <div className="flex flex-col md:flex-row gap-10 md:items-start justify-between">
            <div>
              <h2 className="text-lg font-light mb-4">Location</h2>
              <p className="text-white/60 font-light">{venue.address || 'Address not available'}</p>
              <p className="text-white/60 font-light">{venue.city || 'City'}, {venue.zipCode || 'Zip code'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExperienceClick}
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/5 text-sm font-light tracking-wider"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                <span>In-Venue Experience</span>
              </Button>
              
              <Button
                onClick={handleOrderClick}
                variant="outline"
                className="bg-transparent border-burntOrange text-burntOrange hover:bg-burntOrange hover:text-white text-sm font-light tracking-wider"
              >
                <Utensils className="h-4 w-4 mr-2" />
                <span>Order Now</span>
              </Button>
            
              <Button
                onClick={() => navigate(`/book/${venueName}`)}
                className="bg-burntOrange hover:bg-burntOrange/90 text-dark text-sm font-normal tracking-wider"
              >
                Make a Reservation
              </Button>
            </div>
          </div>
          
          {/* Gift card button */}
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleGiftCardClick}
              variant="outline" 
              className="bg-transparent border-gold text-gold hover:bg-gold/10 text-sm font-light tracking-wider"
            >
              <Gift size={14} className="mr-2" />
              <span>Buy Gift Card</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
          {/* Venue Details Section */}
          <div>
            <h2 className="text-xl font-light mb-8 tracking-wider">Venue Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
              <div>
                <h3 className="font-normal mb-4 text-base">Opening Hours</h3>
                <p className="text-white/60 mb-2 font-light">Monday - Thursday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekdays : 'Not specified'}</p>
                <p className="text-white/60 mb-2 font-light">Friday - Saturday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekends : 'Not specified'}</p>
                <p className="text-white/60 font-light">Sunday: {typeof venue.openingHours === 'object' ? venue.openingHours.sunday : 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-normal mb-4 text-base">Dress Code</h3>
                <p className="text-white/60 font-light">{venue.dressCode || 'No specific dress code'}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-normal mb-4 text-base">Amenities</h3>
              <ul className="grid grid-cols-1 gap-2">
                {venue.amenities?.map((amenity, index) => (
                  <li key={index} className="text-white/60 flex items-start font-light">
                    <span className="inline-block w-1 h-1 bg-[#914110] mr-3 mt-2"></span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Loyalty Card Section */}
          <div>
            <h2 className="text-xl font-light mb-8 tracking-wider">Your Loyalty Status</h2>
            <LoyaltyPreview venueName={venueName} />
          </div>
        </div>
      </div>

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
