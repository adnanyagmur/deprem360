/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const TalepEkle = () => {
  const [formData, setFormData] = useState({
    name: "",
    tc: "",
    date: "",
    address: "",
    foodCategory: "",
    foodName: "",
    urgency: "",
  });
  const buttonStyle = {
    backgroundColor: "#263959",
    color: "#ffffff",
    "&:hover": { backgroundColor: "#1d2d46" },
  //  width: "180px",
    height: "40px",
  };

  const [tableData, setTableData] = useState<
    {
      name: string;
      tc: string;
      date: string;
      address: string;
      foodCategory: string;
      foodName: string;
      urgency: string;
    }[]
  >([]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setTableData((prev) => [...prev, formData]);
    setFormData({
      name: "",
      tc: "",
      date: "",
      address: "",
      foodCategory: "",
      foodName: "",
      urgency: "",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Talep Oluştur</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              label="Ad Soyad"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="TC"
              name="tc"
              value={formData.tc}
              onChange={handleInputChange}
              variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Tarih"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="DD/MM/YYYY"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Adres"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              variant="outlined"
            />
          </FormControl>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel>Erzak Kategorisi</InputLabel>
            <Select
              name="foodCategory"
              value={formData.foodCategory}
              onChange={handleInputChange}
            >
              <MenuItem value="Bakliyat">Bakliyat</MenuItem>
              <MenuItem value="Temizlik">Temizlik</MenuItem>
              <MenuItem value="Kişisel Bakım">Kişisel Bakım</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Erzak Adı"
              name="foodName"
              value={formData.foodName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Acil Durum"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              variant="outlined"
            />
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            style={buttonStyle}
          >
            Talep Oluştur
          </Button>
        </div>
      </div>

      <Paper style={{ marginTop: "20px", padding: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>TC</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>Erzak Kategorisi</TableCell>
              <TableCell>Erzak Adı</TableCell>
              <TableCell>Acil Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.tc}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.foodCategory}</TableCell>
                <TableCell>{row.foodName}</TableCell>
                <TableCell>{row.urgency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default TalepEkle;
