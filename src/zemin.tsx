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
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [28.9784, 41.0082], // İstanbul koordinatları
            zoom: 10
        });

        map.current.on('load', () => {
            if (!map.current) return;

            // GeoJSON kaynağını ekle
            map.current.addSource('geojson-data', {
                type: 'geojson',
                data: '/updated_map.geojson', // GeoJSON dosyasının yolu
            });

            // GeoJSON verisini haritaya ekle
            map.current.addLayer({
                id: 'geojson-layer',
                type: 'fill',
                source: 'geojson-data',
                paint: {
                    'fill-color': [
                        'case',
                        ['==', ['get', 'name'], 'Toprak'], '#f9a800',
                        ['==', ['get', 'name'], 'Kireçtaşı'], '#ffff00',
                        ['==', ['get', 'name'], 'Gevşek Dolgu'], '#903373',
                        ['==', ['get', 'name'], 'Sağlam Kaya'], '#888888',
                        ['==', ['get', 'name'], 'Yumuşak Toprak'], '#325928',
                        ['==', ['get', 'name'], 'Çakıllı Toprak'], '#191e28',
                        ['==', ['get', 'name'], 'Kumlu Toprak'], '#00387b',
                        ['==', ['get', 'name'], 'Killi Toprak'], '#FFB347',
                        '#888888' // Varsayılan renk
                    ],
                    'fill-opacity': 0.6
                },
                filter: ['==', '$type', 'Polygon']
            });

            // Polygon üzerine tıklama olayı
            map.current.on('click', 'geojson-layer', (e: any) => {
                if (e.features && e.features.length > 0) {
                    const coordinates = e.lngLat;
                    const feature = e.features[0];
                    const name = feature.properties.name || "Polygon";
                    const description = feature.properties.description || "Açıklama yok";

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<strong>${name}</strong><p>${description}</p>`)
                        .addTo(map.current as mapboxgl.Map);
                }
            });

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
