import axios from "axios"
import { useEffect, useState, useRef } from "react"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOn from '@mui/icons-material/LocationOn';
import { Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import PaginationComponent from '../../components/PaginationComponent';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ProductsCard from "../../components/ProductsCard";
import categories from "../../utils/Categories";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import StarBorder from "@mui/icons-material/StarBorder";
import StarHalf from "@mui/icons-material/StarHalf";
import StarRate from "@mui/icons-material/StarRate";
import AllInclusive from "@mui/icons-material/AllInclusive";
import SelectZones from "../../components/SelectZones";
import { jwtDecode } from 'jwt-decode'
import { setIsDrawerOpen } from "../../store/slices/isDrawerOpen.slice";
import { useDispatch } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Products = ()=>{
    const dispatch = useDispatch()
    const [value, setValue] = useState(0);
    const [isZoneSelectorOpen, setIsZoneSelectorOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState([])
    const [products, setProducts] = useState([])
    const [zones, setZones] = useState([])
    const [selectedZone, setSelectedZone] = useState(null)
    const containerRef = useRef(null);
    const token = JSON.parse(localStorage.getItem("token"));
    const user = token ? jwtDecode(token) : {}
    const myzones = replace(user.user.zones)

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    function replace(texto) {
        texto = texto.replace(/\[/g, '(');
        texto = texto.replace(/\]/g, ')');
        return texto;
    }

    const getMyZones = async()=>{
        await axios.get(`${import.meta.env.VITE_API_URL}/zones/getMyZones?zones=${myzones}`, {
            headers: {
                Authorization: `Bearer ${token}`
              } 
            })
            .then( response => {
              setSelectedZone(response.data[0])
              setZones(response.data)
            } )
            .catch( error => console.log(error) )
    }

    const getProducts = async()=>{
        await axios.get(`${import.meta.env.VITE_APISHEYLA_URL}/products?page=${page}&limit=20&search=${search}&category=${category}&zone=${selectedZone.bodega}`, {
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
        handleClose()
    }

    // Obtener mis zonas designadas
    useEffect(()=>{
        const init = async()=>{
            await getMyZones()
        }
        init()
    },[])

    // Obtener Productos de la zona
    useEffect(() => {
        handleOpen()
        // ⏱ debounce con 500ms
        const handler = setTimeout(() => {
            getProducts()
        }, 200);
    
        // limpiamos el timeout si el usuario sigue escribiendo
        return () => clearTimeout(handler);
    }, [page, search, category, selectedZone]);


    const handleSearch = (value)=>{
        setSearch(value)
    }

    const handleCategory = (cat)=>{
        const filterCategory = categories.filter((element) => element.value === cat )
        setCategory(
            [
                filterCategory.map( element => element.id)
            ]
        )
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
                                Productos
                            </Typography>
                            <small>
                                {
                                    selectedZone?.name
                                }
                            </small>
                        </div>
                        <div className='icons-group'>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={()=>setIsZoneSelectorOpen(true)}
                                color="inherit"
                            >
                                <LocationOn />
                            </IconButton>
                        </div>
                        </Toolbar>
                    </AppBar>
                </div>
            </section>
            <Box>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                    setValue(newValue);
                    }}
                >
                    <BottomNavigationAction style={{backgroundColor:"#662D91", color:'#FFF'}} label="Todos" icon={<AllInclusive />} onClick={()=> handleCategory([])} />
                    <BottomNavigationAction style={{backgroundColor:"#f69a23", color:'#FFF'}} label="3%" icon={<StarBorder />} onClick={()=> handleCategory(3)} />
                    <BottomNavigationAction style={{backgroundColor:"#F57E25", color:'#FFF'}} label="5%" icon={<StarHalf />} onClick={()=> handleCategory(5)}  />
                    <BottomNavigationAction style={{backgroundColor:"#F26524", color:'#FFF'}} label="15%" icon={<StarRate />} onClick={()=> handleCategory(15)}  />
                </BottomNavigation>
            </Box>
            <section className='searchUser'>
                <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar productos"
                        inputProps={{ 'aria-label': 'buscar productos' }}
                        onChange={(e)=> handleSearch(e.target.value)}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </section>
            <section className='table-users' ref={containerRef}>
                {
                    products?.map((product, index)=>{
                        return(
                            <ProductsCard key={index} product={product} selectedZone={selectedZone}></ProductsCard>
                        )
                    } )
                }
                <div>
                    <Backdrop
                        container={containerRef.current}
                        sx={(theme) => ({ 
                            color: '#fff', 
                            zIndex: theme.zIndex.drawer + 1, 
                            position:'absolute',
                            display: "flex",
                            minHeight: '100px',
                            justifyContent: "center",
                            alignItems: "flex-start",
                            pt: 4,
                            borderRadius:1,
                            backgroundColor: "rgba(34, 34, 32, 0.27)",
                        })}
                        open={open}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            </section>
            <section className='pagination-container'>
                <PaginationComponent 
                    page={page} 
                    totalPages={totalPages} 
                    setPage={setPage}
                ></PaginationComponent>
            </section>
            <SelectZones
                zones={zones}
                isZoneSelectorOpen={isZoneSelectorOpen} 
                setIsZoneSelectorOpen={setIsZoneSelectorOpen}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
            ></SelectZones>
        </>
    )
}

export default Products