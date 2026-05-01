import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api.js";

/* ── helper: pick a badge based on rating / experience ── */
function getBadge(expert) {
  if (expert.rating >= 4.8) return { label: "Top Choice", color: "bg-purple-600" };
  if (expert.experience >= 10) return { label: "Celebrity", color: "bg-red-600" };
  if (expert.rating >= 4.5) return { label: "Popular", color: "bg-cyan-600" };
  if (expert.experience >= 5) return { label: "Rising Star", color: "bg-orange-600" };
  return null;
}

/* ── helper: render filled / empty stars ── */
function Stars({ count }) {
  const full = Math.round(count);
  return (
    <span className="flex gap-px text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "text-amber-400" : "text-gray-300"}>★</span>
      ))}
    </span>
  );
}

/* ── helper: count available (unbooked) slots ── */
function availableSlots(expert) {
  if (!expert.availability?.length) return 0;
  return expert.availability.reduce(
    (sum, day) => sum + day.slots.filter((s) => !s.isBooked).length,
    0
  );
}

/* ── helper: generate a consistent avatar color from name ── */
const AVATAR_COLORS = [
  "bg-purple-600", "bg-cyan-600", "bg-red-600", "bg-orange-600",
  "bg-emerald-600", "bg-blue-600", "bg-fuchsia-600", "bg-yellow-600",
];
function avatarColorClass(name) {
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ── category options ── */
const CATEGORIES = [
  "All", "Fitness", "Yoga", "Zumba", "CrossFit", "Pilates",
  "Swimming", "Cycling", "Aerobics", "Boxing", "Meditation",
];

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page,
        limit: 8,
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await fetch(`${API_BASE}/api/experts?${params}`);
      const data = await res.json();
      setExperts(data.experts || data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (e) {
      setError("Failed to load experts");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategory = (val) => {
    setCategory(val);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  const hasFilters = search || category;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ════════════════════════════════════════
          SEARCH & FILTER BAR (pinned top)
          ════════════════════════════════════════ */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">🔍 Find an Expert</h1>
            <p className="text-xs text-gray-500">
              {total > 0 ? `${total} expert${total > 1 ? "s" : ""} available` : "Search by name or filter by category"}
            </p>
          </div>

          {/* Search + filter + bookings */}
          <div className="flex flex-1 items-center gap-2 sm:max-w-lg">
            {/* Search input */}
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search expert name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
              />
              {search && (
                <button onClick={() => handleSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => handleCategory(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 sm:w-40"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat === "All" ? "" : cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            <Link
              to="/my-bookings"
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-300/40 transition hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex"
            >
              📋 Bookings
            </Link>
          </div>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700">
                "{search}"
                <button onClick={() => handleSearch("")} className="text-purple-400 hover:text-purple-600">✕</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-semibold text-cyan-700">
                {category}
                <button onClick={() => handleCategory("")} className="text-cyan-400 hover:text-cyan-600">✕</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 transition hover:text-gray-700">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          CONTENT (fills remaining height)
          ════════════════════════════════════════ */}
      <div className="mt-4 flex-1 overflow-auto">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <div className="h-3 w-3/5 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-3 w-2/5 animate-pulse rounded-md bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-12 text-center font-semibold text-red-600">
            {error}
          </div>
        ) : experts.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">🔍</div>
              <p className="mt-3 text-sm font-medium text-gray-600">No experts found</p>
              <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4 rounded-lg bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-200">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            {/* Expert cards grid */}
            <div className="grid flex-1 grid-cols-1 content-start gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {experts.map((ex) => {
                const badge = getBadge(ex);
                const slots = availableSlots(ex);
                const initials = ex.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div
                    key={ex._id}
                    className="relative flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
                  >
                    {badge && (
                      <span className={`absolute -top-px left-3 rounded-b-lg px-2 py-px text-[0.6rem] font-bold text-white shadow-sm ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}

                    <div className="flex items-start gap-2.5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${avatarColorClass(ex.name)}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">{ex.name}</h3>
                        <p className="text-[0.68rem] text-gray-500">
                          EXP: <span className="font-semibold text-gray-800">{ex.experience} Yrs</span>
                        </p>
                        <p className="text-[0.68rem] font-medium text-purple-600">{ex.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Stars count={ex.rating} />
                      <span className="rounded-full bg-emerald-50 px-2 py-px text-[0.6rem] font-semibold text-emerald-600">
                        {slots > 0 ? `${slots} slot${slots > 1 ? "s" : ""} open` : "Fully booked"}
                      </span>
                    </div>

                    <Link
                      to={`/experts/${ex._id}`}
                      className="mt-auto flex items-center justify-center gap-1 rounded-xl border border-purple-200 bg-purple-50 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                    >
                      👁 View
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="shrink-0 flex items-center justify-center gap-2 py-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={[
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition",
                      p === page
                        ? "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-300/40"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}