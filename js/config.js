/* =====================================================================
   WEDDING INVITATION — CONFIGURATION
   =====================================================================
   Edit ONLY this file to update wedding details. Nothing else in the
   project needs to change when you swap names, dates, or bank info.
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
    groomParents: "Jonny (✝) & Rosnila",
    brideParents: "Martin Darsono & Sui Kian"
  },

  event: {
    title: "Hansen and Jevica's Wedding",
    dateDisplay: "Sunday, 25 October 2026",
    timeDisplay: "6:00 PM WIB — Finish",
    // ISO 8601 with UTC offset. This single value drives the countdown
    // AND the "Add to Google Calendar" button — keep it accurate.
    // Gading Serpong, Indonesia is WIB, UTC+7.
    dateTimeISO: "2026-10-25T18:00:00+07:00",
    durationHours: 3, // used only to set the calendar event's end time
    venueName: "Episode Hotel, Gading Serpong",
    venueAddress: "Episode Hotel, Jl. Boulevard Raya Gading Serpong, Tangerang, Banten, Indonesia",
    // Short query used for the Google Maps search/embed links
    mapsQuery: "Episode Hotel Gading Serpong",
    calendarDescription: "Don't forget!"
  },

  rsvp: {
    // Paste the Web App URL you get after deploying apps-script/Code.gs
    // (see README.md → "Connect Google Sheets"). Looks like:
    // https://script.google.com/macros/s/AKfycb..../exec
    scriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
    // How often the Wedding Wishes wall checks for new messages (ms)
    wishesPollIntervalMs: 20000
  },

  gift: {
    message: "Your presence means more to us than any gift ever could. Simply being there to celebrate this new chapter with us is the greatest present we could ask for — thank you for being part of our journey ♡"
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
    // Drop an mp3 in assets/audio/ and point to it here.
    src: "assets/songs/sangjit_song.mp3"
  },

  gallery: {
    // Add file paths once photos/video are ready, e.g.
    // "assets/images/photo-01.jpg"
    images: ["assets/images/wedding_05.jpg", "assets/images/wedding_08.jpg", "assets/images/wedding_07.jpg", "assets/images/wedding_06.jpg", "assets/images/wedding_09.jpg"],
    // "assets/video/prewedding.mp4"
    video: "",
    // Up to 4 landscape (16:9) photos shown BETWEEN sections as you scroll
    // (not the gallery grid above — these are one-at-a-time interludes).
    // Leave any entry as "" to hide that spot. Order:
    //   [0] after "How It Began" (Summer)
    //   [1] after the Countdown (Spring)
    //   [2] after the map (Fall)
    //   [3] between Wishes and Gift (Winter)
    sectionPhotos: ["assets/images/wedding_04.jpg", "assets/images/wedding_02.jpg", "assets/images/wedding_03.jpg", "assets/images/wedding_01.jpg"]
  },

  closingMessage: "We can't wait to celebrate this new season of our lives with you by our side!"
};
