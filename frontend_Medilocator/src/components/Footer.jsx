export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#F8F9FA",
        padding: "25px 0",
        borderTop: "1px solid #e5e5e5",
        marginTop: "40px",
      }}
    >
      <div className="container">
        {/* Links */}
        <ul className="nav justify-content-center mb-3">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link px-3"
              style={{ color: "#4E6E81", fontSize: "14px" }}
            >
              Privacy Policy
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link px-3"
              style={{ color: "#4E6E81", fontSize: "14px" }}
            >
              Terms & Conditions
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link px-3"
              style={{ color: "#4E6E81", fontSize: "14px" }}
            >
              Feedback
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link px-3"
              style={{ color: "#4E6E81", fontSize: "14px" }}
            >
              FAQs
            </a>
          </li>
        </ul>

        {/* Copyright */}
        <p
          className="text-center"
          style={{ fontSize: "13px", color: "#7B8FA1", marginBottom: "0" }}
        >
          © {new Date().getFullYear()} MediLocator — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
