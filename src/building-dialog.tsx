 
import React, { useRef } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import { selectOptions } from "./constant";

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
  buildingName: string;
  setBuildingName: (name: string) => void;
  buildingAge: string;
  setBuildingAge: (age: string) => void;
  usePurpose: string;
  setUsePurpose: (purpose: string) => void;
  approvalDate: string;
  setApprovalDate: (date: string) => void;
  permitStatus: string;
  setPermitStatus: (status: string) => void;
  floorCount: string;
  setFloorCount: (count: string) => void;
  buildingHeight: string;
  setBuildingHeight: (height: string) => void;
  structuralSystem: string;
  setStructuralSystem: (system: string) => void;
  totalArea: string;
  setTotalArea: (area: string) => void;
  concreteClass: string;
  setConcreteClass: (concrete: string) => void;
  steelQuality: string;
  setSteelQuality: (quality: string) => void;
  earthquakeZone: string;
  setEarthquakeZone: (zone: string) => void;
  soilClass: string;
  setSoilClass: (soil: string) => void;
  waterLevel: string;
  setWaterLevel: (level: string) => void;
  isSymmetric: string;
  setIsSymmetric: (symmetry: string) => void;
  torsionRisk: string;
  setTorsionRisk: (risk: string) => void;
  rigidity: string;
  setRigidity: (rigidity: string) => void;
  damageStatus: string;
  setDamageStatus: (status: string) => void;
  strengthening: string;
  setStrengthening: (strengthening: string) => void;
  earthquakeEvaluation: string;
  setEarthquakeEvaluation: (evaluation: string) => void;
}

