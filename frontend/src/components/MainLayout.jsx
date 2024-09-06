import { Outlet } from "react-router-dom"
import Leftsidebar from './sidebar/Leftsidebar';
const MainLayout = () => {
    return (
        <div>
            <div>
                <Leftsidebar />
            </div>

            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout