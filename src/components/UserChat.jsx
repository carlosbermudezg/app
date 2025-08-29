import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, List, ListItem, Paper, CircularProgress, IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import api from '../services/api';
import { socket } from '../services/socket';
import { jwtDecode } from 'jwt-decode';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function UserChat() {
  const ADMIN_ID = 1;
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate()

  const token = JSON.parse(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : {};

  const [availableHeight, setAvailableHeight] = useState(window.visualViewport.height);
  console.log(availableHeight)

  useEffect(() => {
    const handleResize = () => {
      // Usamos setTimeout para dar tiempo al navegador a reajustar el viewport
      setTimeout(() => {
        const currentHeight = window.visualViewport.height;
        setAvailableHeight(currentHeight);
      }, 100);
    };

    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socket.emit('join', userId);

    socket.on('receive_message', (msg) => {
      if (msg.sender_id === ADMIN_ID) {
        setMessages((prev) => sortMessages(removeDuplicates([...prev, msg])));
        scrollToBottom();
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  const fetchMessages = async (reset = false) => {
    if (loadingMore || (!reset && !hasMore)) return;

    setLoadingMore(true);

    const delay = new Promise(resolve => setTimeout(resolve, 1000)); // mínimo 1 segundo
    const fetch = api.get(`/chats/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { cursor: reset ? null : cursor },
    });

    const [res] = await Promise.all([fetch, delay]);

    console.log(res);

    const filtered = res.data.filter(
      (msg) => msg.sender_id === ADMIN_ID || msg.receiver_id === ADMIN_ID
    );

    if (filtered.length > 0) {
      setCursor(filtered[filtered.length - 1].id);
    } else {
      setHasMore(false);
    }

    setMessages((prev) => {
      const merged = reset ? filtered : [...filtered, ...prev];
      return sortMessages(removeDuplicates(merged));
    });

    setLoadingMore(false);
  };

  useEffect(() => {
    fetchMessages(true).then(() => {
      scrollToBottom();
    });
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender_id: userId,
      receiver_id: ADMIN_ID,
      content: newMessage,
      type: 'text',
      created_at: new Date().toISOString(),
    };

    socket.emit('send_message', msg);
    setMessages((prev) => sortMessages(removeDuplicates([...prev, msg])));
    setNewMessage('');
    scrollToBottom();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;

      const msg = {
        sender_id: userId,
        receiver_id: ADMIN_ID,
        content: base64,
        filename: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        created_at: new Date().toISOString(),
      };

      socket.emit('send_message', msg);
      setMessages((prev) => sortMessages(removeDuplicates([...prev, msg])));
      scrollToBottom();
    };
    reader.readAsDataURL(file);
  };

  const handleScroll = () => {
    if (listRef.current.scrollTop <= 50 && !loadingMore && cursor && hasMore) {
      fetchMessages(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const sortMessages = (msgs) => {
    return [...msgs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const removeDuplicates = (msgs) => {
    const seen = new Set();
    return msgs.filter(msg => {
      const id = msg.id || `${msg.sender_id}_${msg.receiver_id}_${msg.content}_${msg.created_at}`;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  };

  const getExtensionFromBase64 = (base64) => {
    if (!base64.startsWith('data:')) return '';
  
    const mimeMatch = base64.match(/^data:(.*?);base64,/);
    if (!mimeMatch) return '';
  
    const mimeType = mimeMatch[1];
  
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
      'application/zip': 'zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'audio/mpeg': 'mp3',
      'video/mp4': 'mp4',
    };
  
    return mimeToExt[mimeType] || '';
  };

  const renderMessageContent = (msg) => {
    const content = msg.content || '';
  
    if (content.startsWith('data:image/')) {
      // Es una imagen
      return (
        <img
          src={content}
          alt="Imagen"
          style={{ maxWidth: '200px', borderRadius: '8px' }}
        />
      );
    }
  
    if (content.startsWith('data:application/')) {

      const ext = getExtensionFromBase64(msg.content) || 'desconocido'
      console.log(msg)

      // Es un archivo descargable (PDF, Word, etc.)
      return (
        <a
          href={content}
          download={msg.filename || 'archivo'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          {`archivo.${ext}`}
        </a>
      );
    }
  
    // Por defecto: es texto
    return content;
  };  

  return (
    <div style={{height:`${availableHeight}px`, display:'flex', flexDirection:'column', position:'relative'}}>
      <section className='navbar'>
        <div className='navbar-container'>
            <AppBar position="static" color='secondary' sx={{p:0.7}}>
                <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=> navigate('/buzon')}>
                    <ArrowBack />
                </IconButton>
                <div className='navbar-title'>
                    <Typography variant="h6" color="inherit" component="div">
                        Chat {userId}
                    </Typography>
                </div>
                </Toolbar>
            </AppBar>
        </div>
      </section>
      <Box sx={{height:`${availableHeight - 30}px`, display:'flex', flex: 1, flexDirection:'column', backgroundColor: '#ece5dd', position:'relative'}}>
        <Paper
          sx={{
            flex: '1 1 auto',       // Ocupa el espacio restante
            overflowY: 'auto',      // Scroll vertical
            paddingTop: 5,
            paddingBottom: 10,
            backgroundColor: '#e5ddd5',
          }}
          ref={listRef}
          onScroll={handleScroll}
          elevation={0}
        >
          {loadingMore && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1 }}>
              <CircularProgress size={24} />
            </Box>
          )}
    
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1}}>
            {messages.map((msg, index) => (
              <ListItem
                key={msg.id || index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender_id === userId ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: msg.sender_id === userId ? '#dcf8c6' : '#ffffff',
                    color: '#000',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    boxShadow: 1,
                  }}
                >
                  {renderMessageContent(msg)}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                >
                  {msg.created_at ? formatDate(msg.created_at) : ''}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
    
        <Box
          sx={{
            width:'100%',
            p: 1,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid #ccc',
            position:'fixed',
            bottom:0
          }}
        >
          <IconButton onClick={() => fileInputRef.current.click()} sx={{ color: '#075E54' }}>
            <AttachFileIcon />
          </IconButton>
    
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe un mensaje"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              backgroundColor: 'white',
              borderRadius: '20px',
              '& fieldset': { border: 'none' },
              px: 2,
              py: 1,
            }}
            inputProps={{
              sx: { padding: '8px 14px' }
            }}
          />
    
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
    
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>
      </Box>
    </div>
  );
}