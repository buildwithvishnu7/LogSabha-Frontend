// GENERATED from reference/new_ref/assets/logsabha-data.js — do not hand-edit.
//
// General Election to the Lok Sabha, 2024 (18th Lok Sabha). Seat counts are the
// declared results and the state rows sum to exactly 543. Alliance attribution
// follows the pre-poll alliances declared to the ECI.
//
// This is the UI dataset — the left rail, the stat panel and the legend all read
// from it, so it is bundled. The 759-district BOUNDARY geometry is not: that is
// 339KB and lives in public/data/india-geo.json, fetched only when the 3D map
// actually mounts.

export type PartyInfo = { name: string; c: string; al?: string };
export type StateRow = {
  seats: number; n: number; i: number; o: number; t: number; z: string;
  p: Record<string, number>; lead: string; leadSeats: number;
  win: string; name: string;
};

export const lsParty: Record<string, PartyInfo> = {
  "BJP": {
    "name": "Bharatiya Janata Party",
    "c": "#FF9933",
    "al": "NDA"
  },
  "INC": {
    "name": "Indian National Congress",
    "c": "#19AAED",
    "al": "INDIA"
  },
  "SP": {
    "name": "Samajwadi Party",
    "c": "#D62828",
    "al": "INDIA"
  },
  "TMC": {
    "name": "All India Trinamool Congress",
    "c": "#20A64C",
    "al": "INDIA"
  },
  "DMK": {
    "name": "Dravida Munnetra Kazhagam",
    "c": "#E5171F",
    "al": "INDIA"
  },
  "TDP": {
    "name": "Telugu Desam Party",
    "c": "#FFD100",
    "al": "NDA"
  },
  "JDU": {
    "name": "Janata Dal (United)",
    "c": "#1B7A3E",
    "al": "NDA"
  },
  "SHS": {
    "name": "Shiv Sena",
    "c": "#FF6A13",
    "al": "NDA"
  },
  "SSUBT": {
    "name": "Shiv Sena (UBT)",
    "c": "#E85D04",
    "al": "INDIA"
  },
  "NCPSP": {
    "name": "NCP (Sharadchandra Pawar)",
    "c": "#00A0E3",
    "al": "INDIA"
  },
  "NCP": {
    "name": "Nationalist Congress Party",
    "c": "#1D6FB8",
    "al": "NDA"
  },
  "RJD": {
    "name": "Rashtriya Janata Dal",
    "c": "#007A33",
    "al": "INDIA"
  },
  "CPIM": {
    "name": "Communist Party of India (Marxist)",
    "c": "#DE0000",
    "al": "INDIA"
  },
  "CPI": {
    "name": "Communist Party of India",
    "c": "#B71C1C",
    "al": "INDIA"
  },
  "CPIML": {
    "name": "CPI (Marxist–Leninist) Liberation",
    "c": "#C62828",
    "al": "INDIA"
  },
  "AAP": {
    "name": "Aam Aadmi Party",
    "c": "#0F52BA",
    "al": "INDIA"
  },
  "YSRCP": {
    "name": "YSR Congress Party",
    "c": "#1569C7",
    "al": "OTH"
  },
  "JMM": {
    "name": "Jharkhand Mukti Morcha",
    "c": "#006400",
    "al": "INDIA"
  },
  "AIMIM": {
    "name": "AIMIM",
    "c": "#007A3D",
    "al": "OTH"
  },
  "JKNC": {
    "name": "Jammu & Kashmir National Conference",
    "c": "#C8102E",
    "al": "INDIA"
  },
  "SAD": {
    "name": "Shiromani Akali Dal",
    "c": "#0072BC",
    "al": "OTH"
  },
  "LJPRV": {
    "name": "Lok Janshakti Party (Ram Vilas)",
    "c": "#6A4C93",
    "al": "NDA"
  },
  "JSP": {
    "name": "Janasena Party",
    "c": "#D7263D",
    "al": "NDA"
  },
  "JDS": {
    "name": "Janata Dal (Secular)",
    "c": "#138808",
    "al": "NDA"
  },
  "RLD": {
    "name": "Rashtriya Lok Dal",
    "c": "#7CB342",
    "al": "NDA"
  },
  "ADS": {
    "name": "Apna Dal (Soneylal)",
    "c": "#F2A900",
    "al": "NDA"
  },
  "HAM": {
    "name": "Hindustani Awam Morcha",
    "c": "#8D6E63",
    "al": "NDA"
  },
  "AGP": {
    "name": "Asom Gana Parishad",
    "c": "#F4511E",
    "al": "NDA"
  },
  "UPPL": {
    "name": "United People’s Party Liberal",
    "c": "#00897B",
    "al": "NDA"
  },
  "AJSU": {
    "name": "AJSU Party",
    "c": "#FBC02D",
    "al": "NDA"
  },
  "SKM": {
    "name": "Sikkim Krantikari Morcha",
    "c": "#43A047",
    "al": "NDA"
  },
  "ASP": {
    "name": "Azad Samaj Party (Kanshi Ram)",
    "c": "#3949AB",
    "al": "OTH"
  },
  "RLP": {
    "name": "Rashtriya Loktantrik Party",
    "c": "#EF6C00",
    "al": "INDIA"
  },
  "BAP": {
    "name": "Bharat Adivasi Party",
    "c": "#00695C",
    "al": "INDIA"
  },
  "VCK": {
    "name": "Viduthalai Chiruthaigal Katchi",
    "c": "#1A237E",
    "al": "INDIA"
  },
  "MDMK": {
    "name": "Marumalarchi DMK",
    "c": "#AD1457",
    "al": "INDIA"
  },
  "IUML": {
    "name": "Indian Union Muslim League",
    "c": "#2E7D32",
    "al": "INDIA"
  },
  "KECM": {
    "name": "Kerala Congress (M)",
    "c": "#558B2F",
    "al": "INDIA"
  },
  "RSP": {
    "name": "Revolutionary Socialist Party",
    "c": "#C0392B",
    "al": "INDIA"
  },
  "ZPM": {
    "name": "Zoram People’s Movement",
    "c": "#5E35B1",
    "al": "OTH"
  },
  "VOTPP": {
    "name": "Voice of the People Party",
    "c": "#00838F",
    "al": "OTH"
  },
  "IND": {
    "name": "Independent",
    "c": "#78909C",
    "al": "OTH"
  }
};

