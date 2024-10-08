import { Avatar, Typography } from '@mui/material';
import StarBorder from "@mui/icons-material/StarBorder";
import StarHalf from "@mui/icons-material/StarHalf";
import StarRate from "@mui/icons-material/StarRate";
import AllInclusive from "@mui/icons-material/AllInclusive";
import categories from '../utils/Categories';
import { useSelector } from 'react-redux';

const ProductsCard = ({ product })=>{

    const filterCategory = categories.find( element => product.CATEGORIA === element.id )
    const selectedZone = useSelector( state => state.selectedZone )

    const bodegas = JSON.parse(selectedZone.bodega)

    const stock = bodegas.reduce((acc, current)=>{
        const add = acc + Number(product[current])
        return add
    }, 0) || 0

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
        <div className='productCard'>
            <section className='productCard-body'>
                <div className='avatar'>
                    <Avatar
                        sx={{ width: 24, height: 24, bgcolor: color, fontSize: 12 }}
                    >
                        { cat }%
                    </Avatar>
                </div>
                <div className='product-description'>
                    <Typography variant="caption" component="h2" aria-multiline={true}>
                        { product.PRODUCTO }
                    </Typography>
                </div>
            </section>
            <section className='productCard-footer'>
                <Typography variant="caption" component="h2" textAlign="right">
                    Stock : { stock }
                </Typography>
            </section>
        </div>
    )
}

export default ProductsCard