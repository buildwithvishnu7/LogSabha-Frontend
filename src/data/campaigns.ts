// GENERATED from reference/new_ref/assets/about-data.js — do not hand-edit.
//
// The campaign record as structured data: one entry per campaign, with the
// year it ran in. This is what the mandate helix is built from — each year's
// campaigns sit at the same height on the spiral, so a heavy year reads as a
// thick band and a quiet year as a single point.
//
// Only the structured records are taken from the reference. The page's prose
// stays in src/data/about-page.ts, which is the fuller extraction of the two.
//
// SOURCE: logsabha.com/about-us/ — Internet Archive snapshot, 14 May 2026

/** A published seat row is a [label, count] pair — "Total Seats", 70. */
export type CampaignRow = [label: string, count: number];

export type Campaign = {
  /** the year the campaign ran */
  y: number;
  state: string;
  title: string;
  intro: string;
  /** the seat table, where one was published — empty for most entries */
  rows: CampaignRow[];
  /** the source page truncated this entry behind a read-more */
  more: boolean;
};

export const campaigns: Campaign[] = [
  {
    "y": 2027,
    "state": "Uttar Pradesh",
    "title": "Uttar Pradesh Legislative Assembly Election 2027: BJP Win Prediction",
    "intro": "The Uttar Pradesh Legislative Assembly Election of 2027 is anticipated to be a pivotal moment in Indian politics, with significant implications for the state’s future governance. Based on the recent 2024 Lok Sabha elections, The Logsabha team has conducted a comprehensive analysis to predict the potential outcomes, particularly focusing on the Bharatiya Janata Party (BJP)’s prospects.",
    "rows": [],
    "more": true
  },
  {
    "y": 2025,
    "state": "Delhi",
    "title": "Delhi Vidhan Sabha Elections 2025: A Decisive BJP Triumph in the Capital",
    "intro": "The 2025 Delhi Vidhan Sabha Elections have marked a turning point in the capital’s political landscape. Held on 5 February 2025 with vote counting completed on 8 February 2025, the elections witnessed a dramatic shift after decades of AAP dominance. Voters in the National Capital Territory expressed a strong desire for change, opting for a party that promised efficient governance and rapid development.",
    "rows": [
      [
        "Total Seats",
        70
      ],
      [
        "BJP (NDA)",
        48
      ],
      [
        "AAP",
        22
      ],
      [
        "Indian National Congress (INC)",
        0
      ]
    ],
    "more": true
  },
  {
    "y": 2024,
    "state": "Maharashtra",
    "title": "Maharashtra Vidhan Sabha Elections 2024: A BJP Triumph",
    "intro": "The Maharashtra Vidhan Sabha Elections 2024 witnessed a resounding victory for the Bharatiya Janata Party (BJP), further solidifying its political dominance in the state. The elections reflected the continuing appeal of Hindutva politics, the effective coalition strategies of BJP, and a fractured opposition that struggled to present a unified challenge.",
    "rows": [
      [
        "Bharatiya Janata Party (BJP)",
        132
      ],
      [
        "Shiv Sena (Eknath Shinde faction)",
        57
      ],
      [
        "Shiv Sena (Uddhav Balasaheb Thackeray faction)",
        20
      ],
      [
        "Indian National Congress (INC)",
        16
      ],
      [
        "Nationalist Congress Party (NCP – Sharad Pawar faction)",
        10
      ],
      [
        "Nationalist Congress Party (NCP – Ajit Pawar faction)",
        8
      ],
      [
        "Others",
        22
      ]
    ],
    "more": true
  },
  {
    "y": 2024,
    "state": "Haryana",
    "title": "Overview of the Haryana Vidhan Sabha Elections 2024",
    "intro": "The Haryana Vidhan Sabha Elections of 2024 marked a significant victory for the Bharatiya Janata Party (BJP), allowing them to secure a third consecutive term. This win was marked by strategic adaptations, with the BJP effectively countering anti-incumbency through leadership changes, community outreach, and support from the Rashtriya Swayamsevak Sangh (RSS). This grassroots involvement proved pivotal, especially in rural areas where BJP faced challenges due to the lingering effects of the farmers’ protests.",
    "rows": [],
    "more": true
  },
  {
    "y": 2024,
    "state": "Jharkhand",
    "title": "2024 Jharkhand Vidhan Sabha Election Results",
    "intro": "The 2024 Jharkhand Vidhan Sabha Elections resulted in a significant win for Jharkhand Mukti Morcha (JMM), securing a second consecutive term under the leadership of Hemant Soren. The election was marked by JMM’s focus on tribal welfare, land rights, and inclusive governance, which resonated deeply with voters, particularly in rural and tribal constituencies.",
    "rows": [
      [
        "Jharkhand Mukti Morcha (JMM)",
        34
      ],
      [
        "Bharatiya Janata Party (BJP)",
        21
      ],
      [
        "Indian National Congress (INC)",
        16
      ],
      [
        "Rashtriya Janata Dal (RJD)",
        4
      ],
      [
        "Communist Party of India (Marxist-Leninist)",
        2
      ],
      [
        "AJSU Party",
        1
      ],
      [
        "Lok Janshakti Party (Ram Vilas)",
        1
      ]
    ],
    "more": true
  },
  {
    "y": 2024,
    "state": "National",
    "title": "Overview of the 2024 Lok Sabha Elections",
    "intro": "The 2024 Lok Sabha elections, held from April 19 to June 1, 2024, marked a significant event in Indian politics, culminating in the formation of the 18th Lok Sabha. The Bharatiya Janata Party (BJP), under the leadership of Prime Minister Narendra Modi, aimed to secure a third consecutive term amid various political dynamics and challenges.",
    "rows": [],
    "more": true
  },
  {
    "y": 2023,
    "state": "Madhya Pradesh",
    "title": "Madhya Pradesh Assembly Elections 2023: A BJP Triumph Amidst Challenges",
    "intro": "The 2023 Madhya Pradesh Assembly Elections, held on November 17, witnessed a decisive victory for the Bharatiya Janata Party (BJP) despite facing anti-incumbency sentiment and challenges posed by the Congress party. This detailed overview analyzes the key players, issues, results, and significance of this crucial election.",
    "rows": [],
    "more": true
  },
  {
    "y": 2023,
    "state": "Rajasthan",
    "title": "Rajasthan Assembly Elections 2023: A Shift in Power with BJP’s Return to the Top",
    "intro": "The 2023 Rajasthan Assembly Elections, held on November 25, witnessed a significant political shift as the Bharatiya Janata Party (BJP) wrested power from the incumbent Indian National Congress (INC), ending the trend of governments changing hands every five years. This detailed overview analyzes the key players, issues, results, and significance of this crucial election.",
    "rows": [],
    "more": true
  },
  {
    "y": 2022,
    "state": "Gujarat",
    "title": "Gujarat Assembly Elections 2022: A Historic Victory for BJP and Modi’s Home Turf",
    "intro": "The 2022 Gujarat Assembly Elections, held in two phases from December 1 to 5, showcased a remarkable victory for the Bharatiya Janata Party (BJP), solidifying their dominance in Prime Minister Narendra Modi’s home state. This detailed overview explores the key players, issues, results, and significance of this landmark election.",
    "rows": [],
    "more": true
  },
  {
    "y": 2021,
    "state": "Assam",
    "title": "Detailed Overview of Assam Assembly Elections 2021",
    "intro": "The 2021 Assam Assembly Elections, held in three phases from March 27 to April 6, witnessed the return of the Bharatiya Janata Party (BJP)-led National Democratic Alliance (NDA) to power despite facing anti-incumbency and challenges posed by the Congress-led alliance.",
    "rows": [],
    "more": true
  },
  {
    "y": 2020,
    "state": "Bihar",
    "title": "Bihar Assembly Elections 2020: A Tight Contest and NDA’s Return to Power",
    "intro": "The 2020 Bihar Assembly Elections, held in three phases from October 28 to November 7, witnessed a thrilling contest between the National Democratic Alliance (NDA) led by the Bharatiya Janata Party (BJP) and the Grand Alliance (Mahagathbandhan) led by the Rashtriya Janata Dal (RJD). Despite facing anti-incumbency and the challenges of holding elections during the COVID-19 pandemic, the NDA managed to retain power in the state.",
    "rows": [],
    "more": true
  },
  {
    "y": 2019,
    "state": "National",
    "title": "The 2019 Lok Sabha Elections: A BJP Encore with a Stronger Chorus",
    "intro": "The 2019 Indian general election served as a sequel to the 2014 BJP triumph, but this time, the volume was cranked up to eleven. Held in seven phases from April 11 to May 19, the elections witnessed the incumbent Bharatiya Janata Party (BJP) under Prime Minister Narendra Modi reaffirm its dominance, securing an even bigger mandate than its historic win five years prior.",
    "rows": [],
    "more": true
  },
  {
    "y": 2019,
    "state": "Madhya Pradesh",
    "title": "Madhya Pradesh Elections 2019: BJP’s Triumph Amidst Anti-Incumbency",
    "intro": "The 2019 Madhya Pradesh Assembly Elections witnessed a resurgence of the Bharatiya Janata Party (BJP) despite facing anti-incumbency sentiment against the incumbent government. Held in four phases from April 29 to May 19, the election showcased the BJP’s strategic maneuvering and ability to capitalize on key issues.",
    "rows": [],
    "more": true
  },
  {
    "y": 2019,
    "state": "Karnataka",
    "title": "Karnataka Assembly Elections 2019: A Nail-Biting Contest and BJP’s Rise in South India",
    "intro": "The 2019 Karnataka Assembly Elections held on May 12 were a dramatic and closely contested affair, marking a significant political shift in the southern state. The incumbent Bharatiya Janata Party (BJP) faced a strong challenge from the Congress-Janata Dal (Secular) (JDS) alliance, leading to a hung Assembly and subsequent political maneuvering.",
    "rows": [],
    "more": true
  },
  {
    "y": 2018,
    "state": "Tripura",
    "title": "Tripura Assembly Elections 2018: BJP’s Historic Victory and Left Front’s Ouster",
    "intro": "The 2018 Tripura Assembly Elections witnessed a seismic shift in the state’s political landscape, with the Bharatiya Janata Party (BJP) achieving a historic victory after 25 years of Left Front rule. Held in a single phase on February 18, the election stunned political observers with the BJP’s decisive win.",
    "rows": [],
    "more": true
  },
  {
    "y": 2017,
    "state": "Uttar Pradesh",
    "title": "Uttar Pradesh Elections 2017: Yogi Adityanath’s Rise and the BJP’s Consolidation",
    "intro": "The 2017 Uttar Pradesh Assembly Elections witnessed a significant political shift, marking the rise of Hindu nationalist leader Yogi Adityanath and further solidifying the Bharatiya Janata Party (BJP)’s power in India’s most populous state. Held in seven phases from February 4 to March 8, the election saw the BJP retain power with a larger majority.",
    "rows": [],
    "more": true
  },
  {
    "y": 2017,
    "state": "Himachal Pradesh",
    "title": "Himachal Pradesh Elections 2017: A Close Contest and BJP’s Return to Power",
    "intro": "The 2017 Himachal Pradesh Assembly Elections witnessed a thrilling battle between the Bharatiya Janata Party (BJP) and the incumbent Congress government. Held in a single phase on November 9, the election presented a close contest, ultimately leading to the BJP reclaiming power after five years.",
    "rows": [],
    "more": true
  },
  {
    "y": 2016,
    "state": "Assam",
    "title": "Assam Assembly Elections 2016: A BJP Rise in the Northeast",
    "intro": "The 2016 Assam Assembly Elections were a watershed moment for the state and held significant national implications. Held in two phases on April 4 and 11, the elections saw the Bharatiya Janata Party (BJP) rise to power for the first time in the state’s history, ending the 15-year reign of the Congress-led alliance.",
    "rows": [],
    "more": true
  },
  {
    "y": 2014,
    "state": "National",
    "title": "The 2014 Lok Sabha Elections: Modi Mania Sweeps the Nation",
    "intro": "The Bharatiya Janata Party (BJP) has established itself as a formidable force in Indian politics, not just at the national level but also in numerous state elections. Throughout the past decade, they’ve navigated diverse political landscapes, adapted their strategies to local demands, and emerged victorious in numerous key states.",
    "rows": [],
    "more": true
  }
];

