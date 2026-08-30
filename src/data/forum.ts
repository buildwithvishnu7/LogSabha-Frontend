// GENERATED from reference/new_ref/assets/forum-data.js — do not hand-edit.
//
// ⚠ DEMONSTRATION CONTENT. Demonstration content. Authors are fictional; replace with the forum API payload.
//
// Every author here is invented and every count is made up. The page says so
// on screen: a forum that shows fictional posts and a 52,400-member counter
// without saying they are fictional is claiming a community it does not have.
//
// Structure follows the PRD: six categories, threads with nested comments, an
// up/down vote system, reporting, and a moderator queue. Replace this file
// with the real API payload — nothing else reads these values.

export type ForumUser = {
  name: string;
  handle: string;
  role: "verified" | "member" | "moderator" | string;
  rep: number;
  state: string;
};

export type Category = {
  id: string;
  name: string;
  /** the card's colour on the 3D ring */
  c: string;
  glyph: string;
  blurb: string;
  threads: number;
  replies: number;
  votes: number;
};

export type Comment = {
  id: string;
  by: string;
  t: number;
  up: number;
  down: number;
  /** id of the comment this replies to, or null for a top-level reply */
  parent: string | null;
  text: string;
};

export type Thread = {
  id: string;
  cat: string;
  by: string;
  /** hours since posting */
  t: number;
  pinned?: boolean;
  title: string;
  body: string;
  up: number;
  down: number;
  views: number;
  /** hashtags the thread was filed under */
  tags?: string[];
  replies?: number;
  score?: number;
  /** the feed's own heat value, not a flag */
  hot?: number;
  /** some threads carry their discussion inline as well as in forumComments */
  comments?: Comment[];
  trending?: boolean;
};


export type Report = {
  id: string;
  kind: string;
  on: string;
  reason: string;
  count: number;
  age: string;
  status: "open" | "resolved" | string;
};

export const forumUsers: Record<string, ForumUser> = {
  "ananya": {
    "name": "Ananya Iyer",
    "handle": "ananya_reads",
    "role": "verified",
    "rep": 4820,
    "state": "Tamil Nadu"
  },
  "rohit": {
    "name": "Rohit Deshmukh",
    "handle": "rohit_psephy",
    "role": "verified",
    "rep": 6310,
    "state": "Maharashtra"
  },
  "fatima": {
    "name": "Fatima Qureshi",
    "handle": "fq_policy",
    "role": "moderator",
    "rep": 9140,
    "state": "Delhi"
  },
  "harpreet": {
    "name": "Harpreet Singh",
    "handle": "harpreet_s",
    "role": "member",
    "rep": 1180,
    "state": "Punjab"
  },
  "meera": {
    "name": "Meera Nair",
    "handle": "meera_civics",
    "role": "member",
    "rep": 2240,
    "state": "Kerala"
  },
  "arjun": {
    "name": "Arjun Bhattachar",
    "handle": "arjun_b",
    "role": "member",
    "rep": 760,
    "state": "West Bengal"
  },
  "kavya": {
    "name": "Kavya Reddy",
    "handle": "kavya_data",
    "role": "verified",
    "rep": 5075,
    "state": "Telangana"
  },
  "devendra": {
    "name": "Devendra Yadav",
    "handle": "dev_yadav",
    "role": "member",
    "rep": 1630,
    "state": "Uttar Pradesh"
  },
  "nilofer": {
    "name": "Nilofer Baig",
    "handle": "nilofer_b",
    "role": "moderator",
    "rep": 7890,
    "state": "Karnataka"
  },
  "tenzin": {
    "name": "Tenzin Dorjee",
    "handle": "tenzin_d",
    "role": "member",
    "rep": 540,
    "state": "Sikkim"
  }
};

