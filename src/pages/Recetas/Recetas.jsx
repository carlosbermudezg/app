import { useEffect, useState, Fragment } from "react"
import axios from "axios"
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import Folder from "@mui/icons-material/Folder";
import FolderOpen from "@mui/icons-material/FolderOpen";
import Rule from "@mui/icons-material/Rule";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Add from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ModalReceta from "../../components/ModalReceta";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { setIsDrawerOpen } from '../../store/slices/isDrawerOpen.slice';
import { useDispatch } from 'react-redux';

function sleep(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
}

const Recetas = ()=>{

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [render, setRender] = useState(false);
    const dispatch = useDispatch()

    const handleChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const [years, setYears] = useState([])
    const [openRecetaIndex, setOpenRecetaIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState("")
    const [recetas, setRecetas] =useState([])
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState({})
    const token = JSON.parse(localStorage.getItem("token"));
    const user = token ? jwtDecode(token) : {}
    
    const handleOpen = () => {
        setOpen(true);
        (async () => {
          setLoading(true);
          await sleep(1e3);
          setLoading(false);
    
          setOptions([...doctors]);
        })();
    };
    
    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    const handleOpenReceta = (index) => {
        setOpenRecetaIndex(index);
    };

    const handleCloseReceta = () => {
        setOpenRecetaIndex(null);
    };

    useEffect(()=>{
        const getMonths = async()=>{
            const usuario = user?.user?.type == 10 ? selectedDoctor.idusers : user?.user?.idusers
            await axios.get(`${import.meta.env.VITE_API_URL}/recetas/getByMonthUser?year=${selectedYear}&id=${usuario}`, { 
                headers: {
                    Authorization: `Bearer ${token}`
                  } 
                })
            .then( response => {
                setRecetas( response.data )
            })
            .catch( error => console.log( error ) )
        }
        getMonths()
    },[selectedYear, selectedDoctor, render])

    useEffect(()=>{
        const getYears = async()=>{
            await axios.get(`${import.meta.env.VITE_API_URL}/years`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  } 
                })
                .then( response => {
                    setYears(response.data)
                } )
                .catch( error => console.log( error ) )
        }
        getYears()
    },[])

    useEffect(()=>{
        const getDoctors = async()=>{
            await axios.get(`${import.meta.env.VITE_API_URL}/users/doctors`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  } 
                })
                .then( response => {
                    setDoctors(response.data)
                } )
                .catch( error => console.log( error ) )
        }
        getDoctors()
    },[])

    function replace(texto) {
        texto = texto.replace(/\[/g, '(');
        texto = texto.replace(/\]/g, ')');
        return texto;
    }

    const payment = async(ids)=>{
        const convert = JSON.stringify(ids)
        const identifiers = replace(convert)
        await axios.put(`${import.meta.env.VITE_API_URL}/recetas/updatePayment`, {"ids": identifiers }, { 
            headers: {
                Authorization: `Bearer ${token}`
                } 
            })
        .then( response => {
            console.log('Este lote se ha marcado como pagado')
        })
        .catch( error => console.log( error ) )
        setRender(!render)
    }

    return(
        <>
            <section className='navbar'>
                <div className='navbar-container'>
                    <AppBar position="static" color='secondary' sx={{height:'60px'}}>
                        <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> dispatch(setIsDrawerOpen(true))}>
                            <MenuIcon />
                        </IconButton>
                        <div className='navbar-title'>
                            <Typography variant="h6" color="inherit" component="div">
                                Recetas
                            </Typography>
                        </div>
                        <div className='icons-group'>
                            {
                                user?.user?.type == 10 &&
                                <>
                                    <IconButton
                                        size="large"
                                        aria-label="add receta"
                                        aria-controls="add-receta"
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={()=>{ navigate(`recetas/addreceta`) }}
                                    >
                                        <Add />
                                    </IconButton>
                                </>
                            }
                        </div>
                        </Toolbar>
                    </AppBar>
                </div>
            </section>
            <div className="recetas-main">
                <div className="recetas">
                    <div className="divider">
                        <Typography color="textDisabled">Todas las recetas</Typography>
                    </div>
                    <div className="recetas-head">
                        <Box sx={{ minWidth: 85 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Año</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedYear}
                                label="Año"
                                onChange={handleChange}
                                >
                                    {
                                        years.map((year, index)=>{
                                            return(
                                                <MenuItem key={index} value={year.year}>{year.year}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        {
                            user?.user?.type == 10 &&
                            <Autocomplete
                                sx={{ width: 300 }}
                                open={open}
                                onOpen={handleOpen}
                                onClose={handleClose}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                getOptionLabel={(option) => `${option.name}${option.idusers}`}
                                onChange={(e,value)=> setSelectedDoctor(value)}
                                options={options}
                                loading={loading}
                                renderInput={(params, index) => {
                                    return(
                                        <TextField
                                            key={index}
                                            {...params}
                                            label="Médico"
                                            slotProps={{
                                                input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                    </Fragment>
                                                ),
                                                },
                                            }}
                                        />
                                    )
                                }}
                            />
                        }
                    </div>
                    <SimpleTreeView className="recetas-container">
                            {
                                recetas.length < 1 &&
                                <div className="no-data">
                                    <Typography>No hay resultados disponibles.</Typography>
                                    <Rule fontSize="large" color="disabled"></Rule>
                                </div>
                            }
                            {
                                recetas.map( (receta, index)=>{
                                    const monthsText = [0, "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] 
                                    // Calcula el total para todas las recetas del mes antes de retornar el JSX
                                    const total = receta.recetas.reduce((totalAcc, element) => {
                                        const medicamentos = JSON.parse(element.medicamentos);
                                        const value = medicamentos.reduce((prev, curr) => {
                                            const earn = ((curr.cantidad * curr.COSTO * curr.porcentaje) / 100).toFixed(2);
                                            return prev + Number(earn);
                                        }, 0);

                                        return totalAcc + value;
                                    }, 0);
                                    const ids = receta.recetas.reduce((accumulator, element) => {
                                        accumulator.push(element.idReceta);
                                        return accumulator;
                                    }, []);
                                    const unpaid = receta.recetas.reduce((accumulator, element) => {
                                        if (element.pay === 0) {
                                            accumulator.push(element.pay);
                                        }
                                        return accumulator;
                                    }, []);
                                    
                                    return(
                                        <div key={index} className="receta-group">
                                            <div className="receta-actions">
                                                {
                                                    unpaid.length > 0 && user.user.type == 10 &&
                                                    <Button onClick={()=> payment(ids)}>Pagar</Button>
                                                }
                                                {
                                                    unpaid.length == 0 && user.user.type == 10 &&
                                                    <Button disabled>Pagado</Button>
                                                }
                                                <span className="total">${total}</span>
                                            </div>
                                            <TreeItem2 className="list-title" slots={{expandIcon: Folder, collapseIcon: FolderOpen}} key={index} itemId={`receta${index}`} label={monthsText[receta.month]}>
                                                <div className="card-recetas-container">
                                                    {
                                                        receta.recetas.map((element, recetaIndex)=>{
                                                            const medicamentos = JSON.parse(element.medicamentos)
                                                            const value = medicamentos.reduce((prev, curr)=>{
                                                                const earn = ((curr.cantidad * curr.COSTO * curr.porcentaje) / 100).toFixed(2)
                                                                return prev + Number(earn)
                                                            },0)

                                                            const status = element.pay == 1 ? "Pagada" : "No Pagada"
                                                            const fecha = moment(element.date, "YYYY-MM-DD HH:mm:ss.SSSSSS").format("YYYY-MM-DD");
                                                            return(
                                                                <div className="card-receta" key={recetaIndex}>
                                                                    <div className="card-receta-body">
                                                                        <div className="card-receta-price">
                                                                            <Typography className="price" fontSize={12}>${value}</Typography>
                                                                        </div>
                                                                        <div className="card-receta-info">
                                                                            <Typography fontSize={12}>
                                                                                <span className="card-receta-title"># Receta: </span>
                                                                                {
                                                                                    element.recetaNum
                                                                                }
                                                                            </Typography>
                                                                            <Typography fontSize={12}>
                                                                                <span className="card-receta-title">Fecha: </span>
                                                                                {
                                                                                    fecha
                                                                                }
                                                                            </Typography>
                                                                            <Typography fontSize={12}>
                                                                                <span className="card-receta-title">Estado: </span> 
                                                                                {
                                                                                    status
                                                                                }
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-receta-actions">
                                                                        <Button onClick={() => handleOpenReceta(element.idReceta) } size="small" variant="outlined" color="secondary"><Visibility fontSize="small" color="secondary"></Visibility></Button>
                                                                    </div>
                                                                    {openRecetaIndex === element.idReceta && (
                                                                        <ModalReceta
                                                                            receta={element} 
                                                                            open={openRecetaIndex === element.idReceta} 
                                                                            close={handleCloseReceta} 
                                                                        />
                                                                    )}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </TreeItem2>
                                        </div>
                                    )
                                } )
                            }
                    </SimpleTreeView>
                </div>
            </div>
        </>
    )
}

export default Recetas