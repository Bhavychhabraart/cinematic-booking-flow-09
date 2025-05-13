
export interface Venue {
  id: string;
  name: string;
  slug: string;
  type: 'restaurant' | 'nightclub' | 'event';
  description: string;
  imageUrl: string;
  logoUrl: string;
  location: string;
  address?: string;
  city?: string;
  zipCode?: string;
  openingHours: string | {
    weekdays: string;
    weekends: string;
    sunday: string;
  };
  dressCode?: string;
  tags?: string[];
  amenities?: string[];
}

export const venues: Venue[] = [
  {
    id: '1',
    name: 'Aurelia',
    slug: 'aurelia',
    type: 'restaurant',
    description: 'Fine dining experience with seasonal cuisine and an exceptional wine list.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    logoUrl: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143',
    location: 'Downtown, 123 Vine Street',
    address: '123 Vine Street',
    city: 'Downtown',
    zipCode: '90210',
    openingHours: {
      weekdays: '18:00 - 00:00',
      weekends: '18:00 - 02:00',
      sunday: '18:00 - 22:00'
    },
    dressCode: 'Smart Casual',
    tags: ['Fine Dining', 'Wine', 'Seasonal'],
    amenities: ['Valet Parking', 'Private Dining', 'Outdoor Seating', 'Sommelier']
  },
  {
    id: '2',
    name: 'Mirage',
    slug: 'mirage',
    type: 'nightclub',
    description: 'Premium nightlife venue with world-class DJs and exclusive bottle service.',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2',
    logoUrl: 'https://images.unsplash.com/photo-1642349281449-0f47a2d8c548',
    location: 'Marina District, 45 Harbor Blvd',
    address: '45 Harbor Blvd',
    city: 'Marina District',
    zipCode: '90211',
    openingHours: {
      weekdays: 'Closed',
      weekends: '22:00 - 04:00',
      sunday: 'Closed'
    },
    dressCode: 'Upscale',
    tags: ['Nightclub', 'DJ', 'VIP'],
    amenities: ['VIP Tables', 'Bottle Service', 'Dance Floor', 'Live DJ']
  },
  {
    id: '3',
    name: 'Solstice',
    slug: 'solstice',
    type: 'event',
    description: 'Versatile event space for private parties and corporate gatherings.',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    logoUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb970',
    location: 'Arts District, 78 Gallery Way',
    address: '78 Gallery Way',
    city: 'Arts District',
    zipCode: '90212',
    openingHours: 'By appointment only',
    dressCode: 'Event Dependent',
    tags: ['Event Space', 'Private Parties', 'Corporate'],
    amenities: ['AV Equipment', 'Catering', 'Stage', 'Flexible Layout']
  },
  {
    id: '4',
    name: 'Bülach',
    slug: 'bulach',
    type: 'restaurant',
    description: 'Authentic European cuisine in an elegant setting with garden views.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    logoUrl: 'https://images.unsplash.com/photo-1649599007800-5633a4a01d8b',
    location: 'Old Town, 56 Heritage Road',
    address: '56 Heritage Road',
    city: 'Old Town',
    zipCode: '90213',
    openingHours: {
      weekdays: '17:00 - 23:00',
      weekends: '17:00 - 00:00',
      sunday: '17:00 - 22:00'
    },
    dressCode: 'Business Casual',
    tags: ['European', 'Elegant', 'Garden View'],
    amenities: ['Garden Seating', 'Private Rooms', 'Wine Pairing', 'Chef\'s Table']
  }
];

export const getVenueBySlug = (slug: string): Venue | undefined => {
  return venues.find(venue => venue.slug === slug);
};
