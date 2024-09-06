import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox API anahtarınızı burada belirtin
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Map objesini saklamak için useRef kullanıyoruz
  const [selectedBuilding, setSelectedBuilding] = useState<{ id: number | string, coordinates: [number, number], address: string } | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/koraydurmaz/cm0qcb5ng00g201pj6ok7ai18',
      center: [28.9784, 41.0082], // İstanbul koordinatları
      zoom: 12,
      pitch: 45, // 3D görünüm açısı
    });

    mapRef.current.on('load', () => {
      mapRef.current!.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'clicked'], false],
            '#000000', // Kırmızı renk (tıklandığında)
            ['boolean', ['feature-state', 'highlight'], false],
            '#ff0000', // Turuncu renk (Gönder butonuna basıldığında)
            '#aaa' // Diğer binalar için varsayılan renk
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      });

      // Binaya tıklama olayı
      mapRef.current!.on('click', '3d-buildings', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];

          if (feature.id !== undefined) {
            // Önceki tıklanan binanın durumunu sıfırla
            mapRef.current!.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: feature.id },
              { clicked: false, highlight: false } // Renk sıfırlanıyor
            );

            // Şu an tıklanan bina için durumu değiştir (kırmızı yap)
            mapRef.current!.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: feature.id },
              { clicked: true } // Kırmızı renk
            );

            // Geometrik türü kontrol edin ve ardından koordinatları alın
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              const coordinates = feature.geometry.coordinates[0][0]; // İlk koordinat setini alıyoruz
              
              // Ters geokodlama ile adresi getir
              fetchAddressFromCoordinates(coordinates, feature.id);
            } else if (feature.geometry.type === 'Point') {
              const coordinates = feature.geometry.coordinates; // Nokta koordinatları

              // Ters geokodlama ile adresi getir
              fetchAddressFromCoordinates(coordinates, feature.id);
            } else {
              console.error('Geometri türü desteklenmiyor:', feature.geometry.type);
            }
          }
        }
      });
    });

    return () => mapRef.current?.remove();
  }, []);

  const fetchAddressFromCoordinates = async (coordinates: [number, number], featureId: number | string) => {
    const [longitude, latitude] = coordinates; // coordinates[0] -> boylam, coordinates[1] -> enlem
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      // Ters geokodlama sonucunda en yakın adresi al
      const address = data.features.length > 0 ? data.features[0].place_name : 'Adres bulunamadı';

      // Formu doldur
      setSelectedBuilding({
        id: featureId, // Tıklanan binanın id'si
        coordinates: [longitude, latitude], // Boylam (longitude) ve enlem (latitude)
        address: address
      });

      setFormVisible(true); // Formu göster
    } catch (error) {
      console.error('Adres alınamadı:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Gönderildi:', selectedBuilding);

    // Binanın rengini turuncuya değiştir
    if (selectedBuilding) {
      mapRef.current!.setFeatureState(
        { source: 'composite', sourceLayer: 'building', id: selectedBuilding.id },
        { clicked: false, highlight: true } // Turuncuya geçiş
      );
    }

    setFormVisible(false); // Formu kapat
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />

      {formVisible && selectedBuilding && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          zIndex: 1,
        }}>
          <h3>Bina Bilgileri</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="address">Adres: </label>
              <input
                type="text"
                id="address"
                value={selectedBuilding.address}
                readOnly
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="coordinates">Koordinatlar: </label>
              <input
                type="text"
                id="coordinates"
                value={`Enlem: ${selectedBuilding.coordinates[1]}, Boylam: ${selectedBuilding.coordinates[0]}`}
                readOnly
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff', // Butonun normal rengi
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
