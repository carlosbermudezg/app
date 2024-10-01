import { useEffect, useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checklist from '@mui/icons-material/Checklist';
import Input from '../../components/subcomponets/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Check from '@mui/icons-material/Check';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ciudades from '../../utils/ciudades';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Badge from '@mui/material/Badge';
import { CircularProgress } from '@mui/material';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Register() {

  // Estados de Errores de datos ingresados por el usuario
  const [nombreError, setNombreError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [telefonoError, setTelefonoError] = useState(false)
  const [direccionError, setDireccionError] = useState(false)
  const [ciudadError, setCiudadError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [repeatPasswordError, setRepeatPasswordError] = useState(false)
  
  // Estados de Datos de registro ingresados por el usuario
  const [loading, setLoading] = useState(false)
  const [nombres, setNombres] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [userType, setUserType] = useState("1")
  const [zonesSelected, setZonesSelected] = useState([])
  const [brandSearch, setBrandSearch] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  
  // Estados de mapeo
  const [errors, setErrors] = useState([])
  const [zones, setZones] = useState([])
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteresBrands] = useState([])
  
  // Estados de activación
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [openErrors, setOpenErrors] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const navigate = useNavigate()

  useEffect(()=>{
    // Datos de las marcas que existen
    axios.get(`${import.meta.env.VITE_APISHEYLA_URL}/products/brands`)
        .then( response => {
            setBrands( response.data.data )
        })
        .catch( error => console.log( error ) )
    // Datos de las zonas que existen
    axios.get(`${import.meta.env.VITE_API_URL}/zones`)
    .then( response => {
        setZones( response.data )
    })
    .catch( error => console.log( error ) )
  },[])
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleNextDatos = async ()=> {
      setLoading(true);
      let tempErrors = []; // Variable temporal para acumular los errores.

      // valida los datos del nombre
      if (nombres === "") {
          tempErrors.push("Debe ingresar un nombre.");
          setNombreError(true);
      } else {
          setNombreError(false);
      }

      // valida los datos del email
      if (email === "") {
          tempErrors.push("Debe ingresar un email.");
          setEmailError(true);
      } else {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/getByUsername?username=${email}`);
              if (response.data.response) {
                  tempErrors.push("El email ya existe.");
                  setEmailError(true);
              } else {
                  setEmailError(false);
              }
          } catch (error) {
              tempErrors.push("Hay un problema con el email.");
              setEmailError(true);
          }
      }

      // valida los datos del teléfono
      if (telefono === "") {
          tempErrors.push("Debe ingresar un número de teléfono.");
          setTelefonoError(true);
      } else {
          setTelefonoError(false);
      }

      // valida los datos de la dirección
      if (direccion === "") {
          tempErrors.push("Debe ingresar una dirección.");
          setDireccionError(true);
      } else {
          setDireccionError(false);
      }

      // valida los datos de la ciudad
      if (ciudad === "") {
          tempErrors.push("Debe seleccionar una ciudad de residencia.");
          setCiudadError(true);
      } else {
          setCiudadError(false);
      }

      // Actualiza los errores acumulados
      setErrors(tempErrors);

      // Usa un timeout para simular el tiempo de carga (si es necesario)
      setTimeout(() => {
          if (tempErrors.length > 0) {
              setOpenErrors(true); // Mostrar los errores si los hay
          } else {
              setActiveStep((prevActiveStep) => prevActiveStep + 1); // Avanzar si no hay errores
          }
          setLoading(false); // Terminar el estado de carga
      }, 1000);
  };

  const handleCheck = (zone)=>{
    zonesSelected.includes(zone.idzonas) ? 
      setZonesSelected( zonesSelected.filter( (element)=> element != zone.idzonas ) ) :
      setZonesSelected( [...zonesSelected, zone.idzonas] )
  }

  const handleNextZones = async () => {
    let tempErrors = [];
    setLoading(true);
  
    if (zonesSelected.length > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      tempErrors.push("Debe seleccionar al menos una zona de trabajo");
    }
  
    setErrors(tempErrors);  // Actualizamos los errores antes del timeout
  
    setTimeout(() => {
      if (tempErrors.length > 0) {
        setOpenErrors(true); // Mostramos los errores si hay alguno
      }
      setLoading(false); // Desactivamos el loading después de revisar los errores
    }, 1000);
  };
  
  const searchBrands = (event)=>{
    const param = event.target.value.toLowerCase()
    setBrandSearch(param)
    if(param == ""){
      setFilteresBrands([])
    }else{
      const filter = brands.filter( element => element.marca_NOMBRE.toLowerCase().includes(param) )
      setFilteresBrands(filter)
    }
  }

  const selectBrand = (brand)=>{
    selectedBrands.includes(brand) ? 
      setSelectedBrands( selectedBrands.filter( (element)=> element != brand ) ) : 
      setSelectedBrands( [...selectedBrands, brand] )
  }

  const handleNextBrands = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinishPassword = async()=>{
    let tempErrors = [];
    setLoading(true)
    if(password.length > 7 && password === repeatPassword){
      setPasswordError(false)
      setRepeatPasswordError(false)
      // Continuar con el registro
      const data = {
        "name": nombres,
        "username": email,
        "password": password,
        "telefono": telefono,
        "direccion": direccion,
        "ciudad" : ciudad,
        "type": userType,
        "brands": JSON.stringify(selectedBrands),
        "zones": JSON.stringify(zonesSelected)
      }
      const reg = await register(data)
      if(!reg){
        tempErrors = []
        tempErrors.push("Ha ocurrido un error al procesar el registro")
        setErrors(tempErrors)
        setOpenErrors(true)
        setLoading(false)
      }else{
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }else{
      if(password.length < 8){
        setPasswordError(true)
        tempErrors.push("La contraseña debe tener al menos 8 dígitos.")
      }
      if(password != repeatPassword){
        setRepeatPasswordError(true)
        tempErrors.push("Las contraseñas no coinciden.")
      }
      setErrors(tempErrors)
      if (tempErrors.length > 0) {
        setOpenErrors(true); // Mostramos los errores si hay alguno
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const register = async(data)=>{
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, data);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <>
        <Navbar type="back" to="/"></Navbar>
        <section className='register'>
          <div className='register-container'>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="1">
                  <StepLabel>
                      Datos Personales
                  </StepLabel>
                  <StepContent>
                  <Typography>Ingresa tu datos personales.</Typography>
                  <div className='formData'>
                      <Input size="small" error={nombreError} label="Nombres completos" value={nombres} onChange={(e)=> setNombres(e.target.value) }></Input>
                      <Input size="small" error={emailError} label="Correo Eléctronico" value={email} onChange={(e)=> setEmail(e.target.value) }></Input>
                      <Input size="small" error={telefonoError} label="Telefono" value={telefono} onChange={(e)=> setTelefono(e.target.value)} ></Input>
                      <Input size="small" error={direccionError} label="Dirección" value={direccion} onChange={(e)=> setDireccion(e.target.value)} ></Input>
                      <div>
                      <FormControl sx={{ m: 0, width: "100%" }} size="small">
                        <InputLabel id="demo-select-small-label">Ciudad</InputLabel>
                        <Select
                          error={ciudadError}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={ciudad}
                          label="Ciudad"
                          onChange={(e)=> {
                            setCiudad(e.target.value)
                          }}
                        >
                          <MenuItem value="">
                            <em>Ninguna</em>
                          </MenuItem>
                          {
                            ciudades.map((ciudad, index)=>{
                              return(
                                <MenuItem key={index} value={ciudad.ciudad}>{ciudad.ciudad}</MenuItem>
                              )
                            })
                          }
                        </Select>
                      </FormControl>
                      </div>
                      <FormLabel id="demo-radio-buttons-group-label">Tipo de usuario:</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          value={userType}
                          name="radio-buttons-group"
                          onChange={(e)=> setUserType(e.target.defaultValue)}
                        >
                          <FormControlLabel value="1" control={<Radio />} label="Médico" />
                          <FormControlLabel value="2" control={<Radio />} label="Visitador Médico" />
                        </RadioGroup>
                  </div>
                  <Box sx={{ mb: 2 }}>
                      <Button
                      size='30px'
                      variant="contained"
                      onClick={handleNextDatos}
                      sx={{ mt: 1, mr: 1 }}
                      >
                        {
                          loading ? 
                            <div className='button-loading'>
                              <CircularProgress color='#FFF' size="20px" />
                            </div>
                            : <span className='button-text'>Continuar</span>
                        }
                      </Button>
                  </Box>
                  </StepContent>
              </Step>
              <Step key="2">
                  <StepLabel>
                    Zonas de trabajo
                  </StepLabel>
                  <StepContent>
                  <Typography>Agrega las zonas en donde realizas tu trabajo.</Typography>
                  <div className='formData'>
                    <FormGroup>
                      {
                        zones.map((zone, index)=>{
                          const verify = zonesSelected.includes(zone.idzonas)
                          return(
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox checked={verify} onChange={()=> handleCheck(zone)} name={zone.name} />
                              }
                              label={zone.name}
                            />
                          )
                        })
                      }
                    </FormGroup>
                  </div>
                  <Box sx={{ mb: 2 }}>
                      <Button
                        size='30px'
                        variant="contained"
                        onClick={handleNextZones}
                        sx={{ mt: 1, mr: 1 }}
                        >
                          {
                            loading ? 
                              <div className='button-loading'>
                                <CircularProgress color='#FFF' size="20px" />
                              </div>
                              : <span className='button-text'>Continuar</span>
                          }
                      </Button>
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Volver
                      </Button>
                  </Box>
                  </StepContent>
              </Step>
              {
                userType == "2" && 
                <Step key="3">
                    <StepLabel>
                      Marcas de trabajo
                    </StepLabel>
                    <StepContent>
                    <Typography>Busca y agrega las marcas de los productos con los que trabajas.</Typography>
                    <div className='formData'>
                      <Badge badgeContent={selectedBrands.length} color="error">
                        <Button
                            startIcon={<Checklist />}
                            size='small'
                            variant="contained"
                            onClick={handleClickOpen}
                            fullWidth={true}
                          >
                            Marcas seleccionadas
                        </Button>
                      </Badge>
                      <Input label="Buscar Marcas" size="small" value={brandSearch} onChange={searchBrands}></Input>
                      <div className='brands-container'>
                        {
                          filteredBrands.map( (brand, index)=>{
                            const validate = selectedBrands.some(selected => selected.marca_ID === brand.marca_ID)
                            return(
                              <Chip
                                key={index}
                                label={brand.marca_NOMBRE}
                                onClick={()=> selectBrand(brand)}
                                icon={ !validate ? <Check color='#FFF' /> : <Clear color='#FFF' />}
                                size='medium'
                                style={{ color:"#FFF", justifyContent: 'flex-start', backgroundColor: validate ? '#E74C3C' : '#BB8FCE'}}
                              />
                            )
                          } )
                        }
                      </div>
                    </div>
                    <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleNextBrands}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continuar
                        </Button>
                        <Button
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Volver
                        </Button>
                    </Box>
                    </StepContent>
                </Step>
              }
              <Step key="4">
                  <StepLabel>
                    Contraseña
                  </StepLabel>
                  <StepContent>
                  <Typography>Ingresa unna contraseña segura de al menos 8 dígitos.</Typography>
                  <div className='formData'>
                      <Input value={password} label="Contraseña" error={passwordError} type="password" size="small" onChange={(e)=> setPassword(e.target.value)}></Input>
                      <Input value={repeatPassword} label="Repetir contraseña" error={repeatPasswordError} type="password" size="small" onChange={(e)=> setRepeatPassword(e.target.value)}></Input>
                  </div>
                  <Box sx={{ mb: 2 }}>
                      <Button
                        size='30px'
                        variant="contained"
                        onClick={handleFinishPassword}
                        sx={{ mt: 1, mr: 1 }}
                        >
                          {
                            loading ? 
                              <div className='button-loading'>
                                <CircularProgress color='#FFF' size="20px" />
                              </div>
                              : <span className='button-text'>Finalizar</span>
                          }
                      </Button>
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Volver
                      </Button>
                  </Box>
                  </StepContent>
              </Step>
            </Stepper>
            {activeStep === 4 && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                {
                  loading ?
                  <div className='processing-data'>
                    <div className='button-loading'>
                      <CircularProgress color='#FFF' size="20px" />
                    </div>
                    <Typography>Procesando datos...</Typography>
                  </div> : 
                  <>
                    <Typography>Tu registro se ha completado con éxito. Ahora deberás ser autorizado por el administrador para acceder a tu cuenta.</Typography>
                    <Button onClick={()=>navigate("/")} sx={{ mt: 1, mr: 1 }}>
                        Iniciar sesión
                    </Button>
                  </>
                }
                </Paper>
            )}
          </div>
        </section>
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
        {/* Modal de Marcas seleccionadas */}
        <Fragment>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title">
              Marcas seleccionadas
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
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
                    selectedBrands.map((brand, index)=>{
                      const validate = selectedBrands.some(selected => selected.marca_ID === brand.marca_ID)
                      return(
                        <Chip
                          key={index}
                          label={brand.marca_NOMBRE}
                          onClick={()=> selectBrand(brand)}
                          icon={ !validate ? <Check color='#FFF' /> : <Clear color='#FFF' />}
                          size='medium'
                          style={{ color:"#FFF", justifyContent: 'flex-start', backgroundColor: validate ? '#E74C3C' : '#BB8FCE'}}
                        />
                      )
                    })
                  }
                </div>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cerrar
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </Fragment>
    </>
  );
}

