import React, { useMemo, useRef, useState } from "react";
import MapboxExample from "./map-box";
import { Button, Grid, Select, SelectChangeEvent, Stack } from "@mui/material";
import PrimarySearchAppBar from "./Navbar";
import LeftBar from "./Components/leftBar";
import ErzakForm from "./Components/HelpForm";
import ZeminMap from "./zemin";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SimulationMap from "./simulasyon";

const App: React.FC = () => {
  const [zemin, setZemin] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [destination, setDestination] = useState<string>("6");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("Selected files:", files);
      // Dosyayı yükleme işlemi burada gerçekleştirilebilir
    }
  };
  const buttonStyle = {
    borderColor: "#263959",
    color: "#263959",
    height: "40px",
  };
  const handleChange = (event: SelectChangeEvent) => {
    setZemin(event.target.value === "zemin");
  };
  const tabControl = useMemo(() => {
    switch (tab) {
      case 0:
        return zemin ? <ZeminMap /> : <MapboxExample />;

      case 1:
        return <SimulationMap destination={destination} />;
      case 2:
        return <MapboxExample />;
      case 3:
        return <ErzakForm />;
      default:
        return <MapboxExample />;
    }
  }, [tab, zemin, destination]);
  console.log("destination", destination);

  const handleDestinationChange = (event: SelectChangeEvent) => {
    setDestination(event.target.value);
  };

  // JSON'u indirme fonksiyonu
 const downloadFeedbackAsJson = () => {
  const feedbacks = localStorage.getItem('feedbacks');
  const blob = new Blob([feedbacks || '[]'], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'feedbacks.json';
  link.click();
};
  return (
    <Grid>
      <Grid item xs={12}>
        <PrimarySearchAppBar />
      </Grid>
      <Stack height={"100vw"} direction="row" spacing={1} gap={2}>
        <LeftBar setTab={setTab} tab={tab} />
        <Grid item xs={8}>
          <Stack direction="column">
            <Stack direction={"row"} justifyContent={"flex-end"} py={2}>
              {tab === 0 && (
                <Grid item ml={2}>
                  <Select
                    native
                    value={zemin ? "zemin" : "bina"}
                    onChange={handleChange}
                    inputProps={{
                      name: "zemin",
                      id: "zemin",
                    }}
                    sx={{
                      height: "40px",
                      width: "100px",
                    }}
                  >
                    <option value="bina">Bina</option>
                    <option value="zemin">Zemin</option>
                  </Select>
                </Grid>
              )}
              <Grid item ml={2}>
                {tab === 0 ? (
                  <>
                  <Button
                    startIcon={<FileUploadIcon />}
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={handleClick}
                  >
                    Dosya Yükle
                  </Button>
                  <Button onClick={downloadFeedbackAsJson} sx={buttonStyle} >
        Geri Bildirimleri İndir (JSON)
      </Button>
                  </>
                ) : tab === 1 ? (
                  <Select
                    native
                    inputProps={{
                      name: "siddet",
                      id: "siddet",
                    }}
                    sx={{
                      height: "40px",
                      width: "100px",
                    }}
                    placeholder="Şiddet"
                    value={destination}
                    onChange={handleDestinationChange}
                  >
                    <option value="4">4 Mw</option>
                    <option value="5">5 Mw</option>
                    <option value="5.5">5.5 Mw</option>
                    <option value="6">6 Mw</option>
                    <option value="7">7 Mw</option>
                  </Select>
                ) : null}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Grid>
            </Stack>

            <Grid width={"100%"} item xs={12}>
              {tabControl}
            </Grid>
          </Stack>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default App;
