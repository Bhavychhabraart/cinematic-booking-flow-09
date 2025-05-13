import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Venue } from '@/data/venues';

// Define the correct schema that ensures tags and amenities are always arrays
export const venueSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }).regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  }),
  type: z.enum(["restaurant", "nightclub", "event"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  logoUrl: z.string().url({ message: "Please enter a valid logo URL" }),
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  zipCode: z.string().min(3, { message: "Zip code must be at least 3 characters" }),
  openingHours: z.object({
    weekdays: z.string().min(1, { message: "Please specify weekdays hours" }),
    weekends: z.string().min(1, { message: "Please specify weekend hours" }),
    sunday: z.string().min(1, { message: "Please specify Sunday hours" })
  }),
  dressCode: z.string().optional(),
  tags: z.union([
    z.string().transform(val => val ? val.split(',').map(tag => tag.trim()) : []),
    z.array(z.string())
  ]),
  amenities: z.union([
    z.string().transform(val => val ? val.split(',').map(amenity => amenity.trim()) : []),
    z.array(z.string())
  ]),
});

type VenueFormProps = {
  onSubmit: (data: z.infer<typeof venueSchema>) => void;
  initialValues?: Partial<Venue>;
};

const VenueForm = ({ onSubmit, initialValues }: VenueFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: initialValues?.name || '',
      slug: initialValues?.slug || '',
      type: initialValues?.type || 'restaurant',
      description: initialValues?.description || '',
      imageUrl: initialValues?.imageUrl || '',
      logoUrl: initialValues?.logoUrl || '',
      location: initialValues?.location || '',
      address: initialValues?.address || '',
      city: initialValues?.city || '',
      zipCode: initialValues?.zipCode || '',
      openingHours: {
        weekdays: typeof initialValues?.openingHours === 'object' 
          ? initialValues?.openingHours.weekdays 
          : '18:00 - 23:00',
        weekends: typeof initialValues?.openingHours === 'object' 
          ? initialValues?.openingHours.weekends 
          : '18:00 - 00:00',
        sunday: typeof initialValues?.openingHours === 'object' 
          ? initialValues?.openingHours.sunday 
          : '18:00 - 22:00',
      },
      dressCode: initialValues?.dressCode || '',
      tags: initialValues?.tags?.join(', ') || '',
      amenities: initialValues?.amenities?.join(', ') || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof venueSchema>) => {
    try {
      onSubmit(values);
      toast({
        title: "Venue saved",
        description: "The venue has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the venue.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="venue-name (URL friendly)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="nightclub">Nightclub</SelectItem>
                    <SelectItem value="event">Event Space</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="District, Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter venue description" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="openingHours.weekdays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekday Hours</FormLabel>
                <FormControl>
                  <Input placeholder="18:00 - 23:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="openingHours.weekends"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekend Hours</FormLabel>
                <FormControl>
                  <Input placeholder="18:00 - 00:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="openingHours.sunday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sunday Hours</FormLabel>
                <FormControl>
                  <Input placeholder="18:00 - 22:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dressCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dress Code</FormLabel>
              <FormControl>
                <Input placeholder="Smart Casual, Business Casual, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="Fine Dining, Wine, Seasonal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="Valet Parking, Private Dining, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Save Venue</Button>
        </div>
      </form>
    </Form>
  );
};

export type VenueFormValues = z.infer<typeof venueSchema>;

export default VenueForm;
