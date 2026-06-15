'use client';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '16px'
};

interface MapViewerProps {
    lat: number;
    lng: number;
}

export function MapViewer({ lat, lng }: MapViewerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const center = { lat, lng };

    if (!isLoaded) return <div style={{ width: '100%', height: '100%', background: '#f5f5f5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading Map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: 'cooperative'
            }}
        >
            <Marker position={center} />
        </GoogleMap>
    );
}
