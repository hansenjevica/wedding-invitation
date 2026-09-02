/**
 * =====================================================================
 * WEDDING RSVP — Google Apps Script backend
 * =====================================================================
 * What this does:
 *   - doPost()  → receives RSVP submissions from the website and
 *                 appends a new row to your Google Sheet.
 *   - doGet()   → returns all RSVPs as JSON so the website's
 *                 "Wedding Wishes" wall can display them.
 *
 * SETUP (see README.md for the full walkthrough):
 *   1. Create a Google Sheet.
 *   2. Extensions → Apps Script, delete the sample code, paste this file.
 *   3. Deploy → New deployment → Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the Web App URL into js/config.js → rsvp.scriptURL
 *
 * You do NOT need to create the sheet tab or headers yourself —
 * getSheet() below creates the "RSVP" tab and header row automatically
 * the first time a response comes in (or the first time you run
 * `setupSheet` manually from the Apps Script editor).
 * =====================================================================
 */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Timestamp', 'Name', 'Attendance', 'Guests', 'Message'];

/** Gets (or creates) the RSVP sheet tab with a header row. */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Optional: run this once manually from the Apps Script editor
 *  (Run ▶ setupSheet) if you'd like to create the tab ahead of time. */
function setupSheet() {
  getSheet();
}

/** Handles RSVP form submissions (called by the website). */
function doPost(e) {
  const sheet = getSheet();
  const params = (e && e.parameter) || {};

  const name = (params.name || '').toString().trim();
  const attendance = (params.attendance || '').toString().trim();
  const guests = params.guests ? (parseInt(params.guests, 10) || 0) : 0;
  const message = (params.message || '').toString().trim();

  sheet.appendRow([new Date(), name, attendance, guests, message]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Serves RSVP data as JSON (used by the "Wedding Wishes" wall). */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';

  if (action === 'list') {
    return jsonOutput(getWishes());
  }

  return jsonOutput({ status: 'ok', message: 'Wedding RSVP API is running.' });
}

/** Reads the sheet and returns entries newest-first. */
function getWishes() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1); // skip header row

  return rows
    .filter(function (r) { return r[1]; }) // must have a name
    .map(function (r) {
      return {
        timestamp: r[0],
        name: r[1],
        attendance: r[2],
        guests: r[3],
        message: r[4]
      };
    })
    .reverse();
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
