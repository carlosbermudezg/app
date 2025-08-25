import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const MainLayout = ()=>{
    return(
        <>
            <Sidebar></Sidebar>
                <Outlet></Outlet>
        </>
    )
}
export default MainLayout