import { Visibility } from '@mui/icons-material';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import { Avatar, Typography, Button } from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import rols from './../utils/rols';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const UserCard = ({user, changeUserStatus})=>{

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleStatus = ()=>{
        changeUserStatus(user.idusers, user.active)
    }
    const rol = rols.find( rol => rol.type == user.type ).name

    return(
        <div className='userCard'>
            <section className='userCard-body'>
                <div className='avatar'>
                    <Avatar/>
                </div>
                <div className='userdata'>
                    <Typography variant="caption" component="h2">
                    { user.name }
                    </Typography>
                    <Typography variant="caption" component="h2">
                    { user.username }
                    </Typography>
                </div>
            </section>
            <Divider/>
            <section className='userCardLinks'>
                <Typography variant="caption" component="h2">
                    { rol }
                </Typography>
                <ButtonGroup variant="contained" aria-label="Basic button group" size='small'>
                {
                    user.active == 1 ? 
                    <Button color='success' onClick={ handleStatus }> <CheckOutlined fontSize='small' /> </Button>:
                    <Button color='error' onClick={ handleStatus } ><Clear fontSize='small' /> </Button>
                }
                {
                    <Button color="primary" onClick={handleClickOpen}><Visibility fontSize='small' /></Button>
                }
                </ButtonGroup>
            </section>
            {/* Modal de datos de usuario */}
            <Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Datos
                    </DialogTitle>
                    <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                    >
                    <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                    <Typography gutterBottom>
                        <span className='title'>
                            {
                                rol
                            }
                        </span>
                    </Typography>
                    <Typography gutterBottom>
                        <span className='title'>Nombre :</span>
                        {
                            user.name
                        }
                    </Typography>
                    <Typography gutterBottom>
                        <span className='title'>Email:</span>
                        {
                            user.username
                        }
                    </Typography>
                    <Typography gutterBottom>
                        <span className='title'>Teléfono:</span>
                        {
                            user.telefono
                        }
                    </Typography>
                    <Typography gutterBottom>
                        <span className='title'>Dirección:</span>
                        {
                            user.direccion
                        }
                    </Typography>
                    <Typography gutterBottom>
                        <span className='title'>Ciudad:</span>
                        {
                            user.residencia
                        }
                    </Typography>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cerrar
                    </Button>
                    </DialogActions>
                </BootstrapDialog>
            </Fragment>
        </div>
    )
}

export default UserCard