export const forumCategories: Category[] = [
  {
    "id": "national",
    "name": "National Politics",
    "c": "#ff9933",
    "glyph": "1",
    "blurb": "Union government, national parties, coalition arithmetic.",
    "threads": 2,
    "replies": 102,
    "votes": 369
  },
  {
    "id": "state",
    "name": "State Politics",
    "c": "#1b6ec2",
    "glyph": "2",
    "blurb": "Assemblies, chief ministers, regional alliances and by-polls.",
    "threads": 2,
    "replies": 56,
    "votes": 285
  },
  {
    "id": "elections",
    "name": "Elections",
    "c": "#138808",
    "glyph": "3",
    "blurb": "Results, turnout, electoral rolls, delimitation and the ECI.",
    "threads": 2,
    "replies": 135,
    "votes": 441
  },
  {
    "id": "parliament",
    "name": "Parliamentary Affairs",
    "c": "#8b5cf6",
    "glyph": "4",
    "blurb": "Bills, debates, question hour, committees and attendance.",
    "threads": 2,
    "replies": 93,
    "votes": 420
  },
  {
    "id": "policy",
    "name": "Policy Discussions",
    "c": "#e11d48",
    "glyph": "5",
    "blurb": "Budgets, welfare delivery, federal finance, regulation.",
    "threads": 3,
    "replies": 150,
    "votes": 683
  },
  {
    "id": "general",
    "name": "General Discussion",
    "c": "#0891b2",
    "glyph": "6",
    "blurb": "Everything else — civics, history, platform feedback.",
    "threads": 1,
    "replies": 19,
    "votes": 121
  }
];

