export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email: string;
  linkedin?: string;
}

export const dummyTeam: TeamMember[] = [
  {
    id: "team-001",
    name: "Rohit Kapoor",
    role: "Chief Executive Officer",
    bio: "Rohit founded RapidLuxe after 15 years in premium hospitality across the Oberoi and Taj groups. His vision: make truly bespoke luxury travel accessible to India's ambitious middle class without sacrificing an ounce of quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=400&auto=format&fit=crop&q=80",
    email: "rohit@rapidluxe.com",
    linkedin: "https://linkedin.com/in/rohitkapoor",
  },
  {
    id: "team-002",
    name: "Anika Menon",
    role: "Head of Experiences",
    bio: "A travel journalist turned curator, Anika has personally vetted every destination and hotel partner in the RapidLuxe portfolio. She has slept in 200+ hotels across 45 countries and brings that first-hand knowledge to every itinerary she designs.",
    imageUrl:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&auto=format&fit=crop&q=80",
    email: "anika@rapidluxe.com",
    linkedin: "https://linkedin.com/in/anikamenon",
  },
  {
    id: "team-003",
    name: "Suresh Pillai",
    role: "Lead Concierge",
    bio: "With 20 years in luxury concierge services including a decade at a leading Five-star property in Dubai, Suresh handles every client request with grace and precision. No ask is too unusual — he once arranged a private Kathakali performance inside a 400-year-old Kerala fort.",
    imageUrl:
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=400&auto=format&fit=crop&q=80",
    email: "suresh@rapidluxe.com",
  },
  {
    id: "team-004",
    name: "Sahil Jadhav",
    role: "Head of Technology",
    bio: "Sahil leads the engineering team building the RapidLuxe platform — a best-in-class booking experience that blends editorial luxury with seamless technology. Previously built fintech products serving 2M+ users across Southeast Asia.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=400&auto=format&fit=crop&q=80",
    email: "sahil@rapidluxe.com",
    linkedin: "https://linkedin.com/in/sahiljadhav",
  },
];
