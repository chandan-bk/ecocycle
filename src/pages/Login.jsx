import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { setDemoSession } from '../lib/fallbackData';
import { LogIn, UserPlus, KeyRound, Mail, AlertCircle, Loader2, CheckCircle2, Shield, Sparkles } from 'lucide-react';

/**
 * Login & Registration Page
 * Handles user authentication via Supabase Auth (Email + Password)
 * Supports selecting role (User or Admin) during sign up.
 * Includes instant 1-Click Demo Evaluation modes.
 */
export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [adminPasscode, setAdminPasscode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/my-pickups';

  // Demo secret passcode for creating an admin account easily
  const DEMO_ADMIN_KEY = 'ECOADMIN2025';

  const handleQuickDemoLogin = (demoRole) => {
    setErrorMessage('');
    const demoEmail = demoRole === 'admin' ? 'facility.admin@ecocycle.org' : 'citizen@ecocycle.org';
    setDemoSession({ id: `demo-${demoRole}-id`, email: demoEmail }, demoRole);
    setSuccessMessage(`Instant 1-Click Login: Signed in as ${demoRole === 'admin' ? 'Facility Admin' : 'Citizen'}!`);
    setTimeout(() => {
      navigate(demoRole === 'admin' ? '/admin' : '/my-pickups');
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Basic client validations
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // If signing up as admin, verify passcode
    if (isSignUp && role === 'admin' && adminPasscode.trim() !== DEMO_ADMIN_KEY) {
      setErrorMessage(`Invalid Admin Passcode! Use demo passcode: "${DEMO_ADMIN_KEY}" or register as a standard user.`);
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              role: role,
            });
          } catch {
            // non-fatal
          }
        }

        setSuccessMessage('Account registered successfully! Redirecting...');
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : '/my-pickups');
        }, 1200);

      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch user profile to check if admin
        let userRole = 'user';
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          if (profile?.role) userRole = profile.role;
        } catch {
          // default user
        }

        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/admin' ? '/my-pickups' : from);
        }
      }
    } catch (err) {
      console.warn('Authentication attempt:', err);
      // Graceful fallback if cloud Supabase is paused
      const msg = err.message || '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch') || msg.includes('ENOTFOUND')) {
        setDemoSession({ id: `local-${Date.now()}`, email }, role);
        setSuccessMessage(`Signed in via Local Session (${role === 'admin' ? 'Admin' : 'Citizen'}). Redirecting...`);
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : '/my-pickups');
        }, 900);
      } else {
        setErrorMessage(msg || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-xl border border-[#D6E5DC] shadow-[0_1px_3px_rgba(15,61,46,0.06)] p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#E7F3EC] text-[#0F3D2E] rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#D6E5DC]">
            {isSignUp ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-display font-bold text-[#0F3D2E]">
            {isSignUp ? 'Create EcoCycle Account' : 'Civic Platform Sign In'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52665A] mt-1.5">
            {isSignUp
              ? 'Join municipal collection efforts to schedule pickups and track certified recycling'
              : 'Log in to manage community aggregations and inspect facility registries'}
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="mb-6 p-3.5 bg-[#F8FAF8] rounded-xl border border-[#D6E5DC] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#0F3D2E] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#2FA36B]" />
            <span>Fast Evaluation / Demo Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user')}
              className="py-1.5 px-2 bg-white hover:bg-[#E7F3EC] border border-[#D6E5DC] rounded-lg text-xs font-semibold text-[#0F3D2E] transition-colors text-center"
            >
              Demo Citizen
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 bg-white hover:bg-[#FEF3C7] border border-[#D6E5DC] rounded-lg text-xs font-semibold text-[#D97706] transition-colors text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-[#E7F3EC] border border-[#D6E5DC] flex items-start gap-3 text-[#0F3D2E] text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#1C7C54]" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52665A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52665A]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition-colors"
              />
            </div>
            <span className="text-xs text-[#52665A] mt-1 block">Minimum 6 characters</span>
          </div>

          {/* Role selector (visible during Sign Up) */}
          {isSignUp && (
            <div className="pt-2 border-t border-[#D6E5DC]">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    role === 'user'
                      ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                      : 'bg-[#F8FAF8] text-[#52665A] border-[#D6E5DC] hover:bg-[#E7F3EC]'
                  }`}
                >
                  Citizen Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    role === 'admin'
                      ? 'bg-[#D97706] text-white border-[#D97706]'
                      : 'bg-[#F8FAF8] text-[#52665A] border-[#D6E5DC] hover:bg-[#E7F3EC]'
                  }`}
                >
                  Facility Admin
                </button>
              </div>

              {/* If Admin selected, prompt for demo passcode */}
              {role === 'admin' && (
                <div className="mt-3 p-3 bg-[#FFF8E7] rounded-lg border border-[#F2B134]/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#D97706] text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Demo Facility Passcode:</span>
                  </div>
                  <input
                    type="text"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter ECOADMIN2025"
                    className="w-full px-3 py-1.5 bg-white border border-[#D6E5DC] rounded-md text-xs focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                  <p className="text-xs text-[#B45309]">
                    Evaluation demo passcode: <strong className="font-mono bg-[#FFFBEB] px-1 py-0.5 rounded border border-[#F2B134]/30">ECOADMIN2025</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:bg-[#0A291E] disabled:opacity-60 text-white font-medium py-2.5 rounded-lg shadow-[0_1px_2px_rgba(15,61,46,0.06)] transition-colors text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create My Account' : 'Sign In to EcoCycle'}</span>
            )}
          </button>
        </form>

        {/* Switch between Sign In / Sign Up */}
        <div className="mt-6 text-center text-xs text-[#52665A]">
          {isSignUp ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage('');
                }}
                className="font-semibold text-[#0F3D2E] hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage('');
                }}
                className="font-semibold text-[#0F3D2E] hover:underline ml-1"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
