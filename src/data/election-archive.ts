// GENERATED from reference/new_ref/assets/logsabha-elections.js — do not hand-edit.
//
// India votes for the Lok Sabha only in 2014, 2019 and 2024. Every other year on this timeline is a state assembly cycle, so the map shows the states that actually polled that year and greys out the rest.
//
// `v: true` means the result is verified against the ECI declaration and the
// seat rows sum to the house size. `v: false` means the election was held but
// the result is not loaded — those rows carry null instead of a number, and the
// UI shows them as awaiting the feed rather than printing a guess.
//
// 62 of the 68 polls here are verified; 6 are awaiting the feed.

type PollBase = { state: string; month: string; seats: number };

export type VerifiedPoll = PollBase & {
  v: true;
  p: Record<string, number>;
  win: string;
  lead: string;
  leadSeats: number;
  declared: number;
};

/** Held, but no result loaded. Carries no numbers at all — by design. */
export type PendingPoll = PollBase & {
  v: false;
  p: null;
  win: null;
  lead?: undefined;
  leadSeats?: undefined;
  declared?: undefined;
};

/** A union rather than optional fields on purpose: the compiler now refuses to
 *  read `lead` or `declared` until the caller has checked `v`, so an unverified
 *  poll cannot be rendered as though it had a result. */
export type Poll = VerifiedPoll | PendingPoll;
export type ElectionYear = { lok: boolean; polls: Poll[] };

export const extraParties: Record<string, { name: string; c: string }> = {
  "AAP": {
    "name": "Aam Aadmi Party",
    "c": "#0F52BA"
  },
  "BSP": {
    "name": "Bahujan Samaj Party",
    "c": "#22409A"
  },
  "AIADMK": {
    "name": "AIADMK",
    "c": "#0F9B0F"
  },
  "BJD": {
    "name": "Biju Janata Dal",
    "c": "#0F9D58"
  },
  "BRS": {
    "name": "Bharat Rashtra Samithi",
    "c": "#E91E63"
  },
  "TRS": {
    "name": "Telangana Rashtra Samithi",
    "c": "#E91E63"
  },
  "MNF": {
    "name": "Mizo National Front",
    "c": "#1565C0"
  },
  "NDPP": {
    "name": "Nationalist Democratic Progressive Party",
    "c": "#EF6C00"
  },
  "NPP": {
    "name": "National People’s Party",
    "c": "#00838F"
  },
  "NPF": {
    "name": "Naga People’s Front",
    "c": "#5D4037"
  },
  "SDF": {
    "name": "Sikkim Democratic Front",
    "c": "#2E7D32"
  },
  "AINRC": {
    "name": "All India N.R. Congress",
    "c": "#D81B60"
  },
  "AIUDF": {
    "name": "All India United Democratic Front",
    "c": "#00695C"
  },
  "BPF": {
    "name": "Bodoland People’s Front",
    "c": "#795548"
  },
  "JJP": {
    "name": "Jannayak Janta Party",
    "c": "#FDD835"
  },
  "INLD": {
    "name": "Indian National Lok Dal",
    "c": "#43A047"
  },
  "TIPRA": {
    "name": "TIPRA Motha",
    "c": "#6A1B9A"
  },
  "UDP": {
    "name": "United Democratic Party",
    "c": "#00ACC1"
  },
  "PDP": {
    "name": "Peoples Democratic Party",
    "c": "#2E7D32"
  },
  "JCC": {
    "name": "Janta Congress Chhattisgarh",
    "c": "#8E24AA"
  },
  "GGP": {
    "name": "Gondwana Gantantra Party",
    "c": "#4E342E"
  },
  "SBSP": {
    "name": "Suheldev Bharatiya Samaj Party",
    "c": "#F4511E"
  },
  "NISHAD": {
    "name": "Nishad Party",
    "c": "#0097A7"
  },
  "KPA": {
    "name": "Kuki People’s Alliance",
    "c": "#7B1FA2"
  },
  "PPA": {
    "name": "People’s Party of Arunachal",
    "c": "#00796B"
  },
  "MGP": {
    "name": "Maharashtrawadi Gomantak Party",
    "c": "#F9A825"
  },
  "RGP": {
    "name": "Revolutionary Goans Party",
    "c": "#C2185B"
  },
  "LJP": {
    "name": "Lok Janshakti Party",
    "c": "#6A4C93"
  },
  "HSPDP": {
    "name": "Hill State People’s Democratic Party",
    "c": "#455A64"
  },
  "PDF": {
    "name": "People’s Democratic Front",
    "c": "#37474F"
  },
  "IPFT": {
    "name": "Indigenous People’s Front of Tripura",
    "c": "#AD1457"
  },
  "LIP": {
    "name": "Lok Insaaf Party",
    "c": "#EF5350"
  },
  "BTP": {
    "name": "Bharatiya Tribal Party",
    "c": "#00695C"
  },
  "RLTP": {
    "name": "Rashtriya Loktantrik Party",
    "c": "#EF6C00"
  },
  "OTH": {
    "name": "Others / independents",
    "c": "#8FA3BF"
  }
};

