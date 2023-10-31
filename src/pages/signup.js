import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { set, get, getDatabase, ref } from "firebase/database";

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
    const db = getDatabase(app);
    const dbReference = ref(db, "Customers")
    
    const HandleSubmission = () => {

        const email = document.getElementById("signupEmail").value.toString(); // Get the email input value
        const password = document.getElementById("signupPassword").value.toString(); // Get the password input value
        const fullName = document.getElementById("fullName").value.toString().trim();

        const JSONdata = {
            stars: {
                unrealIdentity: 0,
            },
            basket: 0,
            email: email,
            password: password,
            userName: fullName,
            trimmedEmail: email.slice(0, email.indexOf("@")),
        }
        
        // add their details to databse
        // get to know how far the database is
        get(dbReference)
        .then( snapShot => {
            const data = snapShot.val();
            const dataLength = Object.keys(data).length + 1;
            // get another reference
            const referenceTwo = ref(db, "Customers/" + dataLength)
            set(referenceTwo, JSONdata)
            .then(() => {
                console.log("Information written successfully");
            }).catch((err) => {
                console.log("writingDatabaseError()");
            });
        }).catch( err => console.log("getInfoFromDatabaseError()"))

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User account created successfully
            const user = userCredential.user;
            console.log(user);
            window.location.pathname = "/login";
            // Perform further front-end operations (e.g., redirect, show success message)
        }).catch((error) => {
            // Handle registration errors (e.g., invalid password, weak password, etc.)
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/email-already-in-use") {
                console.log("This email already exists.");
                document.getElementById("emailAlreadyInUse").style.display = "block";
                document.getElementById("checkEmail").style.display = "";
                document.getElementById("shortPassword").style.display = "";
                document.getElementById("passwordMismatch").style.display = "";
                document.getElementById("signupEmail").focus();
            }
            if (errorCode === "auth/invalid-email"){
                document.getElementById("checkEmail").style.display = "block";
                document.getElementById("emailAlreadyInUse").style.display = "";
                document.getElementById("shortPassword").style.display = "";
                document.getElementById("passwordMismatch").style.display = "";
                document.getElementById("signupEmail").focus();
                }
        });
    }
    
    const checkPassword = () => {
        // this determines whether we will submit the document or not.
        const password = document.getElementById("signupPassword").value.toString(); // Get the password input value
        const confirmationPassword = document.getElementById("confirmSignupPassword").value.toString(); // Get the password input value
        const fullName = document.getElementById("fullName").value.toString().trim();
        const User = fullName.split(" ");
        if (User.length !== 2) {
            document.getElementById("badName").style.display = "block"
            document.getElementById("shortPassword").style.display = "";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("passwordMismatch").style.display = "";
            document.getElementById("fullName").focus();
            return false;
        } else if (password.length < 7) {
            document.getElementById("badName").style.display = ""
            document.getElementById("shortPassword").style.display = "block";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("passwordMismatch").style.display = "";
            document.getElementById("signupPassword").focus();
            return false;
        } else if (password !== confirmationPassword) {
            document.getElementById("badName").style.display = ""
            document.getElementById("passwordMismatch").style.display = "block";
            document.getElementById("shortPassword").style.display = "";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("confirmSignupPassword").focus();
            return false;
        } else HandleSubmission(User);
    }

    return (

        <>
            <div className="signup" id="signup">

                <form className="form" action="" method="post">
                    <p className="title">Register</p>
                    <p className="message">Create account and become a member of <b>JS&S</b>.</p>
                        <div className="flex"></div>  
                    <label>
                        <input className="input" type="text" name="fullName" id="fullName" placeholder="" required aria-required autoFocus />
                        <span>Full Name</span>
                        <span id="badName">Please provide 2 names.</span>
                    </label>

                    <label>
                        <input className="input" type="text" name="signupEmail" id="signupEmail" placeholder="" required aria-required />
                        <span>Email</span>
                        <span id="emailAlreadyInUse">This email is already in use.</span>
                        <span id="checkEmail">Email is invalid.</span>
                    </label> 
                        
                    <label>
                        <input className="input" type="password" name="signupPassword" id="signupPassword" placeholder="" required />
                        <span>Password</span>
                        <span id="shortPassword">Lengthen password to 7 characters or more.</span>
                    </label>
                    <label>
                        <input className="input" type="password" name="confirmSignupPassword" id="confirmSignupPassword" placeholder="" required />
                        <span>Confirm password</span>
                        <span id="passwordMismatch">Passwords don't match.</span>
                    </label>
                    <button type="button" className="submit" onClick={checkPassword}>Submit</button>
                    <p className="signin">Already have an acount? <Link to="/login">Login.</Link> </p>
                </form>






            </div>
        </>
    )
}



export default SignUp;