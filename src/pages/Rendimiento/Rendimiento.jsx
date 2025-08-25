import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Card, CardContent, Typography, Grid2 } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

dayjs.extend(isBetween);

const salesData = [
  { doctorId: 1, brand: "Pfizer", date: "2024-01-15", product: "Aspirina" },
  { doctorId: 2, brand: "Bayer", date: "2024-01-16", product: "Ibuprofeno" },
  { doctorId: 1, brand: "Pfizer", date: "2025-01-05", product: "Paracetamol" },
  { doctorId: 2, brand: "Bayer", date: "2025-01-10", product: "Amoxicilina" },
  { doctorId: 1, brand: "Novartis", date: "2025-01-15", product: "Losartán" },
  { doctorId: 2, brand: "Pfizer", date: "2025-01-20", product: "Omeprazol" },
];

export default function Rendimiento() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filteredSales, setFilteredSales] = useState([]);
  const [brands, setBrands] = useState([])
  const [doctors, setDoctors] = useState([])
  const [page, setPage] = useState(1)
  const token = JSON.parse(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : {}

  useEffect(()=>{
    // console.log(selectedDoctor)
    axios.get(`${import.meta.env.VITE_API_URL}/recetas/getByUser/${selectedDoctor?.idusers}/?page=${page}&limit=10&month=01&year=2025`,{
        headers: {
          Authorization: `Bearer ${user.token}`
        }
    })
        .then((response)=>{
            console.log(response.data)
            // setDoctors(response.data)
        })
        .catch(error => console.log(error))
  },[selectedDoctor])

  useEffect(()=>{
    //MARCAS
    if(user.user.type === 10){
        axios.get(`${import.meta.env.VITE_APISHEYLA_URL}/products/brands`)
            .then((response)=>{
                setBrands(response.data.data)
            })
            .catch(error => console.log(error))
    }else{
        const myBrands = JSON.parse(user.user.brands)
        setBrands(myBrands)
    }
  },[])

  useEffect(()=>{
    //MÉDICOS
    if(user.user.type === 10){
        axios.get(`${import.meta.env.VITE_API_URL}/users/doctors`,{
            headers: {
              Authorization: `Bearer ${user.token}`
            }
        })
            .then((response)=>{
                console.log(response.data)
                setDoctors(response.data)
            })
            .catch(error => console.log(error))
    }else{
        const myZones = JSON.parse(user.user.zones)
        axios.get(`${import.meta.env.VITE_API_URL}/users/doctors`,{
            headers: {
              Authorization: `Bearer ${user.token}`
            }
        })
            .then((response)=>{
                const doctorsByZones = response.data
                console.log(doctorsByZones)
                const filteredDoctors = doctorsByZones.filter( doctor => {
                    const doctorZones = JSON.parse(doctor.zones)
                    if(typeof doctorZones == "object"){
                        const validate = myZones.some( zone => doctorZones?.includes(zone) )
                        if (validate) {
                            return true
                        }else{
                            return false
                        }
                    }
                })
                console.log(filteredDoctors)
                setDoctors(filteredDoctors)
            })
            .catch(error => console.log(error))
    }
  },[])

  useEffect(() => {
    if (selectedDoctor && selectedBrand && startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      const filtered = salesData.filter(sale =>
        sale.doctorId === selectedDoctor.id &&
        sale.brand === selectedBrand &&
        dayjs(sale.date).isBetween(start, end, null, "[]")
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales([]);
    }
  }, [selectedDoctor, selectedBrand, startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <section className="rendimiento-container">
            <div className="rendimiento-wrap">
                <section className="date-selector">
                    <DatePicker
                        label="Fecha inicio"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                        label="Fecha fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </section>
                <section className="filters">
                    <Autocomplete
                        options={brands || []} // Asegura que siempre haya un array
                        getOptionLabel={(option) => option?.marca_NOMBRE || ""}
                        value={selectedBrand}
                        onChange={(event, value) => setSelectedBrand(value)}
                        renderInput={(params) => <TextField {...params} label="Marca" fullWidth />}
                    />
                    <Autocomplete
                        options={doctors}
                        getOptionLabel={(option) => option?.name}
                        value={selectedDoctor}
                        onChange={(event, value) => setSelectedDoctor(value)}
                        renderInput={(params) => <TextField {...params} label="Médico" fullWidth />}
                    />
                </section>
                {selectedDoctor && (
                    <section className="doctor-details">
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Dr(a) {selectedDoctor.name}</Typography>
                                <Typography variant="body2">Residencia: {selectedDoctor.residencia}</Typography>
                                <Typography variant="body2">Telefono: {selectedDoctor.telefono}</Typography>
                            </CardContent>
                        </Card>
                    </section>
                )}
                <div className="products-list">
                <Typography variant="h6">Productos Recetados</Typography>
                {filteredSales.length > 0 ? (
                    filteredSales.map((sale, index) => (
                    <Typography key={index}>- {sale.product}</Typography>
                    ))
                ) : (
                    <Typography>No hay productos en este rango.</Typography>
                )}
                </div>
            </div>
        </section>
    </LocalizationProvider>
  );
}