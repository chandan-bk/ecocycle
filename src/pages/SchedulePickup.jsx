import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Package, MapPin, Hash, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

/**
 * SchedulePickup Page
 * Allows authenticated users to schedule an e-waste doorstep pickup.
 */
export default function SchedulePickup() {
  const [itemType, setItemType] = useState('Smartphones & Tablets');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Minimum allowed date is tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const itemCategories = [
    'Smartphones & Tablets',
    'Laptops & Notebooks',
    'Desktop PCs & Monitors',
    'Cables, Chargers & Adapters',
    'Li-ion & Rechargeable Batteries',
    'Small Home Appliances (Microwaves, Kettles)',
    'Printers, Scanners & Cartridges',
    'Televisions & Displays',
    'Audio Equipment & Headphones',
    'Other Electronic Waste',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input validation
    if (!address.trim()) {
      setErrorMessage('Please provide a complete pickup address.');
      return;
    }

    if (quantity < 1) {
      setErrorMessage('Quantity must be at least 1.');
      return;
    }

    if (!pickupDate) {
      setErrorMessage('Please select a preferred pickup date.');
      return;
    }

    setLoading(true);

    try {
      // 1. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be signed in to schedule a pickup.');
      }

      // 2. Insert into Supabase 'pickups' table
      const { error } = await supabase.from('pickups').insert([
        {
          user_id: user.id,
          item_type: itemType,
          quantity: parseInt(quantity, 10),
          address: address.trim(),
          pickup_date: pickupDate,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      console.error('Error scheduling pickup:', err);
      setErrorMessage(err.message || 'Failed to submit pickup request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-emerald-100 text-emerald-700 rounded-2xl mb-3 shadow-inner">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Schedule Doorstep Pickup</h1>
        <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
          We collect your discarded electronic items right at your door and dispatch them to authorized recycling facilities.
        </p>
      </div>

      {/* Success Notification Modal */}
      {success ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Pickup Scheduled Successfully!</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Your e-waste collection request for <strong className="text-slate-800">{quantity}x {itemType}</strong> on <strong className="text-slate-800">{pickupDate}</strong> has been logged. Our logistics team will review and update the status shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate('/my-pickups')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              <span>View In My Pickups</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setAddress('');
                setQuantity(1);
                setPickupDate('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition"
            >
              Book Another Pickup
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8">
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Item Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                E-Waste Item Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Package className="w-4 h-4" />
                </div>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition cursor-pointer"
                >
                  {itemCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Estimated Quantity (Units / Devices)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Pickup Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pickups must be scheduled at least 1 day in advance.
              </p>
            </div>

            {/* Doorstep Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Doorstep Pickup Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows="3"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment/Flat No, Street Name, Landmark, City & PIN Code"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Safety & Compliance Note */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 leading-relaxed">
              💡 <strong>Eco-Tip:</strong> Please remove external SIM cards and backup personal files before handing over digital storage devices.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <span>Confirm & Schedule Pickup</span>
              )}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
