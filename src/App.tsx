import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EventCreate from './pages/EventCreate';
import EventDetail from './pages/EventDetail';
import FormBuilder from './pages/FormBuilder';
import BadgeDesigner from './pages/BadgeDesigner';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicEvent from './pages/PublicEvent';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/register123" element={<Register />} />
          <Route path="/e/:eventId" element={<PublicEvent />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/events/create" element={<EventCreate />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/events/:eventId/form" element={<FormBuilder />} />
              <Route path="/events/:eventId/badges" element={<BadgeDesigner />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;