import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { socket } from "../socket.js";
import { API_BASE } from "../api.js";

/* ── helper: avatar color from name ── */
const AVATAR_COLORS = [
  "bg-purple-600", "bg-cyan-600", "bg-red-600", "bg-orange-600",
  "bg-emerald-600", "bg-blue-600", "bg-fuchsia-600", "bg-yellow-600",
];
function avatarColorClass(name = "") {
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ── helper: stars ── */
function Stars({ count }) {
  const full = Math.round(count);
  return (
    <span className="flex gap-px text-base">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "text-amber-400" : "text-gray-300"}>★</span>
      ))}
    </span>
  );
}

export default function ExpertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpert = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/api/experts/${id}`);
      const data = await res.json();
      setExpert(data.expert || data);
    } catch (e) {
      setError("Failed to load expert details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handler = (payload) => {
      if (payload?.expertId === id) {
        fetchExpert();
      }
    };
    socket.on("slotBooked", handler);
    return () => socket.off("slotBooked", handler);
  }, [id]);

  /* ── Loading skeleton ── */
  if (loading)
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 rounded bg-gray-200" />
              <div className="h-3 w-3/5 rounded bg-gray-200" />
            </div>
          </div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
            <div className="h-3 w-1/3 rounded bg-gray-200" />
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-9 w-20 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-12 text-center font-semibold text-red-600">
        {error}
      </div>
    );

  if (!expert)
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center text-sm text-gray-500">
        Expert not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* ── Profile card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${avatarColorClass(expert.name)}`}
          >
            {expert.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h1 className="truncate text-2xl font-bold text-gray-900">{expert.name}</h1>
              <button
                onClick={() => navigate(-1)}
                className="hidden items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:flex"
              >
                ← Back
              </button>
            </div>

            <p className="mt-1 text-purple-600 font-medium">{expert.category}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">Experience</span>
                <span className="text-sm font-bold text-gray-700">{expert.experience} Years</span>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">Rating</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-700">{expert.rating}</span>
                  <Stars count={expert.rating} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Available Slots</h2>
        {expert.availability?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-8 text-center text-sm text-gray-500">
            No slots listed for this expert.
          </div>
        ) : (
          expert.availability.map((day) => (
            <div key={day.date} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gray-50/50 border-b border-gray-100 px-5 py-3">
                <h3 className="text-sm font-bold text-gray-700">📅 {day.date}</h3>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2.5">
                  {day.slots.map((slot, idx) => (
                    <div key={idx} className="relative">
                      {slot.isBooked ? (
                        <div className="cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-300">
                          {slot.time}
                        </div>
                      ) : (
                        <Link
                          to={`/book/${expert._id}?date=${day.date}&time=${slot.time}`}
                          className="inline-block rounded-xl border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-200"
                        >
                          {slot.time}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}