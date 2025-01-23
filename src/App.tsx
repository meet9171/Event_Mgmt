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
import EventUpdate from './pages/EventUpdate';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { ContactPage } from './pages/Contact';
import Loading from './components/Loading';

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
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/loading" element={<Loading />} />


          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/events/create" element={<EventCreate />} />
              <Route path="/events/update/:eventId" element={<EventUpdate />} />
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