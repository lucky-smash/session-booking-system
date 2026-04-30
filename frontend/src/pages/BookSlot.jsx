import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

export default function BookSlot() {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const date = searchParams.get("date");
  const timeSlot = searchParams.get("timeSlot");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertId: expertId,
          date,
          timeSlot,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Booking failed");

      setMsg("Booking successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = msg.toLowerCase().includes("successful");

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* ── Header card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Decorative gradient bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">📅 Book Slot</h1>
            <p className="mt-1 text-sm text-gray-500">
              Confirm your details to book this session.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
          >
            ← Back
          </button>
        </div>

        {/* Slot info pills */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-purple-50 p-3.5">
            <div className="text-xs font-semibold text-purple-500">Date</div>
            <div className="mt-1 text-sm font-bold text-purple-800">{date || "-"}</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-3.5">
            <div className="text-xs font-semibold text-purple-500">Time</div>
            <div className="mt-1 text-sm font-bold text-purple-800">{timeSlot || "-"}</div>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="10-digit number"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Anything the expert should know..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading || !date || !timeSlot}
            className={[
              "w-full rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all duration-200",
              loading || !date || !timeSlot
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-300/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-300/50",
            ].join(" ")}
          >
            {loading ? "Booking..." : "✅ Confirm Booking"}
          </button>

          {/* Feedback message */}
          {msg && (
            <div
              className={[
                "rounded-xl p-4 text-sm font-medium",
                isSuccess
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700",
              ].join(" ")}
            >
              {isSuccess ? "🎉 " : "⚠️ "}{msg}
            </div>
          )}

          <p className="text-center text-xs text-gray-400">
            By confirming, you agree to reserve this time slot.
          </p>
        </form>
      </div>
    </div>
  );
}