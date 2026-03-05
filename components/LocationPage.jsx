import { ExternalLink, MapPin, Navigation, Search, X } from 'lucide-react';
import { useState } from 'react';
import { MOCK_CENTERS } from '../constants';


let MapContainer, TileLayer, Marker, Popup, useMap;

const CARE_TYPES = [
  { key: 'hospital', label: 'Hospitals', emoji: '🏥', color: '#ef4444', query: 'hospital' },
  { key: 'clinic', label: 'Clinics', emoji: '🏨', color: '#3b82f6', query: 'clinic' },
  { key: 'support', label: 'Support Centers', emoji: '💚', color: '#10b981', query: 'maternity support center' },
  { key: 'pharmacy', label: 'Pharmacies', emoji: '💊', color: '#8b5cf6', query: 'pharmacy' },
];

const MapView = ({ lat, lng, zoom = 13 }) => {
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05},${lat - 0.04},${lng + 0.05},${lat + 0.04}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <iframe
      title="Care Centers Map"
      src={embedSrc}
      className="w-full h-full border-none rounded-[2rem]"
      loading="lazy"
    />
  );
};

const LocationPage = ({ profile, onClose }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 28.5355, lng: 77.2100 }); // Default: New Delhi
  const [locating, setLocating] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      err => {
        console.error('Geolocation error:', err);
        setLocating(false);
        alert('Unable to retrieve your location. Showing default location.');
      },
      { timeout: 10000 }
    );
  };

  const filtered = MOCK_CENTERS.filter(c => {
    const matchType = filter === 'all' || c.type === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleNavigate = (center) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="shrink-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <MapPin size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm tracking-tight">Nearby Care Support</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Find hospitals, clinics & pharmacies</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLocate}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-60"
          >
            <Navigation size={14} className={locating ? 'animate-pulse' : ''} />
            {locating ? 'Locating...' : 'Use My Location'}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-96 bg-white border-r border-slate-100 flex flex-col overflow-hidden shadow-sm">
          {/* Search + filters */}
          <div className="p-4 border-b border-slate-50 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="location-search"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search clinics, hospitals..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} emoji="📍" />
              {CARE_TYPES.map(t => (
                <FilterPill key={t.key} label={t.label} active={filter === t.key} onClick={() => setFilter(t.key)} emoji={t.emoji} />
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400 italic text-sm">No results found.</div>
            ) : (
              filtered.map(center => {
                const typeInfo = CARE_TYPES.find(t => t.key === center.type);
                return (
                  <div
                    key={center.id}
                    onClick={() => setSelectedCenter(center)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedCenter?.id === center.id ? 'bg-emerald-50 border-emerald-200 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{typeInfo?.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">{center.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{center.address}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full" style={{ background: `${typeInfo?.color}15`, color: typeInfo?.color }}>
                            {center.distance}
                          </span>
                          <span className="text-[10px] text-slate-400">{center.phone}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleNavigate(center); }}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                    >
                      <ExternalLink size={12} /> Get Directions
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map Panel */}
        <div className="hidden md:flex flex-1 relative bg-slate-100">
          <div className="absolute inset-3 rounded-[2rem] overflow-hidden shadow-inner">
            <MapView
              lat={selectedCenter?.lat || userLocation.lat}
              lng={selectedCenter?.lng || userLocation.lng}
              zoom={selectedCenter ? 15 : 13}
            />
          </div>
          {/* Floating selected info */}
          {selectedCenter && (
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/60 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
              <span className="text-2xl">{CARE_TYPES.find(t => t.key === selectedCenter.type)?.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">{selectedCenter.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCenter.address} · {selectedCenter.distance}</p>
              </div>
              <button
                onClick={() => handleNavigate(selectedCenter)}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
              >
                <Navigation size={13} /> Navigate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterPill = ({ label, active, onClick, emoji }) => (
  <button
    onClick={onClick}
    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
      active ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
    }`}
  >
    <span>{emoji}</span> {label}
  </button>
);

export default LocationPage;
