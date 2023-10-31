import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, get, ref, query, equalTo } from "firebase/database";


const Login = () => {
    
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
    const db = getDatabase(app);
    const dbReference = ref(db)



    const handleLogin = () => {
        // event.preventDefault(); // Prevent the form from submitting
      
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const Username = email.toString().slice(0, email.indexOf("@"));
    
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                // return

                // User successfully logged in
                const user = userCredential.user;
                console.log(user);
                
                // go home
                window.location.pathname = "/";


                // set username after login...it should be less than 12 characters long
                // it auto deleted when the user logs out
                // meaning after a logout, a logged in session cannot be accessed through window.history()
                window.localStorage.setItem("Username", Username.length > 12 ? Username.toLowerCase().slice(0, 12) + "..." : Username.toLowerCase())

            })
            .catch((error) => {
                // Handle login errors
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === "auth/invalid-login-credentials") {
                    document.getElementById("invalidEmail").style.display = "";
                    document.getElementById("accountDoesNotExist").style.display = "block";
                    document.getElementById("loginPassword").value = "";
                    document.getElementById("loginPassword").focus();
                }
                if (errorCode === "auth/invalid-email") {
                    document.getElementById("invalidEmail").style.display = "block";
                    document.getElementById("accountDoesNotExist").style.display = "";
                }
                // if (errorCode === "auth/network-request-failed") {
                    // this is a network issue
                // }
                // Display an error message to the user
            });

    };



    return (
        <>
            <div className="loginModal" id="loginModal">

            <form className="card-container" action="" method="post">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="container">
                    <div className="log-card">
                        <p className="heading">Welcome Back</p>

                        <div className="input-group">
                            <label htmlFor="loginEmail" className="text">Email</label>
                            <input className="input" type="email" name="loginEmail" id="loginEmail" placeholder="For Ex: jd411@gmail.com" autoFocus />
                            <span id="invalidEmail">Provide a valid email.</span>
                            <span id="accountDoesNotExist">This account does not exist.</span>
                            <label htmlFor="loginPassword" className="text">Password</label>
                            <input className="input" type="password" name="loginPassword" id="loginPassword" placeholder="Enter Password" />
                        </div>

                        <div className="password-group">
                            <div className="checkbox-group">
                                <input type="checkbox" name="rememberMe" id="rememberMe" />
                                <label className="label" htmlFor="rememberMe" >Remember Me</label>
                            </div>
                                <Link to="/forgot_password" className="forget-password">Forget Password</Link>
                        </div>

                        <button type="button" onClick={handleLogin} className="btn">Sign In</button>

                        <p className="no-account">Don't Have an Account?<Link to="/signup" className="link"> Sign Up</Link></p>
                    </div>
                </div>
            </form>



            </div>
        </>
    )
}
export default Login;