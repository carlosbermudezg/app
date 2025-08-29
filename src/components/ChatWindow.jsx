import { useEffect, useState, useRef } from 'react';
import {
  Box, Avatar, Typography, TextField, ListItem, Badge, useMediaQuery, useTheme, List, Backdrop, CircularProgress, InputAdornment
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@mui/icons-material';

export default function ChatWindow({userId}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([])
  const containerRef = useRef(null);
  const navigate = useNavigate()
  
  const token = JSON.parse(localStorage.getItem("token"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const handleClose = () => {
      setOpen(false);
  };
  const handleOpen = () => {
      setOpen(true);
  };
  

  // Detect the message type (text, image, or file)
  const getMessageType = (msg) => {
    if (msg.content && msg.content.startsWith('data:image')) {
      return 'image'; // Image
    } else if (msg.content && msg.content.startsWith('data:application')) {
      return 'file'; // File
    }
    return 'text'; // Text message
  };

  const loadChat = (id)=>{
    setTimeout(()=>{ 
      navigate(`/chat/${id}`);
    },100)
    setSelectedUser(id)
  }

  const fetchUsers = async() => {
    userId === 1 ?
    await axios.get(`${import.meta.env.VITE_API_URL}/users?page=${page}&limit=20&search=${search}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{
      setUsers(response.data.data)
    }).catch(error => console.log(error))
    : 
    await axios.get(`${import.meta.env.VITE_API_URL}/users/one/1`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{
      console.log(response.data)
      setUsers(response.data)
    }).catch(error => console.log(error))
    handleClose()
  }

  // Obtener Usuarios disponibles
  useEffect(() => {
    handleOpen()
    // ⏱ debounce con 500ms
    const handler = setTimeout(() => {
        fetchUsers()
    }, 200);

    // limpiamos el timeout si el usuario sigue escribiendo
    return () => clearTimeout(handler);
}, [page, search]);

  return (
    <Box sx={{ height: '92%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{padding: 1}}>
          <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              color='secondary'
              slotProps={
                {
                  input: {
                    sx: {
                      paddingTop: 0.5,
                      paddingBottom: 0.5,
                      paddingLeft: 3,
                      paddingRight: 3,
                      borderRadius: 10,
                    },
                    startAdornment:  <InputAdornment position="start"><SearchOutlined></SearchOutlined></InputAdornment>
                  }
                }
              }
          />
        </Box>
        <Box
          sx={{ flex: 1, overflowY: 'auto' }}
        >
          <List ref={containerRef}>
            {users.map((user, index) => {
              let color = 'orange'
              let title = 'Visitador Médico'
              if(user.type === 10){
                color = '#2738F5'
                title = 'Administrador'
              }
              if(user.type === 1){
                color = 'indigo'
                title = 'Médico'
              }
              return(
              <ListItem
                key={index}
                onClick={() => loadChat(user.idusers)}
                sx={{
                  backgroundColor: selectedUser === user.idusers ? '#d0e8ff' : 'transparent',
                  borderRadius: 2,
                  padding:'5px 0 5px 0',
                  p: 1,
                  cursor: 'pointer',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar alt="Remy Sharp" sx={{bgcolor: color}}>{user.name[0].toUpperCase()}</Avatar>
                  <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    paddingLeft:1
                  }}>
                    <Badge
                      color="secondary"
                      variant={notifications.includes(user.idusers) ? 'dot' : 'standard'}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {title}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            )})}
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
          </List>
        </Box>
    </Box>
  );
}