import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Inventory from '@mui/icons-material/Inventory';
import Article from '@mui/icons-material/Article';
import TrendingUp from '@mui/icons-material/TrendingUp';
import People from '@mui/icons-material/People';
import Build from '@mui/icons-material/Build';
import Logout from '@mui/icons-material/Logout';
import { Avatar, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setIsDrawerOpen } from '../store/slices/isDrawerOpen.slice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isDrawerOpen = useSelector( state => state.isDrawerOpen )
  const token = JSON.parse(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : {}
  const permission = user?.user?.type

  const toggleDrawer = (newOpen) => () => {
    dispatch(setIsDrawerOpen(newOpen));
  };

  const mainRoutes = [
    {
      name: "Productos",
      url: "/products",
      icon : <Inventory />,
      permission : 0
    },
    {
      name: "Buzon",
      url: "/buzon",
      icon : <InboxIcon />,
      permission : 0
    },
    {
      name: "Recetas",
      url: "/recetas",
      icon : <Article />,
      permission : 1
    },
    {
      name: "Rendimiento",
      url: "/rendimiento",
      icon : <TrendingUp />,
      permission : 2
    }
  ]

  const adminRoutes = [
    {
      name: "Usuarios",
      url: "/users",
      icon : <People />,
      permission : 10
    },
    {
      name: "Configuración",
      url: "/configuration",
      icon : <Build />,
      permission : 10
    }
  ]

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {mainRoutes.map((route, index) => (
          route.permission == 0 || route.permission == permission || permission == 10 ?
          <ListItem key={route.name} disablePadding>
            <ListItemButton onClick={ ()=> navigate(route.url) }>
              <ListItemIcon>
                { route.icon }
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem> : false
        ))}
      </List>
      { permission == 10 && <Divider />}
      <List>
        {adminRoutes.map((route, index) => (
          route.permission == 0 || route.permission == permission || permission == 10 ?
          <ListItem key={route.name} disablePadding>
            <ListItemButton onClick={ ()=> navigate(route.url) }>
              <ListItemIcon>
                { route.icon }
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem> : false
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <section className='sidebar-card'>
          <div className='avatar'>
            <Avatar/>
          </div>
          <div className='userdata'>
            <Typography variant="caption" component="h2">
              { user?.user?.name }
            </Typography>
            <Typography variant="caption" component="h2">
              { user?.user?.username }
            </Typography>
          </div>
        </section>
        <Divider />
        {DrawerList}
        <Divider />
        <div className='buttonLogout'>
          <Button variant="outlined" onClick={ ()=> navigate("/logout") } endIcon={<Logout />}>Salir</Button>
        </div>
      </Drawer>
    </div>
  );
}
