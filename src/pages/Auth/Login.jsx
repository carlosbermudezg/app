import axios from "axios"
import { useState } from "react"

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import { Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import SnackBar from "../../components/subcomponets/Snackbar";
import CustomButton from "../../components/subcomponets/CustomButton";
import Loading from "../../components/subcomponets/Loading";

import { useNavigate } from "react-router-dom";

const Login = ()=>{

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState("error")
    const [message, setMessage] = useState("error")

    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const [incorrectUser, setIncorrectUser] = useState(false)
    const [incorrectPass, setIncorrectPass] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async()=>{
        setLoading(true)
        const data = {
            user, 
            password
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data)
            .then( (response)=> {
                setIncorrectUser(false)
                setIncorrectPass(false)
                setTimeout(()=>{
                    localStorage.setItem("token", JSON.stringify(response.data))
                    navigate("/products")
                },1000)
            } )
            .catch( (error)=> {
                setIncorrectUser(false)
                setIncorrectPass(false)
                if(error.response.data.error == 'invalid credentials user'){
                    setTimeout(()=>{
                        setMessage("Correo incorrecto")
                        setSeverity("error")
                        setOpen(true)
                        setIncorrectUser(true)
                    },1000)
                }
                if(error.response.data.error == 'invalid credentials pass'){
                    setTimeout(()=>{
                        setMessage("Contraseña incorrecta")
                        setSeverity("error")
                        setOpen(true)
                        setIncorrectPass(true)
                    },1000)
                }
            })
        setTimeout(()=>{
            setLoading(false)
        },1000)
    }

    return(
        <Box>
            <Grid container spacing={0.5} minHeight={160}>
                <Grid size={12}>
                    <Stack spacing={2}>
                        <div className="container-logo-lopez">
                            <img className="logo-lopez" src="/farmacias-lopez.jpg" />
                        </div>
                        <div className="container-logo-moderna">
                            <img className="logo-moderna" src="/farmacias-modernas.jpeg" />
                        </div>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={0.5} minHeight={160}>
                <Grid size={{xs: 0, sm:3, md:4, lg:4.5}}></Grid>
                <Grid size={{xs: 12, sm:6, md:4, lg:3}}>
                    <Stack className="group-inputs" spacing={2}>
                        <Typography variant="body2" className="text-center" component="h2">
                            Ingresa tus datos para iniciar sesión.
                        </Typography>
                        <TextField error={incorrectUser} id="outlined-basic" label="Correo" onChange={(e)=> { setUser(e.target.value) }} variant="outlined" size="small" />
                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <TextField
                                error={incorrectPass}
                                onChange={(e)=> { setPassword(e.target.value) }}
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                size="small"
                            />
                            <InputAdornment className="showPassword" position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                            </InputAdornment>
                        </FormControl>
                        {
                            loading ? 
                                <Loading color="secondary" /> : 
                                <>
                                <CustomButton text="Iniciar Sesión" variant="contained" onClick={handleLogin}></CustomButton>
                                <CustomButton text="Registrarse" variant="outlined" onClick={()=> navigate('/register')}></CustomButton>
                                </>
                        }
                    </Stack>
                </Grid>
                <Grid size={{xs: 0, sm:3, md:4, lg:4.5}}></Grid>
            </Grid>
            <Grid container spacing={0.5} minHeight={160}>
                <Grid size={4}></Grid>
                <Grid size={4}>
                    <Stack spacing={2}>
                        <Typography variant="caption" className="text-center" component="h2">
                            Una app creada con el corazón.
                        </Typography>
                        <SnackBar open={open} severity={severity} message={message} setOpen={setOpen}></SnackBar>
                    </Stack>
                </Grid>
                <Grid size={4}></Grid>
            </Grid>
        </Box>
    )
}

export default Login