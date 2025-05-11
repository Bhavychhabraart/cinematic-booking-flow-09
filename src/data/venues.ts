
export interface Venue {
  id: string;
  name: string;
  slug: string;
  type: 'restaurant' | 'nightclub' | 'event';
  description: string;
  imageUrl: string;
  logoUrl: string;
  location: string;
  openingHours: string;
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
    openingHours: 'Mon-Sun: 18:00 - 00:00'
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
    openingHours: 'Thu-Sat: 22:00 - 04:00'
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
    openingHours: 'By appointment only'
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
    openingHours: 'Tue-Sun: 17:00 - 23:00'
  }
];

export const getVenueBySlug = (slug: string): Venue | undefined => {
  return venues.find(venue => venue.slug === slug);
};
