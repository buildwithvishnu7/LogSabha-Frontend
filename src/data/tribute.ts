// Homepage tribute section — "respected ones", as agreed with the client on
// 23 Sept 2026. Eight figures in the order the client listed them.
//
// The one-line descriptions are plain factual epithets, written as
// placeholders for the client to approve or replace. Portraits come from the
// existing Sankalp article art where one exists; Shivaji Maharaj and
// P.V. Narasimha Rao have none yet and render as a saffron tile until the
// client supplies an image. Videos are the client's AI clips — none exist yet;
// each plays automatically once its file is dropped at `video`.

export type TributeFigure = {
  slug: string;
  name: string;
  nameHi: string;
  line: string;
  poster?: string;
  video: string;
};

export const tributeData = {
  kicker: "श्रद्धांजलि",
  title: "हमारे श्रद्धेय",
  subtitle: "जिनके तप, त्याग और नेतृत्व ने राष्ट्र को दिशा दी",
  viewAllLabel: "View More",
  viewLessLabel: "Show Less",
  comingSoonLabel: "Video coming soon",
  figures: [
    {
      slug: "ram-lala",
      name: "Ram Lala",
      nameHi: "राम लला",
      line: "अयोध्या, श्री राम जन्मभूमि मंदिर",
      poster: "/images/tribute/ram-lala.png",
      video: "/videos/tribute/ram-lala.mp4",
    },
    {
      slug: "bappa-rawal",
      name: "Bappa Rawal",
      nameHi: "बप्पा रावल",
      line: "मेवाड़ राजवंश के संस्थापक",
      poster: "/images/tribute/bappa-rawal.jpg",
      video: "/videos/tribute/bappa-rawal.mp4",
    },
    {
      slug: "chhatrapati-shivaji-maharaj",
      name: "Chhatrapati Shivaji Maharaj",
      nameHi: "छत्रपति शिवाजी महाराज",
      line: "हिंदवी स्वराज्य के संस्थापक",
      video: "/videos/tribute/chhatrapati-shivaji-maharaj.mp4",
    },
    {
      slug: "subhash-chandra-bose",
      name: "Netaji Subhash Chandra Bose",
      nameHi: "नेताजी सुभाष चंद्र बोस",
      line: "आज़ाद हिंद फ़ौज के सेनानायक",
      poster: "/images/tribute/subhash-chandra-bose.png",
      video: "/videos/tribute/subhash-chandra-bose.mp4",
    },
    {
      slug: "sardar-patel",
      name: "Sardar Vallabhbhai Patel",
      nameHi: "सरदार वल्लभभाई पटेल",
      line: "भारत के लौह पुरुष, एकीकरण के शिल्पी",
      poster: "/images/tribute/sardar-patel.jpg",
      video: "/videos/tribute/sardar-patel.mp4",
    },
    {
      slug: "pv-narasimha-rao",
      name: "P.V. Narasimha Rao",
      nameHi: "पी.वी. नरसिम्हा राव",
      line: "भारत के नौवें प्रधानमंत्री, आर्थिक सुधारों के सूत्रधार",
      video: "/videos/tribute/pv-narasimha-rao.mp4",
    },
    {
      slug: "kalyan-singh",
      name: "Kalyan Singh",
      nameHi: "कल्याण सिंह",
      line: "उत्तर प्रदेश के पूर्व मुख्यमंत्री",
      poster: "/images/tribute/kalyan-singh.jpg",
      video: "/videos/tribute/kalyan-singh.mp4",
    },
    {
      slug: "yogi-adityanath",
      name: "Yogi Adityanath",
      nameHi: "योगी आदित्यनाथ",
      line: "उत्तर प्रदेश के मुख्यमंत्री",
      poster: "/images/tribute/yogi-adityanath.jpg",
      video: "/videos/tribute/yogi-adityanath.mp4",
    },
  ] as TributeFigure[],
};
