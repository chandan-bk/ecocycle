import emailjs from '@emailjs/browser';

// EmailJS Credentials from Environment Variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Sends a real-time status update alert email to the customer.
 */
export async function sendStatusUpdateEmail({
  toEmail,
  pickupId,
  itemType,
  quantity,
  newStatus,
  pickupDate,
  address,
}) {
  if (!toEmail) {
    console.warn('[EcoCycle Mailer] No recipient email provided. Skipping alert.');
    return { success: false, reason: 'missing_email' };
  }

  // Friendly status explanations
  const statusMessages = {
    scheduled: 'Your pickup has been SCHEDULED! Our collection partner has been assigned for your chosen date.',
    collected: 'Great news! Your e-waste has been COLLECTED and is safely on its way to certified recycling and material recovery.',
    cancelled: 'Your pickup request has been CANCELLED. If you did not request this, please submit a new request.',
    pending: 'Your pickup request is under review by our logistics team.',
  };

  const statusNote = statusMessages[newStatus.toLowerCase()] || `Status updated to ${newStatus}.`;

  // Dynamic parameters passed to EmailJS Template
  const templateParams = {
    to_email: toEmail,
    recipient_email: toEmail,
    pickup_id: pickupId ? pickupId.slice(0, 8) : 'N/A',
    item_type: itemType || 'Electronic Items',
    quantity: quantity || 1,
    status: newStatus.toUpperCase(),
    status_note: statusNote,
    pickup_date: pickupDate || 'Scheduled date',
    pickup_address: address || 'Your registered address',
    dashboard_url: 'https://ecocycle-beryl.vercel.app/my-pickups',
  };

  // If EmailJS is not configured yet in .env, simulate gracefully without throwing errors
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.info(
      `🔔 [EcoCycle Email Simulation] To: ${toEmail} | Status: ${newStatus.toUpperCase()} | Item: ${itemType}`
    );
    return { success: true, simulated: true };
  }

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('[EcoCycle Mailer] Email delivered successfully via EmailJS:', response.status);
    return { success: true, simulated: false };
  } catch (err) {
    console.error('[EcoCycle Mailer] Failed to deliver email alert:', err);
    return { success: false, error: err };
  }
}

/**
 * Sends a booking confirmation email when a user books a doorstep collection.
 */
export async function sendBookingConfirmationEmail({
  toEmail,
  pickupId,
  itemType,
  quantity,
  pickupDate,
  address,
}) {
  return sendStatusUpdateEmail({
    toEmail,
    pickupId,
    itemType,
    quantity,
    newStatus: 'pending',
    pickupDate,
    address,
  });
}
