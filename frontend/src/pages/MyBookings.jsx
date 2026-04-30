import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../api";

/* ── Status badge ── */
function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();

  const cls = useMemo(() => {
    if (s === "confirmed") return "border-blue-200 bg-blue-50 text-blue-700";
    if (s === "completed") return "border-green-200 bg-green-50 text-green-700";
    if (s === "cancelled") return "border-red-200 bg-red-50 text-red-700";
    return "border-amber-200 bg-amber-50 text-amber-700"; // pending
  }, [s]);

  const icon = useMemo(() => {
    if (s === "confirmed") return "✓";
    if (s === "completed") return "✅";
    if (s === "cancelled") return "✕";
    return "⏳";
  }, [s]);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold capitalize ${cls}`}
    >
      {icon} {s}
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
    <div className="mx-auto max-w-3xl space-y-5">
      {/* ── Search card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Decorative gradient bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400" />

        <h1 className="text-xl font-bold tracking-tight text-gray-900">📋 My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email to view your bookings.
        </p>

        <form onSubmit={onSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
            required
          />
          <button
            disabled={loading}
            className={[
              "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold shadow-sm transition-all duration-200",
              loading
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-300/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-300/50",
            ].join(" ")}
          >
            {loading ? "Loading..." : "🔍 Search"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/5 rounded bg-gray-200" />
                  <div className="h-3 w-3/5 rounded bg-gray-200" />
                  <div className="h-3 w-1/4 rounded bg-gray-200" />
                </div>
                <div className="h-6 w-20 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center text-sm text-gray-500">
          No bookings found. Try searching with a different email.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const expertName = b.expertId?.name || b.expertName || b.expert?.name || "Expert Session";
            const expertCategory = b.expertId?.category || "";
            const initials = expertName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={b._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Mini avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      {initials}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-gray-900">{expertName}</div>
                      {expertCategory && (
                        <div className="mt-0.5 text-xs font-medium text-purple-600">{expertCategory}</div>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-medium">
                          📅 {b.date}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-medium">
                          🕐 {b.timeSlot || b.time}
                        </span>
                      </div>
                      <div className="mt-2 text-[0.65rem] text-gray-400">
                        ID: {b._id}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={b.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}