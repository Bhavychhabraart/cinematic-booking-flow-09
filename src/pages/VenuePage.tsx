
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Smartphone, Utensils } from 'lucide-react';
import { getVenueBySlug } from '@/data/venues';
import VenueShowcase from '@/components/VenueShowcase';
import LoyaltyPreview from '@/components/LoyaltyPreview';
import { provideFeedback, vibrationPatterns } from '@/utils/feedback';

const VenuePage: React.FC = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');

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

  return (
    <div className="pb-20">
      <div className="h-[60vh]">
        <VenueShowcase venueSlug={venueName || ''} />
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-5 shadow-xl max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            asChild
          >
            <Link to="/">
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Venues</span>
            </Link>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>

          <div className="flex gap-2 mb-4 flex-wrap">
            {venue.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-white/5">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-white/80 mb-6">{venue.description}</p>

          <Separator className="mb-6" />

          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Location</h2>
              <p className="text-white/70">{venue.address || 'Address not available'}</p>
              <p className="text-white/70">{venue.city || 'City'}, {venue.zipCode || 'Zip code'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleExperienceClick}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Smartphone className="h-5 w-5" />
                <span>In-Venue Experience</span>
              </Button>
              
              <Button
                onClick={handleOrderClick}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-burntOrange text-burntOrange hover:bg-burntOrange hover:text-white"
              >
                <Utensils className="h-5 w-5" />
                <span>Order Now</span>
              </Button>
            
              <Button
                onClick={() => navigate(`/book/${venueName}`)}
                size="lg"
                className="booking-button"
              >
                Make a Reservation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Venue Details Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Venue Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Opening Hours</h3>
                <p className="text-white/70 mb-1">Monday - Thursday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekdays : 'Not specified'}</p>
                <p className="text-white/70 mb-1">Friday - Saturday: {typeof venue.openingHours === 'object' ? venue.openingHours.weekends : 'Not specified'}</p>
                <p className="text-white/70">Sunday: {typeof venue.openingHours === 'object' ? venue.openingHours.sunday : 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Dress Code</h3>
                <p className="text-white/70">{venue.dressCode || 'No specific dress code'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Amenities</h3>
              <ul className="grid grid-cols-2 gap-2">
                {venue.amenities?.map((amenity, index) => (
                  <li key={index} className="text-white/70 flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-[#914110] rounded-full mr-2"></span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Loyalty Card Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Loyalty Status</h2>
            <LoyaltyPreview venueName={venueName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
