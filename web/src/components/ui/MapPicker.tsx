'use client';
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 20.5937, // Default center to India
    lng: 78.9629
};

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLocation?: { lat: number, lng: number };
}

export function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPos, setMarkerPos] = useState(initialLocation || defaultCenter);
    const [zoom, setZoom] = useState(initialLocation ? 15 : 4);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
        // Try to get user's current location if no initial location provided
        if (!initialLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPos(pos);
                    setZoom(15);
                    map.panTo(pos);
                },
                () => {
                    // Geolocation failed or denied
                }
            );
        }
    }, [initialLocation]);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
            onLocationSelect(lat, lng);
        }
    };

    const handleCurrentLocation = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPos(pos);
                    setZoom(16);
                    map?.panTo(pos);
                    onLocationSelect(pos.lat, pos.lng);
                },
                () => {
                    alert('Unable to retrieve your location. Please check browser permissions.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    if (!isLoaded) return <div style={{ width: '100%', height: '100%', background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading Maps...</div>;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button
                onClick={handleCurrentLocation}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 60,
                    zIndex: 10,
                    background: 'var(--forest)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                📍 Use Current Location
            </button>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPos}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                }}
            >
                <Marker position={markerPos} />
            </GoogleMap>
        </div>
    );
}
