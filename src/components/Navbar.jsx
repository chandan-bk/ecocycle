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
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition duration-150 ${
      isActive
        ? 'bg-emerald-100 text-emerald-800 font-semibold'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition duration-150 ${
      isActive
        ? 'bg-emerald-100 text-emerald-800 font-semibold'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center transition duration-200 shadow-sm shadow-emerald-200">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                Eco<span className="text-emerald-600">Cycle</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                E-Waste Recovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/locator" className={navLinkClass}>
              <MapPin className="w-4 h-4 text-emerald-600" />
              Recycler Locator
            </NavLink>
            <NavLink to="/schedule" className={navLinkClass}>
              <CalendarPlus className="w-4 h-4 text-emerald-600" />
              Schedule Pickup
            </NavLink>
            {user && (
              <NavLink to="/my-pickups" className={navLinkClass}>
                <Package className="w-4 h-4 text-emerald-600" />
                My Pickups
              </NavLink>
            )}
            <NavLink to="/impact" className={navLinkClass}>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Impact
            </NavLink>
            <NavLink to="/awareness" className={navLinkClass}>
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Awareness & Quiz
            </NavLink>
            {role === 'admin' && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Panel
              </NavLink>
            )}
          </nav>

          {/* Right Section: Auth & Role */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-700 truncate max-w-[150px]">
                    {user.email}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    role === 'admin' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {role || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-emerald-200 transition duration-150"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Register</span>
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/locator" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <MapPin className="w-5 h-5 text-emerald-600" />
            Recycler Locator
          </NavLink>
          <NavLink to="/schedule" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <CalendarPlus className="w-5 h-5 text-emerald-600" />
            Schedule Pickup
          </NavLink>
          {user && (
            <NavLink to="/my-pickups" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Package className="w-5 h-5 text-emerald-600" />
              My Pickups
            </NavLink>
          )}
          <NavLink to="/impact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Impact Dashboard
          </NavLink>
          <NavLink to="/awareness" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Awareness & Quiz
          </NavLink>
          {role === 'admin' && (
            <NavLink 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)} 
              className={mobileNavLinkClass}
            >
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Admin Portal
            </NavLink>
          )}

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <User className="w-4 h-4 text-slate-500" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-700">{user.email}</div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wide">
                      Role: {role || 'User'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
