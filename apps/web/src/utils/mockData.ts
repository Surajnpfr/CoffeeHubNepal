export const MOCK_NOTICES = [
  { 
    id: 1, 
    title: "NTCB Fertilizer Subsidy 2024", 
    date: "Jan 15, 2024", 
    body: "Government subsidies for organic fertilizers are now open for Gulmi district farmers.", 
    priority: "High" as const, 
    type: "Govt" 
  },
  { 
    id: 2, 
    title: "Monsoon Harvest Training", 
    date: "Feb 2, 2024", 
    body: "Join us at the Ruru cooperative for post-harvest processing workshops.", 
    priority: "Medium" as const, 
    type: "Training" 
  }
];

export const MOCK_JOBS = [
  { 
    id: 1, 
    title: "Seasonal Berry Pickers", 
    farm: "Everest Coffee Estate", 
    location: "Kaski", 
    pay: "Rs. 800/day", 
    type: "Seasonal" 
  },
  { 
    id: 2, 
    title: "Head Roaster", 
    farm: "Himalayan Beans", 
    location: "Kathmandu", 
    pay: "Negotiable", 
    type: "Full-time" 
  }
];

export const MOCK_PRICES = [
  { variety: "Arabica Cherry", price: 95, change: "+2.5%", trend: "up" as const },
  { variety: "Arabica Parchment", price: 460, change: "-0.5%", trend: "down" as const },
  { variety: "Green Beans (A)", price: 950, change: "+1.2%", trend: "up" as const },
  { variety: "Robusta Cherry", price: 82, change: "0.0%", trend: "stable" as const }
];

export const MOCK_LISTINGS = [
  { 
    id: 101, 
    title: "A-Grade Parchment", 
    price: 850, 
    unit: "kg", 
    location: "Kaski", 
    user: "Siddhartha Farm", 
    verified: true, 
    category: "Arabica", 
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400", 
    desc: "Grade A parchment coffee from high altitude Kaski region." 
  },
  { 
    id: 102, 
    title: "Manual Burr Grinder", 
    price: 4500, 
    unit: "pc", 
    location: "Kathmandu", 
    user: "Brew Tools NP", 
    verified: false, 
    category: "Gear", 
    image: "https://images.unsplash.com/photo-1544666107-59448d9465b7?auto=format&fit=crop&w=400", 
    desc: "Ceramic burr grinder for home use." 
  }
];

export const MOCK_QA = [
  { 
    id: 201, 
    title: "How to handle leaf rust at 1500m?", 
    author: "Ram Thapa", 
    answers: 12, 
    tags: ["Disease"], 
    desc: "I've noticed small orange spots on my trees in Gulmi." 
  }
];

