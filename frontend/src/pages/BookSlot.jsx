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

            // console.log("sending booking:", { expertId: id, date, timeSlot, ...form });
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

    //   
    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Book Slot</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Confirm your details to book this session.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                    >
                        Back
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-xs font-medium text-gray-500">Date</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                            {date || "-"}
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-xs font-medium text-gray-500">Time</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                            {timeSlot || "-"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Name
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Phone
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="10-digit number"
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Notes <span className="text-gray-500">(optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Anything the expert should know..."
                            className="mt-1 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />
                    </div>

                    <button
                        disabled={loading || !date || !timeSlot}
                        className={[
                            "w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm transition",
                            loading || !date || !timeSlot
                                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                : "bg-gray-900 text-white hover:bg-gray-800",
                        ].join(" ")}
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>

                    {msg ? (
                        <div
                            className={[
                                "rounded-md p-3 text-sm",
                                msg.toLowerCase().includes("successful")
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700",
                            ].join(" ")}
                        >
                            {msg}
                        </div>
                    ) : null}

                    <p className="text-xs text-gray-500">
                        By confirming, you agree to reserve this time slot.
                    </p>
                </form>
            </div>
        </div>
    );
}