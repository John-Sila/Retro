import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { Outlet, Link } from "react-router-dom";
import logo from "../logo/rc.jpg"
import { RiMenu4Line, RiAccountCircleFill } from "react-icons/ri";
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

    const LogOut = () => {
        // unset item
        localStorage.removeItem("Username");

            // configurations
        const firebaseConfig = {
            apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
            authDomain: "retro-bf312.firebaseapp.com",
            databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
            projectId: "retro-bf312",
            storageBucket: "retro-bf312.appspot.com",
            messagingSenderId: "319056909364",
            appId: "1:319056909364:web:f2215ade4b825b8fe56661",
            measurementId: "G-NT5D2WTQ8T"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth();

        // Sign out the currently authenticated user
        signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log("User signed out");
        })
        .catch((error) => {
            // An error happened.
            console.error("Error signing out:", error);
        });

        // go home
        window.location.pathname = "/";

    }

    return (
        <>
            <nav className="topNav" id="topNav">
                <div className="topLeft">
                    <button type="button" className="menuButton" onClick={bringMenu}><RiMenu4Line /></button>
                    <img src={ logo } alt="Company Logo" className="companyLogo" id="companyLogo" />
                    <Link to="/" className="links">JS&Siblings</Link>
                </div>
                
                <div className="topRight">
                    <Link to="/login" className="links guest login"><RiAccountCircleFill /></Link>

                    <div className="paste-button customer">
                        <button className="button"><span id="userName"></span> &nbsp; ▼</button>
                        <div className="dropdown-content">
                            <Link className="links" id="top" href="#">Keep source formatting</Link>
                            <Link className="links" id="middle" href="#">Merge formatting</Link>
                            <Link className="links" id="bottom" href="#" onClick={LogOut}>Log out</Link>
                        </div>
                    </div>

                </div>
            </nav>


            <div className="loadingModal" id="loadingModal">
                <div className="loading" id="loading">
                    <div className="dot-spinner">
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>

                    </div>
                        <span>Please wait...</span>
                </div>
            </div>

            <Outlet />
        </>
    )
}

export default Layout;