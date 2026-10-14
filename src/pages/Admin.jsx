import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PickupCard from '../components/PickupCard';
import { 
  ShieldCheck, 
  Package, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Search
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Allows administrators to:
 * 1. View all customer pickups and update their workflow status.
 * 2. Add, edit, and delete e-waste collection centers.
 */
export default function Admin() {
  const [activeTab, setActiveTab] = useState('pickups'); // 'pickups' or 'centers'

  // Pickups state
  const [pickups, setPickups] = useState([]);
  const [pickupSearch, setPickupSearch] = useState('');
  const [pickupStatusFilter, setPickupStatusFilter] = useState('all');
  const [loadingPickups, setLoadingPickups] = useState(true);

  // Centers state
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);

  // Form state for creating/editing centers
  const [centerForm, setCenterForm] = useState({
    name: '',
    address: '',
    city: '',
    lat: '',
    lng: '',
    acceptsStr: '',
  });

  // Global messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch All Pickups
  const fetchAllPickups = async () => {
    setLoadingPickups(true);
    try {
      // 1. Fetch all pickups
      const { data: pickupsData, error: pickupError } = await supabase
        .from('pickups')
        .select('*')
        .order('pickup_date', { ascending: false });

      if (pickupError) throw pickupError;

      // 2. Fetch profiles to match user emails without schema join restrictions
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email');

      const profileEmailMap = {};
      (profilesData || []).forEach((p) => {
        if (p.id) profileEmailMap[p.id] = p.email;
      });

      // 3. Attach user email to each pickup object
      const enrichedPickups = (pickupsData || []).map((p) => ({
        ...p,
        profiles: {
          email: profileEmailMap[p.user_id] || 'Registered User',
        },
      }));

      setPickups(enrichedPickups);
    } catch (err) {
      console.error('Error fetching admin pickups:', err);
      setErrorMsg('Failed to load pickups list.');
    } finally {
      setLoadingPickups(false);
    }
  };

  // 2. Fetch All Centers
  const fetchAllCenters = async () => {
    setLoadingCenters(true);
    try {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCenters(data || []);
    } catch (err) {
      console.error('Error fetching centers:', err);
      setErrorMsg('Failed to load collection centers.');
    } finally {
      setLoadingCenters(false);
    }
  };

  useEffect(() => {
    fetchAllPickups();
    fetchAllCenters();
  }, []);

  // Handle Pickup Status Change
  const handleStatusChange = async (pickupId, newStatus) => {
    setErrorMsg('');
    try {
      const { error } = await supabase
        .from('pickups')
        .update({ status: newStatus })
        .eq('id', pickupId);

      if (error) throw error;

      // Update local state
      setPickups((prev) =>
        prev.map((p) => (p.id === pickupId ? { ...p, status: newStatus } : p))
      );
      setSuccessMsg(`Pickup status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setErrorMsg('Could not update pickup status.');
    }
  };

  // Open Center Modal for Create
  const handleOpenAddCenter = () => {
    setEditingCenter(null);
    setCenterForm({
      name: '',
      address: '',
      city: 'Mandya',
      lat: '12.5244',
      lng: '76.8958',
      acceptsStr: 'Smartphones, Laptops, Batteries',
    });
    setIsCenterModalOpen(true);
  };

  // Open Center Modal for Edit
  const handleOpenEditCenter = (center) => {
    setEditingCenter(center);
    setCenterForm({
      name: center.name || '',
      address: center.address || '',
      city: center.city || '',
      lat: center.lat?.toString() || '',
      lng: center.lng?.toString() || '',
      acceptsStr: Array.isArray(center.accepts) ? center.accepts.join(', ') : '',
    });
    setIsCenterModalOpen(true);
  };

  // Submit Center (Create or Update)
  const handleCenterFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!centerForm.name || !centerForm.address || !centerForm.lat || !centerForm.lng) {
      setErrorMsg('Please fill in all center details including coordinates.');
      return;
    }

    const parsedAccepts = centerForm.acceptsStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: centerForm.name.trim(),
      address: centerForm.address.trim(),
      city: centerForm.city.trim(),
      lat: parseFloat(centerForm.lat),
      lng: parseFloat(centerForm.lng),
      accepts: parsedAccepts,
    };

    try {
      if (editingCenter) {
        // Update existing center
        const { error } = await supabase
          .from('centers')
          .update(payload)
          .eq('id', editingCenter.id);

        if (error) throw error;
        setSuccessMsg('Collection center updated successfully!');
      } else {
        // Insert new center
        const { error } = await supabase
          .from('centers')
          .insert([payload]);

        if (error) throw error;
        setSuccessMsg('New collection center added!');
      }

      setIsCenterModalOpen(false);
      fetchAllCenters();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving center:', err);
      setErrorMsg(err.message || 'Failed to save collection center.');
    }
  };

  // Delete Collection Center
  const handleDeleteCenter = async (centerId) => {
    if (!window.confirm('Are you sure you want to delete this collection center?')) return;

    try {
      const { error } = await supabase
        .from('centers')
        .delete()
        .eq('id', centerId);

      if (error) throw error;

      setCenters((prev) => prev.filter((c) => c.id !== centerId));
      setSuccessMsg('Center deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error deleting center:', err);
      setErrorMsg('Could not delete center.');
    }
  };

  // Filtered Pickups for Admin
  const filteredPickups = pickups.filter((p) => {
    const matchesStatus = pickupStatusFilter === 'all' || p.status?.toLowerCase() === pickupStatusFilter;
    const matchesSearch =
      pickupSearch === '' ||
      p.item_type?.toLowerCase().includes(pickupSearch.toLowerCase()) ||
      p.address?.toLowerCase().includes(pickupSearch.toLowerCase()) ||
      p.profiles?.email?.toLowerCase().includes(pickupSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrative Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900">E-Waste Operations Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Oversee all scheduled pickups and manage verified drop-off collection centers.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          {activeTab === 'centers' && (
            <button
              onClick={handleOpenAddCenter}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add New Center
            </button>
          )}
          <button
            onClick={() => {
              fetchAllPickups();
              fetchAllCenters();
            }}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`pb-3 font-bold text-sm sm:text-base border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pickups'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          All Pickups ({pickups.length})
        </button>
        <button
          onClick={() => setActiveTab('centers')}
          className={`pb-3 font-bold text-sm sm:text-base border-b-2 flex items-center gap-2 transition ${
            activeTab === 'centers'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Collection Centers ({centers.length})
        </button>
      </div>

      {/* TAB 1: PICKUPS MANAGEMENT */}
      {activeTab === 'pickups' && (
        <div className="space-y-6">
          
          {/* Pickups Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search user email or address..."
                value={pickupSearch}
                onChange={(e) => setPickupSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {['all', 'pending', 'scheduled', 'collected', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setPickupStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    pickupStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingPickups ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center text-emerald-700">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs text-slate-500">Loading pickups database...</p>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No pickups found matching filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPickups.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  pickup={pickup}
                  isAdmin={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: COLLECTION CENTERS MANAGEMENT */}
      {activeTab === 'centers' && (
        <div className="space-y-6">
          {loadingCenters ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center text-emerald-700">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs text-slate-500">Loading collection centers...</p>
            </div>
          ) : centers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
              <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Collection Centers Added</h3>
              <p className="text-xs text-slate-500">
                Click "Add New Center" above to add your first recycling location.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Facility Name</th>
                      <th className="px-6 py-4">City & Address</th>
                      <th className="px-6 py-4">Coordinates (Lat, Lng)</th>
                      <th className="px-6 py-4">Accepted Items</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {centers.map((center) => (
                      <tr key={center.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {center.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700">{center.city}</div>
                          <div className="text-xs text-slate-500">{center.address}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          {center.lat}, {center.lng}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Array.isArray(center.accepts) &&
                              center.accepts.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditCenter(center)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Center"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCenter(center.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT CENTER MODAL */}
      {isCenterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCenterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-4">
              {editingCenter ? 'Edit Collection Center' : 'Add New Collection Center'}
            </h3>

            <form onSubmit={handleCenterFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Center Name
                </label>
                <input
                  type="text"
                  required
                  value={centerForm.name}
                  onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                  placeholder="e.g. EcoCycle Whitefield Depot"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.city}
                    onChange={(e) => setCenterForm({ ...centerForm, city: e.target.value })}
                    placeholder="Bangalore"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.address}
                    onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                    placeholder="Outer Ring Road"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={centerForm.lat}
                    onChange={(e) => setCenterForm({ ...centerForm, lat: e.target.value })}
                    placeholder="12.9716"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={centerForm.lng}
                    onChange={(e) => setCenterForm({ ...centerForm, lng: e.target.value })}
                    placeholder="77.5946"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Accepted Items (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={centerForm.acceptsStr}
                  onChange={(e) => setCenterForm({ ...centerForm, acceptsStr: e.target.value })}
                  placeholder="Smartphones, Laptops, Batteries, Cables"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400">Separate each category with a comma.</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCenterModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow transition"
                >
                  {editingCenter ? 'Save Changes' : 'Create Center'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
