// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/search?q=${encodeURIComponent(query)}`);
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
//       <div className="container-fluid">

//         {/* Logo */}
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <img src={logo} alt="MediLocator" height="45" className="me-2" />
//           <span className="fw-bold text-success">MediLocator</span>
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
          
//           {/* Left menu */}
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link className="nav-link fw-semibold" to="/">Home</Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link fw-semibold" to="/features">Features</Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link fw-semibold" to="/support">Support 24/7</Link>
//             </li>
//           </ul>

//           {/* Search Bar */}
//           <form className="d-flex me-3" onSubmit={handleSearch}>
//             <input
//               className="form-control"
//               type="search"
//               placeholder="Search medicines..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               style={{ width: "280px" }}
//             />
//           </form>

//           {/* Auth Buttons */}
//           <Link to="/login" className="btn btn-outline-success me-2">Login</Link>
//           <Link to="/signup" className="btn btn-success me-2">Signup</Link>
//           <Link to="/admin/login" className="btn btn-dark">Admin</Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Optionally call backend logout if you have it
      // await axios.post("/api/v1/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/");
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-white shadow-sm">
      <div className="container-fluid px-3 px-xl-4">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <img src={logo} alt="MediLocator" height="40" className="me-2" />
          <span className="fw-bold text-success fs-5">MediLocator</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-xl-0 mt-3 mt-xl-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/features" onClick={closeMenu}>Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/support" onClick={closeMenu}>Support 24/7</Link>
            </li>
          </ul>

          {/* Removed search bar - it's in the main content */}

          <div className="d-flex flex-column flex-xl-row gap-2 align-items-xl-center">
            {isLoggedIn ? (
              <>
                <span className="text-muted me-2">
                  Welcome, <strong>{user?.fullname || user?.name || user?.email || "User"}</strong>
                </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-success" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="btn btn-success" onClick={closeMenu}>Signup</Link>
                <Link to="/admin/login" className="btn btn-dark" onClick={closeMenu}>Admin</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}