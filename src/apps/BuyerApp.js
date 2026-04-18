import { Routes, Route, Navigate } from "react-router-dom";
import BuyerCatalog from "../pages/BuyerCatalog";
import ProductDetails from "../pages/ProductDetails";
import BuyerOrders from "../pages/BuyerOrders";
import FlagSeller from "../pages/FlagSeller";

function BuyerApp() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="catalog" replace />} />
      <Route path="catalog" element={<BuyerCatalog />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="flag-seller" element={<FlagSeller />} />
      <Route path="orders" element={<BuyerOrders />} />
    </Routes>
  );
}

export default BuyerApp;
