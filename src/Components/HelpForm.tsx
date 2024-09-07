import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
interface Erzak {
  name: string;
  category: string;
  urgency: string;
  amount: number;
  il: string;
  ilce: string;
  depo: string;
}

const initialData: Erzak[] = [
  {
    name: "Erzak 1",
    category: "Kategori 1",
    urgency: "min",
    amount: 10,
    il: "İl 1",
    ilce: "İlçe 1",
    depo: "Depo 1",
  },
  {
    name: "Erzak 2",
    category: "Kategori 2",
    urgency: "mid",
    amount: 20,
    il: "İl 2",
    ilce: "İlçe 2",
    depo: "Depo 2",
  },
  {
    name: "Erzak 3",
    category: "Kategori 3",
    urgency: "max",
    amount: 30,
    il: "İl 3",
    ilce: "İlçe 3",
    depo: "Depo 3",
  },
  // Daha fazla veri ekleyebilirsiniz
];
interface ErzakData {
  name: string;
  tc: string;
  product: string;
  quantity: string;
}

const ErzakForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tableData, setTableData] = useState<Erzak[]>(initialData);
  const [selectedIl, setSelectedIl] = useState<string>("");
  const [selectedIlce, setSelectedIlce] = useState<string>("");
  const [selectedDepo, setSelectedDepo] = useState<string>("");

  // Arama işlevi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = tableData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        width: "1230px",
      }}
    >
      <h2>Erzaklar</h2>
      <Grid
        display={"flex"}
        direction={"row"}
        gap={2}
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Filtreler */}
        <Stack
          width={"45%"}
          minHeight={"134px"}
          border={1}
          borderColor={"#aeb0b5a3"}
          p={2}
          borderRadius={4}
          display={"flex"}
          direction="row"
          alignItems={"center"}
          spacing={2}
        >
          <Grid width={"100%"} display={"flex"} direction={"column"} gap={2}>
            <Grid display={"flex"} direction={"row"} gap={2}>
              <Select
                fullWidth
                value={selectedIl}
                onChange={(e) => setSelectedIl(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="">İl</MenuItem>
                <MenuItem value="İl 1">İl 1</MenuItem>
                <MenuItem value="İl 2">İl 2</MenuItem>
                <MenuItem value="İl 3">İl 3</MenuItem>
              </Select>
              <Select
                fullWidth
                value={selectedIlce}
                onChange={(e) => setSelectedIlce(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="">İlçe</MenuItem>
                <MenuItem value="İlçe 1">İlçe 1</MenuItem>
                <MenuItem value="İlçe 2">İlçe 2</MenuItem>
                <MenuItem value="İlçe 3">İlçe 3</MenuItem>
              </Select>
              <Select
                fullWidth
                value={selectedDepo}
                onChange={(e) => setSelectedDepo(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="">Depo</MenuItem>
                <MenuItem value="Depo 1">Depo 1</MenuItem>
                <MenuItem value="Depo 2">Depo 2</MenuItem>
                <MenuItem value="Depo 3">Depo 3</MenuItem>
              </Select>
            </Grid>
            {/* Arama Çubuğu */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Grid>
          </Grid>
        </Stack>
        {/* Yönlendirmeler */}
        <Stack
          width={"45%"}
          minHeight={"134px"}
          border={1}
          borderColor={"#aeb0b5a3"}
          p={2}
          borderRadius={4}
          display={"flex"}
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={2}
        >
          {/* İşlem Butonları */}
          <Grid
            sx={{
              width: "100%",
              height: "50px",
            }}
            item
          >
            <Button
              sx={{
                width: "100%",
                height: "50px",
              }}
              variant="outlined"
            >
              Erzak Teslim Et
            </Button>
          </Grid>
          <Grid
            sx={{
              width: "100%",
              height: "50px",
            }}
            item
          >
            <Button
              sx={{
                width: "100%",
                height: "50px",
              }}
              variant="contained"
            >
              Yeni Erzak Ekle +
            </Button>
          </Grid>
        </Stack>
      </Grid>

      {/* Tablo */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Erzak Adı</TableCell>
              <TableCell>Kategorisi</TableCell>
              <TableCell>Aciliyet Durumu</TableCell>
              <TableCell>Miktar</TableCell>
              <TableCell>İl</TableCell>
              <TableCell>İlçe</TableCell>
              <TableCell>Depo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.urgency}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.il}</TableCell>
                <TableCell>{row.ilce}</TableCell>
                <TableCell>{row.depo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default ErzakForm;