export const electionYears: Record<string, ElectionYear> = {
  "2015": {
    "lok": false,
    "polls": [
      {
        "state": "Delhi",
        "month": "February",
        "seats": 70,
        "p": {
          "AAP": 67,
          "BJP": 3
        },
        "win": "AAP",
        "v": true,
        "lead": "AAP",
        "leadSeats": 67,
        "declared": 70
      },
      {
        "state": "Bihar",
        "month": "October–November",
        "seats": 243,
        "p": {
          "RJD": 80,
          "JDU": 71,
          "BJP": 53,
          "INC": 27,
          "LJP": 2,
          "OTH": 10
        },
        "win": "RJD-led Mahagathbandhan",
        "v": true,
        "lead": "RJD",
        "leadSeats": 80,
        "declared": 243
      }
    ]
  },
  "2016": {
    "lok": false,
    "polls": [
      {
        "state": "West Bengal",
        "month": "April–May",
        "seats": 294,
        "p": {
          "TMC": 211,
          "INC": 44,
          "CPIM": 26,
          "BJP": 3,
          "OTH": 10
        },
        "win": "TMC",
        "v": true,
        "lead": "TMC",
        "leadSeats": 211,
        "declared": 294
      },
      {
        "state": "Tamil Nadu",
        "month": "May",
        "seats": 234,
        "p": {
          "AIADMK": 136,
          "DMK": 89,
          "INC": 8,
          "IUML": 1
        },
        "win": "AIADMK",
        "v": true,
        "lead": "AIADMK",
        "leadSeats": 136,
        "declared": 234
      },
      {
        "state": "Kerala",
        "month": "May",
        "seats": 140,
        "p": {
          "CPIM": 58,
          "INC": 22,
          "CPI": 19,
          "IUML": 18,
          "KECM": 6,
          "BJP": 1,
          "OTH": 16
        },
        "win": "LDF",
        "v": true,
        "lead": "CPIM",
        "leadSeats": 58,
        "declared": 140
      },
      {
        "state": "Assam",
        "month": "April",
        "seats": 126,
        "p": {
          "BJP": 60,
          "INC": 26,
          "AGP": 14,
          "AIUDF": 13,
          "BPF": 12,
          "OTH": 1
        },
        "win": "BJP-led NDA",
        "v": true,
        "lead": "BJP",
        "leadSeats": 60,
        "declared": 126
      },
      {
        "state": "Puducherry",
        "month": "May",
        "seats": 30,
        "p": {
          "INC": 15,
          "AINRC": 8,
          "AIADMK": 4,
          "DMK": 2,
          "IND": 1
        },
        "win": "INC-DMK",
        "v": true,
        "lead": "INC",
        "leadSeats": 15,
        "declared": 30
      }
    ]
  },
  "2017": {
    "lok": false,
    "polls": [
      {
        "state": "Uttar Pradesh",
        "month": "February–March",
        "seats": 403,
        "p": {
          "BJP": 312,
          "SP": 47,
          "BSP": 19,
          "ADS": 9,
          "INC": 7,
          "SBSP": 4,
          "OTH": 5
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 312,
        "declared": 403
      },
      {
        "state": "Punjab",
        "month": "February",
        "seats": 117,
        "p": {
          "INC": 77,
          "AAP": 20,
          "SAD": 15,
          "BJP": 3,
          "LIP": 2
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 77,
        "declared": 117
      },
      {
        "state": "Uttarakhand",
        "month": "February",
        "seats": 70,
        "p": {
          "BJP": 57,
          "INC": 11,
          "OTH": 2
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 57,
        "declared": 70
      },
      {
        "state": "Goa",
        "month": "February",
        "seats": 40,
        "p": {
          "INC": 17,
          "BJP": 13,
          "MGP": 3,
          "OTH": 3,
          "NCP": 1,
          "IND": 3
        },
        "win": "BJP (post-poll)",
        "v": true,
        "lead": "INC",
        "leadSeats": 17,
        "declared": 40
      },
      {
        "state": "Manipur",
        "month": "March",
        "seats": 60,
        "p": {
          "INC": 28,
          "BJP": 21,
          "NPF": 4,
          "NPP": 4,
          "LJP": 1,
          "TMC": 1,
          "IND": 1
        },
        "win": "BJP (post-poll)",
        "v": true,
        "lead": "INC",
        "leadSeats": 28,
        "declared": 60
      },
      {
        "state": "Gujarat",
        "month": "December",
        "seats": 182,
        "p": {
          "BJP": 99,
          "INC": 77,
          "BTP": 2,
          "NCP": 1,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 99,
        "declared": 182
      },
      {
        "state": "Himachal Pradesh",
        "month": "November",
        "seats": 68,
        "p": {
          "BJP": 44,
          "INC": 21,
          "CPIM": 1,
          "IND": 2
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 44,
        "declared": 68
      }
    ]
  },
  "2018": {
    "lok": false,
    "polls": [
      {
        "state": "Karnataka",
        "month": "May",
        "seats": 222,
        "p": {
          "BJP": 104,
          "INC": 78,
          "JDS": 37,
          "OTH": 3
        },
        "win": "INC-JD(S) (post-poll)",
        "v": true,
        "lead": "BJP",
        "leadSeats": 104,
        "declared": 222
      },
      {
        "state": "Madhya Pradesh",
        "month": "November",
        "seats": 230,
        "p": {
          "INC": 114,
          "BJP": 109,
          "BSP": 2,
          "SP": 1,
          "IND": 4
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 114,
        "declared": 230
      },
      {
        "state": "Rajasthan",
        "month": "December",
        "seats": 199,
        "p": {
          "INC": 99,
          "BJP": 73,
          "BSP": 6,
          "RLTP": 3,
          "CPIM": 2,
          "BTP": 2,
          "RLD": 1,
          "IND": 13
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 99,
        "declared": 199
      },
      {
        "state": "Chhattisgarh",
        "month": "November",
        "seats": 90,
        "p": {
          "INC": 68,
          "BJP": 15,
          "JCC": 5,
          "BSP": 2
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 68,
        "declared": 90
      },
      {
        "state": "Telangana",
        "month": "December",
        "seats": 119,
        "p": {
          "TRS": 88,
          "INC": 19,
          "AIMIM": 7,
          "TDP": 2,
          "BJP": 1,
          "OTH": 2
        },
        "win": "TRS",
        "v": true,
        "lead": "TRS",
        "leadSeats": 88,
        "declared": 119
      },
      {
        "state": "Tripura",
        "month": "February",
        "seats": 60,
        "p": {
          "BJP": 36,
          "CPIM": 16,
          "IPFT": 8
        },
        "win": "BJP-IPFT",
        "v": true,
        "lead": "BJP",
        "leadSeats": 36,
        "declared": 60
      },
      {
        "state": "Meghalaya",
        "month": "February",
        "seats": 59,
        "p": {
          "INC": 21,
          "NPP": 19,
          "UDP": 6,
          "PDF": 4,
          "BJP": 2,
          "HSPDP": 2,
          "OTH": 5
        },
        "win": "NPP-led (post-poll)",
        "v": true,
        "lead": "INC",
        "leadSeats": 21,
        "declared": 59
      },
      {
        "state": "Nagaland",
        "month": "February",
        "seats": 59,
        "p": {
          "NPF": 26,
          "NDPP": 18,
          "BJP": 12,
          "OTH": 3
        },
        "win": "NDPP-BJP",
        "v": true,
        "lead": "NPF",
        "leadSeats": 26,
        "declared": 59
      },
      {
        "state": "Mizoram",
        "month": "November",
        "seats": 40,
        "p": {
          "MNF": 26,
          "INC": 5,
          "BJP": 1,
          "IND": 8
        },
        "win": "MNF",
        "v": true,
        "lead": "MNF",
        "leadSeats": 26,
        "declared": 40
      }
    ]
  },
  "2019": {
    "lok": true,
    "polls": [
      {
        "state": "Andhra Pradesh",
        "month": "April",
        "seats": 175,
        "p": {
          "YSRCP": 151,
          "TDP": 23,
          "JSP": 1
        },
        "win": "YSRCP",
        "v": true,
        "lead": "YSRCP",
        "leadSeats": 151,
        "declared": 175
      },
      {
        "state": "Odisha",
        "month": "April",
        "seats": 147,
        "p": {
          "BJD": 112,
          "BJP": 23,
          "INC": 9,
          "CPIM": 1,
          "IND": 2
        },
        "win": "BJD",
        "v": true,
        "lead": "BJD",
        "leadSeats": 112,
        "declared": 147
      },
      {
        "state": "Sikkim",
        "month": "April",
        "seats": 32,
        "p": {
          "SKM": 17,
          "SDF": 15
        },
        "win": "SKM",
        "v": true,
        "lead": "SKM",
        "leadSeats": 17,
        "declared": 32
      },
      {
        "state": "Arunachal Pradesh",
        "month": "April",
        "seats": 60,
        "p": {
          "BJP": 41,
          "JDU": 7,
          "NPP": 5,
          "INC": 4,
          "PPA": 1,
          "IND": 2
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 41,
        "declared": 60
      },
      {
        "state": "Maharashtra",
        "month": "October",
        "seats": 288,
        "p": {
          "BJP": 105,
          "SHS": 56,
          "NCP": 54,
          "INC": 44,
          "OTH": 29
        },
        "win": "Shiv Sena-NCP-INC (post-poll)",
        "v": true,
        "lead": "BJP",
        "leadSeats": 105,
        "declared": 288
      },
      {
        "state": "Haryana",
        "month": "October",
        "seats": 90,
        "p": {
          "BJP": 40,
          "INC": 31,
          "JJP": 10,
          "INLD": 1,
          "IND": 8
        },
        "win": "BJP-JJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 40,
        "declared": 90
      },
      {
        "state": "Jharkhand",
        "month": "November–December",
        "seats": 81,
        "p": {
          "JMM": 30,
          "BJP": 25,
          "INC": 16,
          "AJSU": 2,
          "RJD": 1,
          "OTH": 7
        },
        "win": "JMM-INC-RJD",
        "v": true,
        "lead": "JMM",
        "leadSeats": 30,
        "declared": 81
      }
    ]
  },
  "2020": {
    "lok": false,
    "polls": [
      {
        "state": "Delhi",
        "month": "February",
        "seats": 70,
        "p": {
          "AAP": 62,
          "BJP": 8
        },
        "win": "AAP",
        "v": true,
        "lead": "AAP",
        "leadSeats": 62,
        "declared": 70
      },
      {
        "state": "Bihar",
        "month": "October–November",
        "seats": 243,
        "p": {
          "RJD": 75,
          "BJP": 74,
          "JDU": 43,
          "INC": 19,
          "CPIML": 12,
          "OTH": 20
        },
        "win": "NDA",
        "v": true,
        "lead": "RJD",
        "leadSeats": 75,
        "declared": 243
      }
    ]
  },
  "2021": {
    "lok": false,
    "polls": [
      {
        "state": "West Bengal",
        "month": "March–April",
        "seats": 292,
        "p": {
          "TMC": 213,
          "BJP": 77,
          "OTH": 2
        },
        "win": "TMC",
        "v": true,
        "lead": "TMC",
        "leadSeats": 213,
        "declared": 292
      },
      {
        "state": "Tamil Nadu",
        "month": "April",
        "seats": 234,
        "p": {
          "DMK": 133,
          "AIADMK": 66,
          "INC": 18,
          "PMK": 5,
          "BJP": 4,
          "OTH": 8
        },
        "win": "DMK",
        "v": true,
        "lead": "DMK",
        "leadSeats": 133,
        "declared": 234
      },
      {
        "state": "Kerala",
        "month": "April",
        "seats": 140,
        "p": {
          "CPIM": 62,
          "INC": 21,
          "CPI": 17,
          "IUML": 15,
          "OTH": 25
        },
        "win": "LDF",
        "v": true,
        "lead": "CPIM",
        "leadSeats": 62,
        "declared": 140
      },
      {
        "state": "Assam",
        "month": "March–April",
        "seats": 126,
        "p": {
          "BJP": 60,
          "INC": 29,
          "AIUDF": 16,
          "AGP": 9,
          "UPPL": 6,
          "BPF": 4,
          "OTH": 2
        },
        "win": "BJP-led NDA",
        "v": true,
        "lead": "BJP",
        "leadSeats": 60,
        "declared": 126
      },
      {
        "state": "Puducherry",
        "month": "April",
        "seats": 30,
        "p": {
          "AINRC": 10,
          "BJP": 6,
          "DMK": 6,
          "INC": 2,
          "IND": 6
        },
        "win": "AINRC-BJP",
        "v": true,
        "lead": "AINRC",
        "leadSeats": 10,
        "declared": 30
      }
    ]
  },
  "2022": {
    "lok": false,
    "polls": [
      {
        "state": "Uttar Pradesh",
        "month": "February–March",
        "seats": 403,
        "p": {
          "BJP": 255,
          "SP": 111,
          "ADS": 12,
          "RLD": 8,
          "SBSP": 6,
          "NISHAD": 6,
          "INC": 2,
          "BSP": 1,
          "OTH": 2
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 255,
        "declared": 403
      },
      {
        "state": "Punjab",
        "month": "February",
        "seats": 117,
        "p": {
          "AAP": 92,
          "INC": 18,
          "SAD": 3,
          "BJP": 2,
          "BSP": 1,
          "IND": 1
        },
        "win": "AAP",
        "v": true,
        "lead": "AAP",
        "leadSeats": 92,
        "declared": 117
      },
      {
        "state": "Uttarakhand",
        "month": "February",
        "seats": 70,
        "p": {
          "BJP": 47,
          "INC": 19,
          "BSP": 2,
          "IND": 2
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 47,
        "declared": 70
      },
      {
        "state": "Goa",
        "month": "February",
        "seats": 40,
        "p": {
          "BJP": 20,
          "INC": 11,
          "MGP": 2,
          "AAP": 2,
          "RGP": 1,
          "TMC": 1,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 20,
        "declared": 40
      },
      {
        "state": "Manipur",
        "month": "February–March",
        "seats": 60,
        "p": {
          "BJP": 32,
          "NPP": 7,
          "JDU": 6,
          "NPF": 5,
          "INC": 5,
          "KPA": 2,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 32,
        "declared": 60
      },
      {
        "state": "Gujarat",
        "month": "December",
        "seats": 182,
        "p": {
          "BJP": 156,
          "INC": 17,
          "AAP": 5,
          "SP": 1,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 156,
        "declared": 182
      },
      {
        "state": "Himachal Pradesh",
        "month": "November",
        "seats": 68,
        "p": {
          "INC": 40,
          "BJP": 25,
          "IND": 3
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 40,
        "declared": 68
      }
    ]
  },
  "2023": {
    "lok": false,
    "polls": [
      {
        "state": "Karnataka",
        "month": "May",
        "seats": 224,
        "p": {
          "INC": 135,
          "BJP": 66,
          "JDS": 19,
          "OTH": 4
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 135,
        "declared": 224
      },
      {
        "state": "Madhya Pradesh",
        "month": "November",
        "seats": 230,
        "p": {
          "BJP": 163,
          "INC": 66,
          "BAP": 1
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 163,
        "declared": 230
      },
      {
        "state": "Rajasthan",
        "month": "November",
        "seats": 199,
        "p": {
          "BJP": 115,
          "INC": 69,
          "BAP": 3,
          "BSP": 2,
          "RLD": 1,
          "RLTP": 1,
          "IND": 8
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 115,
        "declared": 199
      },
      {
        "state": "Chhattisgarh",
        "month": "November",
        "seats": 90,
        "p": {
          "BJP": 54,
          "INC": 35,
          "GGP": 1
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 54,
        "declared": 90
      },
      {
        "state": "Telangana",
        "month": "November",
        "seats": 119,
        "p": {
          "INC": 64,
          "BRS": 39,
          "BJP": 8,
          "AIMIM": 7,
          "CPI": 1
        },
        "win": "INC",
        "v": true,
        "lead": "INC",
        "leadSeats": 64,
        "declared": 119
      },
      {
        "state": "Tripura",
        "month": "February",
        "seats": 60,
        "p": {
          "BJP": 32,
          "TIPRA": 13,
          "CPIM": 11,
          "INC": 3,
          "IPFT": 1
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 32,
        "declared": 60
      },
      {
        "state": "Meghalaya",
        "month": "February",
        "seats": 59,
        "p": {
          "NPP": 26,
          "UDP": 11,
          "TMC": 5,
          "INC": 5,
          "BJP": 2,
          "OTH": 10
        },
        "win": "NPP-led",
        "v": true,
        "lead": "NPP",
        "leadSeats": 26,
        "declared": 59
      },
      {
        "state": "Nagaland",
        "month": "February",
        "seats": 60,
        "p": {
          "NDPP": 25,
          "BJP": 12,
          "NCP": 7,
          "NPP": 5,
          "OTH": 11
        },
        "win": "NDPP-BJP",
        "v": true,
        "lead": "NDPP",
        "leadSeats": 25,
        "declared": 60
      },
      {
        "state": "Mizoram",
        "month": "November",
        "seats": 40,
        "p": {
          "ZPM": 27,
          "MNF": 10,
          "BJP": 2,
          "INC": 1
        },
        "win": "ZPM",
        "v": true,
        "lead": "ZPM",
        "leadSeats": 27,
        "declared": 40
      }
    ]
  },
  "2024": {
    "lok": true,
    "polls": [
      {
        "state": "Andhra Pradesh",
        "month": "May",
        "seats": 175,
        "p": {
          "TDP": 135,
          "JSP": 21,
          "YSRCP": 11,
          "BJP": 8
        },
        "win": "TDP-led NDA",
        "v": true,
        "lead": "TDP",
        "leadSeats": 135,
        "declared": 175
      },
      {
        "state": "Odisha",
        "month": "May–June",
        "seats": 147,
        "p": {
          "BJP": 78,
          "BJD": 51,
          "INC": 14,
          "CPIM": 1,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 78,
        "declared": 147
      },
      {
        "state": "Sikkim",
        "month": "April",
        "seats": 32,
        "p": {
          "SKM": 31,
          "SDF": 1
        },
        "win": "SKM",
        "v": true,
        "lead": "SKM",
        "leadSeats": 31,
        "declared": 32
      },
      {
        "state": "Arunachal Pradesh",
        "month": "April",
        "seats": 60,
        "p": {
          "BJP": 46,
          "NPP": 5,
          "NCP": 3,
          "PPA": 2,
          "INC": 1,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 46,
        "declared": 60
      },
      {
        "state": "Haryana",
        "month": "October",
        "seats": 90,
        "p": {
          "BJP": 48,
          "INC": 37,
          "INLD": 2,
          "IND": 3
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 48,
        "declared": 90
      },
      {
        "state": "Jammu and Kashmir",
        "month": "September–October",
        "seats": 90,
        "p": {
          "JKNC": 42,
          "BJP": 29,
          "INC": 6,
          "PDP": 3,
          "OTH": 10
        },
        "win": "JKNC-INC",
        "v": true,
        "lead": "JKNC",
        "leadSeats": 42,
        "declared": 90
      },
      {
        "state": "Maharashtra",
        "month": "November",
        "seats": 288,
        "p": {
          "BJP": 132,
          "SHS": 57,
          "NCP": 41,
          "SSUBT": 20,
          "INC": 16,
          "NCPSP": 10,
          "OTH": 12
        },
        "win": "Mahayuti",
        "v": true,
        "lead": "BJP",
        "leadSeats": 132,
        "declared": 288
      },
      {
        "state": "Jharkhand",
        "month": "November",
        "seats": 81,
        "p": {
          "JMM": 34,
          "BJP": 21,
          "INC": 16,
          "RJD": 4,
          "AJSU": 1,
          "OTH": 5
        },
        "win": "JMM-led",
        "v": true,
        "lead": "JMM",
        "leadSeats": 34,
        "declared": 81
      }
    ]
  },
  "2025": {
    "lok": false,
    "polls": [
      {
        "state": "Delhi",
        "month": "February",
        "seats": 70,
        "p": {
          "BJP": 48,
          "AAP": 22
        },
        "win": "BJP",
        "v": true,
        "lead": "BJP",
        "leadSeats": 48,
        "declared": 70
      },
      {
        "state": "Bihar",
        "month": "October–November",
        "seats": 243,
        "p": null,
        "win": null,
        "v": false
      }
    ]
  },
  "2026": {
    "lok": false,
    "polls": [
      {
        "state": "West Bengal",
        "month": "April–May",
        "seats": 294,
        "p": null,
        "win": null,
        "v": false
      },
      {
        "state": "Tamil Nadu",
        "month": "April–May",
        "seats": 234,
        "p": null,
        "win": null,
        "v": false
      },
      {
        "state": "Kerala",
        "month": "April–May",
        "seats": 140,
        "p": null,
        "win": null,
        "v": false
      },
      {
        "state": "Assam",
        "month": "March–April",
        "seats": 126,
        "p": null,
        "win": null,
        "v": false
      },
      {
        "state": "Puducherry",
        "month": "April–May",
        "seats": 30,
        "p": null,
        "win": null,
        "v": false
      }
    ]
  }
};

export const lokSabhaYears: number[] = [2019,2024];
export const archiveFrom = 2015;
export const archiveTo = 2026;
export const archiveNote = "India votes for the Lok Sabha only in 2014, 2019 and 2024. Every other year on this timeline is a state assembly cycle, so the map shows the states that actually polled that year and greys out the rest.";
