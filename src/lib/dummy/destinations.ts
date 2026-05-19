import type { Destination } from "@/types/destination";

export const dummyDestinations: Destination[] = [
  {
    id: "dest-bali",
    name: "Bali",
    slug: "bali",
    country: "Indonesia",
    continent: "ASIA",
    description:
      "The Island of Gods — a harmonious blend of lush rice terraces, ancient temples, vibrant arts, and world-class surf beaches.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "April",
    bestTimeTo: "October",
    visaType: "VISA_ON_ARRIVAL",
    currency: "IDR",
    language: "Bahasa Indonesia",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-maldives",
    name: "Maldives",
    slug: "maldives",
    country: "Maldives",
    continent: "ASIA",
    description:
      "A tropical paradise of crystal-clear lagoons, pristine coral reefs, and iconic overwater bungalows set across 1,200 islands.",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "November",
    bestTimeTo: "April",
    visaType: "VISA_ON_ARRIVAL",
    currency: "MVR",
    language: "Dhivehi",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-kerala",
    name: "Kerala",
    slug: "kerala",
    country: "India",
    continent: "ASIA",
    description:
      "God's Own Country — serene backwaters, misty hill stations, aromatic spice plantations, and pristine beaches along the Malabar Coast.",
    imageUrl:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "September",
    bestTimeTo: "March",
    visaType: "VISA_FREE",
    currency: "INR",
    language: "Malayalam",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-switzerland",
    name: "Switzerland",
    slug: "switzerland",
    country: "Switzerland",
    continent: "EUROPE",
    description:
      "A land of majestic Alpine peaks, pristine lakes, charming villages, and world-renowned ski resorts that define luxury travel in Europe.",
    imageUrl:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "June",
    bestTimeTo: "September",
    visaType: "VISA_REQUIRED",
    currency: "CHF",
    language: "German, French, Italian",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-santorini",
    name: "Santorini",
    slug: "santorini",
    country: "Greece",
    continent: "EUROPE",
    description:
      "The crown jewel of the Cyclades — iconic blue-domed churches, volcanic caldera views, and legendary sunsets over the Aegean Sea.",
    imageUrl:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "April",
    bestTimeTo: "October",
    visaType: "VISA_REQUIRED",
    currency: "EUR",
    language: "Greek",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-dubai",
    name: "Dubai",
    slug: "dubai",
    country: "United Arab Emirates",
    continent: "MIDDLE_EAST",
    description:
      "Where futuristic skylines meet golden desert dunes — Dubai is the ultimate destination for luxury shopping, world records, and opulent experiences.",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "November",
    bestTimeTo: "March",
    visaType: "VISA_ON_ARRIVAL",
    currency: "AED",
    language: "Arabic",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-rajasthan",
    name: "Rajasthan",
    slug: "rajasthan",
    country: "India",
    continent: "ASIA",
    description:
      "The Land of Kings — magnificent forts, opulent palaces, vibrant bazaars, and vast Thar Desert landscapes that tell stories of royal grandeur.",
    imageUrl:
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "October",
    bestTimeTo: "March",
    visaType: "VISA_FREE",
    currency: "INR",
    language: "Hindi, Rajasthani",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "dest-singapore",
    name: "Singapore",
    slug: "singapore",
    country: "Singapore",
    continent: "ASIA",
    description:
      "Asia's dazzling city-state — a seamless fusion of futuristic architecture, world-class cuisine, lush gardens, and family-friendly attractions.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
    bestTimeFrom: "February",
    bestTimeTo: "April",
    visaType: "VISA_FREE",
    currency: "SGD",
    language: "English, Mandarin, Malay, Tamil",
    createdAt: new Date("2024-01-01"),
  },
];
