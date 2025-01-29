import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, X } from 'lucide-react';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  event_type: z.enum(['conference', 'workshop', 'seminar']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  venue: z.string().min(1, 'Venue is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().default('INR'),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  custom_color: z.string().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

function EventUpdate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Add state for image previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      currency: 'INR',
      event_type: 'conference',
    },
  });

  // Image preview handler
  const handleImagePreview = (
    url: string,
    type: 'logo' | 'banner',
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setError(null);
    setPreview(null);

    if (!url) return;

    const img = new Image();
    img.onload = () => {
      setPreview(url);
    };
    img.onerror = () => {
      setError('Invalid image URL. Please check the link.');
    };
    img.src = url;
  };

  // Function to clear image preview
  const clearImagePreview = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoPreview(null);
      setValue('logo_url', '');
      setLogoError(null);
    } else {
      setBannerPreview(null);
      setValue('banner_url', '');
      setBannerError(null);
    }
  };

  // Fetch existing event data when component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !user) return;

      setIsLoading(true);
      try {
        const { data: event, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (event) {
          reset({
            ...event,
            start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
            end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
          });

          // Set image previews if URLs exist
          if (event.logo_url) {
            handleImagePreview(event.logo_url, 'logo', setLogoPreview, setLogoError);
          }
          if (event.banner_url) {
            handleImagePreview(event.banner_url, 'banner', setBannerPreview, setBannerError);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setIsLoading(false);
        navigate('/events');
      }
    };

    fetchEventDetails();
  }, [eventId, user, reset, navigate]);

  const onSubmit = async (data: EventForm) => {
    if (!user || !eventId) return;

    try {
      const { data: updatedEvent, error } = await supabase
        .from('events')
        .update({
          ...data,
          user_id: user.id,
        })
        .eq('id', eventId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      navigate(`/events/${updatedEvent.id}`);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (isLoading) {
    return <div id="loading">Loading&#8230;</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(`/dashboard`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Event
      </button>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-[#6B46C1] p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Update Event
          </h2>
          <p className="text-sm sm:text-base text-purple-100 text-center mt-2">
            Modify the details of your existing event. Fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Event Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter event name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe your event"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                id="event_type"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('event_type')}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                placeholder="Event location"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('venue')}
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                id="start_date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('start_date')}
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                id="end_date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('end_date')}
              />
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                min="1"
                placeholder="Max attendees"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('capacity', { valueAsNumber: true })}
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  placeholder="Event cost"
                  className="w-full pl-7 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                  {...register('price', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Logo URL */}
            <div className="sm:col-span-2">
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo_url"
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('logo_url', {
                  onChange: (e) => handleImagePreview(
                    e.target.value,
                    'logo',
                    setLogoPreview,
                    setLogoError
                  )
                })}
              />

              {logoPreview && (
                <div className="relative group mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => clearImagePreview('logo')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {logoError && (
                <p className="mt-1 text-sm text-red-600">{logoError}</p>
              )}
            </div>

            {/* Banner URL */}
            <div className="sm:col-span-2">
              <label htmlFor="banner_url" className="block text-sm font-medium text-gray-700 mb-2">
                Banner URL
              </label>
              <input
                type="url"
                id="banner_url"
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                {...register('banner_url', {
                  onChange: (e) => handleImagePreview(
                    e.target.value,
                    'banner',
                    setBannerPreview,
                    setBannerError
                  )
                })}
              />
              {bannerPreview && (
                <div className="relative group mt-2">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => clearImagePreview('banner')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {bannerError && (
                <p className="mt-1 text-sm text-red-600">{bannerError}</p>
              )}
            </div>

            {/* Custom Color */}
            <div className="sm:col-span-2">
              <label htmlFor="custom_color" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  id="custom_color"
                  className="w-16 h-12 rounded-lg cursor-pointer"
                  {...register('custom_color')}
                />
                <span className="text-sm text-gray-600">
                  Choose a color for your event branding
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-right">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#6B46C1] text-white font-semibold rounded-lg hover:bg-[#6B46C1] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventUpdate;
