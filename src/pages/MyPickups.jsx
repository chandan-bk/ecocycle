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
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-8 h-8 text-emerald-600" />
            My E-Waste Pickups
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track the status of all your scheduled doorstep collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUserPickups}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 text-sm transition"
          >
            <CalendarPlus className="w-4 h-4" />
            New Pickup
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
        {[
          { label: 'All Requests', val: 'all' },
          { label: 'Pending', val: 'pending' },
          { label: 'Scheduled', val: 'scheduled' },
          { label: 'Collected', val: 'collected' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilterStatus(tab.val)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterStatus === tab.val
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-emerald-700">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-slate-500 font-medium text-sm">Loading your pickup requests...</p>
        </div>
      ) : filteredPickups.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-6 space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {filterStatus === 'all'
              ? 'No Pickups Scheduled Yet'
              : `No ${filterStatus} pickups found`}
          </h3>
          <p className="text-sm text-slate-500">
            Have old smartphones, monitors, or batteries at home? Schedule a free collection today.
          </p>
          <div>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
            >
              <CalendarPlus className="w-4 h-4" />
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
