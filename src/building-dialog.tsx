import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, CircularProgress, Typography } from '@mui/material';

interface BuildingInfoDialogProps {
  formVisible: boolean;
  setFormVisible: (visible: boolean) => void;
  selectedBuilding: {
    id: number | string;
    coordinates: [number, number];
    address: string;
  } | null;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  response: any;
  buildingAge: string;
  setBuildingAge: (age: string) => void;
  concreteType: string;
  setConcreteType: (type: string) => void;
}

const BuildingInfoDialog: React.FC<BuildingInfoDialogProps> = ({
  formVisible,
  setFormVisible,
  selectedBuilding,
  handleSubmit,
  loading,
  response,
  buildingAge,
  setBuildingAge,
  concreteType,
  setConcreteType,
}) => {
    const buttonStyle = { backgroundColor: '#263959', color: '#ffffff', '&:hover': { backgroundColor: '#1d2d46' } }
  return (
    <Dialog
      open={formVisible}
      onClose={() => setFormVisible(false)}
      aria-labelledby="building-info-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="building-info-dialog">
      <Typography variant='h5'>
      <b>Bina Bilgileri</b>  
        </Typography>  
        </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <TextField
              label="Adres"
              id="address"
              value={selectedBuilding?.address || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <TextField
              label="Koordinatlar"
              id="coordinates"
              value={
                selectedBuilding
                  ? `Enlem: ${selectedBuilding.coordinates[1]}, Boylam: ${selectedBuilding.coordinates[0]}`
                  : ''
              }
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <TextField
              label="Bina Yaşı"
              id="buildingAge"
              type="number"
              value={buildingAge}
              onChange={(e) => setBuildingAge(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <TextField
              label="Beton Yapısı"
              id="concreteType"
              value={concreteType}
              onChange={(e) => setConcreteType(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={buttonStyle}
          >
            {loading ? <CircularProgress size={24} /> : 'Gönder'}
          </Button>
        </form>
        {response && (
          <div style={{ marginTop: '20px' }}>
            <h4>Yanıt:</h4>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInfoDialog;
