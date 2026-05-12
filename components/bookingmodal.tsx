import { useEffect, useMemo, useState } from "react";
import type { Route } from "../data/routes";
import { WHATSAPP_NUMBER } from "../data/routes";
import ImageWithFallback from "./ImageWithFallback";

type Props = {
  route: Route | null;
  onClose: () => void;
};

type Passenger = {
  name: string;
  idNumber: string;
  phone: string;
  gender: string;
};

const VIP_SEATS = Array.from({ length: 10 }, (_, i) => `V${i + 1}`);
const NORMAL_SEATS = Array.from({ length: 36 }, (_, i) => `N${i + 1}`);

// Pre-occupied (random for demo)
const OCCUPIED = new Set(["V3", "V7", "N5", "N12", "N18", "N25", "N30"]);

const VIP_SURCHARGE = 500;

export default function BookingModal({ route, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [passengerCount, setPassengerCount] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [departure, setDeparture] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", idNumber: "", phone: "", gender: "Male" },
  ]);

  useEffect(() => {
    if (route) {
      setStep(1);
      setPassengerCount(1);
      setSelectedSeats([]);
      setPassengers([{ name: "", idNumber: "", phone: "", gender: "Male" }]);
      setTravelDate("");
      const firstDep = route.departure.split("•")[0]?.trim() ?? "";
      setDeparture(firstDep);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [route]);

  const total = useMemo(() => {
    if (!route) return 0;
    const vipCount = selectedSeats.filter((s) => s.startsWith("V")).length;
    const normalCount = selectedSeats.filter((s) => s.startsWith("N")).length;
    return (
      vipCount * (route.price + VIP_SURCHARGE) + normalCount * route.price
    );
  }, [route, selectedSeats]);

  if (!route) return null;

  const handlePassengerCountChange = (n: number) => {
    setPassengerCount(n);
    setSelectedSeats((prev) => prev.slice(0, n));
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < n)
        next.push({ name: "", idNumber: "", phone: "", gender: "Male" });
      return next.slice(0, n);
    });
  };

  const toggleSeat = (seat: string) => {
    if (OCCUPIED.has(seat)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      if (prev.length >= passengerCount) {
        // replace the first one
        return [...prev.slice(1), seat];
      }
      return [...prev, seat];
    });
  };

  const updatePassenger = (idx: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const canProceedFromStep1 = travelDate && departure;
  const canProceedFromStep2 = selectedSeats.length === passengerCount;
  const canSubmit =
    canProceedFromStep2 &&
    passengers.every((p) => p.name.trim() && p.phone.trim() && p.idNumber.trim());

  const sendToWhatsApp = () => {
    const lines: string[] = [];
    lines.push(`*🚌 ABUYA BUS - NEW BOOKING*`);
    lines.push("");
    lines.push(`*Route:* ${route.from} → ${route.to}${route.via ? ` (via ${route.via})` : ""}`);
    lines.push(`*Date:* ${travelDate}`);
    lines.push(`*Departure:* ${departure}`);
    lines.push(`*Duration:* ${route.duration}`);
    lines.push("");
    lines.push(`*Seats Selected:* ${selectedSeats.join(", ")}`);
    lines.push(`*Passengers:* ${passengerCount}`);
    lines.push("");
    lines.push(`*Passenger Details:*`);
    passengers.forEach((p, i) => {
      const seat = selectedSeats[i] ?? "-";
      const cls = seat.startsWith("V") ? "VIP" : "Normal";
      lines.push(
        `${i + 1}. ${p.name} | ${p.gender} | ID: ${p.idNumber} | Tel: ${p.phone} | Seat ${seat} (${cls})`
      );
    });
    lines.push("");
    lines.push(`*Total Fare:* KSh ${total.toLocaleString()}`);
    lines.push("");
    lines.push(`Please confirm my booking. Thank you!`);

    const msg = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, "_blank");
  };

  const SeatButton = ({ seat, type }: { seat: string; type: "vip" | "normal" }) => {
    const occupied = OCCUPIED.has(seat);
    const selected = selectedSeats.includes(seat);
    const base =
      "h-10 w-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all border-2";
    let cls = "";
    if (occupied) {
      cls = "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed line-through";
    } else if (selected) {
      cls = "bg-emerald-500 text-white border-emerald-600 shadow-md scale-105";
    } else if (type === "vip") {
      cls = "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 hover:border-amber-500";
    } else {
      cls = "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 hover:border-sky-400";
    }
    return (
      <button
        type="button"
        onClick={() => toggleSeat(seat)}
        disabled={occupied}
        className={`${base} ${cls}`}
        title={occupied ? "Occupied" : selected ? "Selected" : "Available"}
      >
        {seat.replace(/^[VN]/, "")}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white p-5 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-90">Abuya Bus Booking</div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {route.from} <span className="opacity-70">→</span> {route.to}
            </h2>
            {route.via && <p className="text-xs opacity-90 mt-1">via {route.via}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 hover:bg-white/30 h-9 w-9 flex items-center justify-center text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b">
          {["Trip", "Seats", "Passengers", "Confirm"].map((label, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                      ? "bg-red-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? "✓" : num}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    active ? "font-semibold text-slate-900" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
                {i < 3 && <div className="flex-1 h-px bg-slate-200" />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-xl overflow-hidden border">
                <ImageWithFallback
                  sources={route.imageSources}
                  alt={route.to}
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase">Travel Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase">Departure Time</label>
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2.5 bg-white"
                  >
                    {route.departure.split("•").map((t) => (
                      <option key={t} value={t.trim()}>
                        {t.trim()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase">
                    Number of Passengers
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => handlePassengerCountChange(n)}
                        className={`h-10 w-10 rounded-lg border-2 font-semibold ${
                          passengerCount === n
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-slate-700 border-slate-200 hover:border-red-300"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                <strong>Fare:</strong> KSh {route.price.toLocaleString()} per Normal seat • KSh{" "}
                {(route.price + VIP_SURCHARGE).toLocaleString()} per VIP seat
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">
                  Select <strong>{passengerCount}</strong> seat
                  {passengerCount > 1 ? "s" : ""} ({selectedSeats.length}/{passengerCount} selected)
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 text-xs mb-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded bg-amber-50 border-2 border-amber-300"></span> VIP Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded bg-sky-50 border-2 border-sky-200"></span> Normal Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded bg-emerald-500"></span> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded bg-slate-200"></span> Occupied
                </span>
              </div>

              {/* Bus layout */}
              <div className="mx-auto max-w-md border-2 border-slate-300 rounded-3xl p-4 bg-gradient-to-b from-slate-50 to-white">
                {/* Driver */}
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-dashed">
                  <div className="text-2xl">🚪</div>
                  <div className="text-2xl">🎯</div>
                </div>

                {/* VIP Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 font-bold text-sm">★ VIP SECTION</span>
                    <span className="text-xs text-slate-500">(+KSh {VIP_SURCHARGE})</span>
                    <div className="flex-1 h-px bg-amber-200" />
                  </div>
                  <div className="grid grid-cols-5 gap-2 justify-items-center">
                    {VIP_SEATS.slice(0, 5).map((s) => (
                      <SeatButton key={s} seat={s} type="vip" />
                    ))}
                    {VIP_SEATS.slice(5, 10).map((s) => (
                      <SeatButton key={s} seat={s} type="vip" />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-300" />
                  <span className="text-xs text-slate-400 uppercase">Aisle</span>
                  <div className="flex-1 h-px bg-slate-300" />
                </div>

                {/* Normal Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sky-700 font-bold text-sm">NORMAL SECTION</span>
                    <div className="flex-1 h-px bg-sky-200" />
                  </div>
                  <div className="grid grid-cols-5 gap-2 justify-items-center">
                    {NORMAL_SEATS.map((s) => (
                      <SeatButton key={s} seat={s} type="normal" />
                    ))}
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
                  <strong>Selected:</strong> {selectedSeats.join(", ")} •{" "}
                  <strong>Subtotal:</strong> KSh {total.toLocaleString()}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Enter details for each passenger. All fields are required.
              </p>
              {passengers.map((p, idx) => {
                const seat = selectedSeats[idx];
                const cls = seat?.startsWith("V") ? "VIP" : "Normal";
                return (
                  <div
                    key={idx}
                    className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">
                        Passenger {idx + 1}
                      </h4>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          cls === "VIP"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        Seat {seat} • {cls}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Full Name"
                        value={p.name}
                        onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                        className="rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2 bg-white"
                      />
                      <input
                        placeholder="ID / Passport No."
                        value={p.idNumber}
                        onChange={(e) => updatePassenger(idx, "idNumber", e.target.value)}
                        className="rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2 bg-white"
                      />
                      <input
                        placeholder="Phone Number"
                        value={p.phone}
                        onChange={(e) => updatePassenger(idx, "phone", e.target.value)}
                        className="rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2 bg-white"
                      />
                      <select
                        value={p.gender}
                        onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                        className="rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2 bg-white"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800">Booking Summary</h3>
              <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                <ImageWithFallback
                  sources={route.imageSources}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 space-y-2 text-sm">
                  <Row label="Route" value={`${route.from} → ${route.to}`} />
                  {route.via && <Row label="Via" value={route.via} />}
                  <Row label="Date" value={travelDate} />
                  <Row label="Departure" value={departure} />
                  <Row label="Duration" value={route.duration} />
                  <Row label="Seats" value={selectedSeats.join(", ")} />
                  <Row label="Passengers" value={String(passengerCount)} />
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 flex items-center justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold">KSh {total.toLocaleString()}</span>
              </div>
              <div className="rounded-xl bg-green-50 border-2 border-green-200 p-4 text-sm text-green-900">
                <p className="font-semibold mb-1">📱 Confirm via WhatsApp</p>
                <p>
                  Click below to send your booking details to <strong>0756 908 988</strong>{" "}
                  for instant confirmation and payment instructions.
                </p>
                <p className="mt-2 text-xs text-green-800">
                  Prefer email? Reach us at{" "}
                  <a href="mailto:abuyamodernb@gmail.com" className="underline font-semibold">
                    abuyamodernb@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4 flex items-center justify-between gap-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
          >
            {step > 1 ? "← Back" : "Cancel"}
          </button>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">Total</div>
            <div className="font-bold text-slate-900">
              KSh {total.toLocaleString()}
            </div>
          </div>

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedFromStep1) ||
                (step === 2 && !canProceedFromStep2)
              }
              className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold"
            >
              Continue →
            </button>
          )}
          {step === 4 && (
            <button
              onClick={sendToWhatsApp}
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.39.62-1.005 3.668 3.594-.947zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Confirm on WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-dashed border-slate-200 py-1.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
