import { PanoramaFishEye } from '@mui/icons-material';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import { Avatar, Typography, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import rols from './../utils/rols';

const UserCard = ({user, changeUserStatus})=>{

    const handleStatus = ()=>{
        changeUserStatus(user.idusers, user.active)
    }

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
                    { rols.find( rol => rol.type == user.type ).name }
                </Typography>
                <div>
                    {
                        user.active == 1 ? 
                        <Button variant="outlined" onClick={ handleStatus } startIcon={<CheckOutlined />}></Button>:
                        <Button variant="outlined" onClick={ handleStatus } startIcon={<PanoramaFishEye />}></Button>
                    }
                    {
                        <Button variant="outlined" startIcon={ <PanoramaFishEye /> }></Button>
                    }
                </div>
            </section>
        </div>
    )
}

export default UserCard