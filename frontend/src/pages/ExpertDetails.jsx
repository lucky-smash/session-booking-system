import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { socket } from "../socket.js";

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
      const res = await fetch(`http://localhost:5000/api/experts/${id}`);
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
        No expert found
      </div>
    );

  const availability = expert.availability || [];
  const initials = (expert.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalSlots = availability.reduce((s, d) => s + (d.slots?.length || 0), 0);
  const openSlots = availability.reduce(
    (s, d) => s + (d.slots?.filter((sl) => !sl.isBooked).length || 0),
    0
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* ── Profile card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Decorative gradient bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg ${avatarColorClass(expert.name)}`}
            >
              {initials}
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {expert.name || "Expert"}
              </h1>
              <p className="mt-0.5 text-sm font-medium text-purple-600">
                {expert.category || "-"}
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <Stars count={expert.rating} />
                <span className="text-xs text-gray-500">
                  {expert.experience ?? "-"} yrs exp
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
          >
            ← Back
          </button>
        </div>

        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-purple-50 p-3 text-center">
            <div className="text-lg font-bold text-purple-700">{expert.experience}</div>
            <div className="text-xs text-purple-600">Years Exp</div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-center">
            <div className="text-lg font-bold text-amber-700">{expert.rating}</div>
            <div className="text-xs text-amber-600">Rating</div>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-center">
            <div className="text-lg font-bold text-emerald-700">{openSlots}/{totalSlots}</div>
            <div className="text-xs text-emerald-600">Slots Open</div>
          </div>
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">📅 Available Slots</h2>

        {availability.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
            No availability set
          </div>
        ) : (
          <div className="space-y-4">
            {availability.map((day) => {
              const open = (day.slots || []).filter((s) => !s.isBooked).length;
              return (
                <div
                  key={day.date}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-900">{day.date}</div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                      {open} available
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(day.slots || []).map((slot) => {
                      const booked = Boolean(slot.isBooked);
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={booked}
                          onClick={() =>
                            navigate(
                              `/book/${expert._id}?date=${day.date}&timeSlot=${encodeURIComponent(slot.time)}`
                            )
                          }
                          className={[
                            "rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
                            booked
                              ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 line-through"
                              : "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-sm shadow-purple-300/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-300/40",
                          ].join(" ")}
                          title={booked ? "Already booked" : "Click to book"}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}