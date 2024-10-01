import axios from "axios"
import { useEffect, useState } from "react"
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

const Products = ()=>{

    const [value, setValue] = useState(0);

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [products, setProducts] = useState([])
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_APISHEYLA_URL}/products?page=${page}&limit=20&search=${search}&category=${category}`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })
          .then( response => {
            console.log(response.data)
            setProducts( response.data.data )
            setPage( response.data.pagination.page )
            setTotalPages( response.data.pagination.totalPages )
          } )
          .catch( error => console.log( error ) )
    },[page, search, category])

    const handleSearch = ()=>{
        setSearch(inputValue)
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
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar productos"
                        inputProps={{ 'aria-label': 'buscar productos' }}
                        onChange={(e)=> setInputValue(e.target.value)}
                        onKeyDown={ (e)=> e.code == "Enter" && handleSearch() }
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </section>
            <section className='table-users'>
                {
                    products.map((product, index)=>{
                        return(
                            <ProductsCard key={index} product={product}></ProductsCard>
                        )
                    } )
                }
            </section>
            <section className='pagination-container'>
                <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}></PaginationComponent>
            </section>
        </>
    )
}

export default Products