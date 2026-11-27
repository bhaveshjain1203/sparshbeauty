/**
 * Sparsh Beauty Studio & Academy (sparshbeauty.com)
 * Shared Interactivity: Config Hydration, Portfolio Filters, Lightbox,
 * Tabs, Accordions, Booking Modal & WhatsApp Concierge.
 */
(function () {
  const cfg = window.SPARSH_CONFIG || {};

  function isPlaceholderPhone(digits) {
    return !digits || /X/i.test(digits);
  }

  function buildWhatsAppUrl(message) {
    const text = encodeURIComponent(message || cfg.defaultWhatsAppMessage || "Hello!");
    return `https://api.whatsapp.com/send?phone=${cfg.whatsappDigits}&text=${text}`;
  }

  function hydrateConfigBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      const map = {
        brandName: cfg.brandName,
        brandFullName: cfg.brandFullName,
        artistName: cfg.artistName,
        domain: cfg.domain,
        phone: cfg.displayPhone,
        email: cfg.email,
        instagramHandle: cfg.instagramHandle,
        locationShort: cfg.locationShort,
        addressLine1: cfg.addressLine1,
        addressLine2: cfg.addressLine2,
        statePin: cfg.statePin,
        studioHours: cfg.studioHours,
        nextProBatch: cfg.academy?.nextProBatch,
        nextShortBatch: cfg.academy?.nextShortBatch,
        proDuration: cfg.academy?.proDuration,
        shortCourseDuration: cfg.academy?.shortCourseDuration
      };
      if (map[key]) {
        el.textContent = map[key];
      }
    });

    document.querySelectorAll("[data-ig-link]").forEach((el) => {
      if (cfg.instagramUrl) el.href = cfg.instagramUrl;
    });

    document.querySelectorAll("[data-email-link]").forEach((el) => {
      if (cfg.email) {
        el.href = `mailto:${cfg.email}`;
        if (!el.textContent.trim()) el.textContent = cfg.email;
      }
    });

    document.querySelectorAll("[data-wa-message]").forEach((el) => {
      const msg = el.getAttribute("data-wa-message");
      if (!isPlaceholderPhone(cfg.whatsappDigits)) {
        el.href = buildWhatsAppUrl(msg);
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      } else {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          openBookingModal(msg);
        });
      }
    });
  }

  function initActiveNav() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-nav-list a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initMobileDrawer() {
    const toggle = document.querySelector("[data-mobile-open]");
    const drawer = document.getElementById("mobileDrawer");
    const closeBtn = document.querySelector("[data-mobile-close]");
    if (!toggle || !drawer) return;

    const close = () => drawer.classList.remove("open");
    toggle.addEventListener("click", () => drawer.classList.add("open"));
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) close();
    });
  }

  function initPortfolioFilters() {
    const buttons = document.querySelectorAll("[data-filter]");
    const items = document.querySelectorAll("[data-category]");
    if (!buttons.length || !items.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        items.forEach((item) => {
          const cats = (item.getAttribute("data-category") || "").split(",");
          const match = filter === "all" || cats.includes(filter);
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  function initLightbox() {
    const modal = document.getElementById("lookLightbox");
    if (!modal) return;
    const imgEl = modal.querySelector("[data-lb-img]");
    const titleEl = modal.querySelector("[data-lb-title]");
    const catEl = modal.querySelector("[data-lb-cat]");
    const descEl = modal.querySelector("[data-lb-desc]");
    const bookBtn = modal.querySelector("[data-lb-book]");

    document.querySelectorAll("[data-look-card]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const img = card.querySelector("img");
        const title = card.getAttribute("data-look-title") || "";
        const cat = card.getAttribute("data-look-cat") || "";
        const desc = card.getAttribute("data-look-desc") || "";

        if (imgEl && img) {
          imgEl.src = img.src;
          imgEl.alt = img.alt;
        }
        if (titleEl) titleEl.textContent = title;
        if (catEl) catEl.textContent = cat;
        if (descEl) descEl.textContent = desc;
        if (bookBtn) {
          bookBtn.setAttribute(
            "data-wa-message",
            `Hello Shikha Ma'am! I loved the "${title}" look on sparshbeauty.com and want to check availability and pricing.`
          );
          bookBtn.onclick = (ev) => {
            ev.preventDefault();
            modal.classList.remove("open");
            const msg = bookBtn.getAttribute("data-wa-message");
            if (!isPlaceholderPhone(cfg.whatsappDigits)) {
              window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
            } else {
              openBookingModal(msg);
            }
          };
        }
        modal.classList.add("open");
      });
    });

    modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => modal.classList.remove("open"));
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tab-group]").forEach((group) => {
      const tabs = group.querySelectorAll("[data-tab-target]");
      const panels = group.querySelectorAll("[data-tab-panel]");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const target = tab.getAttribute("data-tab-target");
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          panels.forEach((panel) => {
            panel.style.display = panel.getAttribute("data-tab-panel") === target ? "" : "none";
          });
        });
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".accordion-item");
        if (!item) return;
        const expanded = item.classList.toggle("open");
        trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });
  }

  function initBrochureModal() {
    const modal = document.getElementById("brochureModal");
    if (!modal) return;
    document.querySelectorAll("[data-open-brochure]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = btn.getAttribute("data-open-brochure") || "en";
        const enPanel = modal.querySelector('[data-tab-panel="en"]');
        const hiPanel = modal.querySelector('[data-tab-panel="hi"]');
        const tabs = modal.querySelectorAll("[data-tab-target]");
        tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("data-tab-target") === lang));
        if (enPanel && hiPanel) {
          enPanel.style.display = lang === "en" ? "" : "none";
          hiPanel.style.display = lang === "hi" ? "" : "none";
        }
        modal.classList.add("open");
      });
    });
    modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => modal.classList.remove("open"));
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  function ensureBookingModal() {
    let modal = document.getElementById("quickBookingModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "quickBookingModal";
    modal.className = "modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" type="button" aria-label="Close booking dialog" data-modal-close>&times;</button>
        <span class="eyebrow">Direct Studio Enquiry</span>
        <h2 class="section-title" style="font-size:2rem;margin-bottom:8px;">Connect with Shikha Jain &amp; Team</h2>
        <p class="muted" style="margin-top:0;">Fill in your event date or course interest below. You can also connect with us on Instagram <a href="${cfg.instagramUrl}" target="_blank" rel="noopener" style="color:var(--bg-plum);font-weight:600;text-decoration:underline;">${cfg.instagramHandle}</a>.</p>
        <form id="quickEnquiryForm" class="form-grid mt-20">
          <div class="form-group">
            <label for="qbName">Your Name *</label>
            <input id="qbName" class="form-control" type="text" required placeholder="e.g. Riya Rathore" />
          </div>
          <div class="form-group">
            <label for="qbPhone">Mobile / WhatsApp *</label>
            <input id="qbPhone" class="form-control" type="tel" required placeholder="+91 98XXX XXXXX" />
          </div>
          <div class="form-group">
            <label for="qbService">Service / Course</label>
            <select id="qbService" class="form-control">
              <option>Rajwadi / Rajputi Bridal Makeover</option>
              <option>HD / Airbrush Bridal Makeover</option>
              <option>Permanent Hair Straightening / Keratin</option>
              <option>Party / Engagement / Sangeet Glam</option>
              <option>Pro Makeup &amp; Hair Academy Course</option>
              <option>Short Certificate Workshop</option>
              <option>Model Shoot / Seminar Collaboration</option>
            </select>
          </div>
          <div class="form-group">
            <label for="qbCity">City / Venue</label>
            <input id="qbCity" class="form-control" type="text" placeholder="Boliya, Mandsaur, Garoth..." />
          </div>
          <div class="form-group full">
            <label for="qbMessage">Details / Preferred Dates</label>
            <textarea id="qbMessage" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group full" style="display:flex;flex-direction:row;flex-wrap:wrap;gap:12px;align-items:center;">
            <button type="submit" class="btn btn-primary">Prepare Booking Enquiry</button>
            <a href="${cfg.instagramUrl}" target="_blank" rel="noopener" class="btn btn-outline">Message on Instagram ${cfg.instagramHandle}</a>
          </div>
        </form>
        <div id="quickEnquiryResult" class="form-status"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("[data-modal-close]").addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });

    const form = modal.querySelector("#quickEnquiryForm");
    const status = modal.querySelector("#quickEnquiryResult");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = modal.querySelector("#qbName").value.trim();
      const phone = modal.querySelector("#qbPhone").value.trim();
      const service = modal.querySelector("#qbService").value;
      const city = modal.querySelector("#qbCity").value.trim() || "Boliya / Mandsaur";
      const msg = modal.querySelector("#qbMessage").value.trim();

      const summary = `Hello Shikha Ma'am! Name: ${name} (${phone}) | Interest: ${service} | Location: ${city}${msg ? " | Notes: " + msg : ""}`;
      if (!isPlaceholderPhone(cfg.whatsappDigits)) {
        window.open(buildWhatsAppUrl(summary), "_blank", "noopener");
      }
      status.innerHTML = `<strong>Enquiry Ready!</strong> Thank you, ${name}. Your inquiry for <strong>${service}</strong> (${city}) has been prepared. ${
        isPlaceholderPhone(cfg.whatsappDigits)
          ? `Once the studio WhatsApp number is configured in <code>site-config.js</code>, this opens WhatsApp directly. Meanwhile, you can DM <a href="${cfg.instagramUrl}" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:600;">${cfg.instagramHandle}</a> or email <a href="mailto:${cfg.email}" style="text-decoration:underline;font-weight:600;">${cfg.email}</a>.`
          : `WhatsApp opened in a new tab.`
      }`;
      status.classList.add("visible");
    });

    return modal;
  }

  function openBookingModal(prefillMessage) {
    const modal = ensureBookingModal();
    const ta = modal.querySelector("#qbMessage");
    if (ta && prefillMessage) ta.value = prefillMessage;
    modal.classList.add("open");
  }

  window.openSparshBooking = openBookingModal;

  function initContactForms() {
    const form = document.getElementById("mainBookingForm");
    if (!form) return;
    const status = document.getElementById("mainBookingStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get("name") || "Guest";
      const phone = fd.get("phone") || "";
      const category = fd.get("category") || "Bridal Makeup";
      const date = fd.get("eventDate") || "Flexible";
      const city = fd.get("city") || "Boliya / Mandsaur";
      const notes = fd.get("notes") || "";
      const composed = `Hello Shikha Ma'am! Enquiry from sparshbeauty.com — Name: ${name}, Phone: ${phone}, Service/Course: ${category}, Date: ${date}, City: ${city}. ${notes}`;

      if (!isPlaceholderPhone(cfg.whatsappDigits)) {
        window.open(buildWhatsAppUrl(composed), "_blank", "noopener");
      }
      if (status) {
        status.innerHTML = `<strong>Thank you, ${name}!</strong> Your request for <strong>${category}</strong> (${date}, ${city}) is ready. Our studio team at Sparsh Beauty, Boliya responds promptly between 10:00 AM and 7:30 PM — you can also DM <a href="${cfg.instagramUrl}" target="_blank" rel="noopener" style="font-weight:600;text-decoration:underline;">${cfg.instagramHandle}</a>.`;
        status.classList.add("visible");
      }
      form.reset();
    });
  }

  function initConciergeWidget() {
    const fab = document.querySelector("[data-wa-toggle]");
    const pop = document.querySelector("[data-wa-popover]");
    if (!fab || !pop) return;

    fab.addEventListener("click", () => {
      pop.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".wa-concierge")) {
        pop.classList.remove("open");
      }
    });
  }

  function initRevealAnimations() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateConfigBindings();
    initActiveNav();
    initMobileDrawer();
    initPortfolioFilters();
    initLightbox();
    initTabs();
    initAccordions();
    initBrochureModal();
    initContactForms();
    initConciergeWidget();
    initRevealAnimations();
  });
})();
