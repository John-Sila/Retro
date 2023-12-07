import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByChild, equalTo, limitToFirst, onValue, get } from "firebase/database";



// pages & functions
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import NoPage from "./pages/nopage";
import Product from "./pages/product";
import { useEffect, useState } from "react";
import Sell from "./pages/sell";
import { firebaseConfigurationDetails } from "./external_functions";


function App() {

  const app = initializeApp(firebaseConfigurationDetails);


  const engageData = () => {
    // get username
    const db = getDatabase(app);
    // Reference to "Customers" node
    const reference = ref(db, "Customers");

    // Query for users with trimmedEmail equal to "jsila3000"
    const theQuery = query(
      reference,
      orderByChild("trimmedEmail"),
      equalTo(window.localStorage.getItem("trimmedEmail")),
      limitToFirst(1),
    );

    // Attach a listener to the query
    onValue(theQuery, (snapshot) => {
      // Handle the snapshot data here
      const data = snapshot.val();
      
      if (data == null) {
        // create a 0.5 delay
        setTimeout(() => {
          engageData();
        }, 500);
        return false;
      } else {
        // for this code to get here, the details are already entered and the query is not null
        // we do this because the parent useEffect() here is called just immediately when
        // the user creates the account and information might not have been entered to database yet.
        const parsed = Object.keys(data)[0];
  
        // get
        const ref2 = ref(db, `Customers/${parsed}`);
        get(ref2).then((snapShot) => {
          const data = snapShot.val();
  
          // we have a username
          // display customer divs
          const customer = document.getElementsByClassName("customer");
          for (let i = 0; i < customer.length; i++) {
            const element = customer[i];
            element.style.display = "block";
            
          }
          // hide guest divs
          const guest = document.getElementsByClassName("guest");
          for (let i = 0; i < guest.length; i++) {
            const element = guest[i];
            element.style.display = "none";
            
          }
          document.getElementById("userName").innerHTML = data.userName;
  
  
  
        }).catch((err) => {
          // execute this if the get(ref2) function brough an error
          console.log("An error occurred while trying to get your username: ", err)
          // log out
          const auth = getAuth()
          signOut(auth).then((snap) => {
            console.log("You have been logged out.");
          }).catch((err) => {
            console.log("We also couln't log you out, unfortunately. This compromises your account.");
          });
        });


        // end else statement
        
      }
    });
    // user data ends here
  }




  useEffect( () => {

    const auth = getAuth();
    // check the user login state
    // Set up an observer to watch for changes in the user's authentication state
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in
        console.log("User is logged in:", user);
        // call the function that checks whether we  can access the user's data
        engageData();
        // You can access user properties, like user.uid, user.displayName, etc.
      } else {
        // User is signed out
        console.log("User is logged out");
      }
    });

    // check cookies
    if (localStorage.getItem("cookiesPresent") === null) {
      setTimeout(() => {
        document.getElementById("cookieCard").style.display = "flex";
      }, 3000);
    }

  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={ <Home /> } />
          <Route path="login" element={ <Login /> } />
          <Route path="signup" element={ <SignUp /> } />
          <Route path="this_item" element={ <Product /> } />
          <Route path="sell" element={ <Sell /> } />
          <Route path="*" element={ <NoPage /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
