import { Routes, Route, Navigate } from "react-router-dom";

import SellerDashboard from "../pages/SellerDashboard";
import SellerProducts from "../pages/SellerProducts";
import SellerOrders from "../pages/SellerOrders";
import FlagBuyer from "../pages/FlagBuyer";
import SellerProductEdit from "../pages/SellerProductEdit";

function SellerApp() {
  return (
    <Routes>

      {/* ✅ default */}
      <Route index element={<Navigate to="dashboard" replace />} />

    
      <Route path="dashboard" element={<SellerDashboard />} />

      <Route path="products" element={<SellerProducts />} />
      <Route path="orders" element={<SellerOrders />} />
      <Route path="flag-buyer" element={<FlagBuyer />} />

      {/* ✅ FIX: remove /seller */}
      <Route path="edit/:id" element={<SellerProductEdit />} />

      {/* ✅ fallback */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />

    </Routes>
  );
}

export default SellerApp;