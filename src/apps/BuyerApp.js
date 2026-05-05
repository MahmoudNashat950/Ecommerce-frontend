import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import BuyerCatalog from "../pages/BuyerCatalog";
import ProductDetails from "../pages/ProductDetails";
import BuyerOrders from "../pages/BuyerOrders";
import FlagSeller from "../pages/FlagSeller";

const getBuyerNavClassName = ({ isActive }) =>
  `btn ${isActive ? "btn-danger" : "btn-outline-danger"}`;

function BuyerApp() {
  return (
    <>
      <div className="container pt-3">
        <div className="d-flex justify-content-end">
          <NavLink className={getBuyerNavClassName} to="/buyer/flag-seller">
            Report Seller
          </NavLink>
        </div>
      </div>

      <Routes>
        <Route path="" element={<Navigate to="catalog" replace />} />
        <Route path="catalog" element={<BuyerCatalog />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="flag-seller" element={<FlagSeller />} />
        <Route path="orders" element={<BuyerOrders />} />
      </Routes>
    </>
  );
}

export default BuyerApp;
