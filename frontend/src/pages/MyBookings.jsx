import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../api";

function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();

  const cls = useMemo(() => {
    if (s === "confirmed") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "completed") return "bg-green-50 text-green-700 border-green-200";
    if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200"; // pending
  }, [s]);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        cls,
      ].join(" ")}
    >
      {s}
    </span>
  );
}

export default function MyBookings() {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("booking_email") || "";
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (targetEmail) => {
    const e = (targetEmail || "").trim();
    if (!e) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/bookings?email=${encodeURIComponent(e)}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load bookings");

      setBookings(data.bookings || data || []);
    } catch (err) {
      setBookings([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchBookings(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const e2 = email.trim();
    localStorage.setItem("booking_email", e2);
    fetchBookings(e2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your email to view your bookings.
        </p>

        <form onSubmit={onSearch} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          />
          <button
            disabled={loading}
            className={[
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition",
              loading
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-gray-900 text-white hover:bg-gray-800",
            ].join(" ")}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error ? (
          <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-gray-600">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-sm">
            No bookings found.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {b.expertName || b.expert?.name || "Expert Session"}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {b.date} • {b.timeSlot || b.time}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Booking ID: {b._id}
                  </div>
                </div>

                <StatusBadge status={b.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}