import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  event_type: z.enum(['conference', 'workshop', 'seminar']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  venue: z.string().min(1, 'Venue is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().default('USD'),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  custom_color: z.string().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

function EventUpdate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { eventId } = useParams<{ eventId: string }>();

  console.log("eventId",eventId);
  console.log("user",user);  

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      currency: 'USD',
      event_type: 'conference',
    },
  });

  // Fetch existing event data when component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !user) return;

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
        }

        console.log("data",event);
        
      } catch (error) {
        console.error('Error fetching event details:', error);
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Update Event</h3>
            <p className="mt-1 text-sm text-gray-600">
              Modify the details of your existing event. All fields marked with * are required.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                      Event Type *
                    </label>
                    <select
                      id="event_type"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...register('event_type')}
                    >
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                      Venue *
                    </label>
                    <input
                      type="text"
                      id="venue"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('venue')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="start_date"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('start_date')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="end_date"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('end_date')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      min="1"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('capacity', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="price"
                        min="0"
                        step="0.01"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                        {...register('price', { valueAsNumber: true })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      id="logo_url"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('logo_url')}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="banner_url" className="block text-sm font-medium text-gray-700">
                      Banner URL
                    </label>
                    <input
                      type="url"
                      id="banner_url"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('banner_url')}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="custom_color" className="block text-sm font-medium text-gray-700">
                      Custom Color
                    </label>
                    <input
                      type="color"
                      id="custom_color"
                      className="mt-1 block w-full h-10 p-1"
                      {...register('custom_color')}
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventUpdate;