export const forumThreads: Thread[] = [
  {
    "id": "t1",
    "cat": "policy",
    "by": "ananya",
    "t": 2,
    "pinned": true,
    "title": "Budget 2026: what the rural allocation actually changes on the ground",
    "body": "The headline is a 23% increase in rural infrastructure. But roughly a third of that is a re-classification of existing schemes rather than new money. If we strip the re-labelled lines out, real growth looks closer to 9%. Has anyone reconciled the expenditure budget against last year’s revised estimates yet?",
    "up": 342,
    "down": 18,
    "views": 12400,
    "tags": [
      "Budget2026",
      "RuralDevelopment"
    ],
    "replies": 87,
    "score": 324,
    "hot": 151.15134462896282,
    "comments": [
      {
        "id": "c1",
        "by": "rohit",
        "t": 1.6,
        "up": 64,
        "down": 2,
        "parent": null,
        "text": "I did part of this. Two schemes were merged and re-badged, which accounts for about ₹18,000 crore of the increase. Net new money is real but a lot smaller than the press release implies."
      },
      {
        "id": "c2",
        "by": "ananya",
        "t": 1.2,
        "up": 21,
        "down": 0,
        "parent": "c1",
        "text": "That matches my rough reconciliation. Do you have the scheme codes? I want to check the revised estimates rather than the budget estimates."
      },
      {
        "id": "c3",
        "by": "rohit",
        "t": 1,
        "up": 33,
        "down": 1,
        "parent": "c2",
        "text": "Yes — will post the working as a separate thread with the source PDFs linked so people can check it rather than take my word for it."
      },
      {
        "id": "c4",
        "by": "harpreet",
        "t": 0.9,
        "up": 12,
        "down": 6,
        "parent": null,
        "text": "Worth remembering the allocation is only half the story. Utilisation in the last two years ran well below allocation in several states."
      },
      {
        "id": "c5",
        "by": "fatima",
        "t": 0.5,
        "up": 28,
        "down": 1,
        "parent": "c4",
        "text": "Agreed, and utilisation data lags by about two quarters, so we will not be able to judge this year’s number until well into the next financial year."
      }
    ]
  },
  {
    "id": "t2",
    "cat": "elections",
    "by": "rohit",
    "t": 4,
    "trending": true,
    "title": "Reading the 2024 turnout drop — apathy, or roll clean-up?",
    "body": "National turnout fell from 67.40% to 65.79%. Before we call it disengagement, note that several states completed large-scale roll revisions in the same window, which removes duplicate and deceased entries and mechanically changes the denominator. Turnout is a ratio — you cannot read it without reading the roll.",
    "up": 289,
    "down": 24,
    "views": 8930,
    "tags": [
      "Turnout",
      "ElectoralRolls"
    ],
    "replies": 64,
    "score": 265,
    "hot": 98.91512091681021,
    "comments": [
      {
        "id": "c6",
        "by": "kavya",
        "t": 3.4,
        "up": 51,
        "down": 3,
        "parent": null,
        "text": "The roll-revision point is underrated. In two states the electorate shrank in absolute terms between 2019 and 2024 despite population growth. That is a cleaning artefact, not migration."
      },
      {
        "id": "c7",
        "by": "arjun",
        "t": 2.8,
        "up": 17,
        "down": 9,
        "parent": null,
        "text": "Some of it must still be genuine disengagement though — urban seats in particular have been under-performing rural ones for three cycles now."
      },
      {
        "id": "c8",
        "by": "rohit",
        "t": 2.1,
        "up": 24,
        "down": 1,
        "parent": "c7",
        "text": "True, but the urban–rural gap is old and fairly stable. It does not explain the change between 2019 and 2024, only the level."
      }
    ]
  },
  {
    "id": "t3",
    "cat": "parliament",
    "by": "kavya",
    "t": 6,
    "trending": true,
    "title": "Question Hour productivity: 17th vs 18th Lok Sabha, first session compared",
    "body": "Pulled the sitting-wise data for the first session of both houses. Starred questions answered orally are down, but written answers are up sharply. That is a different story from \"Parliament is not working\" — it is a shift in how scrutiny happens, and written answers are arguably more citable.",
    "up": 256,
    "down": 11,
    "views": 7210,
    "tags": [
      "QuestionHour",
      "LokSabha"
    ],
    "replies": 41,
    "score": 245,
    "hot": 78.0668384233048,
    "comments": [
      {
        "id": "c9",
        "by": "fatima",
        "t": 5.1,
        "up": 38,
        "down": 0,
        "parent": null,
        "text": "Written answers being up is a genuinely important finding. They are on the record, searchable, and citable in a way that an oral exchange is not."
      },
      {
        "id": "c10",
        "by": "meera",
        "t": 4.2,
        "up": 15,
        "down": 2,
        "parent": "c9",
        "text": "Counterpoint: you lose the supplementary. The follow-up question is often where the actual accountability happens."
      }
    ]
  },
  {
    "id": "t4",
    "cat": "national",
    "by": "fatima",
    "t": 9,
    "title": "Coalition arithmetic: what a 293-seat majority actually constrains",
    "body": "A 293-seat NDA is 21 above the halfway mark. The interesting question is not whether the government survives — it is which bills need floor management that a 353-seat majority did not. Money bills, no. Constitutional amendments, very much yes.",
    "up": 231,
    "down": 29,
    "views": 6640,
    "tags": [
      "Coalition",
      "LokSabha"
    ],
    "replies": 58,
    "score": 202,
    "hot": 54.023832800817125,
    "comments": []
  },
  {
    "id": "t5",
    "cat": "policy",
    "by": "meera",
    "t": 13,
    "title": "How should MPLADS utilisation be measured fairly?",
    "body": "Raw utilisation percentage punishes MPs who inherit a backlog and rewards those who sanction quickly regardless of completion. Should we be ranking on funds released, works completed, or works completed per rupee? Each gives a different league table.",
    "up": 198,
    "down": 9,
    "views": 5480,
    "tags": [
      "MPLADS",
      "Transparency"
    ],
    "replies": 37,
    "score": 189,
    "hot": 42.61982004948947,
    "comments": []
  },
  {
    "id": "t6",
    "cat": "state",
    "by": "harpreet",
    "t": 17,
    "title": "Why do by-poll turnouts diverge so sharply from general elections?",
    "body": "Punjab by-polls routinely land 8–12 points below the general election figure in the same seat. Some of that is the absence of a national contest, but I suspect a lot is migrant voters simply not travelling back for a single seat.",
    "up": 176,
    "down": 14,
    "views": 4920,
    "tags": [
      "ByPolls",
      "Turnout"
    ],
    "replies": 33,
    "score": 162,
    "hot": 32.07750150455685,
    "comments": []
  },
  {
    "id": "t7",
    "cat": "parliament",
    "by": "devendra",
    "t": 22,
    "title": "Anti-defection law: has the Tenth Schedule outlived its design?",
    "body": "It was written to stop individual floor-crossing. In practice it has pushed the same behaviour into bulk splits and mass resignations, which the law treats far more leniently. The incentive it creates now is the opposite of the one intended.",
    "up": 164,
    "down": 31,
    "views": 4610,
    "tags": [
      "AntiDefection",
      "Constitution"
    ],
    "replies": 52,
    "score": 133,
    "hot": 23.159834842589525,
    "comments": []
  },
  {
    "id": "t8",
    "cat": "elections",
    "by": "arjun",
    "t": 28,
    "title": "Simultaneous elections: the logistics nobody costs properly",
    "body": "Most of the debate is constitutional. The operational side gets skipped — EVM and VVPAT inventory, central force deployment, and how many polling personnel you need simultaneously. Those numbers decide whether it is feasible at all.",
    "up": 152,
    "down": 38,
    "views": 5130,
    "tags": [
      "OneNationOneElection"
    ],
    "replies": 71,
    "score": 114,
    "hot": 17.558530294307676,
    "comments": []
  },
  {
    "id": "t9",
    "cat": "policy",
    "by": "nilofer",
    "t": 34,
    "title": "State finance commissions: the tier nobody talks about",
    "body": "Everyone tracks the Union Finance Commission. State Finance Commissions, which decide what actually reaches panchayats and municipalities, are constituted late or not at all in several states. Devolution on paper is not devolution.",
    "up": 143,
    "down": 7,
    "views": 3880,
    "tags": [
      "Federalism",
      "Panchayat"
    ],
    "replies": 26,
    "score": 136,
    "hot": 18.948399513766567,
    "comments": []
  },
  {
    "id": "t10",
    "cat": "national",
    "by": "tenzin",
    "t": 41,
    "title": "Women’s Reservation Act: what happens after the next delimitation",
    "body": "Implementation is tied to a census and a delimitation exercise. That sequencing means the timeline is not really in Parliament’s hands any more. Worth reading the commencement clause carefully before predicting a date.",
    "up": 138,
    "down": 12,
    "views": 4270,
    "tags": [
      "WomensReservation",
      "Delimitation"
    ],
    "replies": 44,
    "score": 126,
    "hot": 15.920726970025855,
    "comments": []
  },
  {
    "id": "t11",
    "cat": "general",
    "by": "meera",
    "t": 52,
    "title": "Parliamentary committee attendance is public now — what does it show?",
    "body": "Standing committee attendance varies far more than floor attendance, and committees are where the actual line-by-line scrutiny happens. This feels like the more useful accountability metric, and almost nobody reports it.",
    "up": 121,
    "down": 5,
    "views": 3140,
    "tags": [
      "Committees",
      "Accountability"
    ],
    "replies": 19,
    "score": 116,
    "hot": 12.93127719424429,
    "comments": []
  },
  {
    "id": "t12",
    "cat": "state",
    "by": "kavya",
    "t": 61,
    "title": "Panchayat devolution index: which states actually devolve funds, functions and functionaries?",
    "body": "The 73rd Amendment listed 29 subjects. Very few states have transferred all three \"F\"s for even half of them. Kerala and Karnataka score well; several large states have devolved functions without the staff to perform them.",
    "up": 109,
    "down": 8,
    "views": 2960,
    "tags": [
      "Panchayat",
      "Federalism"
    ],
    "replies": 23,
    "score": 101,
    "hot": 10.34389424199883,
    "comments": []
  }
];

