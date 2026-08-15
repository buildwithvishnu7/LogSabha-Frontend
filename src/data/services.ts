// Static content for /services. Mirrors the designer reference (Services.dc.html)
// section-for-section. Everything here is the fallback the page renders with
// until the CMS endpoint exists — same static-first pattern as the homepage.

export type ServiceItem = {
  title: string;
  body: string;
};

export type ServiceBlock = {
  id: string;
  /** display number in the sticky rail — "01" … "06" */
  number: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  items: ServiceItem[];
};

export const servicesData = {
  hero: {
    title: "SERVICES",
    subtitle:
      "Six connected disciplines that take a campaign from choosing the seat to delivering the closing speech — run by one team, on one set of data.",
    ctaPrimary: { label: "EXPLORE SERVICES", href: "#services" },
    ctaSecondary: { label: "TALK TO OUR TEAM", href: "/contact" },
  },

  intro: {
    kicker: "THE LOGSABHA PRACTICE",
    title: "Six disciplines, one campaign machine",
    body: "From choosing the seat to writing the closing speech, every service below is delivered by the same team, on the same data, against the same calendar.",
  },

  blocks: [
    {
      id: "constituency",
      number: "01",
      title: "Choosing & Finalizing the Right Constituency from the Right Party",
      lead: "Before a rupee is spent, we establish where your candidate can actually win — and on whose ticket.",
      image: "/images/pa/tech-hand.png",
      imageAlt: "Constituency data analysis",
      items: [
        {
          title: "Data-Driven Demographic Analysis",
          body: "We study voter data — such as age, income, and past voting records — to identify areas where your party's ideas will resonate. This approach helps you target regions with a strong voter base and high winning potential.",
        },
        {
          title: "Historical Performance & Party Alignment",
          body: "Every past result in the seat is mapped — margins, swings, by-election behaviour and defection history — against your party's stated position. Where the two overlap, your candidate begins from strength rather than from zero.",
        },
        {
          title: "Resource Optimization",
          body: "Time, money and cadre are finite. We rank constituencies by cost per winnable vote, so booth teams, vehicles and advertising spend are committed only where they change the outcome.",
        },
        {
          title: "Geographic & Regional Considerations",
          body: "Terrain, connectivity, the urban–rural split and migration patterns decide how a seat can actually be worked on the ground. We factor all of it in before a single rally date is booked.",
        },
        {
          title: "Competitive Analysis & Strategic Alliances",
          body: "We profile every serious contender, their vote banks and their vulnerabilities, then identify where a local alliance or a friendly withdrawal turns a three-way split into a clean win.",
        },
        {
          title: "Real-Time Monitoring & Adaptive Strategy",
          body: "Once the contest is live we track ground reports, sentiment shifts and rival movement continuously, and revise the constituency plan while there is still time to act on it.",
        },
      ],
    },
    {
      id: "campaigning",
      number: "02",
      title: "Political Campaigning",
      lead: "Every doorstep, hoarding, headline and hashtag pulling in the same direction, on one calendar.",
      image: "/images/pa/hero-crowd-clean.png",
      imageAlt: "Political campaign rally crowd",
      items: [
        {
          title: "Door-to-Door Publicity",
          body: "Nothing moves a voter like a conversation at their own gate. We build, brief and route booth-level teams so that every household in the priority wards is met, recorded and followed up.",
        },
        {
          title: "Public Gathering Management",
          body: "From a street-corner meeting to a district rally, we handle mobilisation, seating, sound, sequencing and dispersal — so the gathering reads as strength rather than confusion.",
        },
        {
          title: "Online Reputation Management",
          body: "We monitor what is being said about your candidate across platforms, answer misinformation quickly with verified material, and keep the digital record aligned with the campaign's message.",
        },
        {
          title: "Offline Banners and Posters",
          body: "Hoardings, wall writings, flex, pamphlets and vehicle wraps, designed in one visual language and placed where footfall data says they will genuinely be seen.",
        },
        {
          title: "Press Coverage Assistance",
          body: "We prepare briefing notes, arrange interviews, manage press interactions on the ground and make sure the day's story reaches regional and national desks in the form you intended.",
        },
        {
          title: "Territory-Wise Campaign Line-Up",
          body: "Campaign effort is tailored to geography. Understanding the distinct needs and demographics of each region lets a candidate customise messaging, so it stays relevant and resonant across a diverse constituency.",
        },
      ],
    },
    {
      id: "events",
      number: "03",
      title: "Political Event Management",
      lead: "Rallies, receptions and yatras delivered to the minute — logistics, protocol and security included.",
      image: "/images/pa/rally-flag.png",
      imageAlt: "Political event with party flags",
      items: [
        {
          title: "Event Planning Assistance",
          body: "Successful political events hinge on meticulous planning. We guide every stage from conceptualisation to execution, so the event aligns with campaign goals and leaves a lasting impression.",
        },
        {
          title: "Effective Logistics and Venue Management",
          body: "Transport, permissions, power backup, water, barricading, medical standby and volunteer rosters — coordinated on a single timeline, so nothing is discovered late.",
        },
        {
          title: "Perfect Location Scouting",
          body: "We shortlist venues on capacity, sightlines, access routes and optics, then walk each one with your team before anything is committed.",
        },
        {
          title: "Guest Invitation and Coordination",
          body: "Dignitary lists, protocol, invitation dispatch, arrival windows and stage seating are handled discreetly, so senior guests are received without a moment of uncertainty.",
        },
        {
          title: "On-Demand Activities Organisation",
          body: "Cultural performances, youth and women's segments, felicitations and community programmes assembled at short notice to match the mood of the day.",
        },
        {
          title: "Event Secrecy and Security Management",
          body: "Sensitive movements, route plans and guest details are compartmentalised, and our team works alongside official security so the programme stays controlled from first arrival to last departure.",
        },
      ],
    },
    {
      id: "speech",
      number: "04",
      title: "Speech Composition",
      lead: "Addresses written on evidence, vetted by political veterans, and tested before they are delivered.",
      image: "/images/pa/poster-2024.png",
      imageAlt: "Campaign speech material",
      items: [
        {
          title: "Data-Driven Speech Composition",
          body: "We use analytics to identify the issues, sentiments and demographics that matter to the audience in front of you, so every word is chosen to resonate rather than merely to fill time.",
        },
        {
          title: "Political Veteran Cross-Checking",
          body: "Every draft is read by experienced political hands who know the constituency and the party line, so that nothing on the page becomes tomorrow's controversy.",
        },
        {
          title: "Professional Writer Support",
          body: "Career speechwriters shape structure, rhythm and language — including regional idiom — so the address sounds like the leader delivering it, never like a document being read.",
        },
        {
          title: "Pre-Finalization Test Public Run-Through",
          body: "Before the speech is locked we test it with a sample audience, measure where attention rises and falls, and rewrite the passages that do not land.",
        },
      ],
    },
    {
      id: "survey",
      number: "05",
      title: "Survey Assistance Program",
      lead: "Field research designed to be acted on — booth-level collection through to weighted swing estimates.",
      image: "/images/pa/evm-machine.gif",
      imageAlt: "Polling and survey process",
      items: [
        {
          title: "Pre-Poll & Exit Poll Surveying",
          body: "Advanced methodologies gather real-time data on voter sentiment before and after polling, giving the campaign a strategic advantage and room for dynamic adjustment.",
        },
        {
          title: "Public Opinion & Suggestion Surveys",
          body: "Structured listening exercises record what voters want raised, in their own words, and convert it into an issue hierarchy your campaign can act on immediately.",
        },
        {
          title: "Area Demographic Data Collection",
          body: "Booth-level collection of age, occupation, community, language and turnout history — the base layer on which every other decision in the campaign rests.",
        },
        {
          title: "Expert Recommendation Surveys",
          body: "We consult domain experts, local influencers and long-serving workers to sense-check the numbers against lived knowledge of the seat.",
        },
        {
          title: "Survey Data Analysis",
          body: "Raw responses are cleaned, weighted and modelled into swing estimates, segment maps and clear priority lists — not unusable tables.",
        },
        {
          title: "Video Survey Recording and Distribution",
          body: "Recorded voter testimony, verified and edited, gives your campaign credible material for both internal review and public communication.",
        },
      ],
    },
    {
      id: "strategy",
      number: "06",
      title: "Election Strategy Development",
      lead: "One plan per constituency, with the contingencies already written for the week everything changes.",
      image: "/images/pa/farmer-clean.png",
      imageAlt: "Election strategy fieldwork",
      items: [
        {
          title: "Constituency-Wise Strategy Modelling",
          body: "We go deep into each constituency's dynamics, demographics and concerns to craft a customised strategy, so the campaign resonates locally and every rupee of effort lands where it counts.",
        },
        {
          title: "Party SWOT Analysis",
          body: "An honest reading of the party's strengths, weaknesses, openings and threats in the seat — including candidate liabilities — delivered before positions harden.",
        },
        {
          title: "Critical Thinking and Emergency Strategy",
          body: "Pre-built responses for the scenarios that decide close contests: a hostile news cycle, a defection, a last-week rumour or an unexpected alliance.",
        },
        {
          title: "Content Creation Program",
          body: "A continuous pipeline of speeches, scripts, creatives, short video and social copy, produced against the campaign calendar instead of in a rush.",
        },
        {
          title: "Technical & Legal Counselling",
          body: "Guidance on Model Code compliance, expenditure reporting, nomination formalities and platform rules, so the campaign is never derailed on procedure.",
        },
        {
          title: "On-Demand Survey Conduction",
          body: "Fast-turnaround field checks launched mid-campaign, for the moments when a decision needs evidence within days rather than weeks.",
        },
      ],
    },
  ] as ServiceBlock[],

  cta: {
    kicker: "START A MANDATE",
    title: "Tell us the seat. We will tell you how it is won.",
    body: "Share the constituency, the party and the timeline. Our team responds with a first read on winnability and the services that will matter most.",
    button: { label: "TALK TO OUR TEAM", href: "/contact" },
  },
};
