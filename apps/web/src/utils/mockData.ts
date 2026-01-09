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
    type: "Seasonal",
    description: "We are looking for experienced seasonal berry pickers to join our team at Everest Coffee Estate. This position requires hands-on experience in coffee farming and processing.",
    requirements: "Minimum 2 years of experience in coffee farming, Physical fitness for field work, Knowledge of organic farming practices preferred",
    benefits: "Competitive salary package, Accommodation provided, Training and skill development opportunities",
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "user1" // Example user ID
  },
  { 
    id: 2, 
    title: "Head Roaster", 
    farm: "Himalayan Beans", 
    location: "Kathmandu", 
    pay: "Negotiable", 
    type: "Full-time",
    description: "We are seeking an experienced Head Roaster to lead our roasting operations. The ideal candidate should have extensive knowledge of coffee roasting techniques.",
    requirements: "Minimum 5 years of roasting experience, Certification in coffee roasting preferred, Strong leadership skills",
    benefits: "Competitive salary, Health insurance, Professional development opportunities",
    createdAt: "2024-01-20T14:30:00Z",
    createdBy: "user2" // Example user ID
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    applicantId: "applicant1",
    applicantName: "Ram Shrestha",
    applicantEmail: "ram.shrestha@example.com",
    applicantPhone: "+977 9801234567",
    status: "pending" as const,
    appliedAt: "2024-01-16T09:00:00Z",
    message: "I have 3 years of experience in coffee farming and would love to join your team."
  },
  {
    id: 2,
    jobId: 1,
    applicantId: "applicant2",
    applicantName: "Sita Tamang",
    applicantEmail: "sita.tamang@example.com",
    applicantPhone: "+977 9802345678",
    status: "accepted" as const,
    appliedAt: "2024-01-16T11:30:00Z",
    message: "I am very interested in this position and have relevant experience."
  },
  {
    id: 3,
    jobId: 1,
    applicantId: "applicant3",
    applicantName: "Hari Gurung",
    applicantEmail: "hari.gurung@example.com",
    applicantPhone: "+977 9803456789",
    status: "pending" as const,
    appliedAt: "2024-01-17T08:15:00Z"
  },
  {
    id: 4,
    jobId: 2,
    applicantId: "applicant4",
    applicantName: "Gita Thapa",
    applicantEmail: "gita.thapa@example.com",
    applicantPhone: "+977 9804567890",
    status: "pending" as const,
    appliedAt: "2024-01-21T10:00:00Z",
    message: "I have been roasting coffee for 6 years and would be excited to lead your team."
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

