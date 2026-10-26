import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import { 
  MapPin, 
  Search, 
  Filter, 
  Phone, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  Loader2, 
  Building2 
} from 'lucide-react';

// Eco-friendly custom recycling marker icon (CSS + Unicode emoji, zero broken image risk)
const ecoMarkerIcon = L.divIcon({
  className: 'eco-map-marker',
  html: `
    <div style="
      background-color: #0F3D2E; 
      color: white; 
      width: 36px; 
      height: 36px; 
      border-radius: 50% 50% 50% 0; 
      transform: rotate(-45deg); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 4px 10px rgba(15, 61, 46, 0.35); 
      border: 2px solid #ffffff;">
      <span style="transform: rotate(45deg); font-size: 14px; font-weight: bold;">♻️</span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32],
});

// Component to dynamically adjust map center when filtered or clicked
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * Locator Page
 * Interactive Leaflet & OpenStreetMap locator for authorized e-waste collection centers.
 */
export default function Locator() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedItemType, setSelectedItemType] = useState('All');
  const [activeCenter, setActiveCenter] = useState(null);

  // Default Center: Mandya, Karnataka, India
  const defaultCenter = [12.5244, 76.8958];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13);

  // Fetch centers from Supabase
  const fetchCenters = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('centers')
        .select('*')
        .order('name', { ascending: true });

      if (err) throw err;
      setCenters(data || []);
    } catch (err) {
      console.error('Error fetching collection centers:', err);
      setError('Could not load recycling centers. Please check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Extract distinct cities & accepted items for dropdown filters
  const cities = useMemo(() => {
    const list = new Set();
    centers.forEach((c) => {
      if (c.city) list.add(c.city);
    });
    return ['All', ...Array.from(list)];
  }, [centers]);

  const allAcceptedTypes = useMemo(() => {
    const list = new Set();
    centers.forEach((c) => {
      if (Array.isArray(c.accepts)) {
        c.accepts.forEach((item) => list.add(item));
      }
    });
    return ['All', ...Array.from(list)];
  }, [centers]);

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      // 1. Search text query
      const matchesSearch =
        searchQuery === '' ||
        center.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. City filter
      const matchesCity = selectedCity === 'All' || center.city?.toLowerCase() === selectedCity.toLowerCase();

      // 3. Accepted item type filter
      const matchesItem =
        selectedItemType === 'All' ||
        (Array.isArray(center.accepts) &&
          center.accepts.some((acc) => acc.toLowerCase().includes(selectedItemType.toLowerCase())));

      return matchesSearch && matchesCity && matchesItem;
    });
  }, [centers, searchQuery, selectedCity, selectedItemType]);

  const CITY_COORDINATES = {
    'Mandya': { center: [12.5244, 76.8958], zoom: 13 },
    'Bangalore': { center: [12.9716, 77.5946], zoom: 12 },
    'All': { center: [12.75, 77.25], zoom: 9 },
  };

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    setActiveCenter(null);

    // Auto-center map based on chosen city
    if (CITY_COORDINATES[newCity]) {
      setMapCenter(CITY_COORDINATES[newCity].center);
      setMapZoom(CITY_COORDINATES[newCity].zoom);
    } else {
      const match = centers.find(
        (c) => c.city?.toLowerCase() === newCity.toLowerCase() && c.lat && c.lng
      );
      if (match) {
        setMapCenter([match.lat, match.lng]);
        setMapZoom(13);
      }
    }
  };

  const handleCenterSelect = (center) => {
    setActiveCenter(center);
    if (center.lat && center.lng) {
      setMapCenter([center.lat, center.lng]);
      setMapZoom(14);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-emerald-600" />
            Recycler & Collection Center Locator
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Locate authorized e-waste dismantling facilities & drop-off locations powered by OpenStreetMap.
          </p>
        </div>

        <button
          onClick={fetchCenters}
          className="inline-flex items-center gap-1.5 self-start md:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Locations
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search facility name or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                City: {city}
              </option>
            ))}
          </select>
        </div>

        {/* Item Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedItemType}
            onChange={(e) => setSelectedItemType(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
          >
            {allAcceptedTypes.map((type) => (
              <option key={type} value={type}>
                Accepts: {type}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Content: Map + Side List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Map View (8 cols) */}
        <div className="lg:col-span-8 bg-white p-2 rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[500px] lg:h-[620px] relative">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-700 bg-slate-50 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs text-slate-500">Loading interactive map and centers...</p>
            </div>
          ) : (
            <MapContainer
              center={defaultCenter}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
            >
              <ChangeMapView center={mapCenter} zoom={mapZoom} />

              {/* Free OpenStreetMap Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Markers for each filtered center */}
              {filteredCenters.map((center) => {
                if (!center.lat || !center.lng) return null;
                return (
                  <Marker
                    key={center.id}
                    position={[center.lat, center.lng]}
                    icon={ecoMarkerIcon}
                    eventHandlers={{
                      click: () => setActiveCenter(center),
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="p-1 space-y-2 max-w-[240px]">
                        <h4 className="font-bold text-[#0F3D2E] text-sm leading-tight">{center.name}</h4>
                        <p className="text-xs text-[#3F584C]">{center.address}, {center.city}</p>
                        
                        {center.accepts && center.accepts.length > 0 && (
                          <div className="pt-1">
                            <span className="text-xs font-bold text-[#6B8477] uppercase block mb-1">
                              Accepts:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {center.accepts.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-[#E8F5EE] text-[#0F3D2E] px-1.5 py-0.5 rounded border border-[#D6E5DC]"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#EDF3EF] flex items-center justify-between text-xs">
                          <span className="text-[#6B8477]">
                            {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#2FA36B] hover:text-[#1C7C54] inline-flex items-center gap-1"
                          >
                            Directions <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Side List of Centers (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">
              Centers Found ({filteredCenters.length})
            </h2>
            <span className="text-xs text-[#6B8477]">Click to locate</span>
          </div>

          <div className="space-y-3 max-h-[570px] overflow-y-auto pr-1">
            {filteredCenters.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-[#D6E5DC] text-center text-[#3F584C] text-sm">
                No collection centers match your current filter criteria.
              </div>
            ) : (
              filteredCenters.map((center) => {
                const isSelected = activeCenter?.id === center.id;
                return (
                  <div
                    key={center.id}
                    onClick={() => handleCenterSelect(center)}
                    className={`p-4 rounded-xl border cursor-pointer transition duration-150 ${
                      isSelected
                        ? 'bg-[#E8F5EE] border-[#2FA36B] ring-1 ring-[#2FA36B]'
                        : 'bg-white border-[#D6E5DC] hover:border-[#B4CFC1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[#0F3D2E] text-sm">{center.name}</h3>
                      <span className="text-xs bg-[#EDF3EF] text-[#3F584C] px-2 py-0.5 rounded-full shrink-0 font-semibold">
                        {center.city}
                      </span>
                    </div>

                    <p className="text-xs text-[#3F584C] mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2FA36B] shrink-0 mt-0.5" />
                      <span>{center.address}</span>
                    </p>

                    {Array.isArray(center.accepts) && center.accepts.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {center.accepts.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#EDF3EF] text-[#0F3D2E] px-1.5 py-0.5 rounded font-medium"
                          >
                            {item}
                          </span>
                        ))}
                        {center.accepts.length > 3 && (
                          <span className="text-xs text-[#6B8477] self-center">
                            +{center.accepts.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
