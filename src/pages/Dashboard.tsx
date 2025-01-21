import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Users, Ticket, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: string;
  name: string;
  event_type: string;
  start_date: string;
  venue: string;
  registration_count: number;
}

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
}

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*, registrations(count)')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      const formattedEvents = eventsData.map(event => ({
        ...event,
        registration_count: event.registrations?.[0]?.count || 0,
      }));

      setEvents(formattedEvents);

      // Calculate stats
      const now = new Date();
      setStats({
        totalEvents: formattedEvents.length,
        upcomingEvents: formattedEvents.filter(e => new Date(e.start_date) > now).length,
        totalRegistrations: formattedEvents.reduce((acc, curr) => acc + (curr.registration_count || 0), 0),
      });
    };

    fetchEvents();
  }, [user]);

  return (
    <div className="space-y-6 px-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalEvents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingEvents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalRegistrations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Events</h3>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {events.map((event) => ( 
             <li key={event.id}> 
               <Link to={`/events/${event.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">event name</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        date 
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                         registrations
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link> 
             </li> 
           ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;