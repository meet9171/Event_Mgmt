import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, LogOut, PlusCircle } from 'lucide-react';

function Layout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center px-2 py-2 text-gray-900">
                <Calendar className="h-6 w-6 mr-2" />
                <span className="font-semibold">EventMaster</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <Link
                to="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Link>
              
              <div className="ml-4 flex items-center">
                <span className="text-gray-700 mr-4">{user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;