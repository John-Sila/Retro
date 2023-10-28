import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Post from "./pages/dbdata";

// pages
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import NoPage from "./pages/nopage";
import Product from "./pages/product";
import { useEffect } from "react";

function App() {

  useEffect( () => {
    Post();

    // check is the user is logged in
    const parameterType = typeof(localStorage.getItem("Username"));
    if (parameterType === "string") {
      const customer = document.getElementsByClassName("customer");
      for (let i = 0; i < customer.length; i++) {
        const element = customer[i];
        element.style.display = "block";
        
      }
      const guest = document.getElementsByClassName("guest");
      for (let i = 0; i < guest.length; i++) {
        const element = guest[i];
        element.style.display = "none";
        
      }
      document.getElementById("userName").innerHTML = localStorage.getItem("Username");
    } else {
      // this is of type object
      const customer = document.getElementsByClassName("customer");
      for (let i = 0; i < customer.length; i++) {
        const element = customer[i];
        element.style.display = "";
        
      }
      const guest = document.getElementsByClassName("guest");
      for (let i = 0; i < guest.length; i++) {
        const element = guest[i];
        element.style.display = "";
        
      }
    }
  })


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={ <Home /> } />
          <Route path="login" element={ <Login /> } />
          <Route path="signup" element={ <SignUp /> } />
          <Route path="this_item" element={ <Product /> } />
          <Route path="*" element={ <NoPage /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
