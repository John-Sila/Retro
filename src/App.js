import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

// pages
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import NoPage from "./pages/nopage";
import Product from "./pages/product";

function App() {
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
