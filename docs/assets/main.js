(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll progress bar ---- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (scrollTop / max) * 100 : 0;
    progress.style.width = pct + "%";
  }

  /* ---- reveal on scroll ---- */
  var revealTargets = [];

  function markReveal(el, groupClass) {
    el.classList.add(groupClass);
    revealTargets.push(el);
  }

  // Content that fades in on its own (opacity only, no slide) — independent
  // of any heading typewriter nearby, so it's visible while the heading
  // is still typing rather than waiting for it to finish.
  document.querySelectorAll(".fade")
    .forEach(function (el) { markReveal(el, "fade"); });

  // Story blocks: slide in from opposite sides
  var storyMainEl = document.querySelector(".story-main");
  var storySideEl = document.querySelector(".story-side");
  if (storyMainEl) markReveal(storyMainEl, "reveal-left");
  if (storySideEl) markReveal(storySideEl, "reveal-right");

  // Grid groups (stagger children)
  document.querySelectorAll(".skills, .use")
    .forEach(function (el) { el.classList.add("reveal-group"); revealTargets.push(el); });

  var workbooksGrid = document.querySelector(".workbooks");
  if (workbooksGrid) {
    workbooksGrid.classList.add("reveal-group");
    workbooksGrid.querySelectorAll(".workbook").forEach(function (el) {
      el.classList.add("reveal-pop");
    });
    revealTargets.push(workbooksGrid);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // Trigger as soon as an element starts crossing into the viewport
    // (rather than waiting until it's already mostly on screen), so the
    // motion is still visible while scrolling instead of having finished
    // by the time it's noticed.
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -4% 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---- typewriter on headings ---- */
  function tokenize(html) {
    var tokens = [];
    html.split(/(<br\s*\/?>)/i).forEach(function (part) {
      if (/^<br\s*\/?>$/i.test(part)) {
        tokens.push({ br: true });
      } else if (part) {
        Array.from(part).forEach(function (ch) { tokens.push({ ch: ch }); });
      }
    });
    return tokens;
  }

  function runTypewriter(el, tokens) {
    var i = 0;
    el.classList.add("typing");
    el.innerHTML = "";
    (function step() {
      var t = tokens[i];
      el.innerHTML += t.br ? "<br>" : t.ch;
      i++;
      if (i < tokens.length) {
        window.setTimeout(step, 55);
      } else {
        el.classList.remove("typing");
      }
    })();
  }

  document.querySelectorAll(".type-target").forEach(function (el) {
    var originalHTML = el.innerHTML.trim();
    var plainText = el.textContent;

    if (reduceMotion || el.closest(".reading-notebook") || !("IntersectionObserver" in window)) {
      el.innerHTML = originalHTML;
      return;
    }

    var tokens = tokenize(originalHTML);
    el.innerHTML = "";
    el.setAttribute("aria-label", plainText);
    var typed = false;
    var typeIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !typed) {
            typed = true;
            typeIo.disconnect();
            runTypewriter(el, tokens);
          }
        });
      },
      { threshold: 0.4 }
    );
    typeIo.observe(el);
  });

  /* ---- workbooks carousel + list + detail sync ---- */
  (function () {
    var wrap = document;
    if (!wrap.querySelector(".wb-feature")) return;
    var interactionAreas = [wrap.querySelector(".wb-feature"), wrap.querySelector(".wb-categories")];

    var slides = Array.prototype.slice.call(wrap.querySelectorAll(".wb-slide"));
    var dots = Array.prototype.slice.call(wrap.querySelectorAll(".wb-dot"));
    var items = Array.prototype.slice.call(wrap.querySelectorAll(".wb-item")).sort(function (a, b) {
      return Number(a.dataset.index) - Number(b.dataset.index);
    });
    var prevBtn = wrap.querySelector(".wb-nav.prev");
    var nextBtn = wrap.querySelector(".wb-nav.next");
    var carousel = wrap.querySelector(".wb-carousel");
    var track = wrap.querySelector(".wb-carousel-track");
    var channels = wrap.querySelectorAll(".wb-channel, [data-wb-channel]");
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var detailBody = wrap.querySelector(".wb-detail-body");
    var detailTag = wrap.querySelector("[data-wb-tag]");
    var detailTitle = wrap.querySelector("[data-wb-title]");
    var detailDesc = wrap.querySelector("[data-wb-desc]");
    var detailLink = wrap.querySelector("[data-wb-link]");
    var total = slides.length;
    if (!total) return;

    var current = 0;
    var autoTimer = null;
    var switchTimer = null;

    // Reserve the tallest program card at the current width, without truncating copy.
    function sizeDetail() {
      if (!detailBody) return;
      var measure = detailBody.cloneNode(true);
      measure.removeAttribute("href");
      measure.setAttribute("aria-hidden", "true");
      measure.setAttribute("tabindex", "-1");
      measure.inert = true;
      measure.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;min-height:0;width:" + detailBody.getBoundingClientRect().width + "px";
      detailBody.parentNode.appendChild(measure);
      var tallest = 0;
      items.forEach(function (item) {
        measure.querySelector("[data-wb-tag]").textContent = item.querySelector(".tag").textContent;
        measure.querySelector("[data-wb-title]").textContent = item.querySelector("h3").textContent;
        measure.querySelector("[data-wb-desc]").textContent = item.dataset.desc || "";
        tallest = Math.max(tallest, measure.getBoundingClientRect().height);
      });
      measure.remove();
      detailBody.style.minHeight = Math.ceil(tallest) + "px";
    }

    if (detailBody && "ResizeObserver" in window) {
      var detailWidth = 0;
      new ResizeObserver(function (entries) {
        var width = entries[0].contentRect.width;
        if (width !== detailWidth) { detailWidth = width; sizeDetail(); }
      }).observe(detailBody);
    } else {
      window.addEventListener("resize", sizeDetail);
    }
    if (document.fonts) document.fonts.ready.then(sizeDetail);
    sizeDetail();

    function updateDetail(index) {
      if (!detailBody) return;
      var item = items[index];
      detailTag.textContent = item.querySelector(".tag").textContent;
      detailTitle.textContent = item.querySelector("h3").textContent;
      detailDesc.textContent = item.dataset.desc || "";
      detailLink.setAttribute("href", item.querySelector("a").getAttribute("href"));
    }

    function goTo(index) {
      var next = (index + total) % total;
      if (next !== current && !motionQuery.matches) {
        window.clearTimeout(switchTimer);
        track.classList.remove("is-tuning");
        // Restart the short effect, including when controls are pressed rapidly.
        void track.offsetWidth;
        track.classList.add("is-tuning");
        switchTimer = window.setTimeout(function () {
          track.classList.remove("is-tuning");
          switchTimer = null;
        }, 200);
      }
      current = next;
      slides.forEach(function (s, i) {
        s.classList.toggle("is-active", i === current);
        s.setAttribute("aria-hidden", String(i !== current));
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
        d.setAttribute("aria-current", String(i === current));
      });
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === current); });
      channels.forEach(function (channel) {
        channel.textContent = "CH " + String(current + 1).padStart(2, "0") +
          (channel.hasAttribute("data-wb-channel") ? "" : " / " + String(total).padStart(2, "0"));
      });
      updateDetail(current);
    }

    function pauseAuto() {
      if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
    }
    function resumeAuto() {
      var interacting = interactionAreas.some(function (area) {
        return area && (area.matches(":hover") || area.contains(document.activeElement));
      });
      if (!autoTimer && !motionQuery.matches && !interacting) {
        autoTimer = window.setInterval(function () { goTo(current + 1); }, 4500);
      }
    }
    function restartAuto() { pauseAuto(); resumeAuto(); }

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { goTo(i); restartAuto(); });
    });

    items.forEach(function (it, i) {
      var link = it.querySelector("a");
      if (!link) return;
      link.addEventListener("mouseenter", function () { goTo(i); pauseAuto(); });
      link.addEventListener("focus", function () { goTo(i); pauseAuto(); });
      link.addEventListener("mouseleave", resumeAuto);
      link.addEventListener("blur", resumeAuto);
    });

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); restartAuto(); });

    interactionAreas.forEach(function (area) {
      if (!area) return;
      area.addEventListener("mouseenter", pauseAuto);
      area.addEventListener("mouseleave", resumeAuto);
      area.addEventListener("focusin", pauseAuto);
      area.addEventListener("focusout", function (event) {
        if (!area.contains(event.relatedTarget)) resumeAuto();
      });
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goTo(current + (event.key === "ArrowLeft" ? -1 : 1));
      restartAuto();
    });

    var swipeStart = null;
    track.addEventListener("pointerdown", function (event) {
      if (!event.isPrimary || event.pointerType === "mouse") return;
      swipeStart = { x: event.clientX, y: event.clientY };
      track.setPointerCapture(event.pointerId);
      pauseAuto();
    });
    track.addEventListener("pointerup", function (event) {
      if (!swipeStart) return;
      var dx = event.clientX - swipeStart.x;
      var dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
        goTo(current + (dx < 0 ? 1 : -1));
      }
      restartAuto();
    });
    track.addEventListener("pointercancel", function () { swipeStart = null; resumeAuto(); });

    motionQuery.addEventListener("change", function () {
      window.clearTimeout(switchTimer);
      track.classList.remove("is-tuning");
      restartAuto();
    });

    goTo(0);
    resumeAuto();
  })();

  /* ---- parallax on hero art + story decoration ---- */
  var heroArt = document.querySelector(".hero-art");
  var storyMain = document.querySelector(".story-main");
  var ticking = false;

  function applyParallax() {
    var y = window.scrollY || window.pageYOffset;

    if (heroArt) {
      var heroOffset = Math.min(y * 0.12, 60);
      heroArt.style.transform = "rotate(1deg) translateY(" + heroOffset + "px)";
    }

    if (storyMain) {
      var rect = storyMain.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh && rect.bottom > 0) {
        var progressInView = (vh - rect.top) / (vh + rect.height);
        var shift = (progressInView - 0.5) * 46;
        storyMain.style.setProperty("--circle-shift", shift + "px");
      }
    }

    ticking = false;
  }

  function onScroll() {
    updateProgress();
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  if (!reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", applyParallax);
    applyParallax();
  }
  updateProgress();
})();
