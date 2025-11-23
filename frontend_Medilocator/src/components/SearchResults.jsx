import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import MedicineCard from "./medicine_card";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/products/search?name=${query}`);
        setResults(res.data);
      } catch (err) {
        console.log("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Search Results for: <b>{query}</b></h4>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <div className="row">
          {results.map((med) => (
            <div className="col-md-3 mb-4" key={med._id}>
              <MedicineCard medicine={med} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
