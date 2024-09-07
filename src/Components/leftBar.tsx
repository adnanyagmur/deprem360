import { BuildRounded } from "@mui/icons-material";
import ComputerIcon from "@mui/icons-material/Computer";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LayersIcon from "@mui/icons-material/Layers";
import { Button, Grid, Stack } from "@mui/material";
import React from "react";

interface Props {
  setTab: (tab: number) => void;
  tab: number;
}

const LeftBar = (props: Props) => {
  const { setTab, tab } = props;
  const buttonStyle = {
    //color: "#ffffff",
    width: "100%",
    boxShadow: "none",
    borderRadius: "0px",
    height: "60px",
  };

  //button list
  const buttonList = [
    {
      id: 0,
      name: "Analiz Modu",
      icon: <BuildRounded />,
    },
    {
      id: 1,
      name: "Simülasyon Modu",
      icon: <ComputerIcon />,
    },
    {
      id: 2,
      name: "Enkaz Modu",
      icon: <MonitorHeartIcon />,
    },
    {
      id: 3,
      name: "Erzak Teslim",
      icon: <HelpCenterIcon />,
    },
  ];
  return (
    <Grid
      item
      xs={4}
      width={"210px"}
      //height={"100%"}
      bgcolor={"#e4e7ec"}
    >
      <Stack direction="column" mt={9}>
        {buttonList.map((button, index) => (
          <Grid key={index} item>
            <Button
              startIcon={button.icon}
              onClick={() => setTab(button.id)}
              variant="contained"
              sx={{
                display: "flex",
                justifyContent: "flex-start", // İkonları ve metni sola hizalar
                alignItems: "center", // Dikeyde hizalama
                textTransform: "none", // Büyük harf dönüşümünü engeller
                // Butonların aynı genişlikte olmasını sağlar
                padding: "8px 16px", // İkon ve metin arasındaki boşluğu ayarlar
                ...(tab === button.id
                  ? {
                      backgroundColor: "#aeb0b5a3",
                      color: "#263959",
                    }
                  : {
                      backgroundColor: "#e4e7ec",
                      color: "#263959",
                    }),
                ...buttonStyle,
              }}
            >
              {button.name}
            </Button>
          </Grid>
        ))}
      </Stack>
    </Grid>
  );
};

export default LeftBar;
