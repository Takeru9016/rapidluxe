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
    images: [
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555400206-00d2b5a72c99?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    visaType: "VISA_ON_ARRIVAL",
    currency: "IDR",
    language: "Bahasa Indonesia",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "February",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "May",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "June",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "July",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "August",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "October",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Direct Flight to Denpasar",
        type: "Shuttle",
        description:
          "Fly into Ngurah Rai International Airport (DPS) from Delhi, Mumbai, or Bangalore. IndiGo, Air Asia, and Singapore Airlines operate direct and one-stop routes.",
        isRecommended: true,
      },
      {
        name: "Airport Shuttle Bus",
        type: "Bus",
        description:
          "Pre-booked hotel shuttles depart every 30 minutes from the arrivals hall. Comfortable and fixed-price — ideal for Kuta, Seminyak, and Sanur.",
      },
      {
        name: "Metered Taxi or Grab",
        type: "Taxi",
        description:
          "Blue Bird metered taxis are reliable from the airport. The Grab app also works well throughout South Bali and Ubud.",
      },
      {
        name: "Private Car with Driver",
        type: "Car",
        description:
          "Hire a driver for full-day excursions (₹3,000–₹4,500). Essential for Ubud, Uluwatu, and the rice terrace villages.",
      },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46d20898?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: [
      "November",
      "December",
      "January",
      "February",
      "March",
      "April",
    ],
    visaType: "VISA_ON_ARRIVAL",
    currency: "MVR",
    language: "Dhivehi",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "May",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "June",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "July",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "August",
        crowdLevel: "HIGH",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "October",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "December",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Direct Flight to Malé",
        type: "Shuttle",
        description:
          "Fly into Velana International Airport (MLE) in Malé. Direct flights operate from Delhi, Mumbai, Bangalore, and Chennai on IndiGo and Air India.",
        isRecommended: true,
      },
      {
        name: "Speedboat Transfer",
        type: "Ferry",
        description:
          "Resort speedboats pick you up from Malé harbour for closer atolls (30–90 min). Transfers are arranged exclusively by your resort.",
        isRecommended: true,
      },
      {
        name: "Seaplane Transfer",
        type: "Shuttle",
        description:
          "Twin Otter seaplanes connect Malé to remote atolls in 30 minutes with spectacular aerial views of coral reefs. Operates sunrise to sunset only.",
      },
      {
        name: "Local Ferry",
        type: "Ferry",
        description:
          "Budget option connecting inhabited islands on fixed government routes. Comfortable for extended stays exploring local culture.",
      },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580094333619-d1a2f8de56dd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571867893906-8a8a80dc7b3b?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: [
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ],
    visaType: "VISA_FREE",
    currency: "INR",
    language: "Malayalam",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "May",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "June",
        crowdLevel: "LOW",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "July",
        crowdLevel: "LOW",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "August",
        crowdLevel: "LOW",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "October",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Train from Major Cities",
        type: "Train",
        description:
          "Indian Railways connects Kochi (ERS), Thiruvananthapuram (TVC), and Kozhikode (CLT) to Mumbai, Delhi, Bangalore, and Chennai. Highly scenic Western Ghats routes.",
        isRecommended: true,
      },
      {
        name: "Domestic Flight",
        type: "Shuttle",
        description:
          "Cochin International Airport (COK) and Thiruvananthapuram (TRV) have frequent IndiGo, Air India, and Vistara connections from all metros.",
        isRecommended: true,
      },
      {
        name: "Rented Car or Self-Drive",
        type: "Car",
        description:
          "Self-drive or hire a driver for ₹2,500–₹3,500/day. Essential for reaching Munnar, Thekkady, and Wayanad from the coast.",
      },
      {
        name: "Backwater Houseboat",
        type: "Ferry",
        description:
          "Traditional kettuvallam houseboats cruise between Alappuzha, Kumarakom, and Kollam. The most atmospheric way to explore the backwaters.",
      },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: ["June", "July", "August", "September"],
    visaType: "VISA_REQUIRED",
    currency: "CHF",
    language: "German, French, Italian",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "May",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "June",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "July",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "August",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "October",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "November",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Flight to Zürich or Geneva",
        type: "Shuttle",
        description:
          "Fly into Zürich (ZRH) or Geneva (GVA) from Delhi or Mumbai via Swiss Air, Lufthansa, or Emirates. Both airports connect directly to the national rail network.",
        isRecommended: true,
      },
      {
        name: "Swiss Travel Pass (Train)",
        type: "Train",
        description:
          "Unlimited travel on trains, buses, and lake boats nationwide. The Glacier Express and Bernina Express are bucket-list scenic rail journeys.",
        isRecommended: true,
      },
      {
        name: "Cable Car & Mountain Railway",
        type: "Cable Car",
        description:
          "Aerial gondolas reach Jungfraujoch, Titlis, and Pilatus summits. Combined with train travel, this is the premium Alpine experience.",
      },
      {
        name: "Rental Car",
        type: "Car",
        description:
          "Ideal for visiting smaller villages and lakes on your own schedule. Roads are excellent but tolls apply on highways (Vignette sticker required).",
      },
    ],
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
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501888499516-6b7e03bccff1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    visaType: "VISA_REQUIRED",
    currency: "EUR",
    language: "Greek",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "LOW",
        availability: "Closed",
        recommendation: "Not recommended",
      },
      {
        month: "February",
        crowdLevel: "LOW",
        availability: "Closed",
        recommendation: "Not recommended",
      },
      {
        month: "March",
        crowdLevel: "LOW",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "May",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "June",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "July",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "August",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "October",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "LOW",
        availability: "Limited",
        recommendation: "Not recommended",
      },
      {
        month: "December",
        crowdLevel: "LOW",
        availability: "Closed",
        recommendation: "Not recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Direct Flight to Santorini",
        type: "Shuttle",
        description:
          "Fly into Santorini International Airport (JTR) from Athens (ATH) in 45 minutes. From India, connect via Athens, Dubai, or Frankfurt.",
        isRecommended: true,
      },
      {
        name: "Ferry from Athens (Piraeus)",
        type: "Ferry",
        description:
          "High-speed catamarans from Piraeus take 5–7 hours through the Cyclades. Overnight ferries are a comfortable and scenic option.",
        isRecommended: false,
      },
      {
        name: "Local Bus (KTEL)",
        type: "Bus",
        description:
          "Santorini's public buses connect Fira with Oia, Perissa, and the airport. Inexpensive but infrequent — plan around bus schedules.",
      },
      {
        name: "ATV or Scooter Rental",
        type: "Car",
        description:
          "The most popular way to explore the island independently. Rentals available in Fira and Kamari from ₹2,000/day.",
      },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545574812-5e7e27e98e33?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520250014268-7b5cbf27f1b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518684286517-e60b9b63e8a0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: ["November", "December", "January", "February", "March"],
    visaType: "VISA_ON_ARRIVAL",
    currency: "AED",
    language: "Arabic",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "May",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "June",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "July",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "August",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "September",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "October",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Direct Flight to Dubai",
        type: "Shuttle",
        description:
          "Dubai (DXB) has direct flights from over 15 Indian cities. Emirates, Air India, and IndiGo operate multiple daily departures from Delhi, Mumbai, and Bangalore.",
        isRecommended: true,
      },
      {
        name: "Dubai Metro",
        type: "Metro",
        description:
          "The Red and Green lines connect the airport to Downtown, Marina, and the Palm. Fast, air-conditioned, and extremely affordable.",
        isRecommended: true,
      },
      {
        name: "Taxi or Uber",
        type: "Taxi",
        description:
          "RTA taxis are metered and reliable. Uber and Careem are widely available with upfront pricing from ₹300 for short rides.",
      },
      {
        name: "Desert Safari Transport",
        type: "Car",
        description:
          "4WD dune-bashing vehicles take you from your hotel to the desert camps. Included in all RapidLuxe desert safari packages.",
      },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a47d70?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539690615072-4cc2012e2c9e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588416936097-51323b0a8e22?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: [
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ],
    visaType: "VISA_FREE",
    currency: "INR",
    language: "Hindi, Rajasthani",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "May",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "June",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "July",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "August",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "October",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "November",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Train to Jaipur or Jodhpur",
        type: "Train",
        description:
          "Rajasthan has excellent rail connectivity. The Palace on Wheels luxury train departs New Delhi and covers Jaipur, Jaisalmer, Jodhpur, and Udaipur.",
        isRecommended: true,
      },
      {
        name: "Domestic Flight",
        type: "Shuttle",
        description:
          "Fly into Jaipur (JAI), Jodhpur (JDH), or Udaipur (UDR). Jaipur is the most connected with IndiGo and Air India flights from Delhi and Mumbai.",
        isRecommended: true,
      },
      {
        name: "Private Car",
        type: "Car",
        description:
          "Hire a car with driver for the Golden Triangle circuit (Delhi–Jaipur–Agra) or a full Rajasthan road trip through the forts and dunes.",
      },
      {
        name: "Camel Safari",
        type: "Walking",
        description:
          "The iconic way to experience the Thar Desert. Overnight camel safaris depart from Jaisalmer and Bikaner with desert camp stays.",
      },
    ],
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
      "https://images.unsplash.com/photo-1525625293430-1dafa70c62b6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1525625293430-1dafa70c62b6?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571417051569-f6aa07c3e0ca?w=800&auto=format&fit=crop&q=80",
    ],
    bestMonths: ["February", "March", "April"],
    visaType: "VISA_FREE",
    currency: "SGD",
    language: "English, Mandarin, Malay, Tamil",
    whenToVisit: [
      {
        month: "January",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "February",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "March",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "April",
        crowdLevel: "LOW",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "May",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "June",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "July",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "August",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
      {
        month: "September",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "October",
        crowdLevel: "MEDIUM",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "November",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Not recommended",
      },
      {
        month: "December",
        crowdLevel: "HIGH",
        availability: "Open",
        recommendation: "Recommended",
      },
    ],
    howToGetThere: [
      {
        name: "Direct Flight to Changi",
        type: "Shuttle",
        description:
          "Singapore Changi (SIN) is Asia's best-connected hub. Direct flights from Delhi, Mumbai, Chennai, Kolkata, and Bangalore on Singapore Airlines, IndiGo, and Scoot.",
        isRecommended: true,
      },
      {
        name: "MRT (Mass Rapid Transit)",
        type: "Metro",
        description:
          "Changi Airport is directly connected to the city via the East-West and Thomson lines. Clean, air-conditioned, and runs until midnight.",
        isRecommended: true,
      },
      {
        name: "Taxi or Grab",
        type: "Taxi",
        description:
          "Grab is the dominant ride-hailing app. Fixed-price airport rides to Orchard are approximately ₹2,500. Taxis are metered and plentiful.",
      },
      {
        name: "City Walking Tours",
        type: "Walking",
        description:
          "Chinatown, Marina Bay, and Kampong Glam are best explored on foot. Singapore is extremely walkable with covered walkways throughout.",
      },
    ],
    createdAt: new Date("2024-01-01"),
  },
];
