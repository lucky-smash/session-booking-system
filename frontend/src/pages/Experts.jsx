import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Experts() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("http://localhost:5000/api/experts?page=1&limit=10");
                const data = await res.json();

                // adjust if your API shape is different
                setExperts(data.experts || data || []);
            } catch (e) {
                setError("Failed to load experts");
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    if (loading) return <div>Loading experts...</div>;
    if (error) return <div>{error}</div>;

    return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Experts</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and book available slots
        </p>
      </div>

      <Link
        to="/my-bookings"
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
      >
        My bookings
      </Link>
    </div>

    {/* Content */}
    {experts.length === 0 ? (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
        No experts found
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {experts.map((ex) => (
          <div
            key={ex._id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  {ex.name}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {ex.category} • {ex.experience} yrs • ⭐ {ex.rating}
                </div>
              </div>

              <Link
                to={`/experts/${ex._id}`}
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}