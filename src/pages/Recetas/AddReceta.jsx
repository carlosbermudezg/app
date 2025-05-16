import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import ProductsCardReceta from '../../components/ProductsCardReceta';
import PaginationComponent from '../../components/PaginationComponent';
import moment from 'moment';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import categories from '../../utils/Categories';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import SnackBar from '../../components/subcomponets/Snackbar';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';

import { Typography } from "@mui/material";
import { useState, useEffect, Fragment, useRef } from 'react';

import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { jwtDecode } from 'jwt-decode';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 20,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
}));

function sleep(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
}

const AddReceta = ()=>{

    const [openS, setOpenS] = useState(false)
    const [severity, setSeverity] = useState("error")
    const [message, setMessage] = useState("error")

    const [open, setOpen] = useState(false);
    const [openErrors, setOpenErrors] = useState(false);
    const [errors, setErrors] = useState([])
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState({})
    const [numReceta, setNumReceta] = useState("")
    const [selectedProducts, setSelectedProducts] = useState([])
    const token = JSON.parse(localStorage.getItem("token"));
    const user = token ? jwtDecode(token) : {}

    const [openInfo, setOpenInfo] = useState(false);

    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null); // Crear referencia para el input

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
      '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
      },
      '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
      },
    }));

    const handleCapture = () => {
        fileInputRef.current.click(); // Simula el clic en el input
    };
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          // Validar tipo de archivo
          if (!file.type.startsWith("image/")) {
            setError("Solo se permiten imágenes.");
            return;
          }
    
          setError(""); // Limpiar errores si el archivo es válido
    
          // Usar FileReader para convertir la imagen a base64
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result); // Establecer la imagen como data URL
          };
          reader.readAsDataURL(file); // Convertir la imagen a base64
        }
        console.log(image)
      };

    const handleClickOpenInfo = () => {
        setOpenInfo(true);
    };

    const handleCloseInfo = () => {
        setOpenInfo(false);
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

    const handleSave = async()=>{
        // foto medico numero_receta medicamentos
        let tempErrors = []
        if(!image){
            tempErrors.push("Debe agregar una imagen")
        }
        if(JSON.stringify(selectedDoctor) == "{}"){
            tempErrors.push("Debe asignar un Doctor")
        }
        if(!numReceta){
            tempErrors.push("Debe asignar un numero a la receta")
        }
        if(JSON.stringify(selectedProducts) == "[]"){
            tempErrors.push("Debe agregar al menos un producto.")
        }
        setErrors(tempErrors)
        console.log(selectedDoctor)
        console.log(selectedProducts)
        if (tempErrors.length > 0) {
            setOpenErrors(true); // Mostramos los errores si hay alguno
        }else{
            console.log(user)
            const data = {
                iduser: selectedDoctor.idusers, //usuario al que le pertenece la receta, en este caso a un doctor
                idusercreate: user.user.idusers, //usuario que ingresa la receta al sistema
                numReceta: numReceta,
                fechaHora: moment().format("YYYY-MM-DD HH:mm:ss"),
                image: image,
                medicamentos: selectedProducts
            }
            await axios.post(`${import.meta.env.VITE_API_URL}/recetas`, data ,{
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            .then( res => {
                console.log(res.data)
                setMessage("Receta agregada con éxito")
                setSeverity("success")
                setOpenS(true)
                //vaciar formulario
                setImage(null)
                setSelectedDoctor({})
                setSelectedProducts([])
                setNumReceta("")
                setOptions([])
            } )
            .catch( error => console.log( error ) )
        }
    }

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
              Authorization: `Bearer ${token}`
            }
          })
          .then( response => {
            setProducts( response.data.data )
            setPage( response.data.pagination.page )
            setTotalPages( response.data.pagination.totalPages )
          } )
          .catch( error => console.log( error ) )
    },[page, search])

    const invoiceTotal = selectedProducts.reduce((sum, element) => {
        const category = categories.find( item => element.CATEGORIA === item.id )
        const ganancia = ((element.COSTO * category?.value) / 100).toFixed(2);
        return (element.cantidad * ganancia) + sum;
    }, 0);

    const handleDeleteItem = (product)=>{
        setSelectedProducts((prevItems) => {
            return prevItems.filter((item) => item.PRODUCTO != product);
        });   
    }

    return(
        <div className="recetas-main">
            <div className="recetas">
                <div className="divider">
                    <Typography color="textDisabled">Agregar nueva receta</Typography>
                </div>
                {image && (
                    <div className="imagen-receta">
                    <img src={image} alt="preview" width="40" />
                    <Typography variant="caption">{!image ? "No ha seleccionado una imagen.":"La imagen se subio correctamente." }</Typography>
                    </div>
                )}
                <div className="recetas-head">
                    <ButtonGroup size="small" aria-label="Small button group">
                        <Button key="one" type="file" onClick={handleCapture}><CameraAltIcon fontSize='small' />Foto</Button>
                        <input
                            type="file"
                            accept="image/*"
                            capture="camera"
                            ref={fileInputRef} // Asigna la referencia
                            onChange={handleImageChange}
                            style={{ display: "none" }} // Oculta el input
                        />
                        <Button key="two" onClick={handleClickOpenInfo}>
                            <StyledBadge badgeContent={selectedProducts.length} color="warning">
                                <ListAltIcon />
                            </StyledBadge>
                            Receta
                        </Button>
                        <Button onClick={handleSave} key="three"><SaveIcon fontSize='small' />Guardar</Button>
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
                        getOptionLabel={(option) => {
                            if(JSON.stringify(selectedDoctor)=="{}"){
                                return ""
                            }else{
                                return option.name
                            }
                        }}
                        onChange={(e,value)=> {
                            if(value == null){
                                setSelectedDoctor({})
                            }else{
                                setSelectedDoctor(value)
                            }
                        }}
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
                    <TextField className='inputMedia' size='small' value={numReceta} placeholder='# de receta' onChange={(e)=> setNumReceta(e.target.value)}></TextField>
                    <TextField className='inputMedia' size='small' value={search} onChange={(e)=> setSearch(e.target.value)} placeholder='Buscar medicamento'></TextField>
                    <div className='addreceta-container'>
                        {
                            products.map((product, index)=>{
                                return(
                                    <ProductsCardReceta key={index} product={product} setSelected={setSelectedProducts}></ProductsCardReceta>
                                )
                            } )
                        }
                    </div>
                    <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}></PaginationComponent>
                </div>
            </div>
            <SnackBar open={openS} severity={severity} message={message} setOpen={setOpenS}></SnackBar>
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
                        {
                            selectedProducts == "" ? <Typography>La receta esta vacía</Typography>:false
                        }
                    </DialogContentText>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                Detalle
                                </TableCell>
                                <TableCell align="right">Precio</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Acción</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell align="center">Descripcion</TableCell>
                                <TableCell align="right">%Ganancia</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                selectedProducts.map((element, index)=>{
                                    const category = categories.find( item => element.CATEGORIA === item.id )
                                    const ganancia = ((element.COSTO * category?.value) /100).toFixed(2)
                                    const total = (element.cantidad * ganancia).toFixed(2)
                                    return(
                                        <TableRow key={element.PRODUCTO}>
                                            <TableCell align="center">
                                                <IconButton onClick={()=> handleDeleteItem(element.PRODUCTO)} aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">{element.cantidad}</TableCell>
                                            <TableCell><Typography  variant="caption">{element.PRODUCTO}</Typography></TableCell>
                                            <TableCell align="right">$ {ganancia}</TableCell>
                                            <TableCell align="right">$ {total}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell align="center" colSpan={4}>Total</TableCell>
                                <TableCell align="right">$ {invoiceTotal.toFixed(2)}</TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleCloseInfo}>Cancelar</Button>
                    <Button onClick={handleCloseInfo} autoFocus>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>

            {/* Modal detalle de errores */}
            <Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openErrors}
            >
                <DialogTitle id="customized-dialog-title">
                Errores
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={()=> setOpenErrors(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
                >
                <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                <Stack direction="row" spacing={2}>
                    <div className='brands-container'>
                    {
                        errors.map((error, index)=>{
                        return(
                            <Typography key={index}>
                            - {
                                error
                            }
                            </Typography>
                        )
                        })
                    }
                    </div>
                </Stack>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={()=> setOpenErrors(false)}>
                    Cerrar
                </Button>
                </DialogActions>
            </BootstrapDialog>
            </Fragment>
        </div>
    )
}

export default AddReceta