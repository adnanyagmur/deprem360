
// 6 Siddet  style: 'mapbox://styles/koraydurmaz/cm0ravro100m401qua3694vbb',
// 7 Sidet style:  'mapbox://styles/koraydurmaz/cm0rc6sog00no01qy37mj7gmx',

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia29yYXlkdXJtYXoiLCJhIjoiY2x2ZWRuc3FkMDg1dzJpbzRxYTZhcW82aCJ9.WVTgM4Fyy0VrXXpdqoWqMw';

const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLElement,
            style: 'mapbox://styles/koraydurmaz/cm0ravro100m401qua3694vbb',
            center: [28.85419523993139, 41.004641402714334], // İstanbul koordinatları , 
            zoom: 16
        });
      
        map.current.on('load', () => {
            if (!map.current) return;
            // Mouse işaretçisini değiştir
            map.current.on('mouseenter', 'geojson-layer', () => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = 'pointer';
                }
            });

            map.current.on('mouseleave', 'geojson-layer', () => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = '';
                }
            });
        });

        // Cleanup: Bileşen kaldırıldığında haritayı temizle
        return () => {
            if (map.current) map.current.remove();
        };
    }, []);

    return (
        <div ref={mapContainer} style={{ width: '1250px', height: '550px' }} />
    );
};

export default MapComponent;
