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
      <div className="flex flex-col min-h-screen bg-[#F8FAF8] text-[#1E2922] font-sans antialiased selection:bg-[#E7F3EC] selection:text-[#0F3D2E]">
        
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
                  <h2 className="text-4xl font-display font-bold text-[#0F3D2E]">404</h2>
                  <p className="text-[#52665A]">Requested civic route does not exist.</p>
                  <Link
                    to="/"
                    className="bg-[#0F3D2E] hover:bg-[#1C7C54] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shadow-[0_1px_2px_rgba(15,61,46,0.06)]"
                  >
                    Return Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-[#D6E5DC] mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52665A]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#E7F3EC] text-[#0F3D2E] rounded-md border border-[#D6E5DC]">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[#0F3D2E]">EcoCycle Platform</span>
              <span className="hidden sm:inline">— Civic E-Waste Aggregation & Certified Facility Registry</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <span>Civic Non-Profit Utility</span>
              <span className="text-[#D6E5DC]">·</span>
              <span>Zero Commercial Trading</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
