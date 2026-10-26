import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { sendStatusUpdateEmail } from '../lib/emailService';
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
    const targetPickup = pickups.find((p) => p.id === pickupId);

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

      // Trigger automated email alert to user
      const userEmail = targetPickup?.profiles?.email;
      if (userEmail) {
        sendStatusUpdateEmail({
          toEmail: userEmail,
          pickupId: targetPickup.id,
          itemType: targetPickup.item_type,
          quantity: targetPickup.quantity,
          newStatus: newStatus,
          pickupDate: targetPickup.pickup_date,
          address: targetPickup.address,
        });
      }

      setSuccessMsg(
        userEmail
          ? `Status updated to ${newStatus} & email alert dispatched to ${userEmail}!`
          : `Pickup status updated to ${newStatus}`
      );
      setTimeout(() => setSuccessMsg(''), 4000);
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
          <div className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Operations Command & Registry Audit
          </div>
          <h1 className="text-3xl font-display font-bold text-[#0F3D2E] tracking-tight">E-Waste Operations Management</h1>
          <p className="text-[#52665A] text-sm mt-0.5">
            Oversee door-to-facility transit manifests and maintain verified civic recycler registries.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          {activeTab === 'centers' && (
            <button
              onClick={handleOpenAddCenter}
              className="inline-flex items-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] text-white font-semibold px-4 py-2.5 rounded-lg text-xs shadow-[0_1px_2px_rgba(15,61,46,0.06)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Facility Center
            </button>
          )}
          <button
            onClick={() => {
              fetchAllPickups();
              fetchAllCenters();
            }}
            className="p-2.5 bg-white border border-[#D6E5DC] hover:bg-[#F8FAF8] text-[#0F3D2E] rounded-lg transition-colors"
            title="Refresh Manifest"
          >
            <RefreshCw className="w-4 h-4 text-[#1C7C54]" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-[#E7F3EC] border border-[#D6E5DC] text-[#0F3D2E] rounded-lg text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#1C7C54]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex border-b border-[#D6E5DC] gap-6">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`pb-3 font-semibold text-sm sm:text-base border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'pickups'
              ? 'border-[#0F3D2E] text-[#0F3D2E]'
              : 'border-transparent text-[#52665A] hover:text-[#0F3D2E]'
          }`}
        >
          <Package className="w-4 h-4" />
          Civic Pickups ({pickups.length})
        </button>
        <button
          onClick={() => setActiveTab('centers')}
          className={`pb-3 font-semibold text-sm sm:text-base border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'centers'
              ? 'border-[#0F3D2E] text-[#0F3D2E]'
              : 'border-transparent text-[#52665A] hover:text-[#0F3D2E]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Recycler Facilities ({centers.length})
        </button>
      </div>

      {/* TAB 1: PICKUPS MANAGEMENT */}
      {activeTab === 'pickups' && (
        <div className="space-y-6">
          
          {/* Pickups Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-[#D6E5DC] shadow-[0_1px_3px_rgba(15,61,46,0.04)]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#52665A] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search citizen email or address..."
                value={pickupSearch}
                onChange={(e) => setPickupSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-xs sm:text-sm text-[#1E2922] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {['all', 'pending', 'scheduled', 'collected', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setPickupStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                    pickupStatusFilter === st
                      ? 'bg-[#0F3D2E] text-white'
                      : 'bg-[#F8FAF8] text-[#52665A] border border-[#D6E5DC] hover:bg-[#E7F3EC]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingPickups ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center text-[#0F3D2E]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs text-[#52665A]">Accessing central pickup registry...</p>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-[#D6E5DC] text-center text-[#52665A] text-sm">
              No aggregation logs found matching active criteria.
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
            <div className="min-h-[30vh] flex flex-col items-center justify-center text-[#0F3D2E]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs text-[#52665A]">Loading facility directory...</p>
            </div>
          ) : centers.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed border-[#D6E5DC] text-center space-y-4">
              <MapPin className="w-10 h-10 text-[#52665A] mx-auto" />
              <h3 className="text-base font-display font-bold text-[#0F3D2E]">No Certified Centers Registered</h3>
              <p className="text-xs text-[#52665A]">
                Click "Add Facility Center" above to add the first civic recycling facility.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#D6E5DC] shadow-[0_1px_3px_rgba(15,61,46,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#1E2922]">
                  <thead className="bg-[#F8FAF8] border-b border-[#D6E5DC] text-xs font-mono uppercase text-[#52665A]">
                    <tr>
                      <th className="px-6 py-3.5">Facility Name</th>
                      <th className="px-6 py-3.5">City & Address</th>
                      <th className="px-6 py-3.5">Coordinates (Lat, Lng)</th>
                      <th className="px-6 py-3.5">Accepted Waste Streams</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D6E5DC]">
                    {centers.map((center) => (
                      <tr key={center.id} className="hover:bg-[#F8FAF8] transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#0F3D2E]">
                          {center.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#1E2922]">{center.city}</div>
                          <div className="text-xs text-[#52665A]">{center.address}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-[#52665A]">
                          {center.lat}, {center.lng}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Array.isArray(center.accepts) &&
                              center.accepts.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs font-mono bg-[#E7F3EC] text-[#0F3D2E] border border-[#D6E5DC] px-2 py-0.5 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditCenter(center)}
                            className="p-1.5 text-[#0F3D2E] hover:bg-[#E7F3EC] rounded-md transition-colors"
                            title="Edit Center"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCenter(center.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
        <div className="fixed inset-0 z-50 bg-[#0F3D2E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D6E5DC] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCenterModalOpen(false)}
              className="absolute top-5 right-5 text-[#52665A] hover:text-[#1E2922]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-bold text-[#0F3D2E] mb-4">
              {editingCenter ? 'Edit Certified Facility' : 'Register New Collection Facility'}
            </h3>

            <form onSubmit={handleCenterFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={centerForm.name}
                  onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                  placeholder="e.g. EcoCycle Whitefield Aggregation Depot"
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.city}
                    onChange={(e) => setCenterForm({ ...centerForm, city: e.target.value })}
                    placeholder="Bangalore"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.address}
                    onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                    placeholder="Outer Ring Road, Industrial Area"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={centerForm.lat}
                    onChange={(e) => setCenterForm({ ...centerForm, lat: e.target.value })}
                    placeholder="12.9716"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={centerForm.lng}
                    onChange={(e) => setCenterForm({ ...centerForm, lng: e.target.value })}
                    placeholder="77.5946"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#1E2922] mb-1">
                  Accepted Waste Streams (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={centerForm.acceptsStr}
                  onChange={(e) => setCenterForm({ ...centerForm, acceptsStr: e.target.value })}
                  placeholder="Smartphones, Laptops, Batteries, Cables"
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-[#D6E5DC] rounded-lg text-sm text-[#1E2922] focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                />
                <span className="text-xs text-[#52665A] mt-1 block">Separate each material category with a comma.</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCenterModalOpen(false)}
                  className="px-4 py-2 border border-[#D6E5DC] rounded-lg text-sm text-[#52665A] hover:bg-[#F8FAF8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F3D2E] hover:bg-[#1C7C54] text-white font-medium rounded-lg text-sm shadow-[0_1px_2px_rgba(15,61,46,0.06)] transition-colors"
                >
                  {editingCenter ? 'Save Facility Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
