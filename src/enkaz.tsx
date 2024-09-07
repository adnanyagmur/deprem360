import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Switch, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from '@mui/material';

// Görsel dosyasını import edin
import markerIcon from './assets/afadlogo.jpg'; // Bu yolu görselin bulunduğu dosyaya göre ayarlayın

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const EnkazMode = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [buildingName, setBuildingName] = useState('Topkapı');
  const [buildingAge, setBuildingAge] = useState('5');
  const [usePurpose, setUsePurpose] = useState('Konut');
  const [address] = useState('Topkapı, Pazar Tekkesi Sk. 2-1, 34093 Fatih/İstanbul');
  const [supportReached] = useState(false); // Destek ulaştı mı toggle (sabit olarak true)

  // Rastgele kişilerin bilgileri ve kurtarıldı durumu
  const generateRandomPeople = () => {
    return [
      { tc: '12345678901', name: 'Ali Veli', phone: '555-123-4567', rescued: false },
      { tc: '98765432109', name: 'Ayşe Yılmaz', phone: '555-987-6543', rescued: false },
      { tc: '34567890123', name: 'Mehmet Öz', phone: '555-345-6789', rescued: false },
      { tc: '67890123456', name: 'Fatma Kaya', phone: '555-678-9012', rescued: false },
      { tc: '23456789012', name: 'Ahmet Demir', phone: '555-234-5678', rescued: false },
    ];
  };

  const [people, setPeople] = useState(generateRandomPeople);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/koraydurmaz/cm0qcb5ng00g201pj6ok7ai18',
      center: [28.932760695077526, 41.01558226221407],
      zoom: 17,
      pitch: 45,
    });

    mapRef.current.on('load', () => {
      mapRef.current!.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        type: 'fill-extrusion',
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      });

      // İkon ekleme (görsel dosyası kullanımı)
      const img = document.createElement('img');
      img.src = markerIcon; // Yerel dosyayı kullan
      img.style.width = '30px'; // İkonun genişliği küçültüldü
      img.style.height = '20px'; // İkonun yüksekliği küçültüldü

      new mapboxgl.Marker({ element: img })
        .setLngLat([28.931890849484197, 41.016797837089584]) // Verilen koordinatlar
        .addTo(mapRef.current!);

      mapRef.current!.on('click', '3d-buildings', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          if (feature.id !== undefined) {
            setFormVisible(true);
          }
        }
      });
    });

    return () => mapRef.current?.remove();
  }, []);

  const handleRescuedChange = (index: number) => {
    const updatedPeople = people.map((person, i) =>
      i === index ? { ...person, rescued: !person.rescued } : person
    );
    setPeople(updatedPeople);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bina Adı:', buildingName);
    console.log('Bina Yaşı:', buildingAge);
    console.log('Kullanım Amacı:', usePurpose);
    console.log('Adres:', address);
    console.log('Destek ulaştı mı:', supportReached ? 'Evet' : 'Hayır');
    console.log('Yaşayan Kişiler:', people);
    setFormVisible(false); // Formu submit ettikten sonra kapat
  };

  const handleCreateRoute = () => {
    console.log("Yol Haritası Oluşturuldu");
    // Burada yol haritası oluşturma işlemi yapılabilir
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '1250px', height: '550px' }} />
      <Dialog open={formVisible} onClose={() => setFormVisible(false)}>
        <DialogTitle>Bina Bilgileri</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Kayıtlı Kişi Sayısı"
              value={buildingAge}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true, // Değiştirilemez
              }}
            />
            <TextField
              label="Kullanım Amacı"
              value={usePurpose}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true, // Değiştirilemez
              }}
            />
            <TextField
              label="Adres"
              value={address}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true, // Değiştirilemez
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={supportReached} // Değiştirilemez
                  disabled
                />
              }
              label="Destek ulaştı mı?"
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>TC</TableCell>
                  <TableCell>İsim Soyisim</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Kurtarıldı</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((person, index) => (
                  <TableRow key={index}>
                    <TableCell>{person.tc}</TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.phone}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={person.rescued}
                        onChange={() => handleRescuedChange(index)} // Kurtarıldı checkbox'ı düzenlenebilir
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Kapat
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={handleCreateRoute}>
              Yol Haritası Oluştur
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnkazMode;
