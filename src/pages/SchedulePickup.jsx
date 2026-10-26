import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendBookingConfirmationEmail } from '../lib/emailService';
import { getDemoSession, saveStoredPickup } from '../lib/fallbackData';
import { Calendar, Package, MapPin, Hash, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * SchedulePickup Page (Elevated via Impeccable Design System)
 * High-craft citizen booking portal with advance validation and zero AI slop.
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
      // 1. Get current authenticated user (cloud or demo)
      let activeUser = null;
      try {
        const { data } = await supabase.auth.getUser();
        activeUser = data?.user;
      } catch (e) {
        console.warn('Supabase auth check fallback:', e);
      }

      if (!activeUser) {
        const demo = getDemoSession();
        activeUser = demo?.user;
      }

      if (!activeUser) {
        throw new Error('You must be signed in to schedule a pickup.');
      }

      const pickupPayload = {
        id: `pk-${Date.now()}`,
        user_id: activeUser.id,
        item_type: itemType,
        quantity: parseInt(quantity, 10),
        address: address.trim(),
        pickup_date: pickupDate,
        status: 'pending',
        created_at: new Date().toISOString(),
        profiles: { email: activeUser.email || 'citizen@ecocycle.org' },
      };

      // 2. Try inserting into Supabase 'pickups' table
      let insertedInCloud = false;
      try {
        const { error } = await supabase.from('pickups').insert([
          {
            user_id: activeUser.id,
            item_type: itemType,
            quantity: parseInt(quantity, 10),
            address: address.trim(),
            pickup_date: pickupDate,
            status: 'pending',
          },
        ]);
        if (!error) insertedInCloud = true;
      } catch (cloudErr) {
        console.warn('Cloud pickup insert paused, using local storage fallback:', cloudErr);
      }

      // Always save to local store so dashboard shows it immediately
      saveStoredPickup(pickupPayload);

      // Dispatch booking confirmation email to customer
      if (activeUser.email) {
        sendBookingConfirmationEmail({
          toEmail: activeUser.email,
          itemType: itemType,
          quantity: parseInt(quantity, 10),
          pickupDate: pickupDate,
          address: address.trim(),
        });
      }

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
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0F3D2E] tracking-tight">
          Schedule Doorstep Collection
        </h1>
        <p className="text-[#3F584C] text-sm max-w-md mx-auto leading-relaxed">
          Surrender non-working, broken, or obsolete electronics directly from your home for certified demanufacturing.
        </p>
      </div>

      {/* Success Notification */}
      {success ? (
        <div className="bg-white rounded-2xl border border-[#D6E5DC] p-8 shadow-xs text-center space-y-5">
          <div className="w-14 h-14 bg-[#E8F5EE] text-[#0F3D2E] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[#2FA36B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F3D2E]">Pickup Scheduled Successfully</h2>
          <p className="text-sm text-[#3F584C] leading-relaxed max-w-md mx-auto">
            Your e-waste collection request for <strong className="text-[#0F3D2E]">{quantity}x {itemType}</strong> on <strong className="text-[#0F3D2E]">{pickupDate}</strong> has been confirmed. Our team will arrive at your address and dispatch email status receipts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate('/my-pickups')}
              className="inline-flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-6 py-3 rounded-xl transition"
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
              className="bg-[#EDF3EF] hover:bg-[#D6E5DC] text-[#0F3D2E] font-semibold px-6 py-3 rounded-xl transition"
            >
              Book Another Pickup
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-white rounded-2xl border border-[#D6E5DC] shadow-xs p-6 sm:p-8 space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FECACA] flex items-start gap-3 text-[#991B1B] text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Civic Model Assurance */}
          <div className="p-4 rounded-xl bg-[#E8F5EE] border border-[#B4CFC1] flex items-start gap-3 text-[#12261D] text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-[#2FA36B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0F3D2E] font-bold block mb-0.5">100% Free Civic Service:</strong>
              As an open civic initiative, doorstep pickups are completely free of charge. Collected items are aggregated for government-certified CPCB/KSPCB dismantling facilities.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Item Category Selection */}
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                E-Waste Item Stream
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B8477]">
                  <Package className="w-4 h-4" />
                </div>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-xl text-sm text-[#12261D] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition cursor-pointer"
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
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                Estimated Quantity (Units / Devices)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B8477]">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-xl text-sm text-[#12261D] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                Preferred Pickup Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B8477]">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-xl text-sm text-[#12261D] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition cursor-pointer"
                />
              </div>
              <p className="text-xs text-[#6B8477] mt-1.5">
                Logistics requires booking at least 1 day in advance.
              </p>
            </div>

            {/* Doorstep Address */}
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                Doorstep Pickup Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-[#6B8477]">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows="3"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment/Flat No, Street Name, Landmark, City & PIN Code"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-[#D6E5DC] rounded-xl text-sm text-[#12261D] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Safety & Compliance Note */}
            <div className="bg-[#EDF3EF] border border-[#D6E5DC] rounded-xl p-3.5 text-xs text-[#3F584C] leading-relaxed">
              💡 <strong>Data Privacy Reminder:</strong> Please back up files and factory-erase flash storage before handing over digital media.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition duration-150 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Collection Request...</span>
                </>
              ) : (
                <span>Confirm & Schedule Free Pickup</span>
              )}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
