import { supabase } from '../lib/supabase';
import { useState, useEffect, useRef, useCallback } from 'react';
import PageHero from '../components/PageHero';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaClock, FaLocationArrow, FaRoute, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const getMapHeight = () => window.innerWidth < 768 ? '350px' : '600px';
const containerStyle = { width: '100%', height: typeof window !== 'undefined' ? getMapHeight() : '600px' };
const ghanaCenter = { lat: 7.9465, lng: -1.0232 };

const stationMarkerUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#CC0000"/><circle cx="16" cy="16" r="6" fill="white"/></svg>')}`;

const activeMarkerUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><path d="M18 0C9.163 0 2 7.163 2 16c0 8.837 16 28 16 28s16-19.163 16-28C34 7.163 26.837 0 18 0z" fill="#FFD700" stroke="#CC0000" stroke-width="2"/><circle cx="18" cy="16" r="6" fill="#CC0000"/></svg>')}`;

const userMarkerUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="rgba(66,133,244,0.2)"/><circle cx="16" cy="16" r="9" fill="#4285F4" stroke="white" stroke-width="3"/></svg>')}`;

const regionOptions = [
  'All Regions', 'Greater Accra', 'Ashanti', 'Western', 'Central',
  'Eastern', 'Northern', 'Bono East', 'Upper East', 'Volta',
];

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export default function FindStation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStation, setSelectedStation] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directingTo, setDirectingTo] = useState(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [outletsData, setOutletsData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    supabase.from('outlets').select('*').order('id').then(({ data, error }) => {
      if (!error && data) setOutletsData(data);
      setLoadingData(false);
    });
  }, []);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const filteredOutlets = outletsData.filter((outlet) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      outlet.name.toLowerCase().includes(q) ||
      outlet.address.toLowerCase().includes(q) ||
      outlet.region.toLowerCase().includes(q);
    const matchesRegion = selectedRegion === 'All' || outlet.region === selectedRegion;
    return matchesQuery && matchesRegion;
  });

  const handleCardClick = useCallback((outlet) => {
    setSelectedStation(outlet);
    setActiveInfoWindow(outlet.id);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: outlet.lat, lng: outlet.lng });
      mapRef.current.setZoom(14);
    }
  }, []);

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocating(false);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(11);
        }
        let nearest = null;
        let minDist = Infinity;
        outletsData.forEach((o) => {
          const d = getDistanceKm(loc.lat, loc.lng, o.lat, o.lng);
          if (d < minDist) { minDist = d; nearest = o; }
        });
        if (nearest) handleCardClick(nearest);
      },
      () => {
        setLocating(false);
        setLocationError('Location access denied. Please allow location access in your browser settings.');
      },
      { timeout: 10000 }
    );
  };

  const handleGetDirections = (outlet) => {
    const googleMapsUrl = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${outlet.lat},${outlet.lng}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}&travelmode=driving`;

    if (!isLoaded || !window.google || !userLocation) {
      window.open(googleMapsUrl, '_blank');
      return;
    }

    setLoadingDirections(true);
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: outlet.lat, lng: outlet.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoadingDirections(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          setDirectingTo(outlet.id);
          if (mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(userLocation);
            bounds.extend({ lat: outlet.lat, lng: outlet.lng });
            mapRef.current.fitBounds(bounds, 80);
          }
        } else {
          window.open(googleMapsUrl, '_blank');
        }
      }
    );
  };

  const clearDirections = () => {
    setDirectionsResponse(null);
    setDirectingTo(null);
  };

  const openInGoogleMaps = (outlet) => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${outlet.lat},${outlet.lng}&travelmode=driving`
      : `https://www.google.com/maps/place/?q=${outlet.lat},${outlet.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <PageHero
        title="Find a Station"
        subtitle="Locate your nearest Reliance Oil filling station across all regions of Ghana."
        breadcrumb={[{ label: 'Find a Station', path: '/find-station' }]}
        bgImage="https://images.unsplash.com/photo-1723021939081-31f4ab31456a?w=1600&q=85"
      />

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              {[`${outletsData.length} Stations`, '6 Regions', '24/7 Service'].map((stat) => (
                <div key={stat} style={{ backgroundColor: '#fff', borderRadius: '9999px', padding: '8px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaMapMarkerAlt style={{ color: '#CC0000', fontSize: '12px' }} />
                  <span style={{ fontWeight: 600, color: '#111', fontSize: '0.8125rem' }}>{stat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleFindMyLocation}
              disabled={locating}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: locating ? '#e5e7eb' : '#4285F4', color: '#fff', border: 'none', borderRadius: '9999px', padding: '10px 20px', fontWeight: 700, fontSize: '0.875rem', cursor: locating ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s, transform 0.2s', flexShrink: 0 }}
              onMouseEnter={(e) => { if (!locating) e.currentTarget.style.backgroundColor = '#3b77db'; }}
              onMouseLeave={(e) => { if (!locating) e.currentTarget.style.backgroundColor = '#4285F4'; }}
            >
              <FaLocationArrow size={13} style={{ animation: locating ? 'spin 1s linear infinite' : 'none' }} />
              {locating ? 'Locating...' : userLocation ? 'Update My Location' : 'Find My Location'}
            </button>
          </div>

          {locationError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaTimes style={{ color: '#CC0000', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#991B1B' }}>{locationError}</span>
            </div>
          )}

          {userLocation && (
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#1D4ED8', fontWeight: 600 }}>Your location is shown on the map. Click any station to get directions.</span>
            </div>
          )}

          {directionsResponse && (
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaRoute style={{ color: '#16A34A', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: '#15803D', fontWeight: 600 }}>
                  Route displayed — {directionsResponse.routes[0]?.legs[0]?.distance?.text} away
                  {directionsResponse.routes[0]?.legs[0]?.duration?.text && ` · ${directionsResponse.routes[0].legs[0].duration.text}`}
                </span>
              </div>
              <button onClick={clearDirections} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #16A34A', color: '#16A34A', borderRadius: '9999px', padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                <FaTimes size={10} /> Clear Route
              </button>
            </div>
          )}

          <div className="station-layout">
            <div className="station-map">
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={ghanaCenter}
                    zoom={7}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
                  >
                    {directionsResponse && (
                      <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                          suppressMarkers: false,
                          polylineOptions: { strokeColor: '#4285F4', strokeWeight: 5, strokeOpacity: 0.85 },
                        }}
                      />
                    )}

                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{ url: userMarkerUrl, scaledSize: new window.google.maps.Size(32, 32) }}
                        title="Your Location"
                        zIndex={999}
                      />
                    )}

                    {outletsData.map((outlet) => (
                      <Marker
                        key={outlet.id}
                        position={{ lat: outlet.lat, lng: outlet.lng }}
                        icon={{ url: selectedStation?.id === outlet.id ? activeMarkerUrl : stationMarkerUrl }}
                        onClick={() => {
                          setSelectedStation(outlet);
                          setActiveInfoWindow(outlet.id);
                        }}
                        zIndex={selectedStation?.id === outlet.id ? 10 : 1}
                      >
                        {activeInfoWindow === outlet.id && (
                          <InfoWindow
                            position={{ lat: outlet.lat, lng: outlet.lng }}
                            onCloseClick={() => setActiveInfoWindow(null)}
                          >
                            <div style={{ maxWidth: '220px', fontFamily: 'inherit' }}>
                              <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px', color: '#111' }}>{outlet.name}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>{outlet.address}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>{outlet.hours}</p>
                              {userLocation && (
                                <p style={{ fontSize: '0.75rem', color: '#4285F4', fontWeight: 600, marginBottom: '8px' }}>
                                  {formatDistance(getDistanceKm(userLocation.lat, userLocation.lng, outlet.lat, outlet.lng))} away
                                </p>
                              )}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                                {outlet.services.map((service) => (
                                  <span key={service} style={{ backgroundColor: '#FEF2F2', color: '#CC0000', fontSize: '10px', padding: '2px 7px', borderRadius: '9999px' }}>{service}</span>
                                ))}
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleGetDirections(outlet)}
                                  disabled={loadingDirections}
                                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 0', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  <FaRoute size={10} />
                                  {loadingDirections ? 'Loading...' : 'Directions'}
                                </button>
                                <button
                                  onClick={() => openInGoogleMaps(outlet)}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', padding: '7px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                  title="Open in Google Maps"
                                >
                                  <FaExternalLinkAlt size={10} />
                                </button>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))}
                  </GoogleMap>
                ) : (
                  <div style={{ height: '600px', backgroundColor: '#f3f4f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading Map...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="station-list">
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '13px' }} />
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '36px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', width: '100%', backgroundColor: '#F8F8F8', borderRadius: '12px', fontSize: '0.875rem', border: '1px solid transparent', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.target.style.borderColor = '#CC0000'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                  />
                </div>
                <select
                  value={selectedRegion === 'All' ? 'All Regions' : selectedRegion}
                  onChange={(e) => { const v = e.target.value; setSelectedRegion(v === 'All Regions' ? 'All' : v); }}
                  style={{ marginTop: '12px', width: '100%', backgroundColor: '#F8F8F8', border: '1px solid transparent', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', color: '#4b5563', outline: 'none', cursor: 'pointer' }}
                  onFocus={(e) => { e.target.style.borderColor = '#CC0000'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                >
                  {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '12px' }}>
                Showing {filteredOutlets.length} of {outletsData.length} stations
                {userLocation && ' · Sorted by distance'}
              </p>

              <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loadingData ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Loading stations...</div>
                ) : filteredOutlets.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', textAlign: 'center' }}>
                    <FaSearch style={{ fontSize: '32px', color: '#ddd', marginBottom: '12px' }} />
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No stations found</span>
                  </div>
                ) : (
                  [...filteredOutlets]
                    .sort((a, b) => {
                      if (!userLocation) return 0;
                      return getDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
                             getDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
                    })
                    .map((outlet) => {
                      const isSelected = selectedStation?.id === outlet.id;
                      const isDirecting = directingTo === outlet.id;
                      const dist = userLocation ? getDistanceKm(userLocation.lat, userLocation.lng, outlet.lat, outlet.lng) : null;
                      return (
                        <div key={outlet.id}>
                          <div
                            onClick={() => handleCardClick(outlet)}
                            style={{
                              backgroundColor: isSelected ? '#FFF8F8' : '#fff',
                              borderRadius: '12px',
                              padding: '14px',
                              cursor: 'pointer',
                              border: isDirecting ? '1px solid #4285F4' : isSelected ? '1px solid #CC0000' : '1px solid transparent',
                              boxShadow: isSelected ? '0 2px 8px rgba(204,0,0,0.08)' : 'none',
                              transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#CC0000'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; } }}
                            onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; } }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111', flex: 1 }}>{outlet.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                                {dist !== null && (
                                  <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>{formatDistance(dist)}</span>
                                )}
                                <span style={{ backgroundColor: '#FFF0F0', color: '#CC0000', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>{outlet.region}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                              <FaMapMarkerAlt style={{ fontSize: '11px', color: '#999', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.75rem', color: '#888' }}>{outlet.address}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                              <FaClock style={{ fontSize: '11px', color: '#999', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.75rem', color: '#888' }}>{outlet.hours}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                              <FaPhone style={{ fontSize: '11px', color: '#999', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.75rem', color: '#888' }}>{outlet.phone}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleGetDirections(outlet); }}
                                disabled={loadingDirections}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: isDirecting ? '#4285F4' : '#CC0000', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 0', fontSize: '0.75rem', fontWeight: 700, cursor: loadingDirections ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
                                onMouseEnter={(e) => { if (!loadingDirections && !isDirecting) e.currentTarget.style.backgroundColor = '#b00000'; }}
                                onMouseLeave={(e) => { if (!loadingDirections && !isDirecting) e.currentTarget.style.backgroundColor = '#CC0000'; }}
                              >
                                <FaRoute size={11} />
                                {loadingDirections && directingTo === null ? 'Loading...' : isDirecting ? 'Route Active' : 'Get Directions'}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); openInGoogleMaps(outlet); }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                title="Open in Google Maps"
                              >
                                <FaExternalLinkAlt size={10} />
                                Maps
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
