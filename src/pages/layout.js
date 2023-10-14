import { Outlet, Link } from "react-router-dom";
import logo from "../logo/rc.jpg"
import { RiMenu4Line, RiAccountCircleFill } from "react-icons/ri";
import { BiSolidUserCircle } from "react-icons/bi"
import { windowOnclick } from "../external_functions";
import { BsFillCartPlusFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";

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
                    <Link to="/login" className="links guest login"><RiAccountCircleFill /></Link>
                    <Link to="/profile" className="links customer">< BiSolidUserCircle /></Link>
                </div>
            </nav>


            <div className="loadingModal" id="loadingModal">
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
            </div>

            <Outlet />
        </>
    )
}

export default Layout;