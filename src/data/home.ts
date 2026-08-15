import type { HomePageData } from "@/types";

export const homeData: HomePageData = {
  hero: {
    title: "Welcome to",
    titleHighlight: "Logsabha",
    subtitle: "Political Research & Analysis Wing of Bharat",
    videoSrc: "/videos/pre-comp-3-1.mp4",
    posterSrc: "/videos/hero-poster.jpg",
    watermarkLogo: "/logo/mainlogofinal.gif",
    stats: [
      { label: "Civil Secretariat", value: "₹540", unit: "Crore" },
      { label: "17 Projects", value: "₹1,200", unit: "Crore" },
      { label: "EMR School", value: "₹16", unit: "Crore" },
      { label: "Infrastructure", value: "₹2,400", unit: "Crore" },
    ],
  },
  politicalLandscape: {
    badge: "India's Premier Political Intelligence Platform",
    title: "Decoding India's",
    titleHighlight: "Political Landscape",
    subtitle:
      "Real-time analytics, comprehensive insights, and data-driven intelligence for understanding India's democratic pulse.",
    backgroundVideo: "/videos/flag-bg.mp4",
    backgroundPoster: "/videos/flag-poster.jpg",
    overallStats: [
      { icon: "users", value: "543+", label: "Lok Sabha Seats" },
      { icon: "map-pin", value: "28", label: "States Covered" },
      { icon: "bar-chart", value: "1,000+", label: "Campaigns" },
      { icon: "trending-up", value: "95%", label: "Accuracy" },
    ],
    states: [
      { id: "AP", name: "Andhra Pradesh", seats: 25, ndaSeats: 21, indiaSeats: 4, otherSeats: 0, rulingParty: "TDP" },
      { id: "AR", name: "Arunachal Pradesh", seats: 2, ndaSeats: 2, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "AS", name: "Assam", seats: 14, ndaSeats: 9, indiaSeats: 3, otherSeats: 2, rulingParty: "BJP" },
      { id: "BR", name: "Bihar", seats: 40, ndaSeats: 24, indiaSeats: 7, otherSeats: 9, rulingParty: "BJP" },
      { id: "CG", name: "Chhattisgarh", seats: 11, ndaSeats: 10, indiaSeats: 1, otherSeats: 0, rulingParty: "BJP" },
      { id: "GA", name: "Goa", seats: 2, ndaSeats: 1, indiaSeats: 1, otherSeats: 0, rulingParty: "BJP" },
      { id: "GJ", name: "Gujarat", seats: 26, ndaSeats: 25, indiaSeats: 1, otherSeats: 0, rulingParty: "BJP" },
      { id: "HR", name: "Haryana", seats: 10, ndaSeats: 5, indiaSeats: 5, otherSeats: 0, rulingParty: "BJP" },
      { id: "HP", name: "Himachal Pradesh", seats: 4, ndaSeats: 4, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "JK", name: "Jammu & Kashmir", seats: 5, ndaSeats: 4, indiaSeats: 0, otherSeats: 1, rulingParty: "BJP" },
      { id: "JH", name: "Jharkhand", seats: 14, ndaSeats: 8, indiaSeats: 5, otherSeats: 1, rulingParty: "JMM" },
      { id: "KA", name: "Karnataka", seats: 28, ndaSeats: 17, indiaSeats: 9, otherSeats: 2, rulingParty: "BJP" },
      { id: "KL", name: "Kerala", seats: 20, ndaSeats: 1, indiaSeats: 16, otherSeats: 3, rulingParty: "INC" },
      { id: "MP", name: "Madhya Pradesh", seats: 29, ndaSeats: 29, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "MH", name: "Maharashtra", seats: 48, ndaSeats: 16, indiaSeats: 30, otherSeats: 2, rulingParty: "BJP" },
      { id: "MN", name: "Manipur", seats: 2, ndaSeats: 0, indiaSeats: 2, otherSeats: 0, rulingParty: "BJP" },
      { id: "ML", name: "Meghalaya", seats: 2, ndaSeats: 0, indiaSeats: 1, otherSeats: 1, rulingParty: "NPP" },
      { id: "MZ", name: "Mizoram", seats: 1, ndaSeats: 0, indiaSeats: 0, otherSeats: 1, rulingParty: "ZPM" },
      { id: "NL", name: "Nagaland", seats: 1, ndaSeats: 0, indiaSeats: 1, otherSeats: 0, rulingParty: "NDPP" },
      { id: "OD", name: "Odisha", seats: 21, ndaSeats: 20, indiaSeats: 1, otherSeats: 0, rulingParty: "BJP" },
      { id: "PB", name: "Punjab", seats: 13, ndaSeats: 0, indiaSeats: 7, otherSeats: 6, rulingParty: "AAP" },
      { id: "RJ", name: "Rajasthan", seats: 25, ndaSeats: 14, indiaSeats: 8, otherSeats: 3, rulingParty: "BJP" },
      { id: "SK", name: "Sikkim", seats: 1, ndaSeats: 1, indiaSeats: 0, otherSeats: 0, rulingParty: "SKM" },
      { id: "TN", name: "Tamil Nadu", seats: 39, ndaSeats: 0, indiaSeats: 22, otherSeats: 17, rulingParty: "TMC" },
      { id: "TS", name: "Telangana", seats: 17, ndaSeats: 8, indiaSeats: 8, otherSeats: 1, rulingParty: "INC" },
      { id: "TR", name: "Tripura", seats: 2, ndaSeats: 2, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "UP", name: "Uttar Pradesh", seats: 80, ndaSeats: 33, indiaSeats: 43, otherSeats: 4, rulingParty: "BJP" },
      { id: "UK", name: "Uttarakhand", seats: 5, ndaSeats: 5, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "WB", name: "West Bengal", seats: 42, ndaSeats: 12, indiaSeats: 30, otherSeats: 0, rulingParty: "BJP" },
      { id: "DL", name: "Delhi", seats: 7, ndaSeats: 7, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "AN", name: "Andaman & Nicobar Islands", seats: 1, ndaSeats: 1, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "CH", name: "Chandigarh", seats: 1, ndaSeats: 0, indiaSeats: 1, otherSeats: 0, rulingParty: "INC" },
      { id: "DN", name: "Dadra & Nagar Haveli", seats: 1, ndaSeats: 1, indiaSeats: 0, otherSeats: 0, rulingParty: "BJP" },
      { id: "DD", name: "Daman & Diu", seats: 1, ndaSeats: 0, indiaSeats: 0, otherSeats: 1, rulingParty: "OTH" },
      { id: "LD", name: "Lakshadweep", seats: 1, ndaSeats: 0, indiaSeats: 1, otherSeats: 0, rulingParty: "INC" },
      { id: "PY", name: "Puducherry", seats: 1, ndaSeats: 0, indiaSeats: 1, otherSeats: 0, rulingParty: "INC" },
    ],
  },
  services: {
    title: "Our",
    titleHighlight: "Services",
    subtitle:
      "Political consulting services powered by data intelligence and strategic insight.",
    services: [
      {
        id: "campaign-strategy",
        icon: "target",
        title: "Campaign Strategy",
        description:
          "Data-driven strategic planning to maximize campaign effectiveness and voter engagement across constituencies.",
        image: "/images/Campaign Strategy.png",
        stats: [
          { value: 94, suffix: "%", label: "SUCCESS RATE" },
          { value: 250, suffix: "+", label: "CAMPAIGNS LED" },
        ],
        bulletPoints: [
          "Strategic roadmap development",
          "Target audience identification",
          "Message crafting & positioning",
        ],
        learnMoreLink: "/services#strategy",
      },
      {
        id: "political-analytics",
        icon: "bar-chart",
        title: "Political Analytics",
        description:
          "Advanced data analytics and predictive modeling for election forecasting and political trend analysis.",
        image: "/images/Political Analysis.jpeg",
        stats: [
          { value: 98, suffix: "%", label: "ACCURACY" },
          { value: 500, suffix: "+", label: "REPORTS DELIVERED" },
        ],
        bulletPoints: [
          "Election result prediction",
          "Sentiment analysis & tracking",
          "Demographic profiling",
        ],
        learnMoreLink: "/services#constituency",
      },
      {
        id: "voter-outreach",
        icon: "users",
        title: "Voter Outreach",
        description:
          "Comprehensive voter engagement programs combining grassroots mobilization with digital outreach strategies.",
        image: "/images/Voter Outreach.png",
        stats: [
          { value: 10, suffix: "M+", label: "VOTERS REACHED" },
          { value: 120, suffix: "+", label: "CONSTITUENCIES" },
        ],
        bulletPoints: [
          "Door-to-door campaign planning",
          "Community engagement programs",
          "Volunteer network management",
        ],
        learnMoreLink: "/services#campaigning",
      },
      {
        id: "media-management",
        icon: "tv",
        title: "Media Management",
        description:
          "Strategic media planning, crisis communication, and reputation management for political leaders.",
        image: "/images/Media Management.png",
        stats: [
          { value: 85, suffix: "%", label: "POSITIVE COVERAGE" },
          { value: 1000, suffix: "+", label: "MEDIA PLACEMENTS" },
        ],
        bulletPoints: [
          "Press conference management",
          "Social media strategy",
          "Crisis communication response",
        ],
        learnMoreLink: "/services#campaigning",
      },
      {
        id: "opposition-research",
        icon: "search",
        title: "Opposition Research",
        description:
          "In-depth opposition analysis and competitive intelligence to stay ahead in the political landscape.",
        image: "/images/Op-sr.avif",
        stats: [
          { value: 200, suffix: "+", label: "PROFILES ANALYZED" },
          { value: 50, suffix: "+", label: "ELECTIONS COVERED" },
        ],
        bulletPoints: [
          "Candidate vulnerability assessment",
          "Policy gap analysis",
          "Historical voting pattern study",
        ],
        learnMoreLink: "/services#survey",
      },
      {
        id: "digital-campaigns",
        icon: "monitor",
        title: "Digital Campaigns",
        description:
          "End-to-end digital campaign execution including social media, ads, and online reputation management.",
        image: "/images/Digital Campaigns.png",
        stats: [
          { value: 50, suffix: "M+", label: "IMPRESSIONS" },
          { value: 300, suffix: "+", label: "CAMPAIGNS RUN" },
        ],
        bulletPoints: [
          "Social media advertising",
          "Content creation & distribution",
          "Online reputation monitoring",
        ],
        learnMoreLink: "/services#campaigning",
      },
    ],
  },
  sections: [],
};
