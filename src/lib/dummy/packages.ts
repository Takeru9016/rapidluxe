import type { Package } from "@/types/package";

const CANCELLATION_POLICY = [
  { daysBeforeDeparture: 30, refundPercent: 90 },
  { daysBeforeDeparture: 15, refundPercent: 50 },
  { daysBeforeDeparture: 0, refundPercent: 0 },
];

export const dummyPackages: Package[] = [
  // ─── 1. Bali ─── isFeatured: true
  {
    id: "pkg-bali",
    title: "Bali Serenity Escape",
    slug: "bali-serenity-escape",
    description:
      "Immerse yourself in the spiritual heart of Bali — from sunrise yoga on rice terraces to sunset puja ceremonies at Tanah Lot, this carefully crafted escape balances wellness, culture, and pure indulgence.",
    destinationId: "dest-bali",
    durationNights: 7,
    pricePerPerson: 85000,
    minGroupSize: 1,
    maxGroupSize: 12,
    inclusions: [
      "7 nights accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Private temple tour",
      "Cooking class",
      "Ubud rice terrace sunrise walk",
    ],
    exclusions: [
      "International flights",
      "Visa on arrival fee (approx. ₹1,800)",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali — Ubud Welcome",
        description:
          "Arrive at Ngurah Rai International Airport. Private transfer to your villa in Ubud. Evening welcome dinner at a cliffside restaurant overlooking the Ayung River gorge.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Sacred Temples & Rice Terraces",
        description:
          "Sunrise walk through Tegalalang Rice Terraces. Visit Tirta Empul holy spring temple for a purification ritual. Afternoon at leisure in Ubud market.",
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Cooking Class & Tanah Lot Sunset",
        description:
          "Morning Balinese cooking class with a local family — learn to make satay lilit and black rice pudding. Afternoon drive to Tanah Lot for the iconic ocean temple sunset.",
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 4,
        title: "Mount Batur Sunrise Trek",
        description:
          "Pre-dawn departure for the Mount Batur volcano trek. Watch sunrise over the crater lake from 1,717m. Return for a well-earned afternoon spa session.",
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Seminyak Beach & Uluwatu",
        description:
          "Relax on Seminyak Beach in the morning. Afternoon drive to Uluwatu cliff temple. Kecak fire dance performance at sunset followed by seafood dinner at Jimbaran Bay.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Free Day — Beach or Spa",
        description:
          "Day at leisure. Optional: surfing lesson at Kuta Beach, snorkelling at Amed, or a full-day spa retreat at your villa. Your concierge will arrange anything you need.",
        meals: ["Breakfast"],
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Farewell breakfast. Check-out and transfer to Ngurah Rai Airport. Carry the spirit of Bali home with you.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Alaya Resort Ubud",
        stars: 5,
        location: "Ubud, Bali",
        imageUrl:
          "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Luxury pool villas nestled in the heart of Ubud's jungle.",
      },
      {
        name: "The Layar Private Villas",
        stars: 5,
        location: "Seminyak, Bali",
        imageUrl:
          "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Stunning private villas with infinity pools steps from the beach.",
      },
    ],
    activities: [
      {
        name: "Tegalalang Rice Terrace Sunrise Walk",
        duration: "2 hours",
        included: true,
        description:
          "Guided walk through the iconic UNESCO-listed terraces at dawn.",
      },
      {
        name: "Tirta Empul Purification Ritual",
        duration: "1.5 hours",
        included: true,
        description:
          "Participate in a traditional Balinese water purification ceremony.",
      },
      {
        name: "Balinese Cooking Class",
        duration: "4 hours",
        included: true,
        description:
          "Learn to cook 5 traditional Balinese dishes with a local family.",
      },
      {
        name: "Mount Batur Volcano Trek",
        duration: "5 hours",
        included: true,
        description: "Sunrise trek to the active volcano crater rim at 1,717m.",
      },
      {
        name: "Kecak Fire Dance at Uluwatu",
        duration: "1 hour",
        included: true,
        description:
          "Traditional Balinese fire dance performance at the cliff temple.",
      },
      {
        name: "Surfing Lesson at Kuta",
        duration: "2 hours",
        included: false,
        price: 3500,
        description:
          "Beginner to intermediate surfing lesson with a professional instructor.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555400206-1e9bc986efd0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Honeymoon", "Luxury", "Beach", "Adventure"],
    attributes: [
      { label: "Public Transport", quality: "GOOD" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GOOD" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GOOD" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.8, reviewCount: 2847 },
      { platform: "Google", score: 4.9, reviewCount: 1203 },
      { platform: "Booking.com", score: 9.2, reviewCount: 642 },
    ],
    reviewSummary: {
      loves: [
        "Expertly curated temple visits with a knowledgeable local guide",
        "Villa accommodations with private pools and exceptional service",
        "Perfectly balanced itinerary with cultural experiences and leisure time",
      ],
      dislikes: [
        "Traffic in Seminyak and Kuta can cause significant delays",
        "Some tourist areas feel overcrowded during peak season",
        "Humidity and rain can affect outdoor activities in monsoon months",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: true,
    includesFlights: false,
    status: "PUBLISHED",
    metaTitle: "Bali Serenity Escape — 7 Nights Luxury Package | RapidLuxe",
    metaDescription:
      "Discover Bali's temples, rice terraces, and pristine beaches on a 7-night luxury escape. Curated by RapidLuxe. From ₹85,000 per person.",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2025-03-01"),
  },

  // ─── 2. Maldives ─── isFeatured: true, includesFlights: true
  {
    id: "pkg-maldives",
    title: "Maldives Overwater Luxury",
    slug: "maldives-overwater-luxury",
    description:
      "A six-night retreat in the world's most pristine archipelago. Your overwater bungalow perches above a turquoise lagoon teeming with manta rays, whale sharks, and iridescent coral. This is solitude elevated to an art form.",
    destinationId: "dest-maldives",
    durationNights: 6,
    pricePerPerson: 350000,
    minGroupSize: 1,
    maxGroupSize: 6,
    inclusions: [
      "6 nights overwater villa accommodation",
      "Return flights from Mumbai (economy class)",
      "Seaplane transfer to resort",
      "All-inclusive meal plan",
      "Snorkelling equipment",
      "Sunset dolphin cruise",
      "Couple's overwater spa treatment",
    ],
    exclusions: [
      "Premium alcohol",
      "Scuba diving certification course",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Mumbai to Malé — Welcome to Paradise",
        description:
          "Fly from Mumbai to Velana International Airport, Malé. Board your private seaplane for a breathtaking 30-minute flight over atolls to your resort. Check in, freshen up, and enjoy a sunset cocktail over the Indian Ocean.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Coral Reef Snorkelling & Aquatic Bliss",
        description:
          "Morning guided snorkelling session over the house reef — encounter hawksbill turtles, reef sharks, and thousands of tropical fish. Afternoon at leisure in your villa plunge pool.",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Manta Ray Safari & Overwater Spa",
        description:
          "Sunrise manta ray snorkelling at a nearby cleaning station. Return for a luxurious 90-minute couple's spa treatment at the overwater spa pavilion. Evening sandbank picnic dinner under the stars.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Dolphin Cruise & Bioluminescent Night Swim",
        description:
          "Afternoon sunset dolphin-spotting cruise. After dinner, wade into the shallows for a magical encounter with bioluminescent plankton that turns the ocean into a light show.",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Deserted Island Excursion",
        description:
          "Full-day excursion to a private uninhabited island — beach volleyball, barbecue lunch, and afternoon snorkelling in the pristine surrounding lagoon.",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Final Morning & Departure",
        description:
          "Last morning swim in your villa pool. Leisurely breakfast. Seaplane transfer back to Malé and return flight to Mumbai. The ocean stays with you long after you leave.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "One&Only Reethi Rah",
        stars: 5,
        location: "North Malé Atoll, Maldives",
        imageUrl:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "One of the Maldives' most iconic luxury resorts spread across 109 hectares of natural island.",
      },
    ],
    activities: [
      {
        name: "Guided House Reef Snorkelling",
        duration: "2 hours",
        included: true,
        description:
          "Expert-guided snorkelling over the resort's pristine house reef.",
      },
      {
        name: "Manta Ray Safari",
        duration: "3 hours",
        included: true,
        description:
          "Boat excursion to a manta cleaning station for close encounters.",
      },
      {
        name: "Sunset Dolphin Cruise",
        duration: "2 hours",
        included: true,
        description:
          "Watch spinner dolphins leap through the Indian Ocean at golden hour.",
      },
      {
        name: "Overwater Couples Spa",
        duration: "1.5 hours",
        included: true,
        description:
          "Signature treatment for two in a glass-floor overwater pavilion.",
      },
      {
        name: "Deserted Island Excursion",
        duration: "Full day",
        included: true,
        description:
          "Private boat to an uninhabited island with barbecue lunch.",
      },
      {
        name: "Scuba Diving (PADI Open Water)",
        duration: "3 days",
        included: false,
        price: 45000,
        description:
          "Full PADI Open Water certification course with resort dive school.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Honeymoon", "Luxury", "Beach"],
    attributes: [
      { label: "Public Transport", quality: "AVERAGE" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "AVERAGE" },
      { label: "Neighbourhood Vibrancy", quality: "GOOD" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 5.0, reviewCount: 1892 },
      { platform: "Google", score: 4.9, reviewCount: 847 },
      { platform: "Booking.com", score: 9.6, reviewCount: 431 },
    ],
    reviewSummary: {
      loves: [
        "Stunning overwater bungalow with direct lagoon access and total privacy",
        "Manta ray and reef shark encounters exceeded all expectations",
        "Seamless all-inclusive service — nothing left to organise or worry about",
      ],
      dislikes: [
        "Limited connectivity — internet is slow and intermittent at the resort",
        "Very limited options outside the resort for dining and independent activities",
        "Seaplane transfers are weather-dependent and can cause delays",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: true,
    includesFlights: true,
    status: "PUBLISHED",
    metaTitle: "Maldives Overwater Luxury — 6 Nights All-Inclusive | RapidLuxe",
    metaDescription:
      "Six nights in an overwater villa with flights, all meals, seaplane transfer, and manta ray safari included. From ₹3,50,000 per person.",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2025-04-01"),
  },

  // ─── 3. Kerala ───
  {
    id: "pkg-kerala",
    title: "Kerala Backwaters & Spice Country",
    slug: "kerala-backwaters-spice-country",
    description:
      "Drift through Alleppey's labyrinthine backwaters on a luxury houseboat, walk through Munnar's emerald tea estates, and unwind on the golden sands of Kovalam. Kerala at its most authentic and unhurried.",
    destinationId: "dest-kerala",
    durationNights: 8,
    pricePerPerson: 45000,
    minGroupSize: 2,
    maxGroupSize: 20,
    inclusions: [
      "8 nights accommodation (hotels + 1 night houseboat)",
      "Daily breakfast",
      "Houseboat with all meals",
      "Kathakali dance performance",
      "Spice plantation tour",
      "All road transfers within Kerala",
    ],
    exclusions: [
      "Flights to/from Kochi or Trivandrum",
      "Ayurvedic treatments",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi — Fort Kochi Heritage Walk",
        description:
          "Arrive at Cochin International Airport. Check in to your heritage hotel in Fort Kochi. Guided walk through Fort Kochi — Chinese fishing nets, Dutch Palace, Jewish Synagogue, and spice markets.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Kathakali & Kochi City",
        description:
          "Morning at leisure to explore the artists' quarter. Afternoon Kathakali make-up session and evening performance — a 2,000-year-old classical dance drama told through elaborate facial expressions.",
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Drive to Munnar — Tea Estate Walks",
        description:
          "Scenic drive to Munnar through rolling Western Ghats. Arrive in the cool air of India's premier tea region. Sunset walk through TATA tea estates with panoramic valley views.",
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Eravikulam National Park & Spice Plantation",
        description:
          "Morning visit to Eravikulam National Park — home of the endangered Nilgiri Tahr. Afternoon guided spice plantation tour — cardamom, pepper, nutmeg, and cinnamon growing wild.",
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Alleppey — Houseboat Check-In",
        description:
          "Drive to Alleppey. Board your private luxury houseboat. Glide through narrow canals past village life, paddy fields, and coconut groves. All meals prepared fresh by your onboard chef.",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Backwaters at Dawn & Kovalam",
        description:
          "Wake to mist rising off the backwaters — watch fishermen at work before breakfast. Disembark and drive to Kovalam Beach. Afternoon on the crescent beach.",
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 7,
        title: "Trivandrum — Padmanabhaswamy Temple",
        description:
          "Drive to Trivandrum. Visit the magnificent Sri Padmanabhaswamy Temple (dress code required). Explore Napier Museum and the Kerala State Museum.",
        meals: ["Breakfast"],
      },
      {
        day: 8,
        title: "Departure from Trivandrum",
        description:
          "Farewell breakfast. Transfer to Trivandrum International Airport for your onward journey.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Brunton Boatyard",
        stars: 5,
        location: "Fort Kochi",
        imageUrl:
          "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Heritage waterfront hotel in a restored 19th-century boatyard.",
      },
      {
        name: "Windermere Estate",
        stars: 4,
        location: "Munnar",
        imageUrl:
          "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Colonial-era planter's bungalow set on a private tea estate.",
      },
      {
        name: "Raheem Residency",
        stars: 4,
        location: "Alleppey",
        imageUrl:
          "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Restored 1868 colonial mansion steps from the backwater jetty.",
      },
    ],
    activities: [
      {
        name: "Fort Kochi Heritage Walk",
        duration: "3 hours",
        included: true,
        description:
          "Guided walk through Fort Kochi's layered colonial history.",
      },
      {
        name: "Kathakali Performance",
        duration: "2 hours",
        included: true,
        description:
          "Classical Kerala dance drama with elaborate costume and make-up.",
      },
      {
        name: "Spice Plantation Tour",
        duration: "2 hours",
        included: true,
        description:
          "Walk through a working spice plantation with a knowledgeable guide.",
      },
      {
        name: "Luxury Houseboat Cruise",
        duration: "24 hours",
        included: true,
        description:
          "Full day and night on a private houseboat through Alleppey backwaters.",
      },
      {
        name: "Eravikulam National Park Safari",
        duration: "3 hours",
        included: true,
        description:
          "Jeep safari through the Nilgiri Tahr habitat in the Western Ghats.",
      },
      {
        name: "Ayurvedic Panchakarma Treatment",
        duration: "2 hours",
        included: false,
        price: 5000,
        description:
          "Traditional Ayurvedic detox treatment at a certified Kerala spa.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Family", "Adventure", "Budget"],
    attributes: [
      { label: "Public Transport", quality: "GOOD" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GOOD" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.6, reviewCount: 3421 },
      { platform: "Google", score: 4.7, reviewCount: 2103 },
      { platform: "Booking.com", score: 9.0, reviewCount: 876 },
    ],
    reviewSummary: {
      loves: [
        "Houseboat experience through the backwaters was magical and completely serene",
        "Exceptional heritage hotel stays in Fort Kochi with personalised service",
        "Spice plantation and Kathakali performance were the cultural highlights",
      ],
      dislikes: [
        "Long road transfers between cities (Munnar-Alleppey 4hrs) can be tiring",
        "Monsoon season brings heavy rain that limits some outdoor activities",
        "Munnar roads are narrow and winding — not ideal for those prone to motion sickness",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: false,
    status: "PUBLISHED",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2025-02-01"),
  },

  // ─── 4. Switzerland ─── includesFlights: true
  {
    id: "pkg-switzerland",
    title: "Swiss Alps & Glacier Express",
    slug: "swiss-alps-glacier-express",
    description:
      "Ten nights crossing the most scenic country on earth — from Zurich's old town to the Jungfraujoch at 3,454m, with a legendary Glacier Express journey through 291 bridges and 91 tunnels.",
    destinationId: "dest-switzerland",
    durationNights: 10,
    pricePerPerson: 280000,
    minGroupSize: 1,
    maxGroupSize: 15,
    inclusions: [
      "10 nights 4-star hotel accommodation",
      "Return flights from Delhi (economy)",
      "Swiss Travel Pass (10 days unlimited trains)",
      "Glacier Express panoramic train journey",
      "Jungfraujoch excursion",
      "Daily breakfast",
      "Visa assistance",
    ],
    exclusions: [
      "Schengen visa fee (₹7,500 approx.)",
      "Meals outside breakfast",
      "Personal expenses",
      "Travel insurance",
      "Optional ski equipment rental",
    ],
    itinerary: [
      {
        day: 1,
        title: "Delhi to Zurich — Arrival",
        description:
          "Overnight flight from Delhi to Zurich. Arrive at Zurich Airport, collect bags, and take the direct train to your city centre hotel. Afternoon rest and evening walk along the Limmat River.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Zurich — Old Town & Lake",
        description:
          "Guided walk through Zurich's Altstadt — Grossmünster cathedral, Bahnhofstrasse luxury shopping street, and a boat ride on Lake Zurich. Evening fondue dinner in a traditional Swiss restaurant.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Lucerne & Mount Pilatus",
        description:
          "Train to Lucerne. Morning walk across the 14th-century Chapel Bridge. Afternoon cable car ascent of Mount Pilatus for dramatic Alpine views. Return to Lucerne.",
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Interlaken & Grindelwald",
        description:
          "Train to Interlaken between Lakes Thun and Brienz. Afternoon in Grindelwald — a classic Alpine village beneath the North Face of the Eiger.",
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Jungfraujoch — Top of Europe",
        description:
          "Ascend to Jungfraujoch at 3,454m — the highest railway station in Europe. Ice Palace, Sphinx Observatory, and Aletsch Glacier views. A genuinely once-in-a-lifetime day.",
        meals: ["Breakfast"],
      },
      {
        day: 6,
        title: "Glacier Express: Zermatt to St. Moritz",
        description:
          "Board the legendary Glacier Express panoramic train. Eight hours of jaw-dropping scenery across 291 bridges and through 91 tunnels. Dine on board with scenic mountain views.",
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 7,
        title: "Zermatt & the Matterhorn",
        description:
          "Car-free Zermatt under the shadow of the iconic Matterhorn (4,478m). Cable car to Schwarzsee for close-up Matterhorn views. Explore the village's luxury chalets and mountain restaurants.",
        meals: ["Breakfast"],
      },
      {
        day: 8,
        title: "Geneva — International City",
        description:
          "Train to Geneva. Guided tour — Jet d'Eau, Palace of Nations, Flower Clock. Visit CERN visitor centre. Evening dinner in the old town.",
        meals: ["Breakfast"],
      },
      {
        day: 9,
        title: "Montreux & Chillon Castle",
        description:
          "Day trip to Montreux on the Swiss Riviera. Visit the fairy-tale Chillon Castle on Lake Geneva's shore. Walk the floral promenade. Return to Geneva.",
        meals: ["Breakfast"],
      },
      {
        day: 10,
        title: "Departure from Geneva",
        description:
          "Final breakfast and transfer to Geneva International Airport for return flight to Delhi.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Hotel Widder Zurich",
        stars: 5,
        location: "Zurich Old Town",
        imageUrl:
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Nine interconnected historic townhouses in the heart of Zurich's old quarter.",
      },
      {
        name: "Victoria-Jungfrau Grand Hotel",
        stars: 5,
        location: "Interlaken",
        imageUrl:
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "A grand Belle Époque palace hotel with direct Jungfrau mountain views.",
      },
      {
        name: "Mont Cervin Palace",
        stars: 5,
        location: "Zermatt",
        imageUrl:
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Zermatt's historic grand hotel at the foot of the Matterhorn since 1852.",
      },
    ],
    activities: [
      {
        name: "Jungfraujoch Top of Europe",
        duration: "Full day",
        included: true,
        description:
          "Train ascent to Europe's highest railway station at 3,454m.",
      },
      {
        name: "Glacier Express Panoramic Train",
        duration: "8 hours",
        included: true,
        description: "Iconic scenic railway journey through the Swiss Alps.",
      },
      {
        name: "Mount Pilatus Cable Car",
        duration: "Half day",
        included: true,
        description: "Dramatic cable car ascent to 2,132m above Lucerne.",
      },
      {
        name: "Chillon Castle Tour",
        duration: "2 hours",
        included: true,
        description:
          "Guided tour of the medieval island castle on Lake Geneva.",
      },
      {
        name: "Zurich Old Town Walking Tour",
        duration: "3 hours",
        included: true,
        description:
          "Expert-guided tour of Zurich's 2,000-year-old city centre.",
      },
      {
        name: "Ski Day Pass — Zermatt",
        duration: "Full day",
        included: false,
        price: 12000,
        description:
          "Full-day ski pass with equipment rental in Zermatt ski area.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Luxury", "Adventure", "Honeymoon"],
    attributes: [
      { label: "Public Transport", quality: "GREAT" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GREAT" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.7, reviewCount: 1654 },
      { platform: "Google", score: 4.8, reviewCount: 932 },
      { platform: "Booking.com", score: 9.3, reviewCount: 512 },
    ],
    reviewSummary: {
      loves: [
        "Glacier Express journey through the Alps was breathtaking and utterly memorable",
        "Swiss Travel Pass made navigating the entire rail network effortless",
        "Jungfraujoch experience at 3,454m was a genuinely once-in-a-lifetime moment",
      ],
      dislikes: [
        "Switzerland is expensive — personal expenses and dining out add up quickly",
        "Weather at high altitudes is unpredictable; Jungfraujoch views may be clouded",
        "Schengen visa process requires advance planning and detailed documentation",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: true,
    status: "PUBLISHED",
    metaTitle:
      "Swiss Alps & Glacier Express — 10 Nights with Flights | RapidLuxe",
    metaDescription:
      "10 nights across Zurich, Interlaken, Zermatt, and Geneva with Swiss Travel Pass and Glacier Express. From ₹2,80,000 per person.",
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2025-01-15"),
  },

  // ─── 5. Santorini ─── originalPrice
  {
    id: "pkg-santorini",
    title: "Santorini Sunset Romance",
    slug: "santorini-sunset-romance",
    description:
      "Seven nights across the most photographed island in the world — whitewashed Cycladic architecture, caldera-edge infinity pools, wine from volcanic soil, and sunsets from Oia that redefine beauty.",
    destinationId: "dest-santorini",
    durationNights: 7,
    pricePerPerson: 195000,
    originalPrice: 230000,
    minGroupSize: 1,
    maxGroupSize: 10,
    inclusions: [
      "7 nights caldera-view hotel",
      "Daily breakfast",
      "Airport/port transfers",
      "Private wine-tasting at a volcanic winery",
      "Catamaran sunset cruise",
      "Oia sunset photography walk",
    ],
    exclusions: [
      "International flights",
      "Schengen visa",
      "Meals outside breakfast",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival — Caldera Views & Oia Walk",
        description:
          "Fly into Santorini Airport or arrive by ferry from Athens. Transfer to your caldera-view hotel in Oia. Evening golden hour walk through the blue-domed church lanes of Oia.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Fira & Imerovigli Cliff Walk",
        description:
          "Morning hike along the caldera rim from Fira to Imerovigli — 4km of dramatic cliffside views. Afternoon at leisure. Sunset cocktails at a caldera-edge bar.",
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Volcanic Winery Tour & Tasting",
        description:
          "Visit Santo Wines, perched on the caldera cliff. Private tasting of Assyrtiko, Nykteri, and Vinsanto wines grown in ancient volcanic ash soil. Paired with local meze.",
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 4,
        title: "Catamaran Sunset Cruise",
        description:
          "Afternoon catamaran cruise around the caldera — swim at the hot springs, snorkel at the Red Beach, and watch the legendary Santorini sunset from the water with champagne.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Ancient Akrotiri & Black Sand Beaches",
        description:
          "Morning visit to the Minoan Bronze Age ruins of Akrotiri — remarkably preserved under volcanic ash. Afternoon at Perissa black sand beach.",
        meals: ["Breakfast"],
      },
      {
        day: 6,
        title: "Pyrgos Village & Panoramic Views",
        description:
          "Explore the medieval hilltop village of Pyrgos — less crowded, equally beautiful. Visit the ruins of the Venetian castle for 360° island views. Farewell dinner at a traditional taverna.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 7,
        title: "Final Morning & Departure",
        description:
          "Last sunrise from your villa terrace. Farewell breakfast. Transfer to airport or port for onward journey.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Canaves Oia Suites",
        stars: 5,
        location: "Oia, Santorini",
        imageUrl:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Iconic cave-carved suites with private plunge pools and direct caldera views.",
      },
      {
        name: "Mystique, a Luxury Collection Hotel",
        stars: 5,
        location: "Oia, Santorini",
        imageUrl:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
        included: false,
        description:
          "Available as an upgrade option — cliffside luxury with a clifftop pool.",
      },
    ],
    activities: [
      {
        name: "Caldera Rim Hike (Fira to Oia)",
        duration: "4 hours",
        included: true,
        description:
          "Guided hike along the dramatic volcanic caldera rim with sea views.",
      },
      {
        name: "Volcanic Winery Private Tasting",
        duration: "2 hours",
        included: true,
        description:
          "Exclusive tasting of Santorini's unique volcanic wines with food pairing.",
      },
      {
        name: "Catamaran Sunset Cruise",
        duration: "5 hours",
        included: true,
        description:
          "Caldera catamaran cruise with hot springs, snorkelling, and champagne sunset.",
      },
      {
        name: "Akrotiri Archaeological Site",
        duration: "2 hours",
        included: true,
        description:
          "Guided tour of the Minoan city preserved under volcanic ash.",
      },
      {
        name: "Sunset Photography Walk (Oia)",
        duration: "2 hours",
        included: true,
        description:
          "Expert guide to the best sunset vantage points with photography tips.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Honeymoon", "Luxury", "Beach"],
    attributes: [
      { label: "Public Transport", quality: "GOOD" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GREAT" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.8, reviewCount: 4231 },
      { platform: "Google", score: 4.9, reviewCount: 2108 },
      { platform: "Booking.com", score: 9.4, reviewCount: 789 },
    ],
    reviewSummary: {
      loves: [
        "Oia sunset from our caldera suite was the most beautiful sight we have ever witnessed",
        "Catamaran cruise with champagne at sunset was the perfect anniversary evening",
        "Volcanic winery tasting offered wines unlike anything available back home",
      ],
      dislikes: [
        "Oia becomes extremely crowded at sunset — arrive well early for the best viewing spots",
        "The caldera staircases are steep and numerous, challenging for those with mobility issues",
        "International flights and Schengen visa add considerable extra cost to the trip",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: false,
    status: "PUBLISHED",
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-03-10"),
  },

  // ─── 6. Dubai ─── originalPrice
  {
    id: "pkg-dubai",
    title: "Dubai: Gold, Glamour & Desert",
    slug: "dubai-gold-glamour-desert",
    description:
      "Five nights in the city that turned ambition into architecture. Burj Khalifa at 828m, a desert safari under the Milky Way, the world's largest mall, and gold souk trading — Dubai rewards those who dream big.",
    destinationId: "dest-dubai",
    durationNights: 5,
    pricePerPerson: 120000,
    originalPrice: 150000,
    minGroupSize: 1,
    maxGroupSize: 20,
    inclusions: [
      "5 nights 5-star hotel accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Desert safari with BBQ dinner",
      "Burj Khalifa At The Top (124th floor)",
      "Dubai Frame entry",
      "Gold & Spice Souk guided walk",
    ],
    exclusions: [
      "International flights",
      "Lunch and dinners outside breakfast",
      "Alcohol",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival — Downtown Dubai & Burj Khalifa",
        description:
          "Arrive at Dubai International Airport. Transfer to your hotel. Evening visit to Burj Khalifa (At The Top experience, 124th floor). Watch the Dubai Fountain show from the waterfront.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Desert Safari & Bedouin Night",
        description:
          "Afternoon dune-bashing safari in a 4x4 across the red sand dunes. Camel ride, sandboarding, falcon photography. Sunset at the desert camp followed by henna, shisha, and a BBQ feast under the stars with belly dancing.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Old Dubai — Souks & Abra Crossing",
        description:
          "Morning in Old Dubai — Gold Souk, Spice Souk, and a guided walk through the historic Al Fahidi district. Cross the Creek by traditional wooden abra. Afternoon at leisure.",
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Dubai Mall, Frame & Palm Jumeirah",
        description:
          "Morning at Dubai Mall — world's largest mall including the Dubai Aquarium and Underwater Zoo. Afternoon visit to the Dubai Frame for skyline views. Evening monorail to Palm Jumeirah.",
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Free Morning & Departure",
        description:
          "Free morning for last-minute shopping at Dubai Mall or Duty Free. Transfer to Dubai International Airport.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Atlantis The Palm",
        stars: 5,
        location: "Palm Jumeirah, Dubai",
        imageUrl:
          "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Iconic resort on the Palm with waterpark access and aquarium.",
      },
      {
        name: "Address Downtown",
        stars: 5,
        location: "Downtown Dubai",
        imageUrl:
          "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=800&auto=format&fit=crop&q=80",
        included: false,
        description:
          "Available as an upgrade — stunning views of Burj Khalifa from your room.",
      },
    ],
    activities: [
      {
        name: "Burj Khalifa At The Top",
        duration: "2 hours",
        included: true,
        description:
          "Access to the 124th floor observation deck of the world's tallest building.",
      },
      {
        name: "Desert Safari with BBQ Dinner",
        duration: "6 hours",
        included: true,
        description:
          "Dune bashing, camel rides, henna, and Bedouin camp dinner.",
      },
      {
        name: "Gold & Spice Souk Walking Tour",
        duration: "2 hours",
        included: true,
        description:
          "Expert-guided walk through Dubai's historic trading souks.",
      },
      {
        name: "Dubai Frame",
        duration: "1.5 hours",
        included: true,
        description:
          "Glass-floored walkway framing old and new Dubai skylines simultaneously.",
      },
      {
        name: "Dubai Aquarium & Underwater Zoo",
        duration: "2 hours",
        included: false,
        price: 3500,
        description:
          "One of the world's largest indoor aquariums inside Dubai Mall.",
      },
      {
        name: "Dubai Helicopter Tour",
        duration: "12 minutes",
        included: false,
        price: 18000,
        description:
          "Bird's eye view of Burj Khalifa, Palm, and the Dubai Marina skyline.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Luxury", "Family", "Adventure"],
    attributes: [
      { label: "Public Transport", quality: "GREAT" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GOOD" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.5, reviewCount: 6723 },
      { platform: "Google", score: 4.6, reviewCount: 3841 },
      { platform: "Booking.com", score: 8.8, reviewCount: 1209 },
    ],
    reviewSummary: {
      loves: [
        "Desert safari with BBQ dinner under the stars was the highlight of our trip",
        "Burj Khalifa At The Top experience delivered incredible 360° views of the city",
        "Old Dubai souk walk offered a fascinating contrast to the ultra-modern skyline",
      ],
      dislikes: [
        "Dubai requires a car for most travel — walking between attractions is often impractical",
        "Summer temperatures can exceed 40°C, limiting outdoor activities significantly",
        "Alcohol is very expensive and available only at licensed venues; plan accordingly",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: false,
    status: "PUBLISHED",
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2025-04-20"),
  },

  // ─── 7. Rajasthan ───
  {
    id: "pkg-rajasthan",
    title: "Royal Rajasthan Heritage Circuit",
    slug: "royal-rajasthan-heritage-circuit",
    description:
      "Nine nights through the land of maharajas — from Jaipur's pink palaces to Jodhpur's blue city, Jaisalmer's golden fort, and Udaipur's shimmering lake palaces. India at its most regal.",
    destinationId: "dest-rajasthan",
    durationNights: 9,
    pricePerPerson: 75000,
    minGroupSize: 2,
    maxGroupSize: 20,
    inclusions: [
      "9 nights heritage hotel accommodation",
      "Daily breakfast",
      "All road transfers in AC vehicle",
      "Camel safari in Jaisalmer",
      "Boat ride on Lake Pichola",
      "Guided fort & palace tours",
    ],
    exclusions: [
      "Flights to Jaipur and from Udaipur",
      "Lunch and dinners",
      "Monument entry fees",
      "Personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Jaipur Arrival — Pink City First Look",
        description:
          "Arrive in Jaipur. Check in to your heritage haveli hotel. Evening walk through the illuminated bazaars of the old city — Johari Bazaar and Bapu Bazaar.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Amber Fort & City Palace",
        description:
          "Morning elephant (or jeep) ascent to Amber Fort — an extraordinary fusion of Rajput and Mughal architecture. Afternoon City Palace museum and Jantar Mantar observatory.",
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Jaipur to Jodhpur — Blue City",
        description:
          "Morning drive to Jodhpur (5 hours). Check in to your rooftop haveli with views of the blue city. Evening walk through the indigo-painted lanes of Brahmpuri neighbourhood.",
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Mehrangarh Fort & Toorji Ka Jhalra",
        description:
          "Mehrangarh Fort — one of India's most imposing fortresses perched 122m above Jodhpur. Afternoon exploration of the restored Toorji Ka Jhalra stepwell.",
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Jodhpur to Jaisalmer — Golden City",
        description:
          "Drive through the Thar Desert to Jaisalmer (5 hours). Check in to your heritage fort hotel inside the living Jaisalmer Fort. Rooftop dinner with fort views.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Sam Sand Dunes Camel Safari",
        description:
          "Day at leisure in Jaisalmer — havelis, bazaars, Patwon ki Haveli. Late afternoon jeep to Sam Sand Dunes. Camel safari at sunset followed by a folk music performance and BBQ dinner at a desert camp.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 7,
        title: "Jaisalmer to Udaipur — City of Lakes",
        description:
          "Early flight or overnight train to Udaipur (the most romantic city in Rajasthan). Arrive and check in to your lakeside palace hotel. Sunset boat ride on Lake Pichola.",
        meals: ["Breakfast"],
      },
      {
        day: 8,
        title: "City Palace, Jagdish Temple & Local Art",
        description:
          "Morning City Palace — Rajasthan's most impressive palace complex with lake views. Visit Jagdish Temple and the local miniature painting art schools of the old city.",
        meals: ["Breakfast"],
      },
      {
        day: 9,
        title: "Departure from Udaipur",
        description:
          "Farewell breakfast at your lakeside hotel. Transfer to Maharana Pratap Airport.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Samode Haveli",
        stars: 5,
        location: "Jaipur",
        imageUrl:
          "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "A 475-year-old haveli with frescoed courtyards and royal suites.",
      },
      {
        name: "Raas Jodhpur",
        stars: 5,
        location: "Jodhpur",
        imageUrl:
          "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Contemporary luxury hotel built into the Mehrangarh Fort ramparts.",
      },
      {
        name: "Taj Lake Palace",
        stars: 5,
        location: "Udaipur",
        imageUrl:
          "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "An 18th-century white marble palace floating on Lake Pichola.",
      },
    ],
    activities: [
      {
        name: "Amber Fort Guided Tour",
        duration: "3 hours",
        included: true,
        description:
          "Expert-guided tour of Jaipur's iconic hilltop Rajput fortress.",
      },
      {
        name: "Mehrangarh Fort Audio Tour",
        duration: "2.5 hours",
        included: true,
        description:
          "Comprehensive audio-guided exploration of Jodhpur's majestic fort.",
      },
      {
        name: "Sam Dunes Camel Safari",
        duration: "2 hours",
        included: true,
        description:
          "Traditional camel ride through the Thar Desert sand dunes at sunset.",
      },
      {
        name: "Lake Pichola Boat Ride",
        duration: "1 hour",
        included: true,
        description:
          "Sunset boat ride past the Lake Palace and Jagmandir Island.",
      },
      {
        name: "City Palace Udaipur Tour",
        duration: "2 hours",
        included: true,
        description:
          "Guided tour of Rajasthan's grandest palace complex on the lake's edge.",
      },
      {
        name: "Jaisalmer Patwon ki Haveli Walk",
        duration: "1.5 hours",
        included: false,
        price: 800,
        description:
          "Guided tour of the five interconnected merchant mansions.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598091385862-a7c535ba92f2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531261985581-1e24714bfb06?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Adventure", "Family", "Luxury"],
    attributes: [
      { label: "Public Transport", quality: "GOOD" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GOOD" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GOOD" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.7, reviewCount: 5103 },
      { platform: "Google", score: 4.8, reviewCount: 2734 },
      { platform: "Booking.com", score: 9.1, reviewCount: 934 },
    ],
    reviewSummary: {
      loves: [
        "Heritage palace hotels delivered an authentic maharaja living experience",
        "Sam Dunes camel safari at sunset was romantic and utterly unforgettable",
        "Mehrangarh Fort is among India's finest — the audio guide is world-class",
      ],
      dislikes: [
        "Long road transfers between cities (Jodhpur–Jaisalmer 5hrs) can be exhausting",
        "Persistent touts near major monuments require patience and firm but polite refusals",
        "Some roads in Rajasthan are in poor condition, making journeys bumpy and tiring",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: false,
    status: "PUBLISHED",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2025-02-28"),
  },

  // ─── 8. Singapore ───
  {
    id: "pkg-singapore",
    title: "Singapore: City, Sentosa & Gardens",
    slug: "singapore-city-sentosa-gardens",
    description:
      "Six nights in Asia's most efficient, cleanest, and endlessly surprising city-state — Universal Studios, the futuristic Gardens by the Bay, a night safari, and some of the world's best street food.",
    destinationId: "dest-singapore",
    durationNights: 6,
    pricePerPerson: 110000,
    minGroupSize: 1,
    maxGroupSize: 20,
    inclusions: [
      "6 nights 4-star hotel in Orchard Road",
      "Daily breakfast",
      "Airport transfers (MRT card provided)",
      "Universal Studios Singapore (1-day pass)",
      "Gardens by the Bay entry",
      "Night Safari guided tram tour",
      "City highlights guided tour",
    ],
    exclusions: [
      "International flights",
      "Meals outside breakfast",
      "Personal expenses",
      "Travel insurance",
      "Optional cable car to Sentosa",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival — Marina Bay & Merlion",
        description:
          "Arrive at Changi Airport — consistently voted the world's best. MRT to your hotel. Evening walk around Marina Bay — Merlion, the Esplanade, and the spectacular Marina Bay Sands skyline.",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Universal Studios Singapore",
        description:
          "Full day at Universal Studios on Sentosa Island — Jurassic World, Transformers, Hollywood Boulevard. Stay for the Crane Dance light show at sunset.",
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Gardens by the Bay & Cloud Forest",
        description:
          "Morning Gardens by the Bay — Supertree Grove, Cloud Forest biodome, and Flower Dome. Afternoon at leisure on Sentosa Beach or Singapore Flyer.",
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Night Safari & Hawker Centre Dinner",
        description:
          "Free morning. Evening Singapore Night Safari — the world's first nocturnal wildlife park. Guided tram tour through recreated wild habitats. Late dinner at the renowned Newton Food Centre hawker stalls.",
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Chinatown, Little India & Orchard Road",
        description:
          "Cultural neighbourhood walk — Sri Veeramakaliamman Temple in Little India, Buddha Tooth Relic Temple in Chinatown. Afternoon on Orchard Road.",
        meals: ["Breakfast"],
      },
      {
        day: 6,
        title: "Changi Airport & Departure",
        description:
          "Allow time to explore Changi Airport's Jewel — the massive indoor waterfall and attractions before your departure flight.",
        meals: ["Breakfast"],
      },
    ],
    hotels: [
      {
        name: "Shangri-La Singapore",
        stars: 5,
        location: "Orchard Road, Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80",
        included: true,
        description:
          "Iconic garden hotel on Orchard Road with 15 acres of tropical gardens.",
      },
      {
        name: "Hotel Jen Orchardgateway",
        stars: 4,
        location: "Orchard, Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80",
        included: false,
        description:
          "Contemporary 4-star hotel connected directly to Orchard Gateway Mall.",
      },
    ],
    activities: [
      {
        name: "Universal Studios Singapore",
        duration: "Full day",
        included: true,
        description:
          "Full-day access to Southeast Asia's only Universal Studios theme park.",
      },
      {
        name: "Gardens by the Bay",
        duration: "3 hours",
        included: true,
        description:
          "Entry to Supertree Grove, Cloud Forest, and Flower Dome biodomes.",
      },
      {
        name: "Night Safari Guided Tram",
        duration: "3 hours",
        included: true,
        description:
          "Guided tram tour through the world's first nocturnal wildlife park.",
      },
      {
        name: "Cultural Neighbourhoods Walk",
        duration: "3 hours",
        included: true,
        description:
          "Guided walk through Chinatown, Little India, and Arab Street.",
      },
      {
        name: "Marina Bay Sands Skypark",
        duration: "1.5 hours",
        included: false,
        price: 3200,
        description:
          "Access to the iconic rooftop infinity pool and observation deck.",
      },
      {
        name: "Singapore Flyer",
        duration: "30 minutes",
        included: false,
        price: 2800,
        description: "Asia's largest Ferris wheel with panoramic city views.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494893719264-bca5c96b8c57?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508009603885-50cf7c8a3d13?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Family", "Adventure", "Budget"],
    attributes: [
      { label: "Public Transport", quality: "GREAT" },
      { label: "Proximity to Attractions", quality: "GREAT" },
      { label: "Walkability", quality: "GREAT" },
      { label: "Neighbourhood Vibrancy", quality: "GREAT" },
      { label: "Safety", quality: "GREAT" },
    ],
    platformRatings: [
      { platform: "TripAdvisor", score: 4.6, reviewCount: 3892 },
      { platform: "Google", score: 4.7, reviewCount: 1763 },
      { platform: "Booking.com", score: 9.0, reviewCount: 821 },
    ],
    reviewSummary: {
      loves: [
        "Universal Studios delivers a fantastic full-day experience for all ages",
        "Singapore's MRT system makes navigating the entire city effortless and affordable",
        "Gardens by the Bay is stunning both by day and for the evening Supertree light show",
      ],
      dislikes: [
        "Singapore is one of Asia's most expensive cities — dining and drinks outside hawker centres add up",
        "Limited natural landscape — travellers seeking nature may find Singapore underwhelming",
        "Six nights can feel rushed; the island genuinely rewards a slower pace of exploration",
      ],
    },
    cancellationPolicy: CANCELLATION_POLICY,
    isFeatured: false,
    includesFlights: false,
    status: "PUBLISHED",
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2025-03-15"),
  },
];
