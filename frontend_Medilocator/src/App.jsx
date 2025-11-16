import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// (Your existing imports)
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectedRoute";
import Detail from "./components/Detail";
import MedicineDetails from "./components/medicineDetails";
import AdminDashboard from "./components/AdminDashboard";
import StoreDashboard from "./components/StoreDashboard";
import SearchCatalog from "./components/SearchCatalog";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/adminLogin";
import AddProductCatalog from "./components/AddProductCatalog";
import CatalogDisplay from "./components/CatalogDisplay";
import AddStock from "./components/AddStock";
import UpdateInventoryPage from "./components/UpdateInventoryPage";
import ProductRequestList from "./pages/ProductRequestList";
import MasterCatalogAdmin from "./components/MasterCatalogAdmin";

// --- 1. IMPORT THE NEW BILLING PAGES ---
import CreateBillPage from "./pages/CreatingBillPage";
import BillListPage from "./pages/BillingListPage";


import SignUp from "./components/Signup";
import Login from "./components/login";

function App() {
  return (
    <Router> 
      <Routes>
        {/* ... (Your Public & Auth Routes are fine) ... */}
        
        {/* === PUBLIC ROUTES === */}
        <Route element={<Layout />}>
          <Route path="/" element={<Detail />} />
          <Route path="/catalog" element={<CatalogDisplay />} />
          <Route path="/product/:productId" element={<MedicineDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medicineDetails" element={<Navigate to="/catalog" replace />} />
        </Route>

        {/* === STORE AUTH ROUTES === */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminSignup />} />
        <Route path="/admin" element={<Navigate to="/admin/register" replace />} />

        {/* === PROTECTED STORE ROUTES === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/store" element={<StoreDashboard />} />
          <Route path="/store/inventory" element={<Navigate to="/store" replace />} />
          <Route path="/store/catalog-search" element={<SearchCatalog />} />
          <Route path="/store/add-stock/:medicineId" element={<AddStock />} />
          <Route path="/store/inventory/edit/:inventoryId" element={<UpdateInventoryPage />} />
          <Route path="/store/my-requests" element={<ProductRequestList />} />
          <Route path="/store/request-product" element={<AddProductCatalog />} />
          <Route path="/admin/master-catalog" element={<MasterCatalogAdmin />} />
          <Route path="/admin/master-catalog/add" element={<AddProductCatalog />} />
          
          {/* --- 2. ADD THE NEW BILLING ROUTES --- */}
          <Route path="/store/billing/new" element={<CreateBillPage />} />
          <Route path="/store/billing/history" element={<BillListPage />} />
          {/* --- END OF NEW ROUTES --- */}

          {/* Redirects */}
          <Route path="/admin/catalog" element={<Navigate to="/admin/master-catalog" replace />} />
          <Route path="/store/search" element={<Navigate to="/store/catalog-search" replace />} />
          <Route path="/search" element={<Navigate to="/store/catalog-search" replace />} />
          <Route path="/search/add" element={<Navigate to="/store/request-product" replace />} />
          <Route path="/adminDashboard" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;