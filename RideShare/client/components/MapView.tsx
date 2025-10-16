import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapRide {
  id: string;
  lat: number;
  lng: number;
  from: string;
  to: string;
  price: number;
  driver: string;
  time?: string;
  rating?: number;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
}

interface MapViewProps {
  rides?: MapRide[];
  center?: [number, number];
  zoom?: number;
  showRoute?: boolean;
  routeStart?: [number, number];
  routeEnd?: [number, number];
}

export function MapView({
  rides = [],
  center = [12.9716, 77.5946], // Bangalore coordinates
  zoom = 11,
  showRoute = false,
  routeStart,
  routeEnd,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map only once
    if (mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and polylines
    linesRef.current.forEach((line) => {
      if (mapRef.current) {
        mapRef.current.removeLayer(line);
      }
    });
    linesRef.current = [];

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Draw route if provided
    if (showRoute && routeStart && routeEnd) {
      const routeLine = L.polyline([routeStart, routeEnd], {
        color: '#10b981',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5',
      }).addTo(mapRef.current);
      linesRef.current.push(routeLine);

      // Add start and end markers for the route
      L.circleMarker(routeStart, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.8,
        radius: 6,
        weight: 2,
      })
        .addTo(mapRef.current)
        .bindPopup('Pickup Location');

      L.circleMarker(routeEnd, {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.8,
        radius: 6,
        weight: 2,
      })
        .addTo(mapRef.current)
        .bindPopup('Dropoff Location');
    }

    // Add ride markers
    rides.forEach((ride) => {
      if (mapRef.current) {
        const marker = L.marker([ride.lat, ride.lng]).addTo(mapRef.current);
        marker.bindPopup(`
          <div class="text-sm">
            <p class="font-semibold">${ride.driver}</p>
            <p class="text-gray-600">${ride.from} → ${ride.to}</p>
            <p class="text-primary font-bold">$${ride.price}</p>
          </div>
        `);
      }
    });
  }, [rides, showRoute, routeStart, routeEnd]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      className="rounded-lg"
    />
  );
}
