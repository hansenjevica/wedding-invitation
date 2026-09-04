/* =====================================================================
   WEDDING INVITATION — BEHAVIOUR
   Reads everything from WEDDING_CONFIG (js/config.js). You should not
   need to edit this file to change wedding details — edit config.js.
   ===================================================================== */

(function () {
  "use strict";

  const CFG = WEDDING_CONFIG;

  /* ---------------------------------------------------------------
     0. Guest name from the personalised link (?to=Guest+Name)
  --------------------------------------------------------------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get("to") || "").trim();
  const hasFullAccess = params.get("access") === "full";
  // Group links (?group=true) are meant to be shared with many people at
  // once (e.g. blasted in a WhatsApp group) — each person submits their
  // own RSVP from the same link, so we don't pre-fill the name or lock
  // the form after one submission.
  const isGroupLink = params.get("group") === "true";
  const guestSlug = guestName ? guestName.toLowerCase().replace(/\s+/g, "-") : "guest";
  const lockKey = `rsvp_locked_${guestSlug}`;

  /* ---------------------------------------------------------------
     1. Populate static content from config
  --------------------------------------------------------------- */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  document.title = CFG.siteTitle || `${CFG.couple.groomNickname} & ${CFG.couple.brideNickname} — The Wedding`;

  setText("heroDate", CFG.event.dateDisplay);
  setText("heroVenue", CFG.event.venueName);

  setText("groomName", CFG.couple.groomFullName);
  setText("brideName", CFG.couple.brideFullName);
  document.getElementById("groomPhoto").textContent = CFG.couple.groomNickname.charAt(0);
  document.getElementById("bridePhoto").textContent = CFG.couple.brideNickname.charAt(0);
  setText("groomParents", CFG.couple.groomParents);
  setText("brideParents", CFG.couple.brideParents);
  document.getElementById("groomParents").style.display = CFG.couple.groomParents ? "block" : "none";
  document.getElementById("brideParents").style.display = CFG.couple.brideParents ? "block" : "none";

  setText("eventDateTime", `${CFG.event.dateDisplay} · ${CFG.event.timeDisplay}`);
  setText("eventVenue", CFG.event.venueName);
  setText("mapAddressText", CFG.event.venueName);

  setText("giftMessage", CFG.gift.message);
  setText("keepsakeNote", CFG.gift.keepsakeNote);
  setText("verseText", CFG.verse ? `“${CFG.verse.text}”` : null);
  setText("verseRef", CFG.verse ? CFG.verse.reference : null);
  setText("storyBeginning", CFG.story ? CFG.story.beginning : null);
  setText("storyUnion", CFG.story ? CFG.story.union : null);

  if (CFG.holyMatrimony) {
    setText("holmatDateTime", `${CFG.event.dateDisplay} · ${CFG.holyMatrimony.timeDisplay}`);
    if (CFG.holyMatrimony.verses) {
      const ecc = CFG.holyMatrimony.verses.ecclesiastes;
      const mark = CFG.holyMatrimony.verses.mark;
      if (ecc) {
        setText("holmatEccText", `“${ecc.text}”`);
        setText("holmatEccRef", ecc.reference);
      }
      if (mark) {
        setText("holmatMarkText", `“${mark.text}”`);
        setText("holmatMarkRef", mark.reference);
      }
    }
  }

  setText("closingMessage", CFG.closingMessage);

  if (CFG.dressCode) {
    setText("dresscodeNote", CFG.dressCode.note);
    setText("dresscodeGentlemen", CFG.dressCode.gentlemen);
    const paletteRow = document.getElementById("paletteRow");
    if (paletteRow && Array.isArray(CFG.dressCode.ladiesPalette)) {
      paletteRow.innerHTML = CFG.dressCode.ladiesPalette
        .map(
          (c) => `
        <div class="palette-swatch">
          <div class="chip" style="background:${c.hex}"></div>
          <div class="label">${escapeHtml(c.name)}</div>
          <div class="hex">${escapeHtml(c.hex)}</div>
        </div>`
        )
        .join("");
    }
  }

  if (CFG.logo) {
    const gateLogo = document.getElementById("gateLogo");
    const heroLogo = document.getElementById("heroLogo");
    if (gateLogo) gateLogo.src = CFG.logo;
    if (heroLogo) heroLogo.src = CFG.logo;
  }

  // Personalised gate greeting
  const gateGuestEl = document.getElementById("gateGuest");
  if (guestName) {
    gateGuestEl.innerHTML = `Dear <strong>${escapeHtml(guestName)}</strong>,<br>you are warmly invited.`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------------------------------------------------------
     2. Opening gate
  --------------------------------------------------------------- */
  const gate = document.getElementById("gate");
  const btnOpen = document.getElementById("btnOpen");
  btnOpen.addEventListener("click", () => {
    gate.classList.add("hidden");
    document.body.style.overflow = "";
    tryPlayMusic();
  });
  document.body.style.overflow = "hidden";
  gate.addEventListener("transitionend", () => {
    if (gate.classList.contains("hidden")) document.body.style.overflow = "";
  });

  /* ---------------------------------------------------------------
     3. Countdown timer
  --------------------------------------------------------------- */
  const weddingDate = new Date(CFG.event.dateTimeISO);

  function updateCountdown() {
    const now = new Date();
    let diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      setText("cdDays", "0");
      setText("cdHours", "0");
      setText("cdMinutes", "0");
      setText("cdSeconds", "0");
      return;
    }

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    document.getElementById("cdDays").textContent = String(days);
    document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cdMinutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cdSeconds").textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------------------
     4. Downloadable calendar file (.ics) — supports custom reminders,
        which Google Calendar's web-link method does not.
  --------------------------------------------------------------- */
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function toICSUTC(date) {
    return (
      date.getUTCFullYear() +
      pad2(date.getUTCMonth() + 1) +
      pad2(date.getUTCDate()) +
      "T" +
      pad2(date.getUTCHours()) +
      pad2(date.getUTCMinutes()) +
      pad2(date.getUTCSeconds()) +
      "Z"
    );
  }
  function escapeICSText(str) {
    return String(str)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }
  function triggerDuration(minutesBefore) {
    // Prefer whole-day duration syntax when it divides evenly (cleaner ICS)
    return minutesBefore % 1440 === 0 ? `-P${minutesBefore / 1440}D` : `-PT${minutesBefore}M`;
  }
  function buildICS({ title, description, location, start, end, reminders }) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hansen and Jevica Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@hansen-jevica-wedding`,
      `DTSTAMP:${toICSUTC(new Date())}`,
      `DTSTART:${toICSUTC(start)}`,
      `DTEND:${toICSUTC(end)}`,
      `SUMMARY:${escapeICSText(title)}`,
      `DESCRIPTION:${escapeICSText(description)}`,
      `LOCATION:${escapeICSText(location)}`,
    ];
    (reminders || []).forEach((minutes) => {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push("DESCRIPTION:Reminder");
      lines.push(`TRIGGER:${triggerDuration(minutes)}`);
      lines.push("END:VALARM");
    });
    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }
  function downloadICS(icsContent, filename) {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  document.getElementById("btnCalendar").addEventListener("click", () => {
    let start, end, title, description;

    if (hasFullAccess && CFG.holyMatrimony) {
      // One combined event spanning ceremony through reception.
      start = new Date(CFG.holyMatrimony.dateTimeISO);
      const receptionStart = new Date(CFG.event.dateTimeISO);
      end = new Date(receptionStart.getTime() + CFG.event.durationHours * 3600 * 1000);
      title = `${CFG.couple.groomNickname} & ${CFG.couple.brideNickname}'s Wedding Day`;
      description = `Holy Matrimony at ${CFG.holyMatrimony.timeDisplay}, followed by the Reception at ${CFG.event.timeDisplay}. ${CFG.event.calendarDescription}`;
    } else {
      start = new Date(CFG.event.dateTimeISO);
      end = new Date(start.getTime() + CFG.event.durationHours * 3600 * 1000);
      title = CFG.event.title;
      description = CFG.event.calendarDescription;
    }

    const ics = buildICS({
      title,
      description,
      location: CFG.event.venueAddress,
      start,
      end,
      reminders: CFG.calendarReminders || [],
    });
    downloadICS(ics, "hansen-jevica-wedding.ics");
  });

  /* ---------------------------------------------------------------
     5. Google Maps
  --------------------------------------------------------------- */
  const mapsQueryEncoded = encodeURIComponent(CFG.event.mapsQuery);
  document.getElementById("mapEmbed").src = `https://maps.google.com/maps?q=${mapsQueryEncoded}&z=16&output=embed`;
  document.getElementById("mapOpenLink").href = `https://www.google.com/maps/search/?api=1&query=${mapsQueryEncoded}`;

  /* ---------------------------------------------------------------
     6. RSVP form
  --------------------------------------------------------------- */
  const form = document.getElementById("rsvpForm");
  const nameInput = document.getElementById("fName");
  const guestCountField = document.getElementById("guestCountField");
  const guestCountInput = document.getElementById("fGuests");
  const messageInput = document.getElementById("fMessage");
  const attendanceSeg = document.getElementById("attendanceSeg");
  const holmatGuestCountField = document.getElementById("holmatGuestCountField");
  const holmatGuestCountInput = document.getElementById("fHolmatGuests");
  const holmatAttendanceSeg = document.getElementById("holmatAttendanceSeg");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSubmitLabel = document.getElementById("btnSubmitLabel");
  const formStatus = document.getElementById("formStatus");

  let attendanceValue = "Attending";
  let holmatAttendanceValue = "Attending";

  if (guestName && !isGroupLink) nameInput.value = guestName;
  if (isGroupLink) nameInput.placeholder = "Your full name";

  attendanceSeg.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    attendanceValue = btn.dataset.value;
    guestCountField.style.display = attendanceValue === "Attending" ? "block" : "none";
  });

  holmatAttendanceSeg.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    holmatAttendanceSeg.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    holmatAttendanceValue = btn.dataset.value;
    holmatGuestCountField.style.display = holmatAttendanceValue === "Attending" ? "block" : "none";
  });

  function showStatus(kind, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${kind}`;
  }

  function lockForm(message) {
    nameInput.disabled = true;
    guestCountInput.disabled = true;
    holmatGuestCountInput.disabled = true;
    messageInput.disabled = true;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => (b.disabled = true));
    holmatAttendanceSeg.querySelectorAll(".seg-btn").forEach((b) => (b.disabled = true));
    btnSubmit.disabled = true;
    btnSubmitLabel.textContent = "RSVP Sent";
    showStatus("success", message);
  }

  function resetFormForNextEntry(message) {
    form.reset();
    nameInput.value = "";
    messageInput.value = "";
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b, i) => b.classList.toggle("active", i === 0));
    attendanceValue = "Attending";
    guestCountField.style.display = "block";
    guestCountInput.value = "1";
    if (hasFullAccess) {
      holmatAttendanceSeg.querySelectorAll(".seg-btn").forEach((b, i) => b.classList.toggle("active", i === 0));
      holmatAttendanceValue = "Attending";
      holmatGuestCountField.style.display = "block";
      holmatGuestCountInput.value = "1";
    }
    showStatus("success", message);
  }

  // If this guest link already RSVP'd on this device, lock the form.
  // Group links skip this entirely — they're meant for repeat use.
  if (!isGroupLink && localStorage.getItem(lockKey) === "true") {
    lockForm("Thank you — we've already received your RSVP. See your message in the wishes wall below!");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
      showStatus("error", "Please enter your name.");
      return;
    }

    if (!CFG.rsvp.scriptURL || CFG.rsvp.scriptURL.indexOf("PASTE_YOUR") === 0) {
      showStatus(
        "error",
        "RSVP isn't connected yet. Add your Google Apps Script URL to js/config.js (see README.md)."
      );
      return;
    }

    const payload = {
      name: name,
      attendance: attendanceValue,
      guests: attendanceValue === "Attending" ? guestCountInput.value || "1" : "0",
      message: messageInput.value.trim(),
    };

    // Only include Holy Matrimony fields for guests who can actually
    // see that question — keeps the sheet clean for reception-only rows.
    if (hasFullAccess) {
      payload.holmatAttendance = holmatAttendanceValue;
      payload.holmatGuests = holmatAttendanceValue === "Attending" ? holmatGuestCountInput.value || "1" : "0";
    }

    btnSubmit.disabled = true;
    btnSubmit.classList.add("loading");
    btnSubmitLabel.textContent = "Sending...";
    formStatus.className = "form-status";

    try {
      // Apps Script web apps don't reliably support CORS-readable POST
      // responses, so we fire-and-forget with no-cors and optimistically
      // confirm — then refresh the wishes wall to show the new entry.
      await fetch(CFG.rsvp.scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload),
      });

      if (isGroupLink) {
        resetFormForNextEntry(`Thank you, ${name}! If another family member would like to RSVP, just fill in the form again below.`);
      } else {
        localStorage.setItem(lockKey, "true");
        lockForm("Thank you! Your RSVP has been received.");
      }
      setTimeout(loadWishes, 2500);
    } catch (err) {
      showStatus("error", "Something went wrong. Please check your connection and try again.");
    } finally {
      btnSubmit.classList.remove("loading");
      btnSubmitLabel.textContent = "Send RSVP";
      if (isGroupLink || !localStorage.getItem(lockKey)) btnSubmit.disabled = false;
    }
  });

  /* ---------------------------------------------------------------
     7. Wedding Wishes wall (near real-time polling)
  --------------------------------------------------------------- */
  const wishesList = document.getElementById("wishesList");
  const wishesEmpty = document.getElementById("wishesEmpty");
  let lastWishesSignature = "";

  async function loadWishes() {
    if (!CFG.rsvp.scriptURL || CFG.rsvp.scriptURL.indexOf("PASTE_YOUR") === 0) return;
    try {
      const res = await fetch(`${CFG.rsvp.scriptURL}?action=list&t=${Date.now()}`);
      if (!res.ok) return;
      const data = await res.json();
      renderWishes(Array.isArray(data) ? data : []);
    } catch (err) {
      // Silent fail — the wall simply won't update this cycle.
      console.warn("Could not load wedding wishes:", err);
    }
  }

  function renderWishes(items) {
    const withMessages = items.filter((i) => i && i.name);
    const signature = JSON.stringify(withMessages);
    if (signature === lastWishesSignature) return; // no change, skip re-render
    lastWishesSignature = signature;

    if (withMessages.length === 0) {
      wishesList.innerHTML = "";
      wishesList.appendChild(wishesEmpty);
      return;
    }

    wishesList.innerHTML = withMessages
      .map((item) => {
        const isAttending = String(item.attendance).toLowerCase().indexOf("not") === -1;
        const badgeClass = isAttending ? "attending" : "not-attending";
        const badgeText = isAttending ? "Attending" : "Can't make it";
        const msg = item.message
          ? `“${escapeHtml(item.message)}”`
          : isAttending
          ? "Can't wait to celebrate with you!"
          : "Sending love from afar.";
        return `
          <div class="wish-card">
            <div class="wish-top">
              <span class="wish-name">${escapeHtml(item.name)}</span>
              <span class="wish-badge ${badgeClass}">${badgeText}</span>
            </div>
            <p class="wish-msg">${msg}</p>
          </div>`;
      })
      .join("");
  }

  loadWishes();
  setInterval(loadWishes, CFG.rsvp.wishesPollIntervalMs || 20000);

  /* ---------------------------------------------------------------
     8. Between-section photo breaks
  --------------------------------------------------------------- */
  if (CFG.gallery && Array.isArray(CFG.gallery.sectionPhotos)) {
    CFG.gallery.sectionPhotos.forEach((src, i) => {
      const slot = document.getElementById(`photoBreak${i}`);
      if (!slot) return;
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        slot.appendChild(img);
      }
    });
  }

  const galleryScroll = document.getElementById("galleryScroll");
  const galleryPlaceholder = document.getElementById("galleryPlaceholder");
  if (CFG.gallery && Array.isArray(CFG.gallery.images) && CFG.gallery.images.length > 0) {
    galleryPlaceholder.style.display = "none";
    galleryScroll.innerHTML = CFG.gallery.images
      .map((src) => `<img src="${src}" alt="" loading="lazy">`)
      .join("");
  }

  const nostalgiaGrid = document.getElementById("nostalgiaGrid");
  if (nostalgiaGrid && CFG.gallery && Array.isArray(CFG.gallery.nostalgia)) {
    nostalgiaGrid.innerHTML = CFG.gallery.nostalgia
      .map((src) => `<img src="${src}" alt="" loading="lazy">`)
      .join("");
  }

  /* ---------------------------------------------------------------
     9. Floating background music toggle
  --------------------------------------------------------------- */
  const musicBtn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  let musicReady = false;

  if (CFG.music.src) {
    audio.src = CFG.music.src;
    audio.addEventListener("canplay", () => (musicReady = true));
    audio.addEventListener("error", () => (musicReady = false));
  }

  function tryPlayMusic() {
    if (!CFG.music.src) return;
    audio
      .play()
      .then(() => musicBtn.classList.add("playing"))
      .catch(() => {
        /* Autoplay blocked or file missing yet — user can tap the button. */
      });
  }

  musicBtn.addEventListener("click", () => {
    if (!CFG.music.src) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => musicBtn.classList.add("playing"))
        .catch(() => {});
    } else {
      audio.pause();
      musicBtn.classList.remove("playing");
    }
  });

  /* ---------------------------------------------------------------
     10. Scroll progress bar + fade-in reveal animations
  --------------------------------------------------------------- */
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = `${scrolled}%`;
  });

  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
})();
