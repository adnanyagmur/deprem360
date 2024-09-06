

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogTitle, DialogContent, TextField, Button, CircularProgress } from '@mui/material';
import BuildingInfoDialog from './building-dialog';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<{
    id: number | string;
    coordinates: [number, number];
    address: string;
  } | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [buildingAge, setBuildingAge] = useState(''); // Bina yaşı için state
  const [concreteType, setConcreteType] = useState(''); // Beton yapısı için state
  const [loading, setLoading] = useState(false); // API isteği için yükleniyor durumu
  const [response, setResponse] = useState(null); // API yanıtı için state

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/koraydurmaz/cm0qcb5ng00g201pj6ok7ai18',
      center: [28.9784, 41.0082],
      zoom: 12,
      pitch: 45,
    });

    mapRef.current.on('load', () => {
      mapRef.current!.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 12,  // Daha uzak mesafelerden görebilmek için minzoom değerini 12'ye ayarladım
        maxzoom: 24,  // Yakınlaşınca da görünebilmesi için maxzoom'u yüksek tuttum
        paint: {
         
            'fill-extrusion-color': [
              'case',
              ['==', ['feature-state', 'color'], 'black'], '#000000', // siyah renk
              ['==', ['feature-state', 'color'], 'red'], '#ff0000', // Kırmızı renk
              ['==', ['feature-state', 'color'], 'orange'], '#ffa500', // Turuncu renk
              ['==', ['feature-state', 'color'], 'green'], '#00ff00', // Yeşil renk
              '#aaa', // Varsayılan renk
            ],
         
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      });

      mapRef.current!.on('click', '3d-buildings', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];

          if (feature.id !== undefined) {
            const coordinates = feature.geometry.coordinates[0][0];
            fetchAddressFromCoordinates(coordinates, feature.id);

            // Bina etrafına sınır çiz
            drawBuildingBoundary(feature.geometry.coordinates[0]);
          }
        }
      });
    });

    return () => mapRef.current?.remove();
  }, []);

  const fetchAddressFromCoordinates = async (
    coordinates: [number, number],
    featureId: number | string
  ) => {
    const [longitude, latitude] = coordinates;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features.length > 0 ? data.features[0].place_name : 'Adres bulunamadı';
      setSelectedBuilding({ id: featureId, coordinates: [longitude, latitude], address: address });
      setFormVisible(true);
    } catch (error) {
      console.error('Adres alınamadı:', error);
    }
  };

  const drawBuildingBoundary = (coordinates: any) => {
    if (mapRef.current?.getLayer('building-boundary')) {
      mapRef.current?.removeLayer('building-boundary');
      mapRef.current?.removeSource('building-boundary');
    }

    mapRef.current?.addSource('building-boundary', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...coordinates, coordinates[0]], // Son noktayı birleştirerek kapalı bir sınır çiziyoruz
        },
      },
    });

    mapRef.current?.addLayer({
      id: 'building-boundary',
      type: 'line',
      source: 'building-boundary',
      layout: {},
      paint: {
        'line-color': '#000000',
        'line-width': 3,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const apiUrl = 'https://inference.t3ai.org/v1/chat/completions'; // Gerçek API URL'nizi buraya ekleyin
  
    const requestData = {
      model: '/vllm-workspace/hackathon_model_2',
      messages: [
        {
          role: 'system',
          content:
            'Sen yardımcı bir asistansın ve sana verilen talimatlar doğrultusunda en iyi cevabı üretmeye çalışacaksın ve senin adın T3AI. 0, 0,5 , 1 dışında cevap vermeyecekin. Cevap:1 diye yazma sadece 1 de.',
        },
        {
          role: 'user',
          content: `Bina yaşı: ${buildingAge}, Beton yapısı: ${concreteType} BU bina depreme dayanıklı mı değil mi? Dayanıklıysa 1 değilse 0 ortada kaldıysan 0.5 cevabı ver. Başka bir cevap verme ya 1 ya 0 ya da 0.5`,
        },
      ],
      temperature: 0.01,
      top_p: 0.9,
      skip_special_tokens: true,
      repetition_penalty: 1.1,
      max_tokens: 200,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        
      });
  
      const data = await response.json();
      console.log('API Yanıtı:', data);
  
      // `message` içindeki `content` değerine erişim
      const messageContent = data.choices[0].message.content.trim();
      console.log(messageContent);
  
      // Binanın rengini gelen cevaba göre ayarla
      if (messageContent === '0') {
        console.log('0 geldi');
        mapRef.current!.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id: selectedBuilding!.id },
          { color: 'red' }
        );
      } else if (messageContent === '0.5') {
        console.log('0.5 geldi');
        mapRef.current!.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id: selectedBuilding!.id },
          { color: 'orange' }
        );
      } else if (messageContent === 'Cevap: 1') {
        console.log('1 geldi');
        mapRef.current!.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id: selectedBuilding!.id },
          { color: 'green' }
        );
      }
  
      // Haritayı yeniden boyama
      mapRef.current!.triggerRepaint();
  
      setResponse(data);
    } catch (error) {
      console.error('API isteğinde bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  
    setFormVisible(false);
  };

  return (
   
      <div>
        <div ref={mapContainerRef} style={{ width: '1250px', height: '550px' }} />
    
        {formVisible && selectedBuilding && (<BuildingInfoDialog
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        selectedBuilding={selectedBuilding}
        handleSubmit={handleSubmit}
        loading={loading}
        response={response}
        buildingAge={buildingAge}
        setBuildingAge={setBuildingAge}
        concreteType={concreteType}
        setConcreteType={setConcreteType}
      />
        )}
      </div>
  );
}
   


export default MapboxMap;
