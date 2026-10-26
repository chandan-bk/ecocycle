import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getDemoSession } from '../lib/fallbackData';
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
      // 1. Check local demo session first
      const demo = getDemoSession();
      if (demo?.user) {
        setUser(demo.user);
        setRole(demo.role || 'user');
        setLoading(false);
        return;
      }

      try {
        let session = null;
        try {
          const res = await supabase.auth.getSession();
          session = res.data?.session;
        } catch (e) {
          console.warn('Supabase offline in protected route:', e);
        }
        
        if (!session?.user) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Fetch user role from public.profiles table
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setRole(profile?.role || 'user');
        } catch {
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
        const demo = getDemoSession();
        if (demo?.user) {
          setUser(demo.user);
          setRole(demo.role || 'user');
          setLoading(false);
        } else {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-[#0F3D2E]">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0F3D2E]" />
        <p className="text-[#52665A] font-medium text-xs font-mono">Verifying authorization token...</p>
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
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#D6E5DC] rounded-xl shadow-[0_1px_3px_rgba(15,61,46,0.06)] text-center">
        <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-[#0F3D2E] mb-2">Administrative Privileges Required</h2>
        <p className="text-xs text-[#52665A] mb-6 leading-relaxed">
          This portal is reserved for registered recycling facility operators. Your active authorization role is <span className="font-mono text-rose-600 uppercase font-semibold">{role || 'user'}</span>.
        </p>
        <a
          href="/"
          className="inline-block bg-[#0F3D2E] hover:bg-[#1C7C54] text-white font-medium px-5 py-2.5 rounded-lg text-xs transition-colors shadow-[0_1px_2px_rgba(15,61,46,0.06)]"
        >
          Return to Public Directory
        </a>
      </div>
    );
  }

  return children;
}
