import ChatWindow from "../../components/ChatWindow"
import Navbar from "../../components/Navbar"
const Buzon = ({user})=>{
    return(
        <>
            <Navbar></Navbar>
            <ChatWindow userId={user?.user?.idusers}/>
        </>
    )
}

export default Buzon