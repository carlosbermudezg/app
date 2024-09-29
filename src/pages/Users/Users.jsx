import axios from 'axios';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import PaginationComponent from '../../components/PaginationComponent';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import UserCard from '../../components/UserCard';

const Users = ()=>{

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [render, setRender] = useState(false)
    const [users, setUsers] = useState([])
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(()=>{
        const getUsers = async()=>{
            axios.get(`${import.meta.env.VITE_API_URL}/users?page=${page}&limit=20&search=${search}`, {
                headers: {
                  Authorization: `Bearer ${user.admin_token}`
                }
              })
            .then( res => {
                console.log(res.data)
                setUsers(res.data.data)
                setTotalPages(res.data.pagination.totalPages)
                setPage(res.data.pagination.page)
            } )
            .catch( error => console.log( error ) )
        }
        getUsers()
    },[render, page, search])

    const changeUserStatus = async(userId, status)=>{
        const state = status === 1 ? 0 : 1
        await axios.get(`${import.meta.env.VITE_API_URL}/users/changeStatus?id=${userId}&state=${state}`,{
            headers: {
              Authorization: `Bearer ${ user.admin_token }`
            }
          })
            // .then( response =>{
            //     console.log(response)
            // } )
            .catch( error => console.log( error ) )
        setRender(!render)
    }

    const handleSearch = ()=>{
        setSearch(inputValue)
    }

    return(
        <>
            <section className='searchUser'>
                <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar usuarios"
                        inputProps={{ 'aria-label': 'buscar usuarios' }}
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
                    users.map((user, index)=>{
                        return(
                            <UserCard key={index} user={user} changeUserStatus={changeUserStatus}></UserCard>
                        )
                    })
                }
            </section>
            <section className='pagination-container'>
                <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}></PaginationComponent>
            </section>
        </>
    )
}

export default Users