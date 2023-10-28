import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import store from "./redux";


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



    const handleLogin = () => {
        // event.preventDefault(); // Prevent the form from submitting
      
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const Username = email.toString().slice(0, email.indexOf("@"))
    
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User successfully logged in
                const user = userCredential.user;
                // Perform further front-end operations (e.g., redirect, show a success message)
                console.log(user);
                window.location.pathname = "/";

                window.localStorage.setItem("Username", Username)

                // manage that state
                store.dispatch( {
                    type: "LOGIN",
                    payload: user,
                } )

            })
            .catch((error) => {
                // Handle login errors
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === "auth/invalid-login-credentials") {
                    document.getElementById("accountDoesNotExist").style.display = "block";
                }
                // Display an error message to the user
            });

    };



    return (
        <>
            <div className="loginModal" id="loginModal">
                <form action="" method="post">
                    <h2>Login</h2>
                    <span id="accountDoesNotExist">Account does not exist.</span>
                    <label htmlFor="email">
                        <input type="text" name="email" id="loginEmail" min={2} required aria-required />
                        <span className="labelText">Email</span>
                    </label> <br />
                    <label htmlFor="password">
                        <input type="password" name="password" id="loginPassword" required />
                        <span className="labelText">Password</span>
                    </label>

                    <div className="loginSubmissionDiv">
                        <button type="button" onClick={handleLogin}>Submit</button>
                        <button type="button" onClick={() => window.location.pathname = "/"}>Cancel</button>
                    </div>

                    <p>
                        <span>Don't have an account?</span><br />
                        <Link to="/signup" className="noAcc">Create Account.</Link>
                    </p>
                </form>
            </div>
        </>
    )
}
export default Login;