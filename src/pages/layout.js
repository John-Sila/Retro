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

            <div className="imageDivModal zoomClass" id="imageDivModal">
                <div className="imageDivModalInner">
                    <div className="modalleft" id="modalLeft" /**onClick={() => alert("left")} */>
                        <img src="https://images.pexels.com/photos/1612846/pexels-photo-1612846.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                    </div>
                    <div className="modalright" id="modalRight" /** onClick={() => alert("right")} */>

                        <span id="cancel" onClick={() => document.getElementById("imageDivModal").style.display = ""}><FaTimes /></span>

                        <span id="itemName">Blajasndfajk</span>
                        <span id="itemPrice">Ksh. 89999</span>
                        <button type="button" className="addToCart">Add to Cart <span><BsFillCartPlusFill /></span></button>
                        <button type="button" className="sendMessage"><FiPhoneCall /></button>

                    </div>
                </div>
            </div>

            <Outlet />
        </>
    )
}

export default Layout;