import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineCard from "./medicine_card";

export default function Detail() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8000/api/v1"; 

  useEffect(() => {
    async function loadMedicines() {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        console.log("Fetched Medicines:", res.data);

        // 🔥 FIX HERE
        setMedicines(res.data.data.products || []);

      } catch (err) {
        console.error("Error fetching medicines", err);
      } finally {
        setLoading(false);
      }
    }

    loadMedicines();
  }, []);

  if (loading)
    return <h4 className="text-center mt-5 text-secondary">Loading Medicines...</h4>;

  return (
    <div className="container my-4">
      <div className="row g-4">
        {medicines.length === 0 ? (
          <h5 className="text-center">No medicines available</h5>
        ) : (
          medicines.map((med) => (
            <div key={med._id} className="col-md-3 col-sm-6">
              <MedicineCard medicine={med} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
