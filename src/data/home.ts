import type { HomePageData } from "@/types";

export const homeData: HomePageData = {
  hero: {
    title: "Welcome to",
    titleHighlight: "Logsabha",
    subtitle: "Political Research & Analysis Wing of Bharat",
    videoSrc: "/videos/hero-bg.mp4",
    posterSrc: "/videos/hero-poster.jpg",
    watermarkLogo: "/logo/Logfinalsabha.gif",
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
      { id: "AP", name: "Andhra Pradesh", seats: 25, ndaSeats: 21, indiaSeats: 4, otherSeats: 0 },
      { id: "AR", name: "Arunachal Pradesh", seats: 2, ndaSeats: 2, indiaSeats: 0, otherSeats: 0 },
      { id: "AS", name: "Assam", seats: 14, ndaSeats: 11, indiaSeats: 3, otherSeats: 0 },
      { id: "BR", name: "Bihar", seats: 40, ndaSeats: 30, indiaSeats: 9, otherSeats: 1 },
      { id: "CG", name: "Chhattisgarh", seats: 11, ndaSeats: 10, indiaSeats: 1, otherSeats: 0 },
      { id: "GA", name: "Goa", seats: 2, ndaSeats: 1, indiaSeats: 1, otherSeats: 0 },
      { id: "GJ", name: "Gujarat", seats: 26, ndaSeats: 25, indiaSeats: 1, otherSeats: 0 },
      { id: "HR", name: "Haryana", seats: 10, ndaSeats: 5, indiaSeats: 5, otherSeats: 0 },
      { id: "HP", name: "Himachal Pradesh", seats: 4, ndaSeats: 4, indiaSeats: 0, otherSeats: 0 },
      { id: "JK", name: "Jammu & Kashmir", seats: 5, ndaSeats: 2, indiaSeats: 3, otherSeats: 0 },
      { id: "JH", name: "Jharkhand", seats: 14, ndaSeats: 8, indiaSeats: 6, otherSeats: 0 },
      { id: "KA", name: "Karnataka", seats: 28, ndaSeats: 17, indiaSeats: 9, otherSeats: 2 },
      { id: "KL", name: "Kerala", seats: 20, ndaSeats: 0, indiaSeats: 18, otherSeats: 2 },
      { id: "MP", name: "Madhya Pradesh", seats: 29, ndaSeats: 29, indiaSeats: 0, otherSeats: 0 },
      { id: "MH", name: "Maharashtra", seats: 48, ndaSeats: 17, indiaSeats: 30, otherSeats: 1 },
      { id: "MN", name: "Manipur", seats: 2, ndaSeats: 1, indiaSeats: 1, otherSeats: 0 },
      { id: "ML", name: "Meghalaya", seats: 2, ndaSeats: 1, indiaSeats: 1, otherSeats: 0 },
      { id: "MZ", name: "Mizoram", seats: 1, ndaSeats: 1, indiaSeats: 0, otherSeats: 0 },
      { id: "NL", name: "Nagaland", seats: 1, ndaSeats: 1, indiaSeats: 0, otherSeats: 0 },
      { id: "OD", name: "Odisha", seats: 21, ndaSeats: 20, indiaSeats: 1, otherSeats: 0 },
      { id: "PB", name: "Punjab", seats: 13, ndaSeats: 0, indiaSeats: 7, otherSeats: 6 },
      { id: "RJ", name: "Rajasthan", seats: 25, ndaSeats: 14, indiaSeats: 11, otherSeats: 0 },
      { id: "SK", name: "Sikkim", seats: 1, ndaSeats: 0, indiaSeats: 0, otherSeats: 1 },
      { id: "TN", name: "Tamil Nadu", seats: 39, ndaSeats: 0, indiaSeats: 39, otherSeats: 0 },
      { id: "TS", name: "Telangana", seats: 17, ndaSeats: 8, indiaSeats: 9, otherSeats: 0 },
      { id: "TR", name: "Tripura", seats: 2, ndaSeats: 2, indiaSeats: 0, otherSeats: 0 },
      { id: "UP", name: "Uttar Pradesh", seats: 80, ndaSeats: 36, indiaSeats: 43, otherSeats: 1 },
      { id: "UK", name: "Uttarakhand", seats: 5, ndaSeats: 5, indiaSeats: 0, otherSeats: 0 },
      { id: "WB", name: "West Bengal", seats: 42, ndaSeats: 12, indiaSeats: 29, otherSeats: 1 },
      { id: "DL", name: "Delhi", seats: 7, ndaSeats: 7, indiaSeats: 0, otherSeats: 0 },
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
        image: "/images/services/campaign-strategy.jpg",
        stats: [
          { value: 94, suffix: "%", label: "SUCCESS RATE" },
          { value: 250, suffix: "+", label: "CAMPAIGNS LED" },
        ],
        bulletPoints: [
          "Strategic roadmap development",
          "Target audience identification",
          "Message crafting & positioning",
        ],
        learnMoreLink: "/services/campaign-strategy",
      },
      {
        id: "political-analytics",
        icon: "bar-chart",
        title: "Political Analytics",
        description:
          "Advanced data analytics and predictive modeling for election forecasting and political trend analysis.",
        image: "/images/services/political-analytics.jpg",
        stats: [
          { value: 98, suffix: "%", label: "ACCURACY" },
          { value: 500, suffix: "+", label: "REPORTS DELIVERED" },
        ],
        bulletPoints: [
          "Election result prediction",
          "Sentiment analysis & tracking",
          "Demographic profiling",
        ],
        learnMoreLink: "/services/political-analytics",
      },
      {
        id: "voter-outreach",
        icon: "users",
        title: "Voter Outreach",
        description:
          "Comprehensive voter engagement programs combining grassroots mobilization with digital outreach strategies.",
        image: "/images/services/voter-outreach.jpg",
        stats: [
          { value: 10, suffix: "M+", label: "VOTERS REACHED" },
          { value: 120, suffix: "+", label: "CONSTITUENCIES" },
        ],
        bulletPoints: [
          "Door-to-door campaign planning",
          "Community engagement programs",
          "Volunteer network management",
        ],
        learnMoreLink: "/services/voter-outreach",
      },
      {
        id: "media-management",
        icon: "tv",
        title: "Media Management",
        description:
          "Strategic media planning, crisis communication, and reputation management for political leaders.",
        image: "/images/services/media-management.jpg",
        stats: [
          { value: 85, suffix: "%", label: "POSITIVE COVERAGE" },
          { value: 1000, suffix: "+", label: "MEDIA PLACEMENTS" },
        ],
        bulletPoints: [
          "Press conference management",
          "Social media strategy",
          "Crisis communication response",
        ],
        learnMoreLink: "/services/media-management",
      },
      {
        id: "opposition-research",
        icon: "search",
        title: "Opposition Research",
        description:
          "In-depth opposition analysis and competitive intelligence to stay ahead in the political landscape.",
        image: "/images/services/opposition-research.jpg",
        stats: [
          { value: 200, suffix: "+", label: "PROFILES ANALYZED" },
          { value: 50, suffix: "+", label: "ELECTIONS COVERED" },
        ],
        bulletPoints: [
          "Candidate vulnerability assessment",
          "Policy gap analysis",
          "Historical voting pattern study",
        ],
        learnMoreLink: "/services/opposition-research",
      },
      {
        id: "digital-campaigns",
        icon: "monitor",
        title: "Digital Campaigns",
        description:
          "End-to-end digital campaign execution including social media, ads, and online reputation management.",
        image: "/images/services/digital-campaigns.jpg",
        stats: [
          { value: 50, suffix: "M+", label: "IMPRESSIONS" },
          { value: 300, suffix: "+", label: "CAMPAIGNS RUN" },
        ],
        bulletPoints: [
          "Social media advertising",
          "Content creation & distribution",
          "Online reputation monitoring",
        ],
        learnMoreLink: "/services/digital-campaigns",
      },
    ],
  },
  sections: [],
};
