// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { format } from 'date-fns';
// import { Calendar, MapPin, Users, Clock } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// interface Event {
//   id: string;
//   name: string;
//   description: string;
//   event_type: string;
//   start_date: string;
//   end_date: string;
//   venue: string;
//   capacity: number;
//   price: number;
//   currency: string;
//   logo_url?: string;
//   banner_url?: string;
//   custom_color?: string;
//   registration_count: number;
// }

// interface FormField {
//   id: string;
//   field_type: string;
//   label: string;
//   placeholder?: string;
//   options?: string[];
//   is_required: boolean;
//   validation_rules?: any;
//   order_index: number;
// }

// const registrationSchema = z.object({
//   attendee_name: z.string().min(1, 'Name is required'),
//   attendee_email: z.string().email('Invalid email address'),
//   form_responses: z.record(z.string()),
// });

// type RegistrationForm = z.infer<typeof registrationSchema>;

// function PublicEvent() {
//   const { eventId } = useParams<{ eventId: string }>();
//   const [event, setEvent] = useState<Event | null>(null);
//   const [formFields, setFormFields] = useState<FormField[]>([]);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);

//   const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
//     resolver: zodResolver(registrationSchema),
//   });

//   useEffect(() => {
//     if (!eventId) return;

//     const fetchEventDetails = async () => {
//       const { data: eventData, error: eventError } = await supabase
//         .from('events')
//         .select('*, registrations(count)')
//         .eq('id', eventId)
//         .single();

//       if (eventError) {
//         console.error('Error fetching event:', eventError);
//         return;
//       }

//       const { data: fieldsData, error: fieldsError } = await supabase
//         .from('form_fields')
//         .select('*')
//         .eq('event_id', eventId)
//         .order('order_index');

//       if (fieldsError) {
//         console.error('Error fetching form fields:', fieldsError);
//         return;
//       }

//       setEvent({
//         ...eventData,
//         registration_count: eventData.registrations?.[0]?.count || 0,
//       });
//       setFormFields(fieldsData);
//     };

//     fetchEventDetails();
//   }, [eventId]);

//   const onSubmit = async (data: RegistrationForm) => {
//     if (!event || !eventId) return;

//     try {
//       // Create registration
//       const { data: registration, error: registrationError } = await supabase
//         .from('registrations')
//         .insert([
//           {
//             event_id: eventId,
//             attendee_name: data.attendee_name,
//             attendee_email: data.attendee_email,
//             ticket_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
//           },
//         ])
//         .select()
//         .single();

//       if (registrationError) throw registrationError;

//       // Create form responses
//       if (Object.keys(data.form_responses).length > 0) {
//         const formResponses = Object.entries(data.form_responses).map(([fieldId, value]) => ({
//           registration_id: registration.id,
//           field_id: fieldId,
//           response_value: value,
//         }));

//         const { error: responsesError } = await supabase
//           .from('form_responses')
//           .insert(formResponses);

//         if (responsesError) throw responsesError;
//       }

//       setRegistrationSuccess(true);
//     } catch (error) {
//       console.error('Error submitting registration:', error);
//     }
//   };

//   if (!event) {
//     return <div>Loading...</div>;
//   }

//   if (registrationSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
//             <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
//             <p className="text-gray-600 mb-4">
//               Thank you for registering for {event.name}. You will receive a confirmation email shortly.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Register Another Attendee
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         {/* Event Header */}
//         <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
//           <div className="px-4 py-5 sm:px-6">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">{event.name}</h3>
//             <p className="mt-1 max-w-2xl text-sm text-gray-500">{event.event_type}</p>
//           </div>
//           <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
//             <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
//               <div className="sm:col-span-1">
//                 <dt className="text-sm font-medium text-gray-500 flex items-center">
//                   <Calendar className="h-5 w-5 mr-2" />
//                   Date & Time
//                 </dt>
//                 <dd className="mt-1 text-sm text-gray-900">
//                   {format(new Date(event.start_date), 'PPP')} - {format(new Date(event.end_date), 'PPP')}
//                 </dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="text-sm font-medium text-gray-500 flex items-center">
//                   <MapPin className="h-5 w-5 mr-2" />
//                   Venue
//                 </dt>
//                 <dd className="mt-1 text-sm text-gray-900">{event.venue}</dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="text-sm font-medium text-gray-500 flex items-center">
//                   <Users className="h-5 w-5 mr-2" />
//                   Capacity
//                 </dt>
//                 <dd className="mt-1 text-sm text-gray-900">
//                   {event.registration_count} / {event.capacity} registered
//                 </dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="text-sm font-medium text-gray-500 flex items-center">
//                   <Clock className="h-5 w-5 mr-2" />
//                   Price
//                 </dt>
//                 <dd className="mt-1 text-sm text-gray-900">
//                   {event.price === 0 ? 'Free' : `${event.price} ${event.currency}`}
//                 </dd>
//               </div>
//               <div className="sm:col-span-2">
//                 <dt className="text-sm font-medium text-gray-500">Description</dt>
//                 <dd className="mt-1 text-sm text-gray-900">{event.description}</dd>
//               </div>
//             </dl>
//           </div>
//         </div>

