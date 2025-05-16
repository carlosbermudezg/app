import { Avatar, Typography } from '@mui/material';
import StarBorder from "@mui/icons-material/StarBorder";
import StarHalf from "@mui/icons-material/StarHalf";
import StarRate from "@mui/icons-material/StarRate";
import AllInclusive from "@mui/icons-material/AllInclusive";
import categories from '../utils/Categories';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState, Fragment } from 'react';

const ProductsCardReceta = ({ product, setSelected })=>{

    const [open, setOpen] = useState(false);
    const [cantidad, setCantidad] = useState(0)
    const [msgCantidad, setMsgCantidad] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
        setCantidad(0)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const filterCategory = categories.find( element => product.CATEGORIA === element.id )
    
    const handleSetCantidad = (cantidad, product)=>{
        if(cantidad < 1){
            setMsgCantidad("La cantidad debe ser mayor")
        }else{
            product.cantidad = cantidad
            product.porcentaje = filterCategory.value
            addProduct(product)
        }
    }
    

    const addProduct = (product)=>{
        setSelected((prevItems) => {
            const exists = prevItems.some((item) => item.PRODUCTO === product.PRODUCTO);
      
            if (exists) {
              return prevItems.map((item) =>
                item.PRODUCTO === product.PRODUCTO ? { ...item, ...product } : item
              );
            } else {
              return [...prevItems, product];
            }
        });
        handleClose()
    }

    const costo = Number(product.COSTO).toFixed(2)


    let cat = "0"
    let icon = <AllInclusive />
    let color = '#662D91'

    if(filterCategory){
        cat = filterCategory?.value
        if(filterCategory?.value === 3){
            icon = <StarBorder />
            color = '#ffc501'
        }
        if(filterCategory?.value === 5){
            icon = <StarHalf />
            color = '#fe9600'
        }
        if(filterCategory?.value === 15){
            icon = <StarRate />
            color = '#FF5733'
        }
    }

    return(
        <>
            <a className='card-receta-link' href="#" onClick={handleClickOpen}>
                <div className='productCardReceta'>
                    <section className='productCard-body-receta'>
                        <div className='avatar'>
                            <Avatar
                                sx={{ width: 24, height: 24, bgcolor: color, fontSize: 12 }}
                            >
                                { cat }%
                            </Avatar>
                        </div>
                        <div className='product-description'>
                            <Typography variant="caption" component="h2" aria-multiline={true}>
                                { product.PRODUCTO } <b>${ costo }</b>
                            </Typography>
                        </div>
                    </section>
                </div>
            </a>
            <Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmación
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>¿Está seguro que desea agregar este medicamento a la receta?</b><br></br>
                        - { product.PRODUCTO }
                        <TextField className='inputMedia' value={cantidad} type="number" size='small' placeholder='Cantidad' onChange={(e)=> setCantidad(e.target.value)}></TextField>
                        <Typography variant="caption">{msgCantidad}</Typography>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={()=>handleSetCantidad(cantidad, product)} autoFocus>
                        Agregar
                    </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        </>
    )
}

export default ProductsCardReceta