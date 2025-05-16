import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, Paper, Badge, IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';
import { socket } from '../services/socket';
// import { jwtDecode } from 'jwt-decode';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function ChatWindow() {
  const ADMIN_ID = 1;
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [usersHasMore, setUsersHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');

  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [messagesHasMore, setMessagesHasMore] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  
  const messageListRef = useRef(null);
  const usersListRef = useRef(null);
  
  const token = JSON.parse(localStorage.getItem("token"));
  // const user = token ? jwtDecode(token) : {};
  const [userCursor, setUserCursor] = useState(null);

  console.log(userCursor)

  // Detect the message type (text, image, or file)
  const getMessageType = (msg) => {
    if (msg.content && msg.content.startsWith('data:image')) {
      return 'image'; // Image
    } else if (msg.content && msg.content.startsWith('data:application')) {
      return 'file'; // File
    }
    return 'text'; // Text message
  };

  useEffect(() => {
    socket.emit('join', ADMIN_ID);

    socket.on('receive_message', (msg) => {
      if (msg.sender_id === selectedUser) {
        setMessages((prev) => [msg, ...prev]);
      } else {
        setNotifications((prev) => [...prev, msg.sender_id]);
      }
    });

    socket.on('new_notification', (n) => {
      if (n.from_user_id !== selectedUser) {
        setNotifications((prev) => [...prev, n.from_user_id]);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('new_notification');
    };
  }, [selectedUser]);

  const fetchUsers = async (reset = false) => {
    if (loadingMore || (!reset && !usersHasMore)) return;  // Evita cargar más si ya estamos cargando o no hay más usuarios
  
    setLoadingMore(true);
  
    const delay = new Promise(resolve => setTimeout(resolve, 1000)); // mínimo 1 segundo para la siguiente carga
    const fetch = api.get("/users/cursor", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        cursorDate: reset ? null : userCursor?.date,
        cursorId: reset ? null : userCursor?.id,
        search: search,  // Si hay búsqueda, la aplicamos
        limit: 10,  // Límite de usuarios por solicitud
      },
    });
  
    const [res] = await Promise.all([fetch, delay]);
  
    // Filtra los usuarios según la búsqueda (si es necesario)
    const filteredUsers = res.data.data;
  
    if (filteredUsers.length > 0) {
      setUserCursor(res.data.pagination.nextCursor);
    } else {
      setUsersHasMore(false);  // Si no hay más usuarios, actualizamos el estado
    }
  
    // Merge de los usuarios obtenidos, evitando duplicados
    setUsers((prev) => {
      const merged = reset ? filteredUsers : [...filteredUsers, ...prev];
      return removeDuplicates(merged); // Función para eliminar duplicados si es necesario
    });
  
    setLoadingMore(false);
  };  

  const removeDuplicates = (arr) => {
    return arr.filter((value, index, self) => 
      index === self.findIndex((t) => (
        t.idusers === value.idusers
      ))
    );
  };
  
  // Función para manejar el scroll infinito
  const handleScrollUsers = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = usersListRef.current;
  
    // Verificamos si hemos llegado al final del scroll
    if (scrollTop + clientHeight >= scrollHeight - 100 && usersHasMore) {
      // Si hay más usuarios, llamamos a fetchUsers para cargar más
      fetchUsers();
    }
  }, [usersHasMore]);
  
  // Detecta cambios en la página y carga más usuarios si es necesario
  useEffect(() => {
    if(search){
      // Limpiamos los usuarios y el cursor al cambiar la búsqueda
      setUsers([]);  // Limpiar la lista de usuarios
      setUserCursor(null);  // Resetear el cursor
      setUsersHasMore(true);  // Restablecer el estado de "hay más usuarios"
    }
    if(userPage || search){
      // Si el número de página se actualiza, actualizamos la consulta
      fetchUsers();
    }
  }, [userPage, search]); // Aquí solo dependemos de la página

  const fetchMessages = async (reset = false) => {
    if (!selectedUser) return;
    const res = await api.get(`/chats/${ADMIN_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { cursor: reset ? null : cursor }
    });

    const filtered = res.data.filter(msg =>
      (msg.sender_id === selectedUser || msg.receiver_id === selectedUser)
    );
    if (reset) {
      setMessages(filtered);
    } else {
      setMessages(prev => [...prev, ...filtered]);
    }
    if (filtered.length > 0) {
      setCursor(filtered[filtered.length - 1].id);
    } else {
      setMessagesHasMore(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(true);
      setNotifications((prev) => prev.filter(id => id !== selectedUser));
      setMessagesHasMore(true);
    }
  }, [selectedUser]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      sender_id: ADMIN_ID,
      receiver_id: selectedUser,
      content: newMessage
    };
    socket.emit('send_message', msg);
    setMessages((prev) => [msg, ...prev]);
    setNewMessage('');
  };

  const handleScrollMessages = useCallback(() => {
    const scrollTop = messageListRef.current.scrollTop;
    if (scrollTop < 100 && messagesHasMore) {
      fetchMessages(false);
    }
  }, [messagesHasMore]);

  return (
    <Box sx={{ height: '92%', display: 'flex', overflow: 'hidden' }}>
      {/* Usuarios */}
      <Box
        sx={{ width: 300, borderRight: '1px solid #ccc', backgroundColor: '#f0f0f0', p: 2, overflowY: 'auto' }}
        ref={usersListRef}
        onScroll={handleScrollUsers}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Usuarios
        </Typography>

        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setUserPage(1);
            setUsers([]);
            setUsersHasMore(true);
          }}
          sx={{ mb: 2 }}
        />

        <List>
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => setSelectedUser(user.id)}
                sx={{
                  backgroundColor: selectedUser === user.id ? '#d0e8ff' : 'transparent',
                  borderRadius: 2,
                  mb: 1,
                  cursor:'pointer',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Badge
                    color="secondary"
                    variant={notifications.includes(user.id) ? 'dot' : 'standard'}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  {user.type === 1 ? 'Médico' : 'Visitador Médico'}
                </Typography>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#e5ddd5'}}>
        {selectedUser ? (
          <>
            {/* Mensajes */}
            <Paper
              sx={{
                height:'100%',
                overflowY: 'auto',
                backgroundColor: 'transparent',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column-reverse'
              }}
              ref={messageListRef}
              onScroll={handleScrollMessages}
              elevation={0}
            >
              <List sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                {messages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    sx={{
                      justifyContent: msg.sender_id === ADMIN_ID ? 'flex-end' : 'flex-start',
                      display: 'flex'
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: msg.sender_id === ADMIN_ID ? '#dcf8c6' : '#fff',
                        color: 'black',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: '70%',
                        wordBreak: 'break-word',
                        boxShadow: 1,
                      }}
                    >
                      {getMessageType(msg) === 'image' ? (
                        <img src={msg.content} alt="Message Attachment" style={{ maxWidth: '100%' }} />
                      ) : getMessageType(msg) === 'file' ? (
                        <a href={msg.content} target="_blank" rel="noopener noreferrer">
                          Descargar archivo
                        </a>
                      ) : (
                        msg.content
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Input mensaje */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2, backgroundColor: '#f0f0f0' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe un mensaje"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                sx={{
                  borderRadius: 8,
                  backgroundColor: 'white',
                  '& fieldset': { border: 'none' }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
              >
                <AttachFileIcon />
              </IconButton>
              {/* Aquí agregamos el botón de "Enviar" */}
              <Button
                variant="contained"
                onClick={handleSend}
                sx={{
                  minWidth: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: 'white',
                  '&:hover': { backgroundColor: '#20bd5a' },
                }}
              >
                <SendIcon sx={{ color: 'white' }} />
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Selecciona un usuario para comenzar a chatear
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}