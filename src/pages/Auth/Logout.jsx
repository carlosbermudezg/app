import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Loading from "../../components/subcomponets/Loading";

import { Typography } from "@mui/material";

const Logout = ()=>{

    const navigate = useNavigate()
    localStorage.removeItem("token");

    useEffect(()=>{
        setTimeout(()=>{
            navigate("/")
        },1000)
    },[])

    return(
        <section className="logout">
            <Loading color="secondary" />
            <br></br>
            <Typography variant="body2" className="text-center" component="h2">
                Cerrando sesión.
            </Typography>
        </section>
    )
}

export default Logout