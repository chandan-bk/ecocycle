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
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />,
          label: 'Collected',
        };
      case 'scheduled':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-4 h-4 mr-1 text-blue-600" />,
          label: 'Scheduled',
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-4 h-4 mr-1 text-rose-600" />,
          label: 'Cancelled',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />,
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Item & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Package className="w-5 h-5" />
              </span>
              {item_type}
            </h3>
            <span className="text-xs text-slate-500 ml-1">
              Quantity: <strong className="text-slate-700 font-semibold">{quantity} unit(s)</strong>
            </span>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        </div>

        {/* Details list */}
        <div className="space-y-2.5 text-sm text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pickup Date: <strong className="text-slate-700">{formattedDate}</strong></span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-snug line-clamp-2">{address}</span>
          </div>

          {isAdmin && pickup.profiles?.email && (
            <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-500">
              User: <span className="font-mono text-slate-700">{pickup.profiles.email}</span>
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
