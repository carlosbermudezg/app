import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import ProductsCardReceta from '../../components/ProductsCardReceta';
import PaginationComponent from '../../components/PaginationComponent';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArticleIcon from '@mui/icons-material/Article';
import SaveIcon from '@mui/icons-material/Save';

import { Typography } from "@mui/material";
import { useState, useEffect, Fragment } from 'react';

function sleep(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
}

const AddReceta = ()=>{

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState({})
    const [numReceta, setNumReceta] = useState("")
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

    const [openInfo, setOpenInfo] = useState(false);

    const handleClickOpenInfo = () => {
        setOpenInfo(true);
    };

    const handleCloseInfo = () => {
        setOpenInfo(false);
    };

    const [imageSrc, setImageSrc] = useState(null);

    const handleCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

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

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_APISHEYLA_URL}/products/getProductsReceta?page=${page}&limit=10&search=${search}`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })
          .then( response => {
            setProducts( response.data.data )
            setPage( response.data.pagination.page )
            setTotalPages( response.data.pagination.totalPages )
          } )
          .catch( error => console.log( error ) )
    },[page, search])

    return(
        <div className="recetas-main">
            <div className="recetas">
                <div className="divider">
                    <Typography color="textDisabled">Agregar nueva receta</Typography>
                </div>
                <div className="recetas-head">
                    {/* <div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            onChange={handleCapture} 
                        />
                            {imageSrc && (
                                <div>
                                <h3>Preview:</h3>
                                <img src={imageSrc} alt="captured" style={{ width: "300px" }} />
                                </div>
                            )}
                    </div> */}
                    <ButtonGroup size="small" aria-label="Small button group">
                        <Button key="one" onChange={handleCapture}><CameraAltIcon fontSize='small' />Foto</Button>
                        <Button key="two" onClick={handleClickOpenInfo}><ArticleIcon fontSize='small' />Info</Button>
                        <Button key="three"><SaveIcon fontSize='small' />Guardar</Button>
                    </ButtonGroup>
                </div>
                <div className="addrecetas-container">
                    <Autocomplete
                        className='inputMedia'
                        size='small'
                        open={open}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        onChange={(e,value)=> setSelectedDoctor(value)}
                        options={options}
                        loading={loading}
                        renderInput={(params) => {
                            return(
                                <TextField
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
                        renderOption={(props, option) => {
                            return(
                            <li {...props} key={option.idusers}>
                                {option.name}
                            </li>
                            )
                        }}
                    />
                    <TextField className='inputMedia' size='small' placeholder='# de receta' onChange={(e)=> setNumReceta(e.target.value)}></TextField>
                    <TextField className='inputMedia' size='small' value={search} onChange={(e)=> setSearch(e.target.value)} placeholder='Buscar medicamento'></TextField>
                    <div className='addreceta-container'>
                        {
                            products.map((product, index)=>{
                                return(
                                    <ProductsCardReceta key={index} product={product}></ProductsCardReceta>
                                )
                            } )
                        }
                    </div>
                    <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}></PaginationComponent>
                </div>
            </div>
            <Fragment>
                <Dialog
                    open={openInfo}
                    onClose={handleCloseInfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Info de Receta
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Contenido
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleCloseInfo}>Cancelar</Button>
                    <Button onClick={handleCloseInfo} autoFocus>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        </div>
    )
}

export default AddReceta