/** NDA 293 + INDIA 234 + Others 16 = 543. "NC" is not an alliance but the
 *  not-contested marker the map uses for states with no poll in a given year. */
export const lsAlliance: Record<string, { name: string; c: string; seats: number }> = {
  "NDA": {
    "name": "National Democratic Alliance",
    "c": "#FF9933",
    "seats": 293
  },
  "INDIA": {
    "name": "INDIA Bloc",
    "c": "#1B6EC2",
    "seats": 234
  },
  "OTH": {
    "name": "Others",
    "c": "#138808",
    "seats": 16
  },
  "NC": {
    "name": "Not contested",
    "c": "#C7D2DE",
    "seats": 0
  }
};

export const lsStates: Record<string, StateRow> = {
  "Uttar Pradesh": {
    "seats": 80,
    "n": 36,
    "i": 43,
    "o": 1,
    "t": 56.92,
    "z": "North",
    "p": {
      "SP": 37,
      "BJP": 33,
      "INC": 6,
      "RLD": 2,
      "ADS": 1,
      "ASP": 1
    },
    "lead": "SP",
    "leadSeats": 37,
    "win": "INDIA",
    "name": "Uttar Pradesh"
  },
  "Maharashtra": {
    "seats": 48,
    "n": 17,
    "i": 30,
    "o": 1,
    "t": 61.29,
    "z": "West",
    "p": {
      "INC": 13,
      "SSUBT": 9,
      "BJP": 9,
      "NCPSP": 8,
      "SHS": 7,
      "NCP": 1,
      "IND": 1
    },
    "lead": "INC",
    "leadSeats": 13,
    "win": "INDIA",
    "name": "Maharashtra"
  },
  "West Bengal": {
    "seats": 42,
    "n": 12,
    "i": 30,
    "o": 0,
    "t": 81.76,
    "z": "East",
    "p": {
      "TMC": 29,
      "BJP": 12,
      "INC": 1
    },
    "lead": "TMC",
    "leadSeats": 29,
    "win": "INDIA",
    "name": "West Bengal"
  },
  "Bihar": {
    "seats": 40,
    "n": 30,
    "i": 9,
    "o": 1,
    "t": 56.28,
    "z": "East",
    "p": {
      "BJP": 12,
      "JDU": 12,
      "LJPRV": 5,
      "RJD": 4,
      "INC": 3,
      "CPIML": 2,
      "HAM": 1,
      "IND": 1
    },
    "lead": "BJP",
    "leadSeats": 12,
    "win": "NDA",
    "name": "Bihar"
  },
  "Tamil Nadu": {
    "seats": 39,
    "n": 0,
    "i": 39,
    "o": 0,
    "t": 69.72,
    "z": "South",
    "p": {
      "DMK": 22,
      "INC": 9,
      "VCK": 2,
      "CPI": 2,
      "CPIM": 2,
      "MDMK": 1,
      "IUML": 1
    },
    "lead": "DMK",
    "leadSeats": 22,
    "win": "INDIA",
    "name": "Tamil Nadu"
  },
  "Madhya Pradesh": {
    "seats": 29,
    "n": 29,
    "i": 0,
    "o": 0,
    "t": 66.87,
    "z": "Central",
    "p": {
      "BJP": 29
    },
    "lead": "BJP",
    "leadSeats": 29,
    "win": "NDA",
    "name": "Madhya Pradesh"
  },
  "Karnataka": {
    "seats": 28,
    "n": 19,
    "i": 9,
    "o": 0,
    "t": 70.41,
    "z": "South",
    "p": {
      "BJP": 17,
      "INC": 9,
      "JDS": 2
    },
    "lead": "BJP",
    "leadSeats": 17,
    "win": "NDA",
    "name": "Karnataka"
  },
  "Gujarat": {
    "seats": 26,
    "n": 25,
    "i": 1,
    "o": 0,
    "t": 59.51,
    "z": "West",
    "p": {
      "BJP": 25,
      "INC": 1
    },
    "lead": "BJP",
    "leadSeats": 25,
    "win": "NDA",
    "name": "Gujarat"
  },
  "Andhra Pradesh": {
    "seats": 25,
    "n": 21,
    "i": 0,
    "o": 4,
    "t": 81.86,
    "z": "South",
    "p": {
      "TDP": 16,
      "YSRCP": 4,
      "BJP": 3,
      "JSP": 2
    },
    "lead": "TDP",
    "leadSeats": 16,
    "win": "NDA",
    "name": "Andhra Pradesh"
  },
  "Rajasthan": {
    "seats": 25,
    "n": 14,
    "i": 11,
    "o": 0,
    "t": 61.42,
    "z": "North",
    "p": {
      "BJP": 14,
      "INC": 8,
      "CPIM": 1,
      "BAP": 1,
      "RLP": 1
    },
    "lead": "BJP",
    "leadSeats": 14,
    "win": "NDA",
    "name": "Rajasthan"
  },
  "Odisha": {
    "seats": 21,
    "n": 20,
    "i": 1,
    "o": 0,
    "t": 74.45,
    "z": "East",
    "p": {
      "BJP": 20,
      "INC": 1
    },
    "lead": "BJP",
    "leadSeats": 20,
    "win": "NDA",
    "name": "Odisha"
  },
  "Kerala": {
    "seats": 20,
    "n": 1,
    "i": 19,
    "o": 0,
    "t": 71.27,
    "z": "South",
    "p": {
      "INC": 14,
      "IUML": 2,
      "BJP": 1,
      "CPIM": 1,
      "KECM": 1,
      "RSP": 1
    },
    "lead": "INC",
    "leadSeats": 14,
    "win": "INDIA",
    "name": "Kerala"
  },
  "Telangana": {
    "seats": 17,
    "n": 8,
    "i": 8,
    "o": 1,
    "t": 65.67,
    "z": "South",
    "p": {
      "INC": 8,
      "BJP": 8,
      "AIMIM": 1
    },
    "lead": "INC",
    "leadSeats": 8,
    "win": "NDA",
    "name": "Telangana"
  },
  "Assam": {
    "seats": 14,
    "n": 11,
    "i": 3,
    "o": 0,
    "t": 81.56,
    "z": "North East",
    "p": {
      "BJP": 9,
      "INC": 3,
      "AGP": 1,
      "UPPL": 1
    },
    "lead": "BJP",
    "leadSeats": 9,
    "win": "NDA",
    "name": "Assam"
  },
  "Jharkhand": {
    "seats": 14,
    "n": 9,
    "i": 5,
    "o": 0,
    "t": 66.01,
    "z": "East",
    "p": {
      "BJP": 8,
      "JMM": 3,
      "INC": 2,
      "AJSU": 1
    },
    "lead": "BJP",
    "leadSeats": 8,
    "win": "NDA",
    "name": "Jharkhand"
  },
  "Punjab": {
    "seats": 13,
    "n": 0,
    "i": 10,
    "o": 3,
    "t": 62.8,
    "z": "North",
    "p": {
      "INC": 7,
      "AAP": 3,
      "IND": 2,
      "SAD": 1
    },
    "lead": "INC",
    "leadSeats": 7,
    "win": "INDIA",
    "name": "Punjab"
  },
  "Chhattisgarh": {
    "seats": 11,
    "n": 10,
    "i": 1,
    "o": 0,
    "t": 72.08,
    "z": "Central",
    "p": {
      "BJP": 10,
      "INC": 1
    },
    "lead": "BJP",
    "leadSeats": 10,
    "win": "NDA",
    "name": "Chhattisgarh"
  },
  "Haryana": {
    "seats": 10,
    "n": 5,
    "i": 5,
    "o": 0,
    "t": 64.8,
    "z": "North",
    "p": {
      "BJP": 5,
      "INC": 5
    },
    "lead": "BJP",
    "leadSeats": 5,
    "win": "NDA",
    "name": "Haryana"
  },
  "Delhi": {
    "seats": 7,
    "n": 7,
    "i": 0,
    "o": 0,
    "t": 58.69,
    "z": "North",
    "p": {
      "BJP": 7
    },
    "lead": "BJP",
    "leadSeats": 7,
    "win": "NDA",
    "name": "Delhi"
  },
  "Jammu and Kashmir": {
    "seats": 5,
    "n": 2,
    "i": 2,
    "o": 1,
    "t": 58.46,
    "z": "North",
    "p": {
      "BJP": 2,
      "JKNC": 2,
      "IND": 1
    },
    "lead": "BJP",
    "leadSeats": 2,
    "win": "NDA",
    "name": "Jammu and Kashmir"
  },
  "Uttarakhand": {
    "seats": 5,
    "n": 5,
    "i": 0,
    "o": 0,
    "t": 55.89,
    "z": "North",
    "p": {
      "BJP": 5
    },
    "lead": "BJP",
    "leadSeats": 5,
    "win": "NDA",
    "name": "Uttarakhand"
  },
  "Himachal Pradesh": {
    "seats": 4,
    "n": 4,
    "i": 0,
    "o": 0,
    "t": 70.02,
    "z": "North",
    "p": {
      "BJP": 4
    },
    "lead": "BJP",
    "leadSeats": 4,
    "win": "NDA",
    "name": "Himachal Pradesh"
  },
  "Arunachal Pradesh": {
    "seats": 2,
    "n": 2,
    "i": 0,
    "o": 0,
    "t": 78.44,
    "z": "North East",
    "p": {
      "BJP": 2
    },
    "lead": "BJP",
    "leadSeats": 2,
    "win": "NDA",
    "name": "Arunachal Pradesh"
  },
  "Goa": {
    "seats": 2,
    "n": 1,
    "i": 1,
    "o": 0,
    "t": 76.06,
    "z": "West",
    "p": {
      "BJP": 1,
      "INC": 1
    },
    "lead": "BJP",
    "leadSeats": 1,
    "win": "NDA",
    "name": "Goa"
  },
  "Manipur": {
    "seats": 2,
    "n": 0,
    "i": 2,
    "o": 0,
    "t": 76.06,
    "z": "North East",
    "p": {
      "INC": 2
    },
    "lead": "INC",
    "leadSeats": 2,
    "win": "INDIA",
    "name": "Manipur"
  },
  "Meghalaya": {
    "seats": 2,
    "n": 0,
    "i": 1,
    "o": 1,
    "t": 76.6,
    "z": "North East",
    "p": {
      "INC": 1,
      "VOTPP": 1
    },
    "lead": "INC",
    "leadSeats": 1,
    "win": "INDIA",
    "name": "Meghalaya"
  },
  "Tripura": {
    "seats": 2,
    "n": 2,
    "i": 0,
    "o": 0,
    "t": 81.48,
    "z": "North East",
    "p": {
      "BJP": 2
    },
    "lead": "BJP",
    "leadSeats": 2,
    "win": "NDA",
    "name": "Tripura"
  },
  "Mizoram": {
    "seats": 1,
    "n": 0,
    "i": 0,
    "o": 1,
    "t": 56.87,
    "z": "North East",
    "p": {
      "ZPM": 1
    },
    "lead": "ZPM",
    "leadSeats": 1,
    "win": "OTH",
    "name": "Mizoram"
  },
  "Nagaland": {
    "seats": 1,
    "n": 0,
    "i": 1,
    "o": 0,
    "t": 57.72,
    "z": "North East",
    "p": {
      "INC": 1
    },
    "lead": "INC",
    "leadSeats": 1,
    "win": "INDIA",
    "name": "Nagaland"
  },
  "Sikkim": {
    "seats": 1,
    "n": 1,
    "i": 0,
    "o": 0,
    "t": 79.88,
    "z": "North East",
    "p": {
      "SKM": 1
    },
    "lead": "SKM",
    "leadSeats": 1,
    "win": "NDA",
    "name": "Sikkim"
  },
  "Puducherry": {
    "seats": 1,
    "n": 0,
    "i": 1,
    "o": 0,
    "t": 78.9,
    "z": "South",
    "p": {
      "INC": 1
    },
    "lead": "INC",
    "leadSeats": 1,
    "win": "INDIA",
    "name": "Puducherry"
  },
  "Chandigarh": {
    "seats": 1,
    "n": 0,
    "i": 1,
    "o": 0,
    "t": 67.98,
    "z": "North",
    "p": {
      "INC": 1
    },
    "lead": "INC",
    "leadSeats": 1,
    "win": "INDIA",
    "name": "Chandigarh"
  },
  "Ladakh": {
    "seats": 1,
    "n": 0,
    "i": 0,
    "o": 1,
    "t": 71.82,
    "z": "North",
    "p": {
      "IND": 1
    },
    "lead": "IND",
    "leadSeats": 1,
    "win": "OTH",
    "name": "Ladakh"
  },
  "Lakshadweep": {
    "seats": 1,
    "n": 0,
    "i": 1,
    "o": 0,
    "t": 84.16,
    "z": "South",
    "p": {
      "INC": 1
    },
    "lead": "INC",
    "leadSeats": 1,
    "win": "INDIA",
    "name": "Lakshadweep"
  },
  "Andaman and Nicobar Islands": {
    "seats": 1,
    "n": 1,
    "i": 0,
    "o": 0,
    "t": 64.1,
    "z": "South",
    "p": {
      "BJP": 1
    },
    "lead": "BJP",
    "leadSeats": 1,
    "win": "NDA",
    "name": "Andaman and Nicobar Islands"
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    "seats": 2,
    "n": 1,
    "i": 0,
    "o": 1,
    "t": 71.44,
    "z": "West",
    "p": {
      "BJP": 1,
      "IND": 1
    },
    "lead": "BJP",
    "leadSeats": 1,
    "win": "NDA",
    "name": "Dadra and Nagar Haveli and Daman and Diu"
  }
};

export const lsNational = {
  "house": "18th Lok Sabha",
  "seats": 543,
  "majority": 272,
  "turnout": 65.79,
  "electors": 97.97,
  "voters": 64.64,
  "phases": 7,
  "womenTurnout": 65.78,
  "menTurnout": 65.8,
  "womenMPs": 74,
  "pollingStations": 10.52
} as const;

/** What is verified and what is still awaiting a feed. The UI shows the pending
 *  items as pending rather than printing a guessed number. */
export const lsProvenance = {
  "source": "Election Commission of India — General Election to Lok Sabha 2024",
  "verified": [
    "seats",
    "party-wise seats",
    "alliance split",
    "state turnout",
    "national vote share"
  ],
  "pending": [
    "Constituency-level margins and candidate lists (ECI results API)",
    "State-wise male/female elector ratio (ECI Form 20)",
    "2014 & 2019 state-level drill-down (historical ECI archive)",
    "MPLADS utilisation per constituency (MPLADS open dataset)"
  ]
} as const;
