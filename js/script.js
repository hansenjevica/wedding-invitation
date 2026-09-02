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
  const guestSlug = guestName ? guestName.toLowerCase().replace(/\s+/g, "-") : "guest";
  const lockKey = `rsvp_locked_${guestSlug}`;

  /* ---------------------------------------------------------------
     1. Populate static content from config
  --------------------------------------------------------------- */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  document.title = `${CFG.couple.groomNickname} & ${CFG.couple.brideNickname} — The Wedding`;

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

  setText("closingMessage", CFG.closingMessage);

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
     4. Google Calendar link
  --------------------------------------------------------------- */
  function toGCalUTC(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  }

  function buildCalendarLink() {
    const start = new Date(CFG.event.dateTimeISO);
    const end = new Date(start.getTime() + CFG.event.durationHours * 3600 * 1000);
    const dates = `${toGCalUTC(start)}/${toGCalUTC(end)}`;
    const qs = new URLSearchParams({
      action: "TEMPLATE",
      text: CFG.event.title,
      dates: dates,
      details: CFG.event.calendarDescription,
      location: CFG.event.venueAddress,
    });
    return `https://calendar.google.com/calendar/render?${qs.toString()}`;
  }

  document.getElementById("btnCalendar").addEventListener("click", () => {
    window.open(buildCalendarLink(), "_blank", "noopener");
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
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSubmitLabel = document.getElementById("btnSubmitLabel");
  const formStatus = document.getElementById("formStatus");

  let attendanceValue = "Attending";

  if (guestName) nameInput.value = guestName;

  attendanceSeg.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    attendanceValue = btn.dataset.value;
    guestCountField.style.display = attendanceValue === "Attending" ? "block" : "none";
  });

  function showStatus(kind, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${kind}`;
  }

  function lockForm(message) {
    nameInput.disabled = true;
    guestCountInput.disabled = true;
    messageInput.disabled = true;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => (b.disabled = true));
    btnSubmit.disabled = true;
    btnSubmitLabel.textContent = "RSVP Sent";
    showStatus("success", message);
  }

  // If this guest link already RSVP'd on this device, lock the form.
  if (localStorage.getItem(lockKey) === "true") {
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

      localStorage.setItem(lockKey, "true");
      lockForm("Thank you! Your RSVP has been received.");
      setTimeout(loadWishes, 2500);
    } catch (err) {
      showStatus("error", "Something went wrong. Please check your connection and try again.");
    } finally {
      btnSubmit.classList.remove("loading");
      if (!localStorage.getItem(lockKey)) btnSubmit.disabled = false;
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
     8. Floating background music toggle
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
