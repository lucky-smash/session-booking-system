import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";

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
            // payload: { expertId, date, time }
            if (payload?.expertId === id) {
                fetchExpert(); // refetch and UI updates
            }
        };

        socket.on("slotBooked", handler);

        return () => {
            socket.off("slotBooked", handler);
        };
    }, [id]);


    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!expert) return <div className="text-sm text-gray-600">No expert found</div>;

    const availability = expert.availability || [];

    return (
        <div className="space-y-6">
            {/* Header card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {expert.name || "Expert"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {expert.category || "-"} • {expert.experience ?? "-"} yrs • ⭐{" "}
                            {expert.rating ?? "-"}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Available Slots</h2>

                {availability.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
                        No availability set
                    </div>
                ) : (
                    <div className="space-y-4">
                        {availability.map((day) => (
                            <div
                                key={day.date}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {day.date}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {(day.slots || []).filter((s) => !s.isBooked).length} available
                                    </div>
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
                                                        `/book/${expert._id}?date=${day.date}&timeSlot=${encodeURIComponent(
                                                            slot.time
                                                        )}`
                                                    )
                                                }
                                                className={[
                                                    "rounded-full px-3 py-2 text-xs font-medium transition",
                                                    booked
                                                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                        : "bg-gray-900 text-white hover:bg-gray-800",
                                                ].join(" ")}
                                                title={booked ? "Booked" : "Click to book"}
                                            >
                                                {slot.time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}