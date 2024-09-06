import React from "react";
import MapboxExample from "./map-box";
import { Button, Grid, Stack } from "@mui/material";
import PrimarySearchAppBar from "./Navbar";

const App: React.FC = () => {
 
const buttonStyle = { backgroundColor: '#263959', color: '#ffffff', '&:hover': { backgroundColor: '#1d2d46' } }
  return (
    <Grid>
      <Grid item xs={12}>
        <PrimarySearchAppBar />
      </Grid>
<Stack direction="row" spacing={1} gap={2}  >
      <Grid item xs={3}>
        <Stack direction="column" spacing={2} gap={2} ml={2} mt={9} >
          <Grid item ml={2}>
        <Button variant="contained" sx={buttonStyle} >
          Add Building
        </Button>
        </Grid>
        <Grid item ml={2}>
        <Button variant="contained" sx={buttonStyle}>
          Add Building
        </Button>
        </Grid>
        </Stack>
      </Grid>
    <Grid item xs={9} >
   <Stack direction="column"    >
    <Stack  direction={'row'} justifyContent={'flex-end'} py={2}>
    <Grid item ml={2}>
        <Button variant="contained" sx={buttonStyle} >
          Add Building
        </Button>
        </Grid>
        <Grid item ml={2}>
        <Button variant="contained" sx={buttonStyle}>
          Add Building
        </Button>
        
    </Grid>
    </Stack>
    <Grid item xs={12} >
      <MapboxExample/>
    </Grid>
    </Stack>
     
    
   
    </Grid>
    </Stack>

    </Grid>
  );
};

export default App;