/** Ascending, so the helix climbs the way the record reads: oldest at the foot. */
export const campaignYears: number[] = [2014,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2027];

export type Milestone = { y: number; month: string; state: string; text: string };

/** What the mandate helix plots: one disc per milestone, one ring per year. */
export const milestones: Milestone[] = [
  {
    "y": 2027,
    "month": "",
    "state": "Uttar Pradesh",
    "text": "Uttar Pradesh Vidhan Sabha Election 2027: More than a campaign—it’s a state-wide conversation. Join the discussion, make your voice heard, and cast your vote for a better future"
  },
  {
    "y": 2025,
    "month": "",
    "state": "Delhi",
    "text": "This momentous day stands as a testament to our unwavering dedication and strategic approach in the 2025 Delhi Assembly Elections, resulting in a well-earned and decisive victory."
  },
  {
    "y": 2024,
    "month": "",
    "state": "Maharashtra",
    "text": "On this historic day, our efforts in the 2024 Maharashtra Assembly Elections brought exceptional results, reflecting our dedication to strategic planning and securing a well-earned victory."
  },
  {
    "y": 2024,
    "month": "",
    "state": "Jharkhand",
    "text": "Our strategic approach in the 2024 Jharkhand Assembly Elections delivered exceptional results, securing a significant victory for our team."
  },
  {
    "y": 2024,
    "month": "",
    "state": "Haryana",
    "text": "Our success in the 2024 Haryana Assembly Elections highlights the effectiveness of our innovative strategies, demonstrating the strength of our team and securing an exceptional win."
  },
  {
    "y": 2023,
    "month": "November",
    "state": "Madhya Pradesh",
    "text": "In 2023, our unwavering commitment to politics reaches its zenith with triumphs in the Madhya Pradesh Assembly Elections. Our innovative strategies illuminate the path to victory."
  },
  {
    "y": 2023,
    "month": "",
    "state": "Rajasthan",
    "text": "On this exquisite day, the dividends of our labor in the political arena during the 2023 Rajasthan Assembly Elections materialized, underscoring the success of our distinctive campaign strategies."
  },
  {
    "y": 2023,
    "month": "",
    "state": "Chhattisgarh",
    "text": "On this auspicious day, our political journey culminates in success as the 2023 Chhattisgarh Assembly Elections reflect the ingenuity of our efforts and the triumph of our distinctive campaign approach"
  },
  {
    "y": 2023,
    "month": "",
    "state": "Telangana",
    "text": "The fruition of our endeavors in the political arena for the 2023 Telangana Assembly Elections unveils the success of our distinctive campaign strategies."
  },
  {
    "y": 2023,
    "month": "",
    "state": "Mizoram",
    "text": "Our political prowess shines through as the 2023 Mizoram Assembly Elections witness the triumphant results of our innovative campaign efforts. Victory is our melody, played with unique notes of success."
  },
  {
    "y": 2022,
    "month": "February",
    "state": "Goa",
    "text": "On this radiant day, our dedication to the political arena shines through as the 2022 Goa Assembly Elections witness the triumph of our strategic campaigning"
  },
  {
    "y": 2022,
    "month": "",
    "state": "Punjab",
    "text": "Today’s radiance reflects the culmination of our unwavering political dedication, as the 2022 Punjab Assembly Elections witness the fruition of our tireless efforts and the triumph of our unique campaign strategies"
  },
  {
    "y": 2022,
    "month": "",
    "state": "Uttarakhand",
    "text": "In the light of today’s grace, our tireless efforts in the political arena have manifested in the victorious outcome of the 2022 Uttarakhand Assembly Elections."
  },
  {
    "y": 2022,
    "month": "",
    "state": "Uttar Pradesh",
    "text": "Amidst today’s glow, our resolute dedication to politics reaches its zenith, with the 2022 Uttar Pradesh Assembly Elections showcasing the fruits of our unwavering efforts and the success born from our innovative campaign strategies."
  },
  {
    "y": 2021,
    "month": "April",
    "state": "Assam, Tamil Nadu, West Bengal",
    "text": "Amidst the beauty of today, our hard work in the political campaigns for the 2021 Assam, Tamil Nadu, and West Bengal Assembly Elections has blossomed into a well-deserved success."
  },
  {
    "y": 2020,
    "month": "February",
    "state": "Delhi",
    "text": "On this remarkable day, our 2020 Delhi Assembly Elections campaign efforts paid off, marking a well-deserved triumph and underscoring our distinctive approach to political excellence"
  },
  {
    "y": 2020,
    "month": "October",
    "state": "Bihar",
    "text": "On this pivotal day, our 2020 Bihar Assembly Elections campaign yielded a triumphant success, showcasing our unique and effective approach to political excellence"
  },
  {
    "y": 2019,
    "month": "May",
    "state": "General Elections",
    "text": "Our triumph in the 2019 General Elections can be attributed to the ingenious strategies employed, showcasing the distinctive prowess of our cohort and solidifying a remarkable victory."
  },
  {
    "y": 2017,
    "month": "March",
    "state": "Punjab",
    "text": "On this beautiful day, our efforts in political campaigning for the Punjab Assembly Elections (2017) paid off."
  },
  {
    "y": 2015,
    "month": "November",
    "state": "Bihar",
    "text": "Our political personality promotion again bears fruit with the results of the Bihar Assembly Elections (2015)."
  },
  {
    "y": 2014,
    "month": "May",
    "state": "General Elections",
    "text": "Our General Elections (2014) strategies were proven to be efficient, securing a fantastic win for our cohort."
  },
  {
    "y": 2012,
    "month": "March",
    "state": "Punjab",
    "text": "Results for Punjab Assembly Elections (2012) were declared, headlining the victory of our confrere."
  }
];

export const milestoneYears: number[] = [2012,2014,2015,2017,2019,2020,2021,2022,2023,2024,2025,2027];

export const campaignSource = "logsabha.com/about-us/ — Internet Archive snapshot, 14 May 2026";
