import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

const SignUp = () => {

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    const HandleSubmission = (userEmail, userPassword) => {

        const email = userEmail // Get the email input value
        const password = userPassword // Get the password input value
        
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User account created successfully
            const user = userCredential.user;
            console.log(user);
            window.location.pathname = "/login";
            // Perform further front-end operations (e.g., redirect, show success message)
            })
            .catch((error) => {
            // Handle registration errors (e.g., invalid password, weak password, etc.)
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/email-already-in-use") {
                console.log("This email already exists.");
                document.getElementById("emailAlreadyInUse").style.display = "block";
                document.getElementById("checkEmail").style.display = "";
            }
            });
        }



        const checkCred = () => {
            try {
                const email = document.getElementById("email").value.toString(); // Get the email input value
                const password = document.getElementById("password").value.toString(); // Get the password input value
                
                const atIndex = email.lastIndexOf("@");
                const dotIndex = email.lastIndexOf(".");
                const arrangement = email.lastIndexOf(".") > email.toString().lastIndexOf("@");
                const Ats = () => { // Get the email input value
                    return email.lastIndexOf("@") === email.indexOf("@");
                }
    
                if (atIndex === -1 || dotIndex === -1 || !arrangement || !Ats()) {
                    document.getElementById("checkEmail").style.display = "block";
                    document.getElementById("email").focus();
                    document.getElementById("emailAlreadyInUse").style.display = "";
                    return false;
                }
    
                // submit
                HandleSubmission(email, password);

            } catch (error) {
                console.log("An error occured trying to parse form.");
            }
        }



    return (

        <>
            <div className="signup" id="signup">
                <form action="#" method="post">
                    <h2>Sign up</h2>
                    <label htmlFor="email">
                        <input type="text" name="email" id="email" required aria-required />
                        <span className="labelText">Email</span>
                        <span id="emailAlreadyInUse">Email already exists.</span>
                        <span id="checkEmail">Provide a valid Email.</span>
                    </label>
                    <label htmlFor="password">
                        <input type="password" name="password" id="password" required aria-required />
                        <span className="eye"><AiFillEye /></span>
                        <span className="labelText">Password</span>
                    </label>
                    <div className="submissionButtons">
                        <button type="button" onClick={checkCred}>Create Account</button>
                    </div>
                    <div className="signupFinale">
                    <hr />
                        <span>Already have an account? <Link to="/login" className="links">Login</Link></span><br />
                        <span>Go to <Link to="/" className="links">homepage.</Link></span>
                    </div>
                </form>
            </div>
        </>
    )
}



export default SignUp;