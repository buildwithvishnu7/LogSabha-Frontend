// GENERATED from reference/new_ref/assets/live-data.js — do not hand-edit.
//
// Five clips are loaded — the same five the home page carries. The library is built to hold the full 2014-to-date archive; nothing is filled in with invented sessions.
//
// Every record is the approved home page's own 'Live Political Coverage'
// entry, verbatim — same titles, same session labels, same video files.
// All five clips are present in public/videos.

export type Speech = {
  id: string;
  /** the one clip the page presents as the live session */
  live?: boolean;
  title: string;
  leader: string;
  role: string;
  party: string;
  house: string;
  session: string;
  /** null where the source did not state one — not guessed */
  year: number | null;
  src: string;
  topic: string;
};

export const speeches: Speech[] = [
  {
    "id": "live-now",
    "live": true,
    "title": "PM Modi's Remarks in Lok Sabha — Parliament Session",
    "leader": "Narendra Modi",
    "role": "Prime Minister",
    "party": "BJP",
    "house": "LOK SABHA",
    "session": "Parliament Session",
    "year": null,
    "src": "/videos/modis-speech.mp4",
    "topic": "Parliament"
  },
  {
    "id": "akhilesh-laugh",
    "title": "PM Modi Makes Akhilesh Yadav Laugh — Witty Remarks Lighten Up Lok Sabha Debate",
    "leader": "Narendra Modi",
    "role": "Prime Minister",
    "party": "BJP",
    "house": "LOK SABHA",
    "session": "Parliament Session July 2024",
    "year": 2024,
    "src": "/videos/modis-speech.mp4",
    "topic": "Debate"
  },
  {
    "id": "national-unity",
    "title": "PM Modi's Fiery Address on National Unity — Motion of Thanks in Lok Sabha",
    "leader": "Narendra Modi",
    "role": "Prime Minister",
    "party": "BJP",
    "house": "LOK SABHA",
    "session": "Parliament Session January 2025",
    "year": 2025,
    "src": "/videos/pm-modi-speech.mp4",
    "topic": "Motion of Thanks"
  },
  {
    "id": "kharge-dig",
    "title": "'Is PM Modi God?' Mallikarjun Kharge's Sharp Dig At Govt Ahead Of Parliament Speech",
    "leader": "Mallikarjun Kharge",
    "role": "Leader of the Opposition, Rajya Sabha",
    "party": "INC",
    "house": "RAJYA SABHA",
    "session": "Budget Session February 2025",
    "year": 2025,
    "src": "/videos/is-pm-modi-god.mp4",
    "topic": "Budget"
  },
  {
    "id": "gadkari-winter",
    "title": "Winter Session: Future in India — Nitin Gadkari Explains Growth, Safety & Rules in Lok Sabha",
    "leader": "Nitin Gadkari",
    "role": "Minister of Road Transport & Highways",
    "party": "BJP",
    "house": "LOK SABHA",
    "session": "Winter Session December 2024",
    "year": 2024,
    "src": "/videos/winter-session-v.mp4",
    "topic": "Infrastructure"
  }
];

/** What the archive is built to hold but does not yet. Shown on the page as
 *  pending rather than padded out with invented sessions. */
export const speechesPending: string[] = [
  "Full speech archive 2014 → present (Lok Sabha website feed)",
  "Verbatim transcripts with timecodes (Lok Sabha Secretariat)",
  "Live telecast stream (Sansad TV)",
  "Attendance and participation counts per member"
];

export const speechesNote = "Five clips are loaded — the same five the home page carries. The library is built to hold the full 2014-to-date archive; nothing is filled in with invented sessions.";
