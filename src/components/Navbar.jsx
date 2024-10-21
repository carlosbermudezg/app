import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocationOn from '@mui/icons-material/LocationOn';
import Add from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { setIsDrawerOpen } from '../store/slices/isDrawerOpen.slice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import routesTitle from './../utils/routes'
import { setIsZoneSelectorOpen } from '../store/slices/isZoneSelectorOpen.slice';
import { useSelector } from 'react-redux';

export default function Navbar({to}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const title = routesTitle.find( (obj)=> obj.pathname == location.pathname )
    const selectedZone = useSelector( state => state.selectedZone )
    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <section className='navbar'>
            <div className='navbar-container'>
                <AppBar position="static" color='secondary'>
                    <Toolbar variant="dense">
                        {
                            title.icon == 'back' ? 
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> navigate(`${title.backNavigate}`)}>
                                <ArrowBack />
                            </IconButton> : 
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> dispatch(setIsDrawerOpen(true))}>
                                <MenuIcon />
                            </IconButton>
                        }
                    <div className='navbar-title'>
                        <Typography variant="h6" color="inherit" component="div">
                            {title.title}
                        </Typography>
                        {
                            title.title == "Productos" &&
                            <small>
                                {
                                    selectedZone.name
                                }
                            </small>
                        }
                    </div>
                    <div className='icons-group'>
                        {
                            title.title === "Productos" &&
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={()=>dispatch( setIsZoneSelectorOpen(true) )}
                                    color="inherit"
                                >
                                    <LocationOn />
                                </IconButton>
                            </>
                        }
                        {
                            title.title === "Recetas" && user.user.type == 10 &&
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
    );
}
  