//         {/* Registration Form */}
//         <div className="bg-white shadow sm:rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Register for this event</h3>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <div>
//                 <label htmlFor="attendee_name" className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="attendee_name"
//                   className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
//                   {...register('attendee_name')}
//                 />
//                 {errors.attendee_name && (
//                   <p className="mt-1 text-sm text-red-600">{errors.attendee_name.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="attendee_email" className="block text-sm font-medium text-gray-700">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="attendee_email"
//                   className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
//                   {...register('attendee_email')}
//                 />
//                 {errors.attendee_email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.attendee_email.message}</p>
//                 )}
//               </div>

//               {formFields.map((field) => (
//                 <div key={field.id}>
//                   <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
//                     {field.label}
//                     {field.is_required && <span className="text-red-500">*</span>}
//                   </label>
//                   {field.field_type === 'text' && (
//                     <input
//                       type="text"
//                       id={field.id}
//                       placeholder={field.placeholder}
//                       className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
//                       {...register(`form_responses.${field.id}`)}
//                     />
//                   )}
//                   {field.field_type === 'select' && field.options && (
//                     <select
//                       id={field.id}
//                       className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
//                       {...register(`form_responses.${field.id}`)}
//                     >
//                       <option value="">Select an option</option>
//                       {field.options.map((option) => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>
//               ))}

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Register
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PublicEvent;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { format } from 'date-fns';
// import { Calendar, MapPin, Users, Clock } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// interface Event {
//   id: string;
//   name: string;
//   description: string;
//   event_type: string;
//   start_date: string;
//   end_date: string;
//   venue: string;
//   capacity: number;
//   price: number;
//   currency: string;
//   logo_url?: string;
//   banner_url?: string;
//   custom_color?: string;
//   registration_count: number;
// }

// interface FormField {
//   id: string;
//   field_type: string;
//   label: string;
//   placeholder?: string;
//   options?: string[];
//   is_required: boolean;
//   validation_rules?: any;
//   order_index: number;
// }

// const registrationSchema = z.object({
//   attendee_name: z.string().min(1, 'Name is required'),
//   attendee_email: z.string().email('Invalid email address'),
//   form_responses: z.record(z.string()),
// });

// type RegistrationForm = z.infer<typeof registrationSchema>;

// function PublicEvent() {
//   const { eventId } = useParams<{ eventId: string }>();
//   const [event, setEvent] = useState<Event | null>(null);
//   const [formFields, setFormFields] = useState<FormField[]>([]);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
//     resolver: zodResolver(registrationSchema),
//   });

//   useEffect(() => {
//     if (!eventId) return;

//     const fetchEventDetails = async () => {
//       const { data: eventData, error: eventError } = await supabase
//         .from('events')
//         .select('*, registrations(count)')
//         .eq('id', eventId)
//         .single();

//       if (eventError) {
//         console.error('Error fetching event:', eventError);
//         return;
//       }

//       const { data: fieldsData, error: fieldsError } = await supabase
//         .from('form_fields')
//         .select('*')
//         .eq('event_id', eventId)
//         .order('order_index');

//       if (fieldsError) {
//         console.error('Error fetching form fields:', fieldsError);
//         return;
//       }

//       setEvent({
//         ...eventData,
//         registration_count: eventData.registrations?.[0]?.count || 0,
//       });
//       setFormFields(fieldsData || []);
//     };

//     fetchEventDetails();
//   }, [eventId]);

//   const onSubmit = async (data: RegistrationForm) => {
//     if (!event || !eventId) return;

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Check if event is at capacity
//       if (event.registration_count >= event.capacity) {
//         throw new Error('This event is at full capacity');
//       }

//       // Create registration
//       const { data: registration, error: registrationError } = await supabase
//         .from('registrations')
//         .insert([
//           {
//             event_id: eventId,
//             attendee_name: data.attendee_name,
//             attendee_email: data.attendee_email,
//             ticket_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
//             payment_status: event.price === 0 ? 'paid' : 'pending',
//           },
//         ])
//         .select()
//         .single();

