/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import BuildingInfoDialog from './building-dialog';
import LlmFeadBackDialog from './llm-feedback-dialog';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type Message = {
  role: 'system' | 'user';
  content: string;
};

type RequestDataProps = {
  model: string;
  messages: Message[];
  temperature: number;
  top_p: number;
  skip_special_tokens: boolean;
  repetition_penalty: number;
  max_tokens: number;
};

const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);


  const [buildingAge, setBuildingAge] = useState(''); // Bina yaşı için state
 // const [concreteType, setConcreteType] = useState(''); // Beton yapısı için state bu artık corret
  const [loading, setLoading] = useState(false); // API isteği için yükleniyor durumu
  const [response, setResponse] = useState(null); // API yanıtı için state
  const [feedbackDialogVisible, setFeedbackDialogVisible] = useState(false); // Yanıt bilgisi dialog görünürlüğü
 // Dialog ve form için gerekli state'ler
 const [formVisible, setFormVisible] = useState(false); // Formun görünürlüğünü kontrol eder
 const [selectedBuilding, setSelectedBuilding] = useState<{
   id: number | string;
   coordinates: [number, number];
   address: string;
 } | null>(null); // Seçilen bina bilgilerini tutar

 const [buildingName, setBuildingName] = useState(''); // Bina adı

 const [usePurpose, setUsePurpose] = useState(''); // Kullanım amacı (konut, ticari vb.)
 const [approvalDate, setApprovalDate] = useState(''); // Mimari proje onay tarihi
 const [permitStatus, setPermitStatus] = useState(''); // Ruhsat durumu (Var/Yok)
 const [floorCount, setFloorCount] = useState(''); // Kat sayısı
 const [buildingHeight, setBuildingHeight] = useState(''); // Bina yüksekliği
 const [structuralSystem, setStructuralSystem] = useState(''); // Yapısal sistem (Betonarme, Çelik vb.)
 const [totalArea, setTotalArea] = useState(''); // Toplam inşaat alanı
 const [concreteClass, setConcreteClass] = useState(''); // Beton sınıfı (C30 vb.)
 const [steelQuality, setSteelQuality] = useState(''); // Çelik donatı kalitesi (S420 vb.)
 const [earthquakeZone, setEarthquakeZone] = useState(''); // Deprem bölgesi (1. derece, 2. derece vb.)
 const [soilClass, setSoilClass] = useState(''); // Zemin sınıfı (Z3, Z4 vb.)
 const [waterLevel, setWaterLevel] = useState(''); // Yeraltı su seviyesi
 const [isSymmetric, setIsSymmetric] = useState(''); // Bina simetrik mi? (Evet/Hayır)
 const [torsionRisk, setTorsionRisk] = useState(''); // Burulma riski
 const [rigidity, setRigidity] = useState(''); // Yanal rijitlik durumu
 const [damageStatus, setDamageStatus] = useState(''); // Yapısal hasar durumu
 const [strengthening, setStrengthening] = useState(''); // Güçlendirme yapıldı mı? (Evet/Hayır)
 const [earthquakeEvaluation, setEarthquakeEvaluation] = useState(''); // Depreme dayanıklılık durumu


 const [reqData, setReqData] = useState<RequestDataProps>(); // LLM'ye gönderilecek requestData



 useEffect(() => {
  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current!,
    style: 'mapbox://styles/koraydurmaz/cm0qcb5ng00g201pj6ok7ai18',
    center: [28.9784, 41.0082],
    zoom: 12,
    pitch: 45,
  });

    mapRef.current.on('load', () => {


      mapRef.current!.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'point_map.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    mapRef.current!.addLayer({
      id: 'unclustered-point',
      type: 'circle',
              source: 'earthquakes',
              filter: ['has', 'point_count'],
              paint: {
                  // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                  // with three steps to implement three types of circles:
                  //   * Blue, 20px circles when point count is less than 100
                  //   * Yellow, 30px circles when point count is between 100 and 750
                  //   * Pink, 40px circles when point count is greater than or equal to 750
                  'circle-color': [
                      'step',
                      ['get', 'point_count'],
                      '#FF0000',
                      100,
                      '#FF0000',
                      750,
                      '#FF0000'
                  ],
                  'circle-radius': [
                      'step',
                      ['get', 'point_count'],
                      20,
                      100,
                      30,
                      750,
                      40
                  ]
              },
      minzoom: 5  // Bu değeri zoom seviyesi 5'ten büyükse göster anlamında ayarladım
  
          });
          mapRef.current!.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        mapRef.current!.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FF0000'
            }
        });
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
          const feature: mapboxgl.MapboxGeoJSONFeature = e.features[0];
      
          if (feature.id !== undefined) {
            
            const coordinates = feature.geometry?.coordinates[0][0];
            fetchAddressFromCoordinates(coordinates, feature.id);
      
            // Bina etrafına sınır çiz
            drawBuildingBoundary(feature.geometry?.coordinates[0]);
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
        properties: {}, // Add an empty properties object
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
  
    // Formdan gelen tüm verileri kullanarak LLM modeline göndereceğimiz veriyi hazırlıyoruz
    const requestData: RequestDataProps = {
      model: '/vllm-workspace/hackathon_model_2',
      messages: [
        {
          role: 'system',
          content:
            'Sen 30 yıllık bir inşaat yüksek mühendisisin ve uzmanlık alanın deprem analizi ve bina güçlendirme. Sana verilen bina özelliklerine göre 0 ile 10 arasında bir deprem dayanıklılık puanı ver. 0 en iyi, 10 en kötü dayanıklılığı gösterir. Yanıtın sadece sayı olacak ve formatı "Cevap: puanladigin-sayi-buraya-gelecek"  şeklinde olacak.',
        },
        {
          role: 'user',
          content: `Bina yaşı: ${buildingAge}, 
                    Beton sınıfı: ${concreteClass}, 
                    Çelik donatı kalitesi: ${steelQuality}, 
                    Yapısal sistem: ${structuralSystem}, 
                    Kat sayısı: ${floorCount}, 
                    Bina yüksekliği: ${buildingHeight}, 
                    Zemin sınıfı: ${soilClass}, 
                    Deprem bölgesi: ${earthquakeZone}, 
                    Kullanım amacı: ${usePurpose}, 
                    Ruhsat durumu: ${permitStatus}, 
                    Güçlendirme yapılmış mı: ${strengthening}, 
                    Yapısal hasar durumu: ${damageStatus}, 
                    Burulma riski: ${torsionRisk}, 
                    Yanal rijitlik: ${rigidity}, 
                    Bu bina depreme dayanıklı mı değil mi? Dayanıklılığı 0 en dayanıklı ile 10 en kötü dayanaksız olarak arasında bir puanla değerlendir. Yanıtın sadece sayı olacak, formatı "Cevap: puanladigin-sayi-buraya-gelecek"  şeklinde olacak.`,
        },
      ],
      temperature: 0.5,
      top_p: 0.9,
      skip_special_tokens: true,
      repetition_penalty: 1.1,
      max_tokens: 2000,
    };

    console.log('API İsteği:', requestData);
    setReqData(requestData);
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
      let messageContent = data.choices[0].message.content.trim();
  
      // Eğer hala "Cevap:" gibi bir metin varsa temizle
      if (messageContent.startsWith('Cevap:')) {
        messageContent = messageContent.replace('Cevap:', '').trim();
      }
  
      const dayaniklilikPuani = parseFloat(messageContent);
      console.log('Dayanıklılık Puanı:', dayaniklilikPuani);
  
      // Renk atama
      let color = 'green'; // varsayılan en iyi (yeşil)
      
      if (dayaniklilikPuani >= 8) {
        color = 'red'; // en kötü (kırmızı)
      } else if (dayaniklilikPuani >= 4) {
        color = 'orange'; // orta seviye (orange)
      }
  
      // Binanın rengini gelen puana göre ayarla
      mapRef.current!.setFeatureState(
        { source: 'composite', sourceLayer: 'building', id: selectedBuilding!.id },
        { color }
      );
  
      // Haritayı yeniden boyama
      mapRef.current!.triggerRepaint();
  
      setResponse(data);
    } catch (error) {
      console.error('API isteğinde bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
      // 4 saniye sonra yeni dialogu aç
      setTimeout(() => {
        setFeedbackDialogVisible(true);
      }, 3000);
  
    setFormVisible(false);
  };
  

  return (
   
      <div>
        <div ref={mapContainerRef} style={{ width: '1250px', height: '550px' }} />
    
        {formVisible && selectedBuilding && (
        
      <BuildingInfoDialog
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        selectedBuilding={selectedBuilding}
        handleSubmit={handleSubmit}
        loading={loading}
        response={response}
        buildingName={buildingName}
        setBuildingName={setBuildingName}
        buildingAge={buildingAge}
        setBuildingAge={setBuildingAge}
        usePurpose={usePurpose}
        setUsePurpose={setUsePurpose}
        approvalDate={approvalDate}
        setApprovalDate={setApprovalDate}
        permitStatus={permitStatus}
        setPermitStatus={setPermitStatus}
        floorCount={floorCount}
        setFloorCount={setFloorCount}
        buildingHeight={buildingHeight}
        setBuildingHeight={setBuildingHeight}
        structuralSystem={structuralSystem}
        setStructuralSystem={setStructuralSystem}
        totalArea={totalArea}
        setTotalArea={setTotalArea}
        concreteClass={concreteClass}
        setConcreteClass={setConcreteClass}
        steelQuality={steelQuality}
        setSteelQuality={setSteelQuality}
        earthquakeZone={earthquakeZone}
        setEarthquakeZone={setEarthquakeZone}
        soilClass={soilClass}
        setSoilClass={setSoilClass}
        waterLevel={waterLevel}
        setWaterLevel={setWaterLevel}
        isSymmetric={isSymmetric}
        setIsSymmetric={setIsSymmetric}
        torsionRisk={torsionRisk}
        setTorsionRisk={setTorsionRisk}
        rigidity={rigidity}
        setRigidity={setRigidity}
        damageStatus={damageStatus}
        setDamageStatus={setDamageStatus}
        strengthening={strengthening}
        setStrengthening={setStrengthening}
        earthquakeEvaluation={earthquakeEvaluation}
        setEarthquakeEvaluation={setEarthquakeEvaluation}
      />
        )}
       <LlmFeadBackDialog
        open={feedbackDialogVisible}
        onClose={() => setFeedbackDialogVisible(false)}
        response={response}
        requestData={reqData as RequestDataProps}
        onSubmitFeedback={(feedback) => console.log('Geri bildirim gönderildi:', feedback)}
      /> 


      </div>
  );
}
   


export default MapboxMap;
