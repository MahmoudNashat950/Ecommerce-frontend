import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BuyerApp from "./apps/BuyerApp";
import SellerApp from "./apps/SellerApp";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Categories from "./pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/buyer/*" element={<ProtectedRoute role="buyer"><BuyerApp /></ProtectedRoute>} />
        <Route path="/seller/*" element={<ProtectedRoute role="seller"><SellerApp /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute role="buyer"><Products /></ProtectedRoute>} />
        <Route path="/categories" element={<Categories />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;