//       if (registrationError) throw registrationError;

//       // Create form responses
//       if (Object.keys(data.form_responses).length > 0) {
//         const formResponses = Object.entries(data.form_responses).map(([fieldId, value]) => ({
//           registration_id: registration.id,
//           field_id: fieldId,
//           response_value: value,
//         }));

//         const { error: responsesError } = await supabase
//           .from('form_responses')
//           .insert(formResponses);

//         if (responsesError) throw responsesError;
//       }

//       // Get badge template
//       const { data: badgeTemplate } = await supabase
//         .from('badge_templates')
//         .select('*')
//         .eq('event_id', eventId)
//         .single();

//       if (badgeTemplate) {
//         // Prepare registration data for badge
//         const registrationData = {
//           name: data.attendee_name,
//           email: data.attendee_email,
//           ticket_code: registration.ticket_code,
//           ...Object.fromEntries(
//             Object.entries(data.form_responses).map(([fieldId, value]) => [
//               formFields.find(f => f.id === fieldId)?.label || fieldId,
//               value
//             ])
//           )
//         };

//         // Send registration email with badge
//         await sendRegistrationEmail(
//           eventId,
//           registration.id,
//           badgeTemplate.elements,
//           badgeTemplate.aspectRatio,
//           registrationData
//         );
//       }

//       setRegistrationSuccess(true);
//     } catch (error: any) {
//       console.error('Error submitting registration:', error);
//       setError(error.message || 'Failed to submit registration. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!event) {
//     return <div>Loading...</div>;
//   }

//   if (registrationSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
//             <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
//             <p className="text-gray-600 mb-4">
//               Thank you for registering for {event.name}. You will receive a confirmation email shortly.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Register Another Attendee
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto">
//           {event.banner_url && (
//             <div className="mb-8">
//               <img
//                 src={event.banner_url}
//                 alt={event.name}
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//             </div>
//           )}
          
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <div className="flex items-center">
//                 {event.logo_url && (
//                   <img
//                     src={event.logo_url}
//                     alt=""
//                     className="h-12 w-12 rounded-full mr-4"
//                   />
//                 )}
//                 <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
//               </div>
//               <p className="mt-4 text-gray-600">{event.description}</p>
//             </div>
            
//             <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div className="flex items-center">
//                   <Calendar className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-gray-600">
//                     {format(new Date(event.start_date), 'PPP')}
//                     {event.end_date && ` - ${format(new Date(event.end_date), 'PPP')}`}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Clock className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-gray-600">
//                     {format(new Date(event.start_date), 'p')}
//                     {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <MapPin className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-gray-600">{event.venue}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Users className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-gray-600">
//                     {event.registration_count} / {event.capacity} registered
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Form</h3>
//               {error && (
//                 <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
//                   {error}
//                 </div>
//               )}
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
//                 {formFields.map((field) => (
//                   <div key={field.id}>
//                     <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
//                       {field.label}
//                       {field.is_required && <span className="text-red-500">*</span>}
//                     </label>
//                     {field.field_type === 'text' && (
//                       <input
//                         type="text"
//                         {...register(`form_responses.${field.id}`)}
//                         placeholder={field.placeholder}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     )}
//                      {field.field_type === 'email' && (
//                       <input
//                         type="email"
//                         {...register(`form_responses.${field.id}`)}
//                         placeholder={field.placeholder}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     )}
//                      {field.field_type === 'date' && (
//                       <input
//                         type="date"
//                         {...register(`form_responses.${field.id}`)}
//                         placeholder={field.placeholder}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     )}
//                      {field.field_type === 'number' && (
//                       <input
//                         type="number"
//                         {...register(`form_responses.${field.id}`)}
//                         placeholder={field.placeholder}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     )}
//                     {field.field_type === 'select' && field.options && (
//                       <select
//                         {...register(`form_responses.${field.id}`)}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       >
//                         <option value="">Select an option</option>
//                         {field.options.map((option) => (
//                           <option key={option} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                       isLoading ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {isLoading ? 'Registering...' : 'Register'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PublicEvent;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Event {
  id: string;
  name: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  venue: string;
  capacity: number;
  price: number;
  currency: string;
  logo_url?: string;
  banner_url?: string;
  custom_color?: string;
  registration_count: number;
}

interface FormField {
  id: string;
  field_type: string;
  label: string;
  placeholder?: string;
  options?: string[];
  is_required: boolean;
  validation_rules?: any;
  order_index: number;
}

