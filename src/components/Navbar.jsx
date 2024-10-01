import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { setIsDrawerOpen } from '../store/slices/isDrawerOpen.slice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import routesTitle from './../utils/routes'

export default function Navbar({type, to}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const title = routesTitle.find( (obj)=> obj.pathname == location.pathname )

    return (
        <section className='navbar'>
            <div className='navbar-container'>
                <AppBar position="static" color='secondary'>
                    <Toolbar variant="dense">
                        {
                            type == 'back' ? 
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> navigate(`${to}`)}>
                                <ArrowBack />
                            </IconButton> : 
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> dispatch(setIsDrawerOpen(true))}>
                                <MenuIcon />
                            </IconButton>
                        }
                    <Typography variant="h6" color="inherit" component="div">
                        {title.title}
                    </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        </section>
    );
}
