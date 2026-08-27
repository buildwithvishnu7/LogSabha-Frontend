// GENERATED from reference/new_ref/assets/party-data.js — do not hand-edit.
//
// History, leadership, ideology and alliance for each party. Lok Sabha seat
// counts are deliberately NOT stored here — they are derived at runtime from
// lok-sabha-2024.ts, so this file cannot drift out of step with the declared
// result.
//
// `founded`, `type`, `alliance` and `symbol` are settled facts. Figures that
// move — state governments in office, Rajya Sabha strength, membership — are
// absent rather than estimated, and the UI marks them as awaiting a feed.

export type Party = {
  /** party key, matching lsParty in lok-sabha-2024.ts. Alliance is NOT stored
   *  here either — it comes from lsParty[k].al for the same reason seats do. */
  k: string;
  /** full registered name */
  full: string;
  founded: number;
  /** "n" = national party, "s" = state party */
  type: "n" | "s";
  symbol: string;
  desc: string;
  ideology: string[];
  /** current leader, with the office where it applies */
  lead: string;
  /** where the party is strongest */
  base: string;
  /** [year, what happened] — the party's own milestones */
  hist: [number, string][];
};
export const parties: Party[] = [
  {
    "k": "BJP",
    "founded": 1980,
    "type": "n",
    "symbol": "Lotus",
    "full": "Bharatiya Janata Party",
    "desc": "Formed in 1980 from the Jana Sangh lineage via the Janata Party, the BJP has led the Union government since 2014. Its platform combines cultural nationalism with an infrastructure- and welfare-delivery agenda.",
    "ideology": [
      "Integral humanism",
      "Cultural nationalism",
      "Economic liberalisation"
    ],
    "lead": "Narendra Modi (Prime Minister)",
    "base": "Pan-India, strongest in the north and west",
    "hist": [
      [
        1980,
        "Founded, carrying forward the Jana Sangh lineage through the Janata Party"
      ],
      [
        1984,
        "Wins just two Lok Sabha seats in its first general election"
      ],
      [
        1996,
        "Emerges as the largest party; forms a government that lasts thirteen days"
      ],
      [
        1998,
        "Leads the NDA to power under Atal Bihari Vajpayee"
      ],
      [
        2014,
        "Wins 282 seats — the first single-party majority since 1984"
      ],
      [
        2019,
        "Expands to 303 seats, the party’s best result"
      ],
      [
        2024,
        "Returns with 240 seats and governs through NDA partners"
      ]
    ]
  },
  {
    "k": "INC",
    "founded": 1885,
    "type": "n",
    "symbol": "Hand",
    "full": "Indian National Congress",
    "desc": "India’s oldest political party, founded in 1885 and the dominant force for most of the post-independence period. It leads the INDIA bloc and returned to a three-figure seat count in 2024 for the first time since 2009.",
    "ideology": [
      "Social democracy",
      "Secularism",
      "Welfare economics"
    ],
    "lead": "Mallikarjun Kharge (President)",
    "base": "Pan-India, strongest in Kerala and the south",
    "hist": [
      [
        1885,
        "Founded in Bombay; becomes the vehicle of the freedom movement"
      ],
      [
        1947,
        "Forms the first government of independent India under Nehru"
      ],
      [
        1969,
        "First major split, between the party organisation and Indira Gandhi"
      ],
      [
        1984,
        "Wins a record 404 seats"
      ],
      [
        1991,
        "Opens the economy under Narasimha Rao and Manmohan Singh"
      ],
      [
        2004,
        "Returns to power leading the UPA for two terms"
      ],
      [
        2014,
        "Falls to 44 seats, its worst result"
      ],
      [
        2024,
        "Recovers to 99 seats and anchors the INDIA bloc"
      ]
    ]
  },
  {
    "k": "SP",
    "founded": 1992,
    "type": "s",
    "symbol": "Bicycle",
    "full": "Samajwadi Party",
    "desc": "Founded by Mulayam Singh Yadav in 1992, rooted in the socialist and Mandal traditions of Uttar Pradesh. Its 2024 performance made it the third-largest party in the House.",
    "ideology": [
      "Democratic socialism",
      "Social justice"
    ],
    "lead": "Akhilesh Yadav",
    "base": "Uttar Pradesh",
    "hist": [
      [
        1992,
        "Founded by Mulayam Singh Yadav out of the Janata Dal"
      ],
      [
        1993,
        "Forms a government in Uttar Pradesh in alliance with the BSP"
      ],
      [
        2012,
        "Wins a majority in UP; Akhilesh Yadav becomes chief minister"
      ],
      [
        2017,
        "Loses the state to the BJP"
      ],
      [
        2024,
        "Wins 37 seats — the third-largest party in the House"
      ]
    ]
  },
  {
    "k": "TMC",
    "founded": 1998,
    "type": "n",
    "symbol": "Flowers and grass",
    "full": "All India Trinamool Congress",
    "desc": "Split from the Congress in 1998 under Mamata Banerjee. It has governed West Bengal since 2011 and remains the dominant force in the state.",
    "ideology": [
      "Populism",
      "Federalism",
      "Secularism"
    ],
    "lead": "Mamata Banerjee",
    "base": "West Bengal",
    "hist": [
      [
        1998,
        "Splits from the Congress under Mamata Banerjee"
      ],
      [
        2011,
        "Ends 34 years of Left Front rule in West Bengal"
      ],
      [
        2021,
        "Wins a third consecutive state term"
      ],
      [
        2024,
        "Takes 29 of West Bengal’s 42 seats"
      ]
    ]
  },
  {
    "k": "DMK",
    "founded": 1949,
    "type": "s",
    "symbol": "Rising sun",
    "full": "Dravida Munnetra Kazhagam",
    "desc": "Founded in 1949 out of the Dravidian movement. Alternating in power in Tamil Nadu for decades, it swept the state in alliance in 2024.",
    "ideology": [
      "Dravidian identity",
      "Social justice",
      "State autonomy"
    ],
    "lead": "M K Stalin",
    "base": "Tamil Nadu",
    "hist": [
      [
        1949,
        "Founded by C N Annadurai from the Dravidian movement"
      ],
      [
        1967,
        "Forms the first non-Congress government in Tamil Nadu"
      ],
      [
        1969,
        "M Karunanidhi becomes chief minister"
      ],
      [
        2021,
        "M K Stalin leads the party back to power"
      ],
      [
        2024,
        "Its alliance sweeps all 39 seats in the state"
      ]
    ]
  },
  {
    "k": "TDP",
    "founded": 1982,
    "type": "s",
    "symbol": "Bicycle",
    "full": "Telugu Desam Party",
    "desc": "Founded by N T Rama Rao in 1982 on a Telugu self-respect plank. It returned to power in Andhra Pradesh in 2024 and is a key partner in the Union government.",
    "ideology": [
      "Regionalism",
      "Market-friendly development"
    ],
    "lead": "N Chandrababu Naidu",
    "base": "Andhra Pradesh",
    "hist": [
      [
        1982,
        "Founded by N T Rama Rao on a Telugu self-respect plank"
      ],
      [
        1983,
        "Forms a government within a year of its founding"
      ],
      [
        1995,
        "N Chandrababu Naidu takes over the leadership"
      ],
      [
        2019,
        "Heavy defeat to the YSRCP"
      ],
      [
        2024,
        "Returns to power in Andhra Pradesh; 16 Lok Sabha seats"
      ]
    ]
  },
  {
    "k": "JDU",
    "founded": 2003,
    "type": "s",
    "symbol": "Arrow",
    "full": "Janata Dal (United)",
    "desc": "Formed in 2003 from the Janata Dal lineage. Long central to Bihar’s politics and, with a reduced NDA majority, to the arithmetic of the 18th Lok Sabha.",
    "ideology": [
      "Socialism",
      "Social engineering"
    ],
    "lead": "Nitish Kumar",
    "base": "Bihar",
    "hist": [
      [
        2003,
        "Formed from the Janata Dal lineage"
      ],
      [
        2005,
        "Nitish Kumar becomes chief minister of Bihar"
      ],
      [
        2024,
        "Wins 12 seats, becoming central to the NDA’s majority"
      ]
    ]
  },
  {
    "k": "SSUBT",
    "founded": 2022,
    "type": "s",
    "symbol": "Flaming torch",
    "full": "Shiv Sena (Uddhav Balasaheb Thackeray)",
    "desc": "The faction of the Shiv Sena led by Uddhav Thackeray after the 2022 split, contesting as part of the INDIA bloc in Maharashtra.",
    "ideology": [
      "Marathi regionalism",
      "Hindutva"
    ],
    "lead": "Uddhav Thackeray",
    "base": "Maharashtra",
    "hist": [
      [
        1966,
        "The Shiv Sena is founded by Bal Thackeray"
      ],
      [
        2019,
        "Uddhav Thackeray becomes chief minister leading the Maha Vikas Aghadi"
      ],
      [
        2022,
        "The party splits; this faction retains Uddhav Thackeray’s leadership"
      ],
      [
        2024,
        "Wins 9 seats as part of the INDIA bloc"
      ]
    ]
  },
  {
    "k": "SHS",
    "founded": 1966,
    "type": "s",
    "symbol": "Bow and arrow",
    "full": "Shiv Sena",
    "desc": "Founded by Bal Thackeray in 1966. Following the 2022 split, the faction led by Eknath Shinde retained the name and symbol and sits with the NDA.",
    "ideology": [
      "Marathi regionalism",
      "Hindutva"
    ],
    "lead": "Eknath Shinde",
    "base": "Maharashtra",
    "hist": [
      [
        1966,
        "Founded by Bal Thackeray in Mumbai"
      ],
      [
        1995,
        "Forms its first government in Maharashtra with the BJP"
      ],
      [
        2022,
        "After the split, this faction retains the name and symbol"
      ],
      [
        2024,
        "Wins 7 seats within the NDA"
      ]
    ]
  },
  {
    "k": "NCPSP",
    "founded": 2023,
    "type": "s",
    "symbol": "Man blowing turha",
    "full": "Nationalist Congress Party (Sharadchandra Pawar)",
    "desc": "The faction of the NCP retained by Sharad Pawar after the 2023 split, contesting with the INDIA bloc in Maharashtra.",
    "ideology": [
      "Social democracy",
      "Federalism"
    ],
    "lead": "Sharad Pawar",
    "base": "Maharashtra",
    "hist": [
      [
        1999,
        "The NCP is founded by leaders who left the Congress"
      ],
      [
        2023,
        "The party splits; Sharad Pawar retains this faction"
      ],
      [
        2024,
        "Wins 8 of the 10 seats it contests"
      ]
    ]
  },
  {
    "k": "NCP",
    "founded": 1999,
    "type": "s",
    "symbol": "Clock",
    "full": "Nationalist Congress Party",
    "desc": "Formed in 1999 by leaders who left the Congress. After the 2023 split the faction led by Ajit Pawar sits with the NDA.",
    "ideology": [
      "Social democracy",
      "Federalism"
    ],
    "lead": "Ajit Pawar",
    "base": "Maharashtra",
    "hist": [
      [
        1999,
        "Founded by Sharad Pawar, P A Sangma and Tariq Anwar"
      ],
      [
        2023,
        "Ajit Pawar leads this faction into the NDA"
      ],
      [
        2024,
        "Wins 1 seat"
      ]
    ]
  },
  {
    "k": "RJD",
    "founded": 1997,
    "type": "s",
    "symbol": "Hurricane lamp",
    "full": "Rashtriya Janata Dal",
    "desc": "Founded by Lalu Prasad Yadav in 1997 from the Janata Dal. A principal opposition force in Bihar with a base among Yadav and Muslim voters.",
    "ideology": [
      "Social justice",
      "Secularism"
    ],
    "lead": "Lalu Prasad Yadav",
    "base": "Bihar",
    "hist": [
      [
        1997,
        "Founded by Lalu Prasad Yadav out of the Janata Dal"
      ],
      [
        2015,
        "Returns to power in Bihar in a grand alliance"
      ],
      [
        2024,
        "Wins 4 seats"
      ]
    ]
  },
  {
    "k": "YSRCP",
    "founded": 2011,
    "type": "s",
    "symbol": "Ceiling fan",
    "full": "YSR Congress Party",
    "desc": "Founded by Y S Jagan Mohan Reddy in 2011. It governed Andhra Pradesh from 2019 before losing heavily in 2024.",
    "ideology": [
      "Populism",
      "Welfare delivery"
    ],
    "lead": "Y S Jagan Mohan Reddy",
    "base": "Andhra Pradesh",
    "hist": [
      [
        2011,
        "Founded by Y S Jagan Mohan Reddy"
      ],
      [
        2019,
        "Sweeps Andhra Pradesh with 151 of 175 assembly seats"
      ],
      [
        2024,
        "Loses power heavily; reduced to 4 Lok Sabha seats"
      ]
    ]
  },
  {
    "k": "AAP",
    "founded": 2012,
    "type": "n",
    "symbol": "Broom",
    "full": "Aam Aadmi Party",
    "desc": "Grew out of the 2011 anti-corruption movement. It has governed Delhi and Punjab and was recognised as a national party in 2023.",
    "ideology": [
      "Anti-corruption",
      "Public service delivery"
    ],
    "lead": "Arvind Kejriwal",
    "base": "Delhi and Punjab",
    "hist": [
      [
        2012,
        "Founded out of the 2011 anti-corruption movement"
      ],
      [
        2015,
        "Wins 67 of Delhi’s 70 assembly seats"
      ],
      [
        2022,
        "Forms a government in Punjab"
      ],
      [
        2023,
        "Recognised as a national party"
      ],
      [
        2024,
        "Wins 3 Lok Sabha seats"
      ]
    ]
  },
  {
    "k": "CPIM",
    "founded": 1964,
    "type": "n",
    "symbol": "Hammer, sickle and star",
    "full": "Communist Party of India (Marxist)",
    "desc": "Formed in the 1964 split of the Communist Party of India. It governed West Bengal for 34 years and remains the principal force in Kerala’s LDF.",
    "ideology": [
      "Marxism–Leninism",
      "Land reform"
    ],
    "lead": "M A Baby (General Secretary)",
    "base": "Kerala, Tripura, West Bengal",
    "hist": [
      [
        1964,
        "Formed in the split of the Communist Party of India"
      ],
      [
        1977,
        "Begins 34 unbroken years in power in West Bengal"
      ],
      [
        2011,
        "Loses West Bengal to the Trinamool Congress"
      ],
      [
        2024,
        "Wins 4 seats, chiefly through the Kerala LDF"
      ]
    ]
  },
  {
    "k": "CPI",
    "founded": 1925,
    "type": "s",
    "symbol": "Ears of corn and sickle",
    "full": "Communist Party of India",
    "desc": "Founded in 1925, the older of the two main communist parties, now contesting largely in alliance in Tamil Nadu and Kerala.",
    "ideology": [
      "Marxism–Leninism"
    ],
    "lead": "D Raja (General Secretary)",
    "base": "Kerala, Tamil Nadu",
    "hist": [
      [
        1925,
        "Founded at Kanpur"
      ],
      [
        1957,
        "Forms the government in Kerala — among the first elected communist governments anywhere"
      ],
      [
        2024,
        "Wins 2 seats in alliance"
      ]
    ]
  },
  {
    "k": "JMM",
    "founded": 1972,
    "type": "s",
    "symbol": "Bow and arrow",
    "full": "Jharkhand Mukti Morcha",
    "desc": "Founded in 1972 out of the movement for a separate Jharkhand. It leads the state government in alliance with the Congress and RJD.",
    "ideology": [
      "Tribal rights",
      "Regional autonomy"
    ],
    "lead": "Shibu Soren / Hemant Soren",
    "base": "Jharkhand",
    "hist": [
      [
        1972,
        "Founded during the movement for a separate Jharkhand"
      ],
      [
        2000,
        "Jharkhand is carved out of Bihar"
      ],
      [
        2024,
        "Wins 3 Lok Sabha seats and leads the state government"
      ]
    ]
  },
  {
    "k": "JDS",
    "founded": 1999,
    "type": "s",
    "symbol": "Woman farmer carrying paddy",
    "full": "Janata Dal (Secular)",
    "desc": "Founded by H D Deve Gowda in 1999. A pivotal player in Karnataka’s coalition politics and now an NDA partner.",
    "ideology": [
      "Socialism",
      "Farmer interests"
    ],
    "lead": "H D Deve Gowda",
    "base": "Karnataka",
    "hist": [
      [
        1999,
        "Founded by H D Deve Gowda"
      ],
      [
        2018,
        "Forms a coalition government in Karnataka with the Congress"
      ],
      [
        2024,
        "Contests within the NDA and wins 2 seats"
      ]
    ]
  },
  {
    "k": "IUML",
    "founded": 1948,
    "type": "s",
    "symbol": "Ladder",
    "full": "Indian Union Muslim League",
    "desc": "Founded in 1948, a long-standing constituent of the Congress-led UDF in Kerala.",
    "ideology": [
      "Minority representation",
      "Secular democracy"
    ],
    "lead": "Sadiq Ali Shihab Thangal",
    "base": "Kerala",
    "hist": [
      [
        1948,
        "Founded after Partition"
      ],
      [
        2024,
        "Wins 3 seats as part of Kerala’s UDF"
      ]
    ]
  },
  {
    "k": "JKNC",
    "founded": 1932,
    "type": "s",
    "symbol": "Plough",
    "full": "Jammu & Kashmir National Conference",
    "desc": "Founded in 1932 by Sheikh Abdullah, the oldest political party in Jammu and Kashmir. It won the 2024 assembly election in the reorganised UT.",
    "ideology": [
      "Regional autonomy",
      "Secularism"
    ],
    "lead": "Farooq Abdullah",
    "base": "Jammu and Kashmir",
    "hist": [
      [
        1932,
        "Founded by Sheikh Abdullah as the Muslim Conference"
      ],
      [
        1939,
        "Renamed the National Conference, opening membership to all"
      ],
      [
        2024,
        "Wins 2 Lok Sabha seats and the Jammu & Kashmir assembly election"
      ]
    ]
  },
  {
    "k": "AIMIM",
    "founded": 1958,
    "type": "s",
    "symbol": "Kite",
    "full": "All India Majlis-e-Ittehadul Muslimeen",
    "desc": "Revived in its present form in 1958, based in Hyderabad and contesting selectively across several states.",
    "ideology": [
      "Minority representation"
    ],
    "lead": "Asaduddin Owaisi",
    "base": "Telangana",
    "hist": [
      [
        1958,
        "Revived in its present form under Abdul Wahed Owaisi"
      ],
      [
        2024,
        "Retains Hyderabad; 1 Lok Sabha seat"
      ]
    ]
  },
  {
    "k": "SAD",
    "founded": 1920,
    "type": "s",
    "symbol": "Scales",
    "full": "Shiromani Akali Dal",
    "desc": "Founded in 1920, historically the principal Panthic party of Punjab. It contested 2024 outside the NDA.",
    "ideology": [
      "Panthic politics",
      "State autonomy"
    ],
    "lead": "Sukhbir Singh Badal",
    "base": "Punjab",
    "hist": [
      [
        1920,
        "Founded as the political voice of the Panthic movement"
      ],
      [
        2020,
        "Leaves the NDA over the farm laws"
      ],
      [
        2024,
        "Wins 1 seat"
      ]
    ]
  },
  {
    "k": "LJPRV",
    "founded": 2021,
    "type": "s",
    "symbol": "Helicopter",
    "full": "Lok Janshakti Party (Ram Vilas)",
    "desc": "The faction of the LJP led by Chirag Paswan after the 2021 split. It won every seat it contested in Bihar in 2024.",
    "ideology": [
      "Social justice",
      "Dalit representation"
    ],
    "lead": "Chirag Paswan",
    "base": "Bihar",
    "hist": [
      [
        2000,
        "The Lok Janshakti Party is founded by Ram Vilas Paswan"
      ],
      [
        2021,
        "The party splits; Chirag Paswan leads this faction"
      ],
      [
        2024,
        "Wins all 5 seats it contests in Bihar"
      ]
    ]
  }
];

/** Deliberately not loaded — shown as pending rather than guessed. */
export const partiesPending: string[] = [
  "State governments currently in office, party by party",
  "Rajya Sabha strength (RS secretariat feed)",
  "Registered membership and organisational structure",
  "Full manifesto archive and election symbol registry (ECI)",
  "Historical seat and vote share before 2014"
];

export const partiesSource = "Party formation dates and symbols from the ECI register of political parties; seat counts derived from the declared 2024 Lok Sabha result.";
