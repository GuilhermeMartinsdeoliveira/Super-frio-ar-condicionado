(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5511997012073";

  /* ---------- Header shrink / shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".about-text, .about-visual, .service-card, .review-card, .trust-item, .footer-map, .footer-form, .footer-contact"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Trust bar counters ---------- */
  var counters = document.querySelectorAll(".trust-number");
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var isDecimal = el.getAttribute("data-decimal") === "true";
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var trustBar = document.querySelector(".trust-bar");
  if (trustBar && "IntersectionObserver" in window) {
    var trustIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            trustIO.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    trustIO.observe(trustBar);
  } else {
    animateCounters();
  }

  /* ---------- Hero temperature gauge ---------- */
  var gaugeTemp = document.getElementById("gaugeTemp");
  var gaugeProgress = document.getElementById("gaugeProgress");
  var gaugeStatus = document.getElementById("gaugeStatus");
  var ARC_LENGTH = 298;

  function setGauge(temp) {
    // Range considered: 18 (frio) a 34 (quente)
    var pct = Math.min(Math.max((temp - 18) / (34 - 18), 0), 1);
    var offset = ARC_LENGTH * (1 - pct);
    gaugeProgress.style.strokeDashoffset = offset;
    gaugeTemp.textContent = temp;
    gaugeStatus.textContent = temp <= 20 ? "temperatura ideal atingida" : "esfriando o ambiente…";
  }

  setGauge(34);
  setTimeout(function () { setGauge(18); }, 700);

  setInterval(function () {
    var current = parseInt(gaugeTemp.textContent, 10);
    setGauge(current <= 18 ? 34 : 18);
  }, 5200);

  /* ---------- Quote form -> WhatsApp ---------- */
  var quoteForm = document.getElementById("quoteForm");
  var formHint = document.getElementById("formHint");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("qName").value.trim();
      var bairro = document.getElementById("qBairro").value.trim();
      var msg = document.getElementById("qMsg").value.trim();

      if (!name || !msg) {
        formHint.textContent = "Preencha seu nome e o que você precisa antes de enviar.";
        return;
      }

      var text =
        "Olá, Super Frio! Meu nome é " + name +
        (bairro ? " (" + bairro + ")" : "") +
        ". " + msg;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
      formHint.textContent = "Abrindo o WhatsApp…";
      window.open(url, "_blank", "noopener");
      quoteForm.reset();
    });
  }
})();
