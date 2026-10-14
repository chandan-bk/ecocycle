import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SchedulePickup from './pages/SchedulePickup';
import MyPickups from './pages/MyPickups';
import Locator from './pages/Locator';
import Admin from './pages/Admin';
import Impact from './pages/Impact';
import Awareness from './pages/Awareness';

import { Recycle, Heart } from 'lucide-react';

/**
 * App Component
 * Defines application routing hierarchy and common layout shells.
 */
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/locator" element={<Locator />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/awareness" element={<Awareness />} />

            {/* User Authenticated Routes */}
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePickup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-pickups"
              element={
                <ProtectedRoute>
                  <MyPickups />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <h2 className="text-4xl font-black text-slate-800">404</h2>
                  <p className="text-slate-500">Oops! The page you are looking for does not exist.</p>
                  <Link
                    to="/"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
                  >
                    Return Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-700">EcoCycle Platform</span>
              <span>— Responsible E-Waste Pickup & Recycler Locator</span>
            </div>

            <div className="flex items-center gap-1">
              <span>Built for sustainable cities with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>(Free Tier Architecture)</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
