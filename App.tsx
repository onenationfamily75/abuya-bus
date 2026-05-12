import { useMemo, useState } from "react";
import {
  heroImageSources,
  routes,
  type Route,
  WHATSAPP_NUMBER,
} from "./data/routes";
import BookingModal from "./components/BookingModal";
import ImageWithFallback from "./components/ImageWithFallback";

export default function App() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Combine all origins AND destinations so every city in every route appears in both dropdowns
  const allCities = useMemo(() => {
    const set = new Set<string>();
    routes.forEach((r) => {
      set.add(r.from);
      set.add(r.to);
      if (r.via) {
        r.via.split("/").forEach((v) => set.add(v.trim()));
      }
    });
    return Array.from(set).sort();
  }, []);
  const allFroms = allCities;
  const allTos = allCities;

  const filtered = useMemo(() => {
    if (!submitted) return routes;
    const matchesCity = (route: Route, city: string) => {
      const c = city.toLowerCase();
      if (route.from.toLowerCase() === c) return true;
      if (route.to.toLowerCase() === c) return true;
      if (route.via && route.via.toLowerCase().includes(c)) return true;
      return false;
    };
    return routes.filter(
      (r) =>
        (!searchFrom || matchesCity(r, searchFrom)) &&
        (!searchTo || matchesCity(r, searchTo))
    );
  }, [searchFrom, searchTo, submitted]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    document
      .getElementById("routes")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearSearch = () => {
    setSearchFrom("");
    setSearchTo("");
    setSearchDate("");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
              A
            </div>
            <div>
              <div className="font-black text-lg leading-none tracking-tight">
                ABUYA <span className="text-red-600">BUS</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Modern Coach Services
              </div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a href="#routes" className="hover:text-red-600">Routes</a>
            <a href="#fleet" className="hover:text-red-600">Our Fleet</a>
            <a href="#why" className="hover:text-red-600">Why Us</a>
            <a href="#contact" className="hover:text-red-600">Contact</a>
          </nav>
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="mailto:abuyamodernb@gmail.com"
              className="hidden lg:inline-flex items-center gap-2 text-slate-700 hover:text-red-600 px-3 py-2 rounded-lg font-semibold text-sm"
            >
              ✉️ abuyamodernb@gmail.com
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
              </svg>
              0756 908 988
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            sources={heroImageSources}
            alt="Abuya Bus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              🇰🇪 Kenya's Northern Frontier Specialists
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Travel in Style with{" "}
              <span className="text-amber-400">Abuya Bus</span>
            </h1>
            <p className="mt-4 text-lg text-slate-200 max-w-xl">
              Reliable, comfortable, and modern coach services connecting Nairobi
              to Moyale, Marsabit, Isiolo, Mwingi, Bura, Hola, Busia and beyond.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                <span>⭐</span> 4.8 / 5 rating
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                <span>🚌</span> 18+ daily routes
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                <span>🛡️</span> Licensed & Insured
              </div>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={onSearch}
            className="relative mt-10 lg:mt-14 bg-white rounded-2xl shadow-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            <div className="md:col-span-3">
              <label className="text-xs font-bold uppercase text-slate-600">From</label>
              <select
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2.5 bg-white"
              >
                <option value="">Any origin</option>
                {allFroms.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-bold uppercase text-slate-600">To</label>
              <select
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2.5 bg-white"
              >
                <option value="">Any destination</option>
                {allTos.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-bold uppercase text-slate-600">Travel Date</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 focus:border-red-500 outline-none px-3 py-2.5"
              />
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg shadow"
              >
                🔍 Search Buses
              </button>
              {submitted && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-3 py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Routes */}
      <section id="routes" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black">
              {submitted ? "Search Results" : "Our Routes & Fares"}
            </h2>
            <p className="text-slate-600 mt-1">
              {submitted
                ? `${filtered.length} route${filtered.length === 1 ? "" : "s"} found`
                : "Choose your destination and book your seat instantly."}
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-red-600 font-semibold hover:underline"
          >
            Need help? Chat with us →
          </a>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <div className="text-5xl mb-3">🤔</div>
            <h3 className="font-bold text-lg">No routes match your search</h3>
            <p className="text-slate-500 text-sm mt-1">
              Try clearing the filters or contact us on WhatsApp.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg font-semibold"
            >
              Show all routes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <RouteCard key={r.id} route={r} onBook={() => setSelectedRoute(r)} />
            ))}
          </div>
        )}
      </section>

      {/* Fleet showcase */}
      <section id="fleet" className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black">Meet Our Modern Fleet</h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Powered by Scania, our buses are built for long-distance comfort,
              safety and reliability across Kenya's toughest routes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                img: "/images/abuya-hero.jpg",
                title: "Abuya Master Scania",
                desc: "Flagship Nairobi–Moyale luxury coach with VIP recliner seats.",
              },
              {
                img: "/images/bus-blue.jpg",
                title: "Abuya Modern Express",
                desc: "Premium long-distance coach with onboard entertainment.",
              },
              {
                img: "/images/bus-night.jpg",
                title: "Abuya Night Cruiser",
                desc: "Overnight services with reclining seats and LED comfort lighting.",
              },
              {
                img: "/images/bus-red.jpg",
                title: "Abuya Highway Master",
                desc: "Three-axle Scania for the toughest northern Kenya highways.",
              },
              {
                img: "/images/bus-brown.jpg",
                title: "Abuya Royal",
                desc: "Elegant gold-trimmed coach for premium travelers.",
              },
              {
                img: "/images/bus-mombasa.jpg",
                title: "Abuya Coastal Link",
                desc: "Connecting Mwingi, Bura, Hola and the eastern coast.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:shadow-xl transition"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{b.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black">Why Travel with Abuya?</h2>
          <p className="text-slate-600 mt-2">
            Six reasons thousands of travelers choose us every week.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              img: "/images/bus-red.jpg",
              icon: "🛡️",
              title: "Safety First",
              desc: "Trained drivers, regular maintenance and full insurance coverage.",
            },
            {
              img: "/images/bus-blue.jpg",
              icon: "💺",
              title: "VIP Comfort",
              desc: "Reclining seats, AC, USB charging and onboard refreshments.",
            },
            {
              img: "/images/bus-night.jpg",
              icon: "🕐",
              title: "Punctual Departures",
              desc: "We run on time — every day, every route, every season.",
            },
            {
              img: "/images/bus-brown.jpg",
              icon: "💰",
              title: "Best Fares",
              desc: "Honest, transparent pricing — no hidden booking charges.",
            },
            {
              img: "/images/bus-mombasa.jpg",
              icon: "📞",
              title: "24/7 Support",
              desc: "Talk to a real person any time, day or night, on WhatsApp.",
            },
            {
              img: "/images/abuya-hero.jpg",
              icon: "🌍",
              title: "Wide Network",
              desc: "From Nairobi to Moyale, we cover Kenya's most remote routes.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition"
            >
              <div className="h-40 overflow-hidden relative">
                <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 h-12 w-12 rounded-xl bg-white/95 flex items-center justify-center text-2xl shadow-md">
                  {f.icon}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-red-700 via-red-800 to-amber-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black">Book on WhatsApp Now</h2>
            <p className="mt-3 text-white/90">
              Our booking team is online 24/7 to confirm your seat, share M-Pesa
              payment details and answer any questions about your journey.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div>📞 <strong>Phone / WhatsApp:</strong>{" "}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="underline hover:text-amber-200">
                  0756 908 988
                </a>
              </div>
              <div>✉️ <strong>Email:</strong>{" "}
                <a href="mailto:abuyamodernb@gmail.com" className="underline hover:text-amber-200">
                  abuyamodernb@gmail.com
                </a>
              </div>
              <div>📍 <strong>Main Office:</strong> Eastleigh, Nairobi</div>
              <div>🕐 <strong>Hours:</strong> 24 hours, 7 days a week</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:abuyamodernb@gmail.com?subject=Booking%20Enquiry%20-%20Abuya%20Bus"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white font-semibold px-5 py-2.5 rounded-xl border border-white/30"
              >
                ✉️ Email Us
              </a>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello Abuya Bus, I'd like to make a booking."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
          <div className="rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
            <img src="/images/bus-night.jpg" alt="Abuya Bus" className="w-full h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-black">
                A
              </div>
              <div className="text-white font-black text-lg">ABUYA BUS</div>
            </div>
            <p>Kenya's trusted modern coach service connecting Nairobi to the northern frontier and beyond.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Contact</h4>
            <div className="space-y-1.5">
              <div>📞 <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-white">0756 908 988</a></div>
              <div>✉️ <a href="mailto:abuyamodernb@gmail.com" className="hover:text-white">abuyamodernb@gmail.com</a></div>
              <div>📍 Eastleigh, Nairobi</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Popular Routes</h4>
            <ul className="space-y-1.5">
              <li>Nairobi → Moyale</li>
              <li>Nairobi → Marsabit</li>
              <li>Nairobi → Isiolo</li>
              <li>Mwingi → Nairobi</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© {new Date().getFullYear()} Abuya Bus Modern. All rights reserved.</div>
          <div>Built with ❤️ for the people of Northern Kenya.</div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-30 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
        </svg>
      </a>

      <BookingModal route={selectedRoute} onClose={() => setSelectedRoute(null)} />
    </div>
  );
}

function RouteCard({ route, onBook }: { route: Route; onBook: () => void }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageWithFallback
          sources={route.imageSources}
          alt={`${route.from} to ${route.to}`}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
          ⏱ {route.duration}
        </div>
        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          KSh {route.price.toLocaleString()}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 text-lg font-black">
            <span>{route.from}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>{route.to}</span>
          </div>
          {route.via && (
            <div className="text-xs opacity-90 mt-0.5">via {route.via}</div>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>🕒 {route.departure}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-200">
          <div>
            <div className="text-xs text-slate-500">Starting from</div>
            <div className="text-xl font-black text-red-600">
              KSh {route.price.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onBook}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-sm"
          >
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
}
