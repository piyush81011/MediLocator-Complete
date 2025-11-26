import React, { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your request has been submitted. We will contact you soon!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      
      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">Customer Support</h1>
        <p className="text-muted">
          We're here to help you 24/7. Find answers or reach out to us anytime.
        </p>
      </div>

      <div className="row g-4">

        {/* LEFT SECTION - FAQ */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Frequently Asked Questions</h4>

              <div className="accordion" id="faqAccordion">
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I create an account?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Go to the Register page and fill your details. You will receive a confirmation once registered.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      I forgot my password. What should I do?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Click "Forgot Password" on the login page to reset your password.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      How can I contact support?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can reach us at <strong>support@medilocator.com</strong> or call <strong>+91 9876543210</strong>.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SECTION - CONTACT FORM */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h4 className="fw-bold mb-3">Need Help? Contact Us</h4>
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe your issue..."
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Submit Request
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>

      {/* CONTACT INFO */}
      <div className="text-center mt-5">
        <p className="text-muted">Email: <strong>support@medilocator.com</strong></p>
        <p className="text-muted">Phone: <strong>+91 9876543210</strong></p>
      </div>

    </div>
  );
}
