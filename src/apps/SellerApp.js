import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import SellerDashboard from "../pages/SellerDashboard";
import SellerProducts from "../pages/SellerProducts";
import SellerOrders from "../pages/SellerOrders";
import FlagBuyer from "../pages/FlagBuyer";
import SellerProductEdit from "../pages/SellerProductEdit";

const getSellerNavClassName = ({ isActive }) =>
  `btn ${isActive ? "btn-danger" : "btn-outline-danger"}`;

function SellerApp() {
  return (
    <>
      <div className="container pt-3">
        <div className="d-flex justify-content-end">
          <NavLink className={getSellerNavClassName} to="/seller/flag-buyer">
            Report Buyer
          </NavLink>
        </div>
      </div>

      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="flag-buyer" element={<FlagBuyer />} />
        <Route path="edit/:id" element={<SellerProductEdit />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </>
  );
}

export default SellerApp;