/** Keyed by thread id. Only some threads carry a seeded discussion. */
export const forumComments: Record<string, Comment[]> = {
  "t1": [
    {
      "id": "c1",
      "by": "rohit",
      "t": 1.6,
      "up": 64,
      "down": 2,
      "parent": null,
      "text": "I did part of this. Two schemes were merged and re-badged, which accounts for about ₹18,000 crore of the increase. Net new money is real but a lot smaller than the press release implies."
    },
    {
      "id": "c2",
      "by": "ananya",
      "t": 1.2,
      "up": 21,
      "down": 0,
      "parent": "c1",
      "text": "That matches my rough reconciliation. Do you have the scheme codes? I want to check the revised estimates rather than the budget estimates."
    },
    {
      "id": "c3",
      "by": "rohit",
      "t": 1,
      "up": 33,
      "down": 1,
      "parent": "c2",
      "text": "Yes — will post the working as a separate thread with the source PDFs linked so people can check it rather than take my word for it."
    },
    {
      "id": "c4",
      "by": "harpreet",
      "t": 0.9,
      "up": 12,
      "down": 6,
      "parent": null,
      "text": "Worth remembering the allocation is only half the story. Utilisation in the last two years ran well below allocation in several states."
    },
    {
      "id": "c5",
      "by": "fatima",
      "t": 0.5,
      "up": 28,
      "down": 1,
      "parent": "c4",
      "text": "Agreed, and utilisation data lags by about two quarters, so we will not be able to judge this year’s number until well into the next financial year."
    }
  ],
  "t2": [
    {
      "id": "c6",
      "by": "kavya",
      "t": 3.4,
      "up": 51,
      "down": 3,
      "parent": null,
      "text": "The roll-revision point is underrated. In two states the electorate shrank in absolute terms between 2019 and 2024 despite population growth. That is a cleaning artefact, not migration."
    },
    {
      "id": "c7",
      "by": "arjun",
      "t": 2.8,
      "up": 17,
      "down": 9,
      "parent": null,
      "text": "Some of it must still be genuine disengagement though — urban seats in particular have been under-performing rural ones for three cycles now."
    },
    {
      "id": "c8",
      "by": "rohit",
      "t": 2.1,
      "up": 24,
      "down": 1,
      "parent": "c7",
      "text": "True, but the urban–rural gap is old and fairly stable. It does not explain the change between 2019 and 2024, only the level."
    }
  ],
  "t3": [
    {
      "id": "c9",
      "by": "fatima",
      "t": 5.1,
      "up": 38,
      "down": 0,
      "parent": null,
      "text": "Written answers being up is a genuinely important finding. They are on the record, searchable, and citable in a way that an oral exchange is not."
    },
    {
      "id": "c10",
      "by": "meera",
      "t": 4.2,
      "up": 15,
      "down": 2,
      "parent": "c9",
      "text": "Counterpoint: you lose the supplementary. The follow-up question is often where the actual accountability happens."
    }
  ]
};

