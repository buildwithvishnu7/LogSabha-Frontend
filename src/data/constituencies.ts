// GENERATED from reference/new_ref/assets/election-data.js — do not hand-edit.
//
// A VERIFIED SUBSET of constituency results, not the full House. 77 of the
// 543 seats are loaded here, covering 21 states.
//
// `margin` is the winning margin in votes and is given ONLY where the figure is
// firm — 31 of the 77 rows. The rest carry null, which means the number
// arrives with the ECI feed rather than being estimated here. The UI must show
// null as unavailable and must never present this subset as the whole House.

export type Constituency = {
  id: string;
  /** constituency name */
  c: string;
  /** state */
  s: string;
  /** winning member */
  w: string;
  /** party key, matching lsParty in lok-sabha-2024.ts */
  p: string;
  /** winning margin in votes, or null when not yet firm */
  m: number | null;
  /** A remark on the row itself — Surat was elected unopposed, Dhubri carried
   *  the largest margin of the 2024 election. Not every row has one. */
  note?: string;
  year: number;
  house: string;
};

export const constituencies: Constituency[] = [
  {
    "c": "Varanasi",
    "s": "Uttar Pradesh",
    "w": "Narendra Modi",
    "p": "BJP",
    "m": 152513,
    "id": "pc1",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Rae Bareli",
    "s": "Uttar Pradesh",
    "w": "Rahul Gandhi",
    "p": "INC",
    "m": 390030,
    "id": "pc2",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Amethi",
    "s": "Uttar Pradesh",
    "w": "Kishori Lal Sharma",
    "p": "INC",
    "m": 167196,
    "id": "pc3",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Lucknow",
    "s": "Uttar Pradesh",
    "w": "Rajnath Singh",
    "p": "BJP",
    "m": 135159,
    "id": "pc4",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Mainpuri",
    "s": "Uttar Pradesh",
    "w": "Dimple Yadav",
    "p": "SP",
    "m": 221639,
    "id": "pc5",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kannauj",
    "s": "Uttar Pradesh",
    "w": "Akhilesh Yadav",
    "p": "SP",
    "m": 170922,
    "id": "pc6",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Faizabad",
    "s": "Uttar Pradesh",
    "w": "Awadhesh Prasad",
    "p": "SP",
    "m": 54567,
    "id": "pc7",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Sultanpur",
    "s": "Uttar Pradesh",
    "w": "Ram Bhual Nishad",
    "p": "SP",
    "m": 43174,
    "id": "pc8",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Meerut",
    "s": "Uttar Pradesh",
    "w": "Arun Govil",
    "p": "BJP",
    "m": 10585,
    "id": "pc9",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kairana",
    "s": "Uttar Pradesh",
    "w": "Iqra Choudhary",
    "p": "SP",
    "m": null,
    "id": "pc10",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Muzaffarnagar",
    "s": "Uttar Pradesh",
    "w": "Harendra Singh Malik",
    "p": "SP",
    "m": null,
    "id": "pc11",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Baghpat",
    "s": "Uttar Pradesh",
    "w": "Rajkumar Sangwan",
    "p": "RLD",
    "m": null,
    "id": "pc12",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Ghaziabad",
    "s": "Uttar Pradesh",
    "w": "Atul Garg",
    "p": "BJP",
    "m": null,
    "id": "pc13",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Pilibhit",
    "s": "Uttar Pradesh",
    "w": "Jitin Prasada",
    "p": "BJP",
    "m": null,
    "id": "pc14",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Gandhinagar",
    "s": "Gujarat",
    "w": "Amit Shah",
    "p": "BJP",
    "m": 744716,
    "id": "pc15",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Rajkot",
    "s": "Gujarat",
    "w": "Parshottam Rupala",
    "p": "BJP",
    "m": 484260,
    "id": "pc16",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Surat",
    "s": "Gujarat",
    "w": "Mukesh Dalal",
    "p": "BJP",
    "m": null,
    "note": "Elected unopposed",
    "id": "pc17",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Vadodara",
    "s": "Gujarat",
    "w": "Hemang Joshi",
    "p": "BJP",
    "m": null,
    "id": "pc18",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Nagpur",
    "s": "Maharashtra",
    "w": "Nitin Gadkari",
    "p": "BJP",
    "m": 137603,
    "id": "pc19",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Mumbai North",
    "s": "Maharashtra",
    "w": "Piyush Goyal",
    "p": "BJP",
    "m": 357608,
    "id": "pc20",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Baramati",
    "s": "Maharashtra",
    "w": "Supriya Sule",
    "p": "NCPSP",
    "m": 158333,
    "id": "pc21",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Nanded",
    "s": "Maharashtra",
    "w": "Vasantrao Chavan",
    "p": "INC",
    "m": null,
    "id": "pc22",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Amravati",
    "s": "Maharashtra",
    "w": "Balwant Wankhade",
    "p": "INC",
    "m": null,
    "id": "pc23",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Vidisha",
    "s": "Madhya Pradesh",
    "w": "Shivraj Singh Chouhan",
    "p": "BJP",
    "m": 821408,
    "id": "pc24",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Guna",
    "s": "Madhya Pradesh",
    "w": "Jyotiraditya Scindia",
    "p": "BJP",
    "m": 540929,
    "id": "pc25",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Diamond Harbour",
    "s": "West Bengal",
    "w": "Abhishek Banerjee",
    "p": "TMC",
    "m": 710930,
    "id": "pc26",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Krishnanagar",
    "s": "West Bengal",
    "w": "Mahua Moitra",
    "p": "TMC",
    "m": null,
    "id": "pc27",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Baharampur",
    "s": "West Bengal",
    "w": "Yusuf Pathan",
    "p": "TMC",
    "m": null,
    "id": "pc28",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Balurghat",
    "s": "West Bengal",
    "w": "Sukanta Majumdar",
    "p": "BJP",
    "m": null,
    "id": "pc29",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Tamluk",
    "s": "West Bengal",
    "w": "Abhijit Gangopadhyay",
    "p": "BJP",
    "m": null,
    "id": "pc30",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Patna Sahib",
    "s": "Bihar",
    "w": "Ravi Shankar Prasad",
    "p": "BJP",
    "m": null,
    "id": "pc31",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Hajipur",
    "s": "Bihar",
    "w": "Chirag Paswan",
    "p": "LJPRV",
    "m": null,
    "id": "pc32",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Saran",
    "s": "Bihar",
    "w": "Rajiv Pratap Rudy",
    "p": "BJP",
    "m": null,
    "id": "pc33",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Karakat",
    "s": "Bihar",
    "w": "Raja Ram Singh",
    "p": "CPIML",
    "m": null,
    "id": "pc34",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Purnia",
    "s": "Bihar",
    "w": "Rajesh Ranjan (Pappu Yadav)",
    "p": "IND",
    "m": null,
    "id": "pc35",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Gaya",
    "s": "Bihar",
    "w": "Jitan Ram Manjhi",
    "p": "HAM",
    "m": null,
    "id": "pc36",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Wayanad",
    "s": "Kerala",
    "w": "Rahul Gandhi",
    "p": "INC",
    "m": 364422,
    "id": "pc37",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Thiruvananthapuram",
    "s": "Kerala",
    "w": "Shashi Tharoor",
    "p": "INC",
    "m": 16077,
    "id": "pc38",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Thrissur",
    "s": "Kerala",
    "w": "Suresh Gopi",
    "p": "BJP",
    "m": 74686,
    "id": "pc39",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Alathur",
    "s": "Kerala",
    "w": "K Radhakrishnan",
    "p": "CPIM",
    "m": null,
    "id": "pc40",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kannur",
    "s": "Kerala",
    "w": "K Sudhakaran",
    "p": "INC",
    "m": null,
    "id": "pc41",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kozhikode",
    "s": "Kerala",
    "w": "M K Raghavan",
    "p": "INC",
    "m": null,
    "id": "pc42",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Thoothukkudi",
    "s": "Tamil Nadu",
    "w": "Kanimozhi Karunanidhi",
    "p": "DMK",
    "m": null,
    "id": "pc43",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Sivaganga",
    "s": "Tamil Nadu",
    "w": "Karti Chidambaram",
    "p": "INC",
    "m": null,
    "id": "pc44",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Coimbatore",
    "s": "Tamil Nadu",
    "w": "Ganapathy Rajkumar P",
    "p": "DMK",
    "m": null,
    "id": "pc45",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kanniyakumari",
    "s": "Tamil Nadu",
    "w": "Vijay Vasanth",
    "p": "INC",
    "m": null,
    "id": "pc46",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Chennai South",
    "s": "Tamil Nadu",
    "w": "Thamizhachi Thangapandian",
    "p": "DMK",
    "m": null,
    "id": "pc47",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Hyderabad",
    "s": "Telangana",
    "w": "Asaduddin Owaisi",
    "p": "AIMIM",
    "m": 338087,
    "id": "pc48",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Secunderabad",
    "s": "Telangana",
    "w": "G Kishan Reddy",
    "p": "BJP",
    "m": null,
    "id": "pc49",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Karimnagar",
    "s": "Telangana",
    "w": "Bandi Sanjay Kumar",
    "p": "BJP",
    "m": null,
    "id": "pc50",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Vijayawada",
    "s": "Andhra Pradesh",
    "w": "Kesineni Sivanath",
    "p": "TDP",
    "m": null,
    "id": "pc51",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Rajahmundry",
    "s": "Andhra Pradesh",
    "w": "Daggubati Purandeswari",
    "p": "BJP",
    "m": null,
    "id": "pc52",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kadapa",
    "s": "Andhra Pradesh",
    "w": "Y S Avinash Reddy",
    "p": "YSRCP",
    "m": null,
    "id": "pc53",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kota",
    "s": "Rajasthan",
    "w": "Om Birla",
    "p": "BJP",
    "m": 41974,
    "id": "pc54",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Jodhpur",
    "s": "Rajasthan",
    "w": "Gajendra Singh Shekhawat",
    "p": "BJP",
    "m": null,
    "id": "pc55",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Bikaner",
    "s": "Rajasthan",
    "w": "Arjun Ram Meghwal",
    "p": "BJP",
    "m": null,
    "id": "pc56",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Nagaur",
    "s": "Rajasthan",
    "w": "Hanuman Beniwal",
    "p": "RLP",
    "m": null,
    "id": "pc57",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Barmer",
    "s": "Rajasthan",
    "w": "Ummeda Ram Beniwal",
    "p": "INC",
    "m": null,
    "id": "pc58",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Bathinda",
    "s": "Punjab",
    "w": "Harsimrat Kaur Badal",
    "p": "SAD",
    "m": null,
    "id": "pc59",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Khadoor Sahib",
    "s": "Punjab",
    "w": "Amritpal Singh",
    "p": "IND",
    "m": null,
    "id": "pc60",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Faridkot",
    "s": "Punjab",
    "w": "Sarabjeet Singh Khalsa",
    "p": "IND",
    "m": null,
    "id": "pc61",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Ludhiana",
    "s": "Punjab",
    "w": "Amarinder Singh Raja Warring",
    "p": "INC",
    "m": null,
    "id": "pc62",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Gurdaspur",
    "s": "Punjab",
    "w": "Sukhjinder Singh Randhawa",
    "p": "INC",
    "m": null,
    "id": "pc63",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Kurukshetra",
    "s": "Haryana",
    "w": "Naveen Jindal",
    "p": "BJP",
    "m": 29021,
    "id": "pc64",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Chandigarh",
    "s": "Chandigarh",
    "w": "Manish Tewari",
    "p": "INC",
    "m": 2504,
    "id": "pc65",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "New Delhi",
    "s": "Delhi",
    "w": "Bansuri Swaraj",
    "p": "BJP",
    "m": 78370,
    "id": "pc66",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "North East Delhi",
    "s": "Delhi",
    "w": "Manoj Tiwari",
    "p": "BJP",
    "m": 138778,
    "id": "pc67",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Chandni Chowk",
    "s": "Delhi",
    "w": "Praveen Khandelwal",
    "p": "BJP",
    "m": null,
    "id": "pc68",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Dhubri",
    "s": "Assam",
    "w": "Rakibul Hussain",
    "p": "INC",
    "m": 1012476,
    "note": "Largest victory margin in the 2024 election",
    "id": "pc69",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Dibrugarh",
    "s": "Assam",
    "w": "Sarbananda Sonowal",
    "p": "BJP",
    "m": null,
    "id": "pc70",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Jorhat",
    "s": "Assam",
    "w": "Gaurav Gogoi",
    "p": "INC",
    "m": null,
    "id": "pc71",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Mandi",
    "s": "Himachal Pradesh",
    "w": "Kangana Ranaut",
    "p": "BJP",
    "m": 74755,
    "id": "pc72",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Shimla",
    "s": "Himachal Pradesh",
    "w": "Suresh Kumar Kashyap",
    "p": "BJP",
    "m": null,
    "id": "pc73",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Haridwar",
    "s": "Uttarakhand",
    "w": "Trivendra Singh Rawat",
    "p": "BJP",
    "m": null,
    "id": "pc74",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Baramulla",
    "s": "Jammu and Kashmir",
    "w": "Sheikh Abdul Rashid",
    "p": "IND",
    "m": 204142,
    "id": "pc75",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Puri",
    "s": "Odisha",
    "w": "Sambit Patra",
    "p": "BJP",
    "m": 103644,
    "id": "pc76",
    "year": 2024,
    "house": "Lok Sabha"
  },
  {
    "c": "Bangalore South",
    "s": "Karnataka",
    "w": "Tejasvi Surya",
    "p": "BJP",
    "m": 278229,
    "id": "pc77",
    "year": 2024,
    "house": "Lok Sabha"
  }
];

/** How much of the House this file actually covers. Rendered on the page so a
 *  reader is never left assuming the table is complete. */
export const constituencyCoverage = {
  loaded: 77,
  houseSize: 543,
  withFirmMargin: 31,
  statesCovered: 21,
  source: "Election Commission of India — General Election to Lok Sabha 2024",
} as const;

/** What is deliberately not loaded. Shown as-is rather than filled with guesses. */
export const constituencyPending: string[] = [
  "Full candidate lists and vote counts for all 543 constituencies (ECI results API)",
  "Constituency-level male/female elector ratio (ECI Form 20)",
  "Victory margins for seats shown as “awaiting feed” below",
  "2019 and 2014 constituency drill-down (ECI historical archive)",
  "Rajya Sabha member roll and biennial retirement cycle (RS secretariat)"
];
