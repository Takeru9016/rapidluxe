export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  authorAvatarUrl: string;
  imageUrl: string;
  readTime: number;
  publishedAt: Date;
  tags: string[];
}

export const dummyBlogPosts: BlogPost[] = [
  {
    id: "blog-001",
    title: "10 Things Nobody Tells You Before Travelling to Southeast Asia",
    slug: "things-nobody-tells-you-southeast-asia",
    category: "Travel Tips",
    excerpt:
      "From SIM cards to street food etiquette, these insider tips will save you from rookie mistakes and make your first Southeast Asia trip genuinely seamless.",
    body: "Southeast Asia is one of the most rewarding regions on earth for first-time travellers. The food, the culture, the temples — it all comes together beautifully. But there are a few things the guidebooks skip. First, get a local SIM card the moment you land. Second, carry small denomination notes at all times — street vendors rarely have change for large bills. Third, dress modestly when visiting temples, even if it is 38°C outside. Fourth, bargaining is expected in markets but be gracious about it. Fifth, eat where the locals eat — the plastic-stool restaurants with handwritten menus are always the best. Sixth, book overnight buses and trains well in advance during peak season. Seventh, learn three words in the local language — locals appreciate the effort enormously. Eighth, travel insurance is non-negotiable. Ninth, budget for more than you think — it is easy to extend your trip once you are there. Tenth, slow down. The best experiences happen when you stop rushing.",
    author: "Priya Mehta",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1537996088002-8e4f8e9e3c3e?w=800&auto=format&fit=crop&q=80",
    readTime: 4,
    publishedAt: new Date("2025-04-10"),
    tags: ["Travel Tips", "Southeast Asia", "First Time Traveller"],
  },
  {
    id: "blog-002",
    title: "Maldives vs Bali: Which Island Escape is Right for You?",
    slug: "maldives-vs-bali-which-is-right-for-you",
    category: "Destination Guide",
    excerpt:
      "Both are paradise. But they are very different paradises. We break down budget, vibe, activities, and ideal travel personas to help you decide.",
    body: "The Maldives and Bali are two of the most sought-after island destinations from India — and for good reason. Both offer turquoise waters, stunning sunsets, and world-class hospitality. But choosing between them comes down to what kind of traveller you are. The Maldives is about seclusion, silence, and luxury. You come here to do nothing magnificently — snorkel in crystalline lagoons, watch phosphorescent plankton at night, and eat freshly caught tuna at your overwater villa. Bali, by contrast, is alive. It has culture, ceremony, rice terraces, volcanic peaks, surf breaks, yoga retreats, and a nightlife scene in Seminyak that rivals Ibiza. Budget-wise, Bali is significantly more accessible. A high-quality week in Bali can cost ₹80,000–1,20,000 per person while an equivalent Maldives experience starts at ₹2,00,000. For honeymooners seeking pure romance, the Maldives wins. For couples who want to explore, eat their way through a destination, and have adventures between beach days, Bali is the answer.",
    author: "Arjun Sharma",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f7fb2b?w=100&auto=format&fit=crop&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    readTime: 6,
    publishedAt: new Date("2025-03-22"),
    tags: ["Maldives", "Bali", "Destination Guide", "Honeymoon"],
  },
  {
    id: "blog-003",
    title: "Planning the Perfect Indian Honeymoon: A Complete Guide",
    slug: "perfect-indian-honeymoon-complete-guide",
    category: "Honeymoon",
    excerpt:
      "From booking timelines to GST on packages, legal documentation to destination shortlisting — here is everything an Indian couple needs to plan their dream honeymoon.",
    body: "Honeymoon planning in India has its own unique considerations. You are often planning 4–6 months in advance, coordinating with family, managing budgets that include wedding costs, and navigating a complex landscape of international visas. Here is a streamlined guide. Start with budget clarity — decide on a realistic per-person figure inclusive of flights, accommodation, and activities. Then shortlist two or three destinations that match your interests as a couple, not just what is trending on Instagram. For international destinations, check visa requirements early — Schengen visas for Europe need 90 days lead time. Book flights before accommodation — they are harder to change. For packages above ₹2,00,000, have your PAN card details handy as it is a legal requirement under FEMA regulations. Purchase comprehensive travel insurance that covers medical evacuation. Finally, carry a mix of payment methods — your forex card, some cash in local currency, and an international debit card as backup.",
    author: "Kavya Iyer",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=100&auto=format&fit=crop&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
    readTime: 3,
    publishedAt: new Date("2025-05-02"),
    tags: ["Honeymoon", "India", "Planning", "Tips"],
  },
  {
    id: "blog-004",
    title:
      "Patagonia, Kilimanjaro, and Beyond: India's New Adventure Travellers",
    slug: "patagonia-kilimanjaro-india-adventure-travellers",
    category: "Adventure",
    excerpt:
      "A new generation of Indian travellers is trading beach loungers for crampons and summits. We spoke to five adventure seekers who are redefining what luxury travel looks like.",
    body: "When Rohit Malhotra, a 34-year-old fintech founder from Bangalore, summited Kilimanjaro last October, he was joined on the trail by four other Indians he had never met. Two were doctors from Mumbai, one was a school principal from Ahmedabad, and one was a retired army officer from Pune. This would have been unthinkable a decade ago. Indian adventure travel has exploded. Between 2022 and 2025, the number of Indian trekkers on Himalayan routes above 5,000 metres has tripled. International adventure destinations — Patagonia, Iceland, the Faroe Islands, Svalbard — are seeing significant Indian visitor growth. What is driving this shift? A combination of factors: more disposable income, more content creators documenting expeditions, and a generation that grew up watching Bear Grylls and now has the means to do it themselves. The adventure travel market in India is estimated to be growing at 22% annually. And it is not budget adventure — these travellers want expert guides, quality gear, satellite communication, and luxury base camps. Adventure and luxury are no longer opposites.",
    author: "Vikram Nair",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=100&auto=format&fit=crop&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1516026672322-375526dff3e5?w=800&auto=format&fit=crop&q=80",
    readTime: 8,
    publishedAt: new Date("2025-04-28"),
    tags: ["Adventure", "Kilimanjaro", "Patagonia", "Luxury Adventure"],
  },
];
