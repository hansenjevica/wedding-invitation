/* =====================================================================
   WEDDING INVITATION — CONFIGURATION
   =====================================================================
   Edit ONLY this file to update wedding details. Nothing else in the
   project needs to change when you swap names, dates, or bank info.

   GUEST ACCESS LEVELS
   Guests invited to BOTH the Holy Matrimony ceremony and the reception
   need "&access=full" in their link, e.g.:
     ?to=Ade%20Fitriyani&access=full
   Guests invited to the reception ONLY should get a link WITHOUT that
   parameter, e.g.:
     ?to=Budi%20Santoso
   Reception-only guests never see the Holy Matrimony section and only
   ever get asked about reception attendance in the RSVP form.
   ===================================================================== */

const WEDDING_CONFIG = {

  // Shown in the browser tab / bookmark title, and used as the fallback
  // title search engines and link previews (WhatsApp, etc.) will show.
  siteTitle: "Hansen & Jevica — The Wedding",

  // Shown in the opening gate and at the top of the hero section
  logo: "assets/images/logo-wedding.png",

  couple: {
    groomFullName: "Hansen Juni Lieus",
    groomNickname: "Hansen",
    brideFullName: "Jevica Ozora",
    brideNickname: "Jevica",
    // Optional — leave as "" to hide the line under each name
    groomParents: "",
    brideParents: ""
  },

  event: {
    title: "Hansen and Jevica's Wedding",
    dateDisplay: "Sunday, 25 October 2026",
    timeDisplay: "6:00 PM WIB — Finish",
    // ISO 8601 with UTC offset. This single value drives the countdown
    // AND the calendar button — keep it accurate.
    // Gading Serpong, Indonesia is WIB, UTC+7.
    dateTimeISO: "2026-10-25T18:00:00+07:00",
    durationHours: 3, // used only to set the calendar event's end time
    venueName: "Episode Hotel, Gading Serpong",
    venueAddress: "Episode Hotel, Jl. Boulevard Raya Gading Serpong, Tangerang, Banten, Indonesia",
    // Short query used for the Google Maps search/embed links
    mapsQuery: "Episode Hotel Gading Serpong",
    calendarDescription: "Don't forget!"
  },

  // Holy Matrimony — only shown to guests whose link includes
  // "&access=full" (see README → "Guest access levels"). Reception-only
  // guests never see this content and never see it in the RSVP form.
  holyMatrimony: {
    timeDisplay: "10:00 AM WIB",
    dateTimeISO: "2026-10-25T10:00:00+07:00",
    verses: {
      ecclesiastes: {
        text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow: but woe to him that is alone when he falleth; for he hath not another to help him up. Again, if two lie together, then they have heat: but how can one be warm alone? And if one prevail against him, two shall withstand him; and a threefold cord is not quickly broken.",
        reference: "Ecclesiastes 4:9–12 (KJV)"
      },
      mark: {
        text: "What therefore God hath joined together, let not man put asunder.",
        reference: "Mark 10:9 (KJV)"
      }
    }
  },

  // Minutes-before-event for the downloadable calendar file's built-in
  // reminders (7 days, 2 days, 1 day). Used for both the combined event
  // (full-access guests) and the reception-only event.
  calendarReminders: [10080, 2880, 1440],

  rsvp: {
    // Paste the Web App URL you get after deploying apps-script/Code.gs
    // (see README.md → "Connect Google Sheets"). Looks like:
    // https://script.google.com/macros/s/AKfycb..../exec
    scriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
    // How often the Wedding Wishes wall checks for new messages (ms)
    wishesPollIntervalMs: 20000
  },

  gift: {
    message: "Your presence means more to us than any gift ever could. Simply being there to celebrate this new chapter with us is the greatest present we could ask for — thank you for being part of our journey.",
    keepsakeNote: "If you'd like to leave us something more personal, we'd treasure a favourite quote, a piece of advice, a short story, or a heartfelt letter — postcards will be waiting on the day for you to write it all down."
  },

  verse: {
    text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.",
    reference: "Genesis 2:24 (KJV)"
  },

  story: {
    // Shown in the Summer section, right after the hero
    beginning: "It was within the hallowed halls of learning that fate saw fit to bring two souls together — earnest, restless, and full of the quiet promise of youth. In each other's company, they found not merely companionship, but a company that grew steadily through the seasons, shaping them first as individuals, then as devoted partners, and at last as a family whose very children bore the beautiful mingling of two distinct lineages.",
    // Shown in the Fall section, right after the map
    union: "And so, what had once been two separate families — each with its own traditions and its own world — were woven together into a single and enduring tapestry, united by the generous truth that love, when it is steadfast, is ever large enough to hold them all."
  },

  music: {
    src: "assets/songs/wedding_song.mp3"
  },

  dressCode: {
    note: "We'd love for you to join us in these warm, earthy tones — ladies from the palette below, gentlemen in suits that complement them.",
    ladiesPalette: [
      { name: "Olive Green", hex: "#6B6E3D" },
      { name: "Terracotta", hex: "#C65A3D" },
      { name: "Mustard", hex: "#D4A017" },
      { name: "Camel", hex: "#C19A6B" }
    ],
    gentlemen: "Suits in navy, charcoal, or deep brown pair beautifully with the palette above."
  },

  gallery: {
    // Shown as a vertically-scrollable photo feed in "Gallery & Video"
    images: [
      "assets/images/wedding_05.jpg",
      "assets/images/wedding_08.jpg",
      "assets/images/wedding_07.jpg",
      "assets/images/wedding_06.jpg",
      "assets/images/wedding_09.jpg"
    ],
    // "assets/video/prewedding.mp4"
    video: "",
    // Up to 4 landscape (16:9) photos shown BETWEEN sections as you scroll
    // (not the gallery grid above — these are one-at-a-time interludes).
    // Leave any entry as "" to hide that spot. Order:
    //   [0] after "How It Began" (Summer)
    //   [1] after the Countdown (Spring)
    //   [2] after the map (Fall)
    //   [3] between Wishes and Gift (Winter)
    sectionPhotos: [
      "assets/images/wedding_02.jpg",
      "assets/images/wedding_03.jpg",
      "assets/images/wedding_04.jpg",
      "assets/images/wedding_01.jpg"
    ],
    // Masonry-style "Nostalgia" grid — mixed photo sizes are fine, the
    // layout adapts automatically. Shown near the end of the page.
    nostalgia: [
      "assets/images/wedding_10.jpg",
      "assets/images/wedding_11.JPEG",
      "assets/images/wedding_12.jpg",
      "assets/images/wedding_13.jpg",
      "assets/images/wedding_14.jpg",
      "assets/images/wedding_15.jpg",
      "assets/images/wedding_16.JPEG"
    ]
  },

  closingMessage: "We can't wait to celebrate this new season of our lives with you by our side."
};