const BuildingInfoDialog: React.FC<BuildingInfoDialogProps> = ({
  formVisible,
  setFormVisible,
  selectedBuilding,
  handleSubmit,
  loading,
  buildingName,
  setBuildingName,
  buildingAge,
  setBuildingAge,
  usePurpose,
  setUsePurpose,
  approvalDate,
  setApprovalDate,
  permitStatus,
  setPermitStatus,
  floorCount,
  setFloorCount,
  buildingHeight,
  setBuildingHeight,
  structuralSystem,
  setStructuralSystem,
  totalArea,
  setTotalArea,
  concreteClass,
  setConcreteClass,
  steelQuality,
  setSteelQuality,
  earthquakeZone,
  setEarthquakeZone,
  soilClass,
  setSoilClass,
  waterLevel,
  setWaterLevel,
  isSymmetric,
  setIsSymmetric,
  torsionRisk,
  setTorsionRisk,
  rigidity,
  setRigidity,
  damageStatus,
  setDamageStatus,
  strengthening,
  setStrengthening,
  earthquakeEvaluation,
  setEarthquakeEvaluation,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const buttonStyle = {
    backgroundColor: "#263959",
    color: "#ffffff",
    "&:hover": { backgroundColor: "#1d2d46" },
    width: "180px",
    height: "40px",
  };

  // Dummy data fill function
  const fillDummyData = () => {
    setBuildingName("Örnek Bina");
    setBuildingAge("1990");
    setUsePurpose("Konut");
    setApprovalDate("2000-05-12");
    setPermitStatus("Var");
    setFloorCount("10");
    setBuildingHeight("30");
    setStructuralSystem("Betonarme");
    setTotalArea("2000");
    setConcreteClass("C25");
    setSteelQuality("S420");
    setEarthquakeZone("1. Bölge");
    setSoilClass("Zemin Sınıfı I");
    setWaterLevel("10");
    setIsSymmetric("Evet");
    setTorsionRisk("Düşük");
    setRigidity("Yüksek");
    setDamageStatus("Az Hasarlı");
    setStrengthening("Evet");
    setEarthquakeEvaluation("Dayanıklı");
    setDownloadLoading(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("Selected files:", files);
      setFiles(files);
      setDownloadLoading(true);
      setTimeout(() => {
        fillDummyData();
      }, 4000);
    }
  };
  return (
    <Dialog
      open={formVisible}
      onClose={() => setFormVisible(false)}
      aria-labelledby="building-info-dialog"
      fullWidth
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="building-info-dialog">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">
              <b>Deprem Dayanıklılığı Değerlendirme Formu</b>
            </Typography>
            <Grid display={"flex"} direction={"row"} gap={2} item xs={4}>
              <Stack component="div" direction={"column"}>
                <Button
                  startIcon={<FileUploadIcon />}
                  variant="outlined"
                  sx={buttonStyle}
                  onClick={handleClick}
                  disabled={downloadLoading}
                >
                  {downloadLoading ? <CircularProgress size={24} /> : "Gönder"}

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" color="textSecondary">
                  {files?.item(0)?.name || "Dosya seçilmedi"}
                </Typography>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                fullWidth
                disabled={loading}
                sx={buttonStyle}
              >
                {loading ? <CircularProgress size={24} /> : "Gönder"}
              </Button>
            </Grid>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={1} marginBottom={1}>
            {/* Genel Bilgiler */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="h6">Genel Bilgiler</Typography>
              </Divider>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Bina Adı"
                size="small"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Adres"
                value={selectedBuilding?.address || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Yapım Yılı"
                type="number"
                size="small"
                value={buildingAge}
                onChange={(e) => setBuildingAge(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Kullanım Amacı"
                value={usePurpose}
                size="small"
                onChange={(e) => setUsePurpose(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Mimari Onay Tarihi"
                type="date"
                size="small"
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Ruhsat Durumu</InputLabel>
                <Select
                  value={permitStatus}
                  size="small"
                  onChange={(e) => setPermitStatus(e.target.value)}
                  label="Ruhsat Durumu"
                >
                  <MenuItem value="Var">Var</MenuItem>
                  <MenuItem value="Yok">Yok</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Yapısal Bilgiler */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="h6">Yapısal Bilgiler</Typography>
              </Divider>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Kat Sayısı"
                type="number"
                size="small"
                value={floorCount}
                onChange={(e) => setFloorCount(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Bina Yüksekliği (m)"
                type="number"
                size="small"
                value={buildingHeight}
                onChange={(e) => setBuildingHeight(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Yapısal Sistem"
                value={structuralSystem}
                onChange={(e) => setStructuralSystem(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Toplam İnşaat Alanı (m²)"
                type="number"
                size="small"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Beton Sınıfı */}
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Beton Sınıfı</InputLabel>
                <Select
                  value={concreteClass}
                  onChange={(e) => setConcreteClass(e.target.value)}
                  label="Beton Sınıfı"
                  size="small"
                >
                  {selectOptions.concreteClassOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Çelik Donatı Kalitesi */}
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Çelik Donatı Kalitesi</InputLabel>
                <Select
                  value={steelQuality}
                  onChange={(e) => setSteelQuality(e.target.value)}
                  label="Çelik Donatı Kalitesi"
                  size="small"
                >
                  {selectOptions.steelQualityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Depremle İlgili Veriler */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="h6">Depremle İlgili Veriler</Typography>
              </Divider>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Deprem Bölgesi</InputLabel>
                <Select
                  value={earthquakeZone}
                  onChange={(e) => setEarthquakeZone(e.target.value)}
                  label="Deprem Bölgesi"
                  size="small"
                >
                  {selectOptions.earthquakeZoneOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Zemin Sınıfı</InputLabel>
                <Select
                  value={soilClass}
                  onChange={(e) => setSoilClass(e.target.value)}
                  label="Zemin Sınıfı"
                  size="small"
                >
                  {selectOptions.soilClassOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Yeraltı Su Seviyesi (m)"
                type="number"
                size="small"
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Yapısal Güvenlik ve Dayanıklılık */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="h6">
                  Yapısal Güvenlik ve Dayanıklılık
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Bina Simetrik mi?</InputLabel>
                <Select
                  value={isSymmetric}
                  onChange={(e) => setIsSymmetric(e.target.value)}
                  label="Bina Simetrik mi?"
                  size="small"
                >
                  <MenuItem value="Evet">Evet</MenuItem>
                  <MenuItem value="Hayır">Hayır</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Burulma Riski</InputLabel>
                <Select
                  value={torsionRisk}
                  onChange={(e) => setTorsionRisk(e.target.value)}
                  label="Burulma Riski"
                  size="small"
                >
                  {selectOptions.torsionRiskOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Yanal Rijitlik</InputLabel>
                <Select
                  value={rigidity}
                  onChange={(e) => setRigidity(e.target.value)}
                  label="Yanal Rijitlik"
                  size="small"
                >
                  {selectOptions.rigidityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Mevcut Durum ve Güçlendirme */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Typography variant="h6">
                  Mevcut Durum ve Güçlendirme
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Yapısal Hasar"
                value={damageStatus}
                onChange={(e) => setDamageStatus(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Daha Önce Güçlendirme Yapıldı mı?</InputLabel>
                <Select
                  value={strengthening}
                  onChange={(e) => setStrengthening(e.target.value)}
                  label="Daha Önce Güçlendirme Yapıldı mı?"
                  size="small"
                >
                  <MenuItem value="Hayır">Hayır</MenuItem>
                  <MenuItem value="Evet">Evet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Depreme Dayanıklılık Durumu"
                value={earthquakeEvaluation}
                onChange={(e) => setEarthquakeEvaluation(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default BuildingInfoDialog;
