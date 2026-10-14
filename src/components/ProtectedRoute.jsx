import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Guards routes that require login and/or specific roles (like 'admin').
 *
 * Props:
 * - children: Component to render if authorized
 * - requiredRole: Optional role required ('admin' or 'user')
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Fetch user role from public.profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!error && profile) {
          setRole(profile.role);
        } else {
          // Default fallback to 'user'
          setRole('user');
        }
      } catch (err) {
        console.error('Error verifying auth in ProtectedRoute:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setRole(null);
        setLoading(false);
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-emerald-700">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-slate-600 font-medium text-sm">Verifying access privileges...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role requirement check (e.g. admin only)
  if (requiredRole && role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Access Required</h2>
        <p className="text-sm text-slate-600 mb-6">
          This portal is reserved for recycling facility administrators. Your current account role is <span className="font-semibold text-rose-600 uppercase">{role || 'user'}</span>.
        </p>
        <a
          href="/"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition duration-150"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return children;
}
