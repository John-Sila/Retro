import { Link } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { set, get, getDatabase, ref } from "firebase/database";
import { firebaseConfigurationDetails } from "../external_functions";

const SignUp = () => {

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfigurationDetails);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const db = getDatabase(app);
    const dbReference = ref(db, "Customers");
    
    const HandleSubmission = () => {

        const email = document.getElementById("signupEmail").value.toString(); // Get the email input value
        const password = document.getElementById("signupPassword").value.toString(); // Get the password input value
        let fullName = document.getElementById("fullName").value.toString().trim();
        const firstNameFragment = fullName.split(" ")[0].split("");
        const secondNameFragment = fullName.split(" ")[0].split("");


        const JSONdata = {
            stars: {
                unrealIdentity: 0,
            },
            basket: 0,
            email: email,
            password: password,
            userName: fullName,
            trimmedEmail: email.slice(0, email.indexOf("@")),
            adminPrivilege: false,
        }
        
        
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User account created successfully
            // add their details to databse
            // get to know how far the database is
            get(dbReference)
            .then( snapShot => {
                const data = snapShot.val();
                const dataLength = Object.keys(data).length;
                const objKeys = Object.keys(data);
                let lastUser = objKeys[dataLength - 1];
                lastUser = lastUser.toString().split("");
                let userInt = "", index = lastUser.length - 1;
                do {
                    userInt += lastUser[index];
                    index--;
                } while (!isNaN(parseInt(lastUser[index])));

                userInt = userInt.split("").reverse().join("");
                userInt = parseInt(userInt) + 1;

                // get another reference
                const referenceTwo = ref(db, "Customers/user" + userInt)
                set(referenceTwo, JSONdata)
                .then(() => {
                    console.log("Information written successfully");

                    // set username in localstorage/// this also happens in login
                    window.localStorage.setItem("trimmedEmail", email.toString().slice(0, email.indexOf("@")));

                    // we are in, account created and data written
                    // const user = userCredential.user;
                    // console.log(user);
                    window.location.pathname = "/";
                }).catch((err) => {
                    console.log("writingDatabaseError()");
                });
            }).catch( err => console.log("couldn't access database."))


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
        const unInclusive = ",./?;:'\"-_!`$%^&*)(][}{\\+@~".split("");
        const splitName = fullName.split("");
        for (let a = 0; a < splitName.length; a++) {
            for (let b = 0; b < unInclusive.length; b++) {
                if (splitName[a] === unInclusive[b]) {
                    document.getElementById("noSymbols").style.display = "block";
                    document.getElementById("badName").style.display = "";
                    document.getElementById("shortPassword").style.display = "";
                    document.getElementById("checkEmail").style.display = "";
                    document.getElementById("emailAlreadyInUse").style.display = "";
                    document.getElementById("passwordMismatch").style.display = "";
                    document.getElementById("fullName").focus();
                    return false;
                }
            }
            
        }
        
        if (User.length !== 2) {
            document.getElementById("badName").style.display = "block"
            document.getElementById("shortPassword").style.display = "";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("passwordMismatch").style.display = "";
            document.getElementById("noSymbols").style.display = "";
            document.getElementById("fullName").focus();
            return false;
        } else if (password.length < 7) {
            document.getElementById("badName").style.display = ""
            document.getElementById("shortPassword").style.display = "block";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("passwordMismatch").style.display = "";
            document.getElementById("noSymbols").style.display = "";
            document.getElementById("signupPassword").focus();
            return false;
        } else if (password !== confirmationPassword) {
            document.getElementById("badName").style.display = ""
            document.getElementById("passwordMismatch").style.display = "block";
            document.getElementById("shortPassword").style.display = "";
            document.getElementById("checkEmail").style.display = "";
            document.getElementById("emailAlreadyInUse").style.display = "";
            document.getElementById("noSymbols").style.display = "";
            document.getElementById("confirmSignupPassword").focus();
            return false;
        } else HandleSubmission();
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
                        <span id="badName">Full Name can only contain 2 names.</span>
                        <span id="noSymbols">You can't use symbols in your name.</span>
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