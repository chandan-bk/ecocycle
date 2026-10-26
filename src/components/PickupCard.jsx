import React from 'react';
import { Calendar, MapPin, Package, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

/**
 * PickupCard Component
 * Reusable card to display an e-waste pickup request.
 *
 * Props:
 * - pickup: The pickup object { id, item_type, quantity, address, pickup_date, status, user_id }
 * - isAdmin: Boolean indicating if admin controls should be rendered
 * - onStatusChange: Callback function (id, newStatus) for admin status update
 */
export default function PickupCard({ pickup, isAdmin = false, onStatusChange }) {
  const { id, item_type, quantity, address, pickup_date, status } = pickup;

  // Status visual badge styling
  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'collected':
        return {
          bg: 'bg-[#E8F5EE] text-[#0F3D2E] border-[#B4CFC1]',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#2FA36B]" />,
          label: 'Collected',
        };
      case 'scheduled':
        return {
          bg: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-[#0284C7]" />,
          label: 'Scheduled',
        };
      case 'cancelled':
        return {
          bg: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-[#DC2626]" />,
          label: 'Cancelled',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-[#D97706]" />,
          label: 'Pending',
        };
    }
  };

  const badge = getStatusBadge(status);

  // Friendly formatted date
  const formattedDate = pickup_date
    ? new Date(pickup_date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not scheduled';

  return (
    <div className="bg-white rounded-xl border border-[#D6E5DC] p-5 shadow-xs hover:border-[#B4CFC1] transition-colors duration-150 flex flex-col justify-between">
      <div>
        {/* Header: Item & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-[#0F3D2E] text-base sm:text-lg flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E8F5EE] text-[#0F3D2E]">
                <Package className="w-4 h-4 text-[#2FA36B]" />
              </span>
              {item_type}
            </h3>
            <span className="text-xs text-[#6B8477] ml-1">
              Quantity: <strong className="text-[#12261D] font-semibold">{quantity} unit(s)</strong>
            </span>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        </div>

        {/* Details list */}
        <div className="space-y-2 text-xs sm:text-sm text-[#3F584C] border-t border-[#EDF3EF] pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2FA36B] shrink-0" />
            <span>Scheduled: <strong className="text-[#12261D] font-semibold">{formattedDate}</strong></span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#2FA36B] shrink-0 mt-0.5" />
            <span className="text-[#12261D] leading-snug line-clamp-2">{address}</span>
          </div>

          {isAdmin && pickup.profiles?.email && (
            <div className="text-xs bg-[#F8FAF8] p-2 rounded-lg border border-[#D6E5DC] text-[#6B8477]">
              User: <span className="font-mono text-[#0F3D2E] font-medium">{pickup.profiles.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Action Bar */}
      {isAdmin && onStatusChange && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <label htmlFor={`status-${id}`} className="text-xs font-medium text-slate-500">
            Update Status:
          </label>
          <select
            id={`status-${id}`}
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="collected">Collected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}
    </div>
  );
}
