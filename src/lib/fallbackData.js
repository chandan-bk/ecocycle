/**
 * EcoCycle Resilient Fallback Data & Local State Management
 * Ensures 100% functionality during live demonstrations and evaluations
 * even if cloud Supabase free-tier instances pause due to inactivity.
 */

export const FALLBACK_CENTERS = [
  {
    id: 'c1',
    name: 'EcoE-Waste Recycling Hub - Whitefield',
    address: 'ITPB Main Road, Near Hope Farm Junction, Whitefield',
    city: 'Bangalore',
    lat: 12.9698,
    lng: 77.7499,
    accepts: ['Smartphones & Tablets', 'Laptops & Notebooks', 'Cables, Chargers & Adapters', 'Li-ion Batteries'],
  },
  {
    id: 'c2',
    name: 'Mandya Civic E-Waste Depot',
    address: 'V V Road, Near District Stadium',
    city: 'Mandya',
    lat: 12.5244,
    lng: 76.8958,
    accepts: ['Smartphones & Tablets', 'Laptops & Notebooks', 'Li-ion Batteries', 'Small Home Appliances'],
  },
  {
    id: 'c3',
    name: 'GreenTech E-Waste Facility - Electronic City',
    address: 'Phase 1, Hosur Main Road, Electronic City',
    city: 'Bangalore',
    lat: 12.8452,
    lng: 77.6602,
    accepts: ['Desktop PCs & Monitors', 'Laptops & Notebooks', 'Servers', 'Keyboards', 'Printers & Scanners'],
  },
  {
    id: 'c4',
    name: 'SustainCycle Collection Depot - Koramangala',
    address: '80 Feet Road, 4th Block, Koramangala',
    city: 'Bangalore',
    lat: 12.9352,
    lng: 77.6245,
    accepts: ['Smartphones & Tablets', 'Audio Equipment & Headphones', 'Cables, Chargers & Adapters', 'Li-ion Batteries'],
  },
  {
    id: 'c5',
    name: 'Urban Recyclers Dismantling Station - Indiranagar',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore',
    lat: 12.9784,
    lng: 77.6408,
    accepts: ['Laptops & Notebooks', 'Desktop PCs & Monitors', 'Small Home Appliances', 'Audio Equipment'],
  },
  {
    id: 'c6',
    name: 'EarthSafe Certified E-Waste - Jayanagar',
    address: '33rd Cross, 9th Block, Jayanagar',
    city: 'Bangalore',
    lat: 12.9250,
    lng: 77.5938,
    accepts: ['Televisions & Displays', 'Small Home Appliances', 'Smartphones & Tablets'],
  },
  {
    id: 'c7',
    name: 'CleanCity Circular Depot - Malleshwaram',
    address: 'Sampige Road, Between 7th & 8th Cross, Malleshwaram',
    city: 'Bangalore',
    lat: 13.0031,
    lng: 77.5643,
    accepts: ['Li-ion Batteries', 'Smartphones & Tablets', 'Cables, Chargers & Adapters', 'Other Electronic Waste'],
  },
  {
    id: 'c8',
    name: 'Silicon Valley E-Waste Recovery - HSR Layout',
    address: '27th Main Road, Sector 1, HSR Layout',
    city: 'Bangalore',
    lat: 12.9116,
    lng: 77.6534,
    accepts: ['Laptops & Notebooks', 'Desktop PCs & Monitors', 'Smartphones & Tablets', 'Cables & Adapters'],
  },
  {
    id: 'c9',
    name: 'EcoTrust Demanufacturing Plant - Peenya',
    address: 'Plot 42, 2nd Stage, Peenya Industrial Area',
    city: 'Bangalore',
    lat: 13.0329,
    lng: 77.5142,
    accepts: ['Desktop PCs & Monitors', 'Televisions & Displays', 'Small Home Appliances', 'Servers'],
  },
  {
    id: 'c10',
    name: 'GreenKarma E-Drop Point - Hebbal',
    address: 'Bellary Road, Near Flyover, Hebbal',
    city: 'Bangalore',
    lat: 13.0358,
    lng: 77.5970,
    accepts: ['Smartphones & Tablets', 'Laptops & Notebooks', 'Li-ion Batteries', 'Cables, Chargers & Adapters'],
  },
];

export const INITIAL_DEMO_PICKUPS = [
  {
    id: 'pk-101',
    user_id: 'demo-user-id',
    item_type: 'Smartphones & Tablets',
    quantity: 3,
    address: 'Flat 402, Green Meadows, 5th Main, Bangalore',
    pickup_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    status: 'scheduled',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    profiles: { email: 'citizen@ecocycle.org' },
  },
  {
    id: 'pk-102',
    user_id: 'demo-user-id',
    item_type: 'Laptops & Notebooks',
    quantity: 1,
    address: 'House #12, 3rd Cross, Ashok Nagar, Mandya',
    pickup_date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    status: 'collected',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    profiles: { email: 'citizen@ecocycle.org' },
  },
  {
    id: 'pk-103',
    user_id: 'demo-user-id',
    item_type: 'Li-ion Batteries',
    quantity: 6,
    address: 'Flat 402, Green Meadows, 5th Main, Bangalore',
    pickup_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { email: 'citizen@ecocycle.org' },
  },
];

const LOCAL_PICKUPS_KEY = 'ecocycle_local_pickups';
const DEMO_SESSION_KEY = 'ecocycle_demo_session';

export function getStoredPickups() {
  try {
    const raw = localStorage.getItem(LOCAL_PICKUPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PICKUPS_KEY, JSON.stringify(INITIAL_DEMO_PICKUPS));
      return INITIAL_DEMO_PICKUPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_PICKUPS;
  }
}

export function saveStoredPickup(newPickup) {
  try {
    const current = getStoredPickups();
    const updated = [newPickup, ...current];
    localStorage.setItem(LOCAL_PICKUPS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving local pickup:', err);
    return [];
  }
}

export function updateStoredPickupStatus(id, newStatus) {
  try {
    const current = getStoredPickups();
    const updated = current.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    localStorage.setItem(LOCAL_PICKUPS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating local pickup status:', err);
    return [];
  }
}

export function getDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setDemoSession(userObj, role) {
  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: userObj, role }));
  } catch (err) {
    console.error('Error setting demo session:', err);
  }
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(DEMO_SESSION_KEY);
  } catch (err) {
    console.error('Error clearing demo session:', err);
  }
}
