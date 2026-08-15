// Static content for /contact, mirroring the designer reference (Contact Us.dc.html).

export const contactData = {
  hero: {
    title: "CONTACT US",
    subtitle: "Get In Touch",
    kicker: "TWO OFFICES · ONE DESK · A REPLY WITHIN 48 HOURS",
  },

  enquiry: {
    kicker: "WRITE TO THE LOGSABHA",
    title: "Get In Touch",
    body: "We really appreciate you taking the time to get in touch. Please fill in the form below.",
  },

  offices: [
    {
      label: "NOIDA OFFICE",
      lines: [
        "206 Second Floor, Tower 1,",
        "Assotech Business Cresterra,",
        "Plot No- 22, Sector 135,",
        "Noida - 201301, Uttar Pradesh, India",
      ],
    },
    {
      label: "LUCKNOW OFFICE",
      lines: ["Vibhuti Khand, Gomti Nagar,", "Lucknow - 226010, Uttar Pradesh, India"],
    },
  ],

  mail: "logsabhabharat@gmail.com",
  phone: "+91 9839773333",

  form: {
    fields: {
      name: { label: "NAME", placeholder: "Your name" },
      email: { label: "EMAIL", placeholder: "you@example.com", required: true },
      phone: { label: "PHONE", placeholder: "+91 00000 00000" },
      message: { label: "MESSAGE", placeholder: "How can we help?" },
    },
    submit: "Send",
    note: "Fields marked * are required.",
  },

  success: {
    title: "Message Received",
    body: "Thank you for writing to The Logsabha. Our desk will reply within 48 hours.",
    again: "Send Another",
  },
};
