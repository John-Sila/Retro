import { Outlet, Link } from "react-router-dom";
import logo from "../logo/rc.jpg"
import { RiMenu4Line } from "react-icons/ri";
import { BiSolidUserCircle } from "react-icons/bi"
import { windowOnclick } from "../external_functions";

const Layout = () => {

    const bringMenu = () => {
        const aside = document.getElementsByTagName("aside")[0]
        if (aside) {
            aside.style.left = "10px";
            window.addEventListener("click", windowOnclick)
            return
        }
        return false
    }

    return (
        <>
            <nav className="topNav" id="topNav">
                <div className="topLeft">
                    <button type="button" className="menuButton" onClick={bringMenu}><RiMenu4Line /></button>
                    <img src={ logo } alt="Company Logo" className="companyLogo" id="companyLogo" />
                    <Link to="/" className="links">JS & Siblings.</Link>
                </div>
                
                <div className="topRight">
                    <li><Link to="/login" className="links guest">Login</Link></li>
                    <li><Link to="/profile" className="links customer">< BiSolidUserCircle /></Link></li>
                </div>
            </nav>


            <div className="loading" id="loading">
                <div class="dot-spinner">
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>

                </div>
                    <span>Please wait...</span>
            </div>

            <Outlet />
        </>
    )
}

export default Layout;