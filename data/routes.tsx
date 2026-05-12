export type Route = {
  id: string;
  from: string;
  to: string;
  via?: string;
  price: number;
  duration: string;
  departure: string;
  imageSources: string[];
};

export const abuyaExactPhotoSlots: string[][] = [
  ["/images/abuya-user-01-city-front.jpg", "/images/bus-blue.jpg"],
  ["/images/abuya-user-02-night-city.jpg", "/images/bus-night.jpg"],
  ["/images/abuya-user-03-red-highway-rear.jpg", "/images/bus-red.jpg"],
  ["/images/abuya-user-04-red-side-station.jpg", "/images/bus-red.jpg"],
  ["/images/abuya-user-05-blue-parked.jpg", "/images/bus-blue.jpg"],
  ["/images/abuya-user-06-brown-front-open-door.jpg", "/images/bus-brown.jpg"],
  ["/images/abuya-user-07-white-highway-front.jpg", "/images/abuya-hero.jpg"],
  ["/images/abuya-user-08-brown-rear-road.jpg", "/images/bus-brown.jpg"],
  ["/images/abuya-user-09-red-dusk-city.jpg", "/images/bus-red.jpg"],
  ["/images/abuya-user-10-white-close-front.jpg", "/images/abuya-hero.jpg"],
];

export const heroImageSources = abuyaExactPhotoSlots[0];

const photo = (index: number) => abuyaExactPhotoSlots[index % abuyaExactPhotoSlots.length];

export const routes: Route[] = [
  {
    id: "r1",
    from: "Nairobi",
    to: "Isiolo",
    via: "Archers Post",
    price: 1500,
    duration: "5h 30m",
    departure: "07:00 AM • 08:30 PM",
    imageSources: photo(0),
  },
  {
    id: "r2",
    from: "Nairobi",
    to: "Laisamis",
    via: "Sereolipi / Merille",
    price: 2000,
    duration: "9h 00m",
    departure: "06:30 AM • 07:30 PM",
    imageSources: photo(1),
  },
  {
    id: "r3",
    from: "Nairobi",
    to: "Marsabit",
    via: "Logologi / Bubisa",
    price: 2500,
    duration: "11h 30m",
    departure: "06:00 AM • 06:30 PM",
    imageSources: photo(2),
  },
  {
    id: "r4",
    from: "Nairobi",
    to: "Moyale",
    via: "Turbi / Walda / Sololo",
    price: 3000,
    duration: "16h 00m",
    departure: "05:30 AM • 05:30 PM",
    imageSources: photo(3),
  },
  {
    id: "r5",
    from: "Nanyuki",
    to: "Moyale",
    price: 2500,
    duration: "13h 00m",
    departure: "08:00 AM",
    imageSources: photo(4),
  },
  {
    id: "r6",
    from: "Isiolo",
    to: "Moyale",
    price: 2000,
    duration: "10h 00m",
    departure: "10:00 AM • 09:00 PM",
    imageSources: photo(5),
  },
  {
    id: "r7",
    from: "Nairobi",
    to: "Bura",
    price: 1800,
    duration: "8h 30m",
    departure: "07:00 PM",
    imageSources: photo(6),
  },
  {
    id: "r8",
    from: "Nairobi",
    to: "Hola",
    price: 2000,
    duration: "10h 00m",
    departure: "06:30 PM",
    imageSources: photo(7),
  },
  {
    id: "r9",
    from: "Marsabit",
    to: "Moyale",
    price: 1200,
    duration: "5h 00m",
    departure: "11:00 AM • 11:00 PM",
    imageSources: photo(8),
  },
  {
    id: "r10",
    from: "Bura",
    to: "Nairobi",
    price: 1800,
    duration: "8h 30m",
    departure: "07:00 PM",
    imageSources: photo(9),
  },
  {
    id: "r11",
    from: "Mwingi",
    to: "Nairobi",
    price: 1200,
    duration: "4h 00m",
    departure: "07:00 AM • 02:00 PM",
    imageSources: photo(0),
  },
  {
    id: "r12",
    from: "Mwingi",
    to: "Bangal",
    price: 800,
    duration: "3h 00m",
    departure: "09:00 AM",
    imageSources: photo(1),
  },
  {
    id: "r13",
    from: "Mwingi",
    to: "Madogo",
    price: 800,
    duration: "3h 00m",
    departure: "09:30 AM",
    imageSources: photo(2),
  },
  {
    id: "r14",
    from: "Mwingi",
    to: "Bura",
    price: 1400,
    duration: "5h 00m",
    departure: "10:00 AM",
    imageSources: photo(3),
  },
  {
    id: "r15",
    from: "Mwingi",
    to: "Hola",
    price: 1400,
    duration: "6h 00m",
    departure: "10:30 AM",
    imageSources: photo(4),
  },
  {
    id: "r16",
    from: "Nairobi",
    to: "Busia",
    price: 2000,
    duration: "9h 00m",
    departure: "08:00 PM",
    imageSources: photo(5),
  },
  {
    id: "r17",
    from: "Moyale",
    to: "Nairobi",
    price: 3000,
    duration: "16h 00m",
    departure: "05:30 AM • 05:30 PM",
    imageSources: photo(6),
  },
  {
    id: "r18",
    from: "Marsabit",
    to: "Nairobi",
    price: 2500,
    duration: "11h 30m",
    departure: "06:00 PM",
    imageSources: photo(7),
  },
];

export const WHATSAPP_NUMBER = "254756908988";
