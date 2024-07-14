import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./Compoments/LoginForm";
import Catalog from "./Compoments/Catalog"; // Importez le composant Catalog
import Cart from "./Compoments/Cart";
import Register from "./Compoments/Register";
import UserProfile from "./Compoments/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/catalog" element={<Catalog/>} /> 
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/cart" element={<Cart/>} />

        
      </Routes>
    </Router>
  );
}

export default App;