export const forumHashtags = [
  {
    "tag": "Budget2026",
    "n": 45200,
    "change": 23,
    "spark": [
      12,
      18,
      15,
      24,
      31,
      38,
      45
    ]
  },
  {
    "tag": "StateElections",
    "n": 38700,
    "change": 18,
    "spark": [
      22,
      20,
      26,
      25,
      31,
      34,
      39
    ]
  },
  {
    "tag": "RuralDevelopment",
    "n": 29400,
    "change": 34,
    "spark": [
      8,
      11,
      14,
      13,
      19,
      24,
      29
    ]
  },
  {
    "tag": "QuestionHour",
    "n": 21800,
    "change": 12,
    "spark": [
      14,
      16,
      15,
      17,
      19,
      20,
      22
    ]
  },
  {
    "tag": "Turnout",
    "n": 18300,
    "change": -6,
    "spark": [
      21,
      22,
      20,
      19,
      20,
      19,
      18
    ]
  },
  {
    "tag": "MPLADS",
    "n": 15600,
    "change": 9,
    "spark": [
      11,
      12,
      13,
      12,
      14,
      15,
      16
    ]
  },
  {
    "tag": "Federalism",
    "n": 12900,
    "change": 27,
    "spark": [
      6,
      7,
      8,
      9,
      10,
      12,
      13
    ]
  },
  {
    "tag": "AntiDefection",
    "n": 9800,
    "change": -3,
    "spark": [
      11,
      10,
      11,
      10,
      10,
      9,
      10
    ]
  }
] as const;

export const forumReports: Report[] = [
  {
    "id": "r1",
    "kind": "Comment",
    "on": "Anti-defection law: has the Tenth Schedule…",
    "reason": "Personal attack",
    "count": 7,
    "age": "12 min",
    "status": "open"
  },
  {
    "id": "r2",
    "kind": "Thread",
    "on": "Simultaneous elections: the logistics nobody costs…",
    "reason": "Unverified claim",
    "count": 4,
    "age": "48 min",
    "status": "open"
  },
  {
    "id": "r3",
    "kind": "Comment",
    "on": "Reading the 2024 turnout drop…",
    "reason": "Off-topic / spam",
    "count": 3,
    "age": "2 hr",
    "status": "reviewing"
  },
  {
    "id": "r4",
    "kind": "Comment",
    "on": "Budget 2026: what the rural allocation…",
    "reason": "Misleading figure",
    "count": 9,
    "age": "3 hr",
    "status": "open"
  },
  {
    "id": "r5",
    "kind": "Thread",
    "on": "Panchayat devolution index…",
    "reason": "Duplicate post",
    "count": 2,
    "age": "5 hr",
    "status": "resolved"
  }
];

/** Demo figures — invented, and labelled as such wherever they are shown. */
export const forumStats = {
  "members": 52400,
  "dailyPosts": 1200,
  "threads": 18640,
  "replies": 214900,
  "online": 3180,
  "moderators": 24
} as const;

/** [title, detail] — the house rules. */
export const forumGuidelines: [string, string][] = [
  [
    "Argue the claim, not the person",
    "Attack reasoning, evidence and framing. Never the individual making the point."
  ],
  [
    "Cite where you can",
    "A link to the gazette, the ECI portal or a committee report ends more arguments than volume does."
  ],
  [
    "Say when you are speculating",
    "Marking a guess as a guess costs nothing and protects everyone reading."
  ],
  [
    "Report, do not retaliate",
    "Flag it and move on. Moderators see the queue within minutes."
  ],
  [
    "No personal data",
    "No phone numbers, addresses, or identity document numbers — yours or anyone else’s."
  ]
];

export const forumNote = "Demonstration content. Authors are fictional; replace with the forum API payload.";