const registrationSchema = z.object({
  attendee_name: z.string().min(1, 'Name is required'),
  attendee_email: z.string().email('Invalid email address'),
  form_responses: z.record(z.string()),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function PublicEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   // Find Name and Email fields
   console.log("formFields",formFields);
   
   const nameField = formFields.find(f => f.field_type === 'text' && f.order_index === 0);
   const emailField = formFields.find(f => f.field_type === 'email' && f.order_index === 1);

   
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*, registrations(count)')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Error fetching event:', eventError);
        return;
      }

      const { data: fieldsData, error: fieldsError } = await supabase
        .from('form_fields')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index');

      if (fieldsError) {
        console.error('Error fetching form fields:', fieldsError);
        return;
      }

      setEvent({
        ...eventData,
        registration_count: eventData.registrations?.[0]?.count || 0,
      });
      setFormFields(fieldsData || []);
    };

    fetchEventDetails();
  }, [eventId]);

  const onSubmit = async (data: RegistrationForm) => {
    if (!event || !eventId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check if event is at capacity
      if (event.registration_count >= event.capacity) {
        throw new Error('This event is at full capacity');
      }

      // Create registration
      const { data: registration, error: registrationError } = await supabase
        .from('registrations')
        .insert([
          {
            event_id: eventId,
            attendee_name: data.attendee_name,
            attendee_email: data.attendee_email,
            ticket_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            payment_status: event.price === 0 ? 'paid' : 'pending',
          },
        ])
        .select()
        .single();

      if (registrationError) throw registrationError;

      // Create form responses
      if (Object.keys(data.form_responses).length > 0) {
        const formResponses = Object.entries(data.form_responses).map(([fieldId, value]) => ({
          registration_id: registration.id,
          field_id: fieldId,
          response_value: value,
        }));

        const { error: responsesError } = await supabase
          .from('form_responses')
          .insert(formResponses);

        if (responsesError) throw responsesError;
      }

      // Get badge template
      const { data: badgeTemplate } = await supabase
        .from('badge_templates')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (badgeTemplate) {
        // Prepare registration data for badge
        const registrationData = {
          name: data.attendee_name,
          email: data.attendee_email,
          ticket_code: registration.ticket_code,
          ...Object.fromEntries(
            Object.entries(data.form_responses).map(([fieldId, value]) => [
              formFields.find(f => f.id === fieldId)?.label || fieldId,
              value
            ])
          )
        };

        // Send registration email with badge
        await sendRegistrationEmail(
          eventId,
          registration.id,
          badgeTemplate.elements,
          badgeTemplate.aspectRatio,
          registrationData
        );
      }

      setRegistrationSuccess(true);
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      setError(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for registering for {event.name}. You will receive a confirmation email shortly.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Another Attendee
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {event.banner_url && (
            <div className="mb-8">
              <img
                src={event.banner_url}
                alt={event.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                {event.logo_url && (
                  <img
                    src={event.logo_url}
                    alt=""
                    className="h-12 w-12 rounded-full mr-4"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              </div>
              <p className="mt-4 text-gray-600">{event.description}</p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {format(new Date(event.start_date), 'PPP')}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'PPP')}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {format(new Date(event.start_date), 'p')}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{event.venue}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {event.registration_count} / {event.capacity} registered
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Form</h3>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="attendee_name" className="block text-sm font-medium text-gray-700">
                  {nameField?.label || 'Name'}
                  </label>
                  <input
                    type="text"
                    {...register('attendee_name')}
                    placeholder={nameField?.placeholder || 'Your Name'}

                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.attendee_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.attendee_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="attendee_email" className="block text-sm font-medium text-gray-700">
                  {emailField?.label || 'Email'}

                  </label>
                  <input
                    type="email"
                    {...register('attendee_email')}
                    placeholder={emailField?.placeholder || 'Your Email'}

                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.attendee_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.attendee_email.message}</p>
                  )}
                </div>

                {formFields.filter(f => f.order_index >= 2).map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.is_required && <span className="text-red-500">*</span>}
                    </label>
                    {field.field_type === 'text' && (
                      <input
                        type="text"
                        {...register(`form_responses.${field.id}`)}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                      {field.field_type === 'email' && (
                      <input
                        type="email"
                        {...register(`form_responses.${field.id}`)}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                      {field.field_type === 'date' && (
                      <input
                        type="date"
                        {...register(`form_responses.${field.id}`)}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                      {field.field_type === 'number' && (
                      <input
                        type="number"
                        {...register(`form_responses.${field.id}`)}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                    {field.field_type === 'select' && field.options && (
                      <select
                        {...register(`form_responses.${field.id}`)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicEvent;