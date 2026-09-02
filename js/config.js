/* =====================================================================
   WEDDING INVITATION — CONFIGURATION
   =====================================================================
   Edit ONLY this file to update wedding details. Nothing else in the
   project needs to change when you swap names, dates, or bank info.
   ===================================================================== */

const WEDDING_CONFIG = {

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

  music: {
    // Drop an mp3 in assets/audio/ and point to it here.
    src: "assets/audio/music.mp3"
  },

  gallery: {
    // Add file paths once photos/video are ready, e.g.
    // "assets/images/photo-01.jpg"
    images: [],
    // "assets/video/prewedding.mp4"
    video: ""
  },

  closingMessage: "We can't wait to celebrate this new season of our lives with you by our side."
};
