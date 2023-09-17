import { Outlet, Link } from "react-router-dom";
import logo from "../logo/rc.jpg"

const Layout = () => {
    return (
        <>
            <nav className="topNav" id="topNav">
                <div className="topLeft">
                    <img src={ logo } alt="Company Logo" />
                    <Link to="/" className="links">Retro Classics</Link>
                </div>
                
                <div className="topRight">
                    <li><Link to="/login" className="links guest">Login</Link></li>
                    <li><Link to="/signup" className="links guest">Sign Up</Link></li>
                </div>
            </nav>

            <Outlet />
        </>
    )
}

export default Layout;