import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Recycle, 
  MapPin, 
  CalendarPlus, 
  Package, 
  BarChart3, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  User
} from 'lucide-react';

/**
 * Navbar Component
 * Responsive navigation bar with authentication awareness and mobile drawer.
 */
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch active session and profile role
    async function getUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) setRole(profile.role);
      } else {
        setUser(null);
        setRole(null);
      }
    }

    getUserData();

    // 2. Subscribe to auth changes (sign-in / sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) setRole(profile.role);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-[#E8F5EE] text-[#0F3D2E] font-semibold'
        : 'text-[#3F584C] hover:text-[#0F3D2E] hover:bg-[#EDF3EF]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-[#E8F5EE] text-[#0F3D2E] font-semibold'
        : 'text-[#3F584C] hover:bg-[#EDF3EF]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAF8]/95 backdrop-blur-md border-b border-[#D6E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#0F3D2E] text-white flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
              <Recycle className="w-5 h-5 text-[#2FA36B]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#0F3D2E]">
                Eco<span className="text-[#2FA36B]">Cycle</span>
              </span>
              <span className="hidden sm:block text-[10px] text-[#6B8477] font-semibold -mt-1 tracking-wider uppercase">
                Civic E-Waste Utility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/locator" className={navLinkClass}>
              <MapPin className="w-4 h-4 text-[#2FA36B]" />
              Recycler Locator
            </NavLink>
            <NavLink to="/schedule" className={navLinkClass}>
              <CalendarPlus className="w-4 h-4 text-[#2FA36B]" />
              Schedule Pickup
            </NavLink>
            {user && (
              <NavLink to="/my-pickups" className={navLinkClass}>
                <Package className="w-4 h-4 text-[#2FA36B]" />
                My Pickups
              </NavLink>
            )}
            <NavLink to="/impact" className={navLinkClass}>
              <BarChart3 className="w-4 h-4 text-[#2FA36B]" />
              Impact
            </NavLink>
            <NavLink to="/awareness" className={navLinkClass}>
              <BookOpen className="w-4 h-4 text-[#2FA36B]" />
              Awareness & Quiz
            </NavLink>
            {role === 'admin' && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                    isActive 
                      ? 'bg-[#FEF3C7] text-[#92400E]' 
                      : 'bg-[#FFFBEB] text-[#B45309] hover:bg-[#FEF3C7]'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                Admin Panel
              </NavLink>
            )}
          </nav>

          {/* Right Section: Auth & Role */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#12261D] truncate max-w-[150px]">
                    {user.email}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    role === 'admin' 
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' 
                      : 'bg-[#E8F5EE] text-[#0F3D2E] border border-[#D6E5DC]'
                  }`}>
                    {role || 'Citizen'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3F584C] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition duration-150"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white text-xs font-bold px-4 py-2 rounded-lg transition duration-150"
              >
                <LogIn className="w-4 h-4 text-[#2FA36B]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8FAF8] border-b border-[#D6E5DC] px-4 pt-2 pb-6 space-y-1.5">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/locator" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <MapPin className="w-5 h-5 text-[#2FA36B]" />
            Recycler Locator
          </NavLink>
          <NavLink to="/schedule" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <CalendarPlus className="w-5 h-5 text-[#2FA36B]" />
            Schedule Pickup
          </NavLink>
          {user && (
            <NavLink to="/my-pickups" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Package className="w-5 h-5 text-[#2FA36B]" />
              My Pickups
            </NavLink>
          )}
          <NavLink to="/impact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <BarChart3 className="w-5 h-5 text-[#2FA36B]" />
            Impact Dashboard
          </NavLink>
          <NavLink to="/awareness" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <BookOpen className="w-5 h-5 text-[#2FA36B]" />
            Awareness & Quiz
          </NavLink>
          {role === 'admin' && (
            <NavLink 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)} 
              className={mobileNavLinkClass}
            >
              <ShieldCheck className="w-5 h-5 text-[#D97706]" />
              Admin Portal
            </NavLink>
          )}

          <div className="pt-4 border-t border-[#D6E5DC]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#EDF3EF] rounded-lg">
                  <User className="w-4 h-4 text-[#3F584C]" />
                  <div className="text-xs">
                    <div className="font-semibold text-[#12261D]">{user.email}</div>
                    <span className="text-[10px] text-[#0F3D2E] uppercase font-bold tracking-wide">
                      Role: {role || 'Citizen'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#DC2626] bg-[#FEE2E2] hover:bg-[#FECACA] rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] text-white font-semibold py-2.5 rounded-lg shadow-sm transition"
              >
                <LogIn className="w-4 h-4 text-[#2FA36B]" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
