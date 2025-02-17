import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock, QrCode, Edit, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode.react';
import { formatInTimeZone } from 'date-fns-tz';

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

interface Registration {
  id: string;
  created_at: string;
  attendee_name: string;
  attendee_email: string;
  payment_status: string;
  ticket_code: string;
}

function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showQR, setShowQR] = useState(false);

  const navigate = useNavigate();

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

      const { data: registrationsData, error: registrationsError } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (registrationsError) {
        console.error('Error fetching registrations:', registrationsError);
        return;
      }

      setEvent({
        ...eventData,
        registration_count: eventData.registrations?.[0]?.count || 0,
      });
      setRegistrations(registrationsData);
    };

    fetchEventDetails();
  }, [eventId]);

  const publicUrl = `${window.location.origin}/e/${event?.id}`;

  if (!event) {
    return <div id="loading">Loading&#8230;</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/dashboard`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>

        {/* Event Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
              <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center'>
                <div className="flex-shrink-0">
                  <img
                    src={event?.logo_url}
                    alt={event?.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" 
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">{event?.name}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">{event?.event_type}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:space-x-4 w-full sm:w-auto">
                <Link
                  to={`/events/update/${eventId}`}
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-[#6B46C1] shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-[#6B46C1] bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Edit Event
                </Link>
                <Link
                  to={`/events/${eventId}/form`}
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-[#6B46C1] shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-[#6B46C1] bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Edit Form
                </Link>
                <Link
                  to={`/events/${eventId}/badges`}
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-[#6B46C1] shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-[#6B46C1] bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Design Badges
                </Link>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-[#6B46C1] shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-[#6B46C1] bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {showQR ? 'Hide QR' : 'Show QR'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <dl className="">
              <img 
                src={event?.banner_url} 
                alt="Event Banner" 
                className='w-full h-48 sm:h-64 md:h-80 lg:h-96' 
              />
            </dl>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {showQR && (
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white rounded-lg shadow">
                  <QRCode value={publicUrl} size={150} className="mx-auto" />
                  <p className="mt-2 text-xs sm:text-sm text-center text-gray-500">Scan to view event page</p>
                </div>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#6B46C1] text-bold" />
                  Date & Time
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                  {formatInTimeZone(new Date(event.start_date), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ssXXX')} -{' '}
                  {formatInTimeZone(new Date(event.end_date), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ssXXX')}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#6B46C1] text-bold" />
                  Venue
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900">{event?.venue}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#6B46C1] text-bold" />
                  Capacity
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                  {event?.registration_count} / {event?.capacity} registered
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#6B46C1] text-bold" />
                  Price
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                  {event?.price === 0 ? 'Free' : `${event?.price} ${event?.currency}`}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs sm:text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-xs sm:text-sm text-gray-900">{event?.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Registrations */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Registrations</h3>
          </div>
          <div className="bg-white overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-2xs sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-2xs sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-2xs sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-2xs sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-2xs sm:text-sm font-medium text-gray-900">
                            {registration.attendee_name}
                          </div>
                          <div className="text-2xs sm:text-sm text-gray-500">
                            {registration.attendee_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="text-2xs sm:text-sm text-gray-900">
                        {format(new Date(registration.created_at), 'PPP')}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-2xs sm:text-xs leading-5 font-semibold rounded-full ${registration.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {registration.payment_status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-2xs sm:text-sm text-gray-500">
                      {registration.ticket_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;