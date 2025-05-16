import { Fragment } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import moment from 'moment';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const ModalReceta = ({receta, open, close})=>{

    const medicamentos = JSON.parse(receta.medicamentos)
    const user = JSON.parse(localStorage.getItem("user"))

    const fecha = moment(receta.date, "YYYY-MM-DD HH:mm:ss.SSSSSS").format("YYYY-MM-DD HH:mm:ss");

    const downloadBase64Image = (base64Data, filename) => {
        // Crear un enlace temporal
        const link = document.createElement("a");
        link.href = base64Data; // Asignar la imagen base64 como href
        link.download = filename; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simular clic en el enlace
        document.body.removeChild(link); // Remover el enlace del DOM
    };
    
    // Uso: Llamar a la función con la imagen base64 y el nombre del archivo
    const handleDownload = () => {
        const base64Image = receta.image
        downloadBase64Image(base64Image, `${receta.recetaNum}.png`);
    };

    return(
        <Fragment>
            <BootstrapDialog
                onClose={close}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle id="customized-dialog-title">
                    Detalle
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={close}
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
                <Stack direction="row" spacing={2}>
                    <div className='receta-modal-container'>
                        <p>
                            <span className="card-receta-title">
                                # de Receta : 
                            </span>
                            <span> {receta.recetaNum}</span>
                        </p>
                        <p>
                            <span className="card-receta-title">
                                Fecha y Hora : 
                            </span>
                            <span> {fecha}</span>
                        </p>
                        <p>
                            <span className="card-receta-title">
                                Estado : 
                            </span>
                            <span> { receta.pay == 1 ? "Pagado" : "No pagado" }</span>
                        </p>
                        {
                            user.user.type == 10 &&
                            <p>
                                <span className="card-receta-title">
                                    Creado por : 
                                </span>
                                <span> { receta.userCreateName }</span>
                            </p>
                        }
                        <p>
                            <span className="card-receta-title">
                                Medicamentos : 
                            </span>
                        </p>
                        {
                            medicamentos.map((medicamento, index)=>{
                                return(
                                    <span key={index} className='medicamento'> - ({medicamento.cantidad}) { medicamento.PRODUCTO }</span>
                                )
                            })
                        }
                    </div>
                </Stack>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDownload}>
                    Descargar
                </Button>
                <Button autoFocus onClick={close}>
                    Cerrar
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </Fragment>
    )
}

export default ModalReceta