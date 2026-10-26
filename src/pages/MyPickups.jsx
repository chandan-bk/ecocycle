import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PickupCard from '../components/PickupCard';
import { Package, CalendarPlus, Loader2, AlertCircle, RefreshCw, Filter } from 'lucide-react';

/**
 * MyPickups Page
 * Shows list of pickups booked by the currently signed-in user.
 */
export default function MyPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchUserPickups = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Please log in to view your scheduled pickups.');
        setLoading(false);
        return;
      }

      // Fetch pickups owned by the authenticated user
      const { data, error: fetchErr } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_date', { ascending: false });

      if (fetchErr) throw fetchErr;

      setPickups(data || []);
    } catch (err) {
      console.error('Error fetching pickups:', err);
      setError(err.message || 'Could not retrieve your pickups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPickups();
  }, []);

  // Filter pickups by status
  const filteredPickups = pickups.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status?.toLowerCase() === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F3D2E] flex items-center gap-2.5">
            <Package className="w-7 h-7 text-[#2FA36B]" />
            My Collection Requests
          </h1>
          <p className="text-[#3F584C] text-sm mt-1">
            Real-time status tracking for all your scheduled household pickups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchUserPickups}
            className="p-2.5 rounded-lg border border-[#D6E5DC] bg-white hover:bg-[#EDF3EF] text-[#3F584C] transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition shadow-xs"
          >
            <CalendarPlus className="w-4 h-4 text-[#2FA36B]" />
            New Pickup
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#D6E5DC] pb-4">
        {[
          { label: 'All Requests', val: 'all' },
          { label: 'Pending', val: 'pending' },
          { label: 'Scheduled', val: 'scheduled' },
          { label: 'Collected', val: 'collected' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilterStatus(tab.val)}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              filterStatus === tab.val
                ? 'bg-[#0F3D2E] text-white'
                : 'bg-white text-[#3F584C] border border-[#D6E5DC] hover:bg-[#EDF3EF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 mb-6 rounded-xl bg-[#FEE2E2] border border-[#FECACA] flex items-start gap-3 text-[#991B1B] text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626]" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-[#0F3D2E]">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#2FA36B]" />
          <p className="text-[#3F584C] font-medium text-sm">Retrieving collection records...</p>
        </div>
      ) : filteredPickups.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#D6E5DC] p-12 text-center max-w-md mx-auto my-6 space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-[#EDF3EF] text-[#3F584C] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-7 h-7 text-[#2FA36B]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F3D2E]">
            {filterStatus === 'all'
              ? 'No Pickups Scheduled Yet'
              : `No ${filterStatus} pickups found`}
          </h3>
          <p className="text-xs sm:text-sm text-[#3F584C] leading-relaxed">
            Have old smartphones, monitors, or batteries at home? Schedule a free collection today.
          </p>
          <div className="pt-2">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition shadow-xs"
            >
              <CalendarPlus className="w-4 h-4 text-[#2FA36B]" />
              Book First Pickup
            </Link>
          </div>
        </div>
      ) : (
        /* Pickups Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPickups.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      )}

    </div>
  );
}
