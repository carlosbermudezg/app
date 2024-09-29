import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

const MainLayout = ()=>{
    return(
        <>
            <Navbar></Navbar>
            <Sidebar></Sidebar>
                <Outlet></Outlet>
        </>
    )
}
export default MainLayout