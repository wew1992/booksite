/* William Martino / Weebly custom theme interactions - v7 */
(function () {
  "use strict";

  var FALLBACK_PAGES = [
    { title: "Home", url: "index.html" },
    { title: "Bibliography", url: "bibliography.html" },
    {
      title: "Blog",
      url: "blog.html",
      children: [
        { title: "Meet William Martino", url: "01-meet-william-martino.html" },
        { title: "The Battle of Good and Evil", url: "02-the-battle-of-good-and-evil.html" },
        { title: "Exploring Obsession", url: "03-exploring-obsession.html" }
      ]
    },
    { title: "About William Martino", url: "about-william-martino.html" }
  ];

  function directChildrenByClass(parent, className) {
    if (!parent) return [];
    return Array.prototype.filter.call(parent.children, function (child) {
      return child.classList && child.classList.contains(className);
    });
  }

  /*
   * Weebly builds the menu from the Pages tree.  In the current site,
   * Bibliography / Blog / About can be indented under Home in the Pages panel.
   * When that happens Weebly emits ONE top-level item (Home) and puts the other
   * pages inside Home's hidden flyout.  Promote those first-level children so
   * the public header still matches the original Wix layout:
   * Home | Bibliography | Blog | About William Martino
   *
   * Blog's own three child pages remain inside Blog's flyout.
   */
  function promotePagesAccidentallyNestedUnderHome(menu) {
    var topList = menu.querySelector(".wsite-menu-default");
    if (!topList) return;

    var topItems = directChildrenByClass(topList, "wsite-menu-item-wrap");
    if (topItems.length !== 1) return;

    var homeItem = topItems[0];
    var homeAnchor = homeItem.querySelector(":scope > a");
    var homeText = homeAnchor ? homeAnchor.textContent.replace(/\s+/g, " ").trim().toLowerCase() : "";
    if (homeText !== "home") return;

    var homeFlyout = homeItem.querySelector(":scope > .wsite-menu-wrap");
    var childList = homeFlyout && homeFlyout.querySelector(":scope > .wsite-menu");
    if (!childList) return;

    var children = Array.prototype.slice.call(childList.children).filter(function (node) {
      return node.tagName === "LI";
    });

    if (children.length < 2) return;

    children.forEach(function (item) {
      item.classList.remove("wsite-menu-subitem-wrap");
      item.classList.add("wsite-menu-item-wrap");

      var anchor = item.querySelector(":scope > a");
      if (anchor) {
        anchor.classList.remove("wsite-menu-subitem");
        anchor.classList.add("wsite-menu-item");
      }

      topList.appendChild(item);
    });

    if (homeFlyout) homeFlyout.remove();
  }

  function createFallbackMenu(menu) {
    var ul = document.createElement("ul");
    ul.className = "wsite-menu-default wm-menu-fallback";

    FALLBACK_PAGES.forEach(function (page) {
      var li = document.createElement("li");
      li.className = "wsite-menu-item-wrap";

      var a = document.createElement("a");
      a.className = "wsite-menu-item";
      a.href = page.url;
      a.textContent = page.title;
      li.appendChild(a);

      if (page.children && page.children.length) {
        var wrap = document.createElement("div");
        wrap.className = "wsite-menu-wrap";
        wrap.style.display = "none";

        var sub = document.createElement("ul");
        sub.className = "wsite-menu";

        page.children.forEach(function (child) {
          var childLi = document.createElement("li");
          childLi.className = "wsite-menu-subitem-wrap";

          var childA = document.createElement("a");
          childA.className = "wsite-menu-subitem";
          childA.href = child.url;

          var span = document.createElement("span");
          span.className = "wsite-menu-title";
          span.textContent = child.title;

          childA.appendChild(span);
          childLi.appendChild(childA);
          sub.appendChild(childLi);
        });

        wrap.appendChild(sub);
        li.appendChild(wrap);
      }

      ul.appendChild(li);
    });

    menu.innerHTML = "";
    menu.appendChild(ul);
  }

  function markCurrentMenuItem(menu) {
    var current = window.location.pathname.replace(/\/+$/, "") || "/";
    menu.querySelectorAll("a[href]").forEach(function (link) {
      var raw = link.getAttribute("href");
      if (!raw || /^(https?:|mailto:|#)/i.test(raw)) return;

      try {
        var path = new URL(raw, window.location.origin).pathname.replace(/\/+$/, "") || "/";
        if (path === current || (current === "" && path === "/")) {
          link.classList.add("wm-current-link");
          link.setAttribute("aria-current", "page");
        }
      } catch (e) {}
    });
  }

  function normalizePrimaryMenu(menu) {
    promotePagesAccidentallyNestedUnderHome(menu);

    var topList = menu.querySelector(".wsite-menu-default");
    var topItems = topList ? directChildrenByClass(topList, "wsite-menu-item-wrap") : [];

    /* If Weebly fails to render {menu} at all, do not leave the header empty. */
    if (!topList || topItems.length < 2) {
      createFallbackMenu(menu);
      topList = menu.querySelector(".wsite-menu-default");
      topItems = topList ? directChildrenByClass(topList, "wsite-menu-item-wrap") : [];
    }

    topItems.forEach(function (item) {
      item.style.removeProperty("display");
      item.style.removeProperty("visibility");
      item.style.removeProperty("opacity");
      item.style.removeProperty("width");
      item.style.removeProperty("height");
      item.style.removeProperty("float");
    });

    markCurrentMenuItem(menu);
  }

  function initPrimaryMenu() {
    var toggle = document.querySelector(".wm-menu-toggle");
    var menu = document.getElementById("wm-menu");
    if (!menu) return;

    normalizePrimaryMenu(menu);

    /* Re-run once after Weebly's own front-end code has had a chance to touch
       the menu.  This also makes the editor preview less fragile. */
    window.setTimeout(function () {
      normalizePrimaryMenu(menu);
    }, 250);

    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      document.addEventListener("click", function (event) {
        if (!menu.classList.contains("is-open")) return;
        if (menu.contains(event.target) || toggle.contains(event.target)) return;
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });

      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !menu.classList.contains("is-open")) return;
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      });
    }
  }

  function configureNativeContactForm(nativeZone) {
    if (!nativeZone) return;

    var nativeForm = nativeZone.querySelector("form, .wsite-form-container");
    if (!nativeForm) return;

    /* Keep the horror-themed wording even if Weebly inserts its default button
       label.  Weebly still owns the actual submission/backend. */
    nativeZone.querySelectorAll("input[type='submit']").forEach(function (button) {
      button.value = "Send Whisper";
    });

    nativeZone.querySelectorAll("button[type='submit'], .wsite-button-inner").forEach(function (button) {
      var text = (button.textContent || "").trim().toLowerCase();
      if (!text || text === "submit" || text === "send" || text === "contact us") {
        button.textContent = "Send Whisper";
      }
    });
  }

  function updateNativeContactState(nativeZone, fallback) {
    if (!nativeZone) return false;

    var hasForm = !!nativeZone.querySelector("form, .wsite-form-container");
    nativeZone.classList.toggle("has-native-form", hasForm);

    if (fallback) {
      fallback.hidden = hasForm;
      fallback.setAttribute("aria-hidden", hasForm ? "true" : "false");
    }

    if (hasForm) configureNativeContactForm(nativeZone);
    return hasForm;
  }

  function setContactStatus(status, message, type) {
    if (!status) return;
    status.textContent = message || "";
    status.classList.remove("is-error", "is-success");
    if (type) status.classList.add(type);
  }

  function initContactForm() {
    var fallback = document.getElementById("wm-contact-form");
    var nativeZone = document.getElementById("wm-native-contact");
    var status = document.getElementById("wm-contact-status");

    updateNativeContactState(nativeZone, fallback);

    if (nativeZone && "MutationObserver" in window) {
      var formObserver = new MutationObserver(function () {
        updateNativeContactState(nativeZone, fallback);
      });
      formObserver.observe(nativeZone, { childList: true, subtree: true });
    }

    if (!fallback) return;

    fallback.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!fallback.reportValidity()) {
        setContactStatus(status, "Please complete each required field before sending your whisper.", "is-error");
        return;
      }

      var data = new FormData(fallback);
      var to = fallback.getAttribute("data-email") || "williammartino@writeme.com";
      var subject = data.get("subject") || "Website Message here is a whisper";
      var body = [
        "",
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Subject: " + subject,
        "",
        data.get("message") || ""
      ].join("\n");

      /* The fallback intentionally uses mailto.  Once a native Weebly Contact
         Form is added to {contact-form:content}, Weebly becomes the real
         server-side sender and this fallback hides automatically. */
      setContactStatus(status, "Opening your email application with the whisper filled in…", "is-success");

      window.location.href =
        "mailto:" + encodeURIComponent(to) +
        "?subject=" + encodeURIComponent("[William Martino website] " + subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  function initFaqAccordions() {
    document.querySelectorAll("[data-wm-accordion='single']").forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll("details.wm-faq"));

      items.forEach(function (item) {
        item.addEventListener("toggle", function () {
          if (!item.open) return;

          items.forEach(function (other) {
            if (other !== item && other.open) other.open = false;
          });
        });
      });
    });
  }

  function initScrollReveals() {
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var targets = document.querySelectorAll([
      ".wm-section-heading",
      ".wm-centered > .wm-kicker",
      ".wm-centered > h1",
      ".wm-centered > h2",
      ".wm-centered > .wm-lede",
      ".wm-fan-shop",
      ".wm-trilogy-card",
      ".wm-archive > *",
      ".wm-contact-grid > *",
      ".wm-book",
      ".wm-blog-card",
      ".wm-about-images",
      ".wm-prose",
      ".wm-motto blockquote",
      ".wm-faq",
      ".wm-post-content > *"
    ].join(","));

    if (!targets.length) return;

    Array.prototype.forEach.call(targets, function (el, index) {
      el.classList.add("wm-reveal");
      if (index % 3 === 0) el.classList.add("wm-reveal-left");
      else if (index % 3 === 1) el.classList.add("wm-reveal-up");
      else el.classList.add("wm-reveal-right");
      el.style.setProperty("--wm-reveal-delay", ((index % 3) * 70) + "ms");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.10,
      rootMargin: "0px 0px -7% 0px"
    });

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  function isWeeblyPromoLink(link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href.indexOf("weebly.com") === -1) return false;

    var text = (link.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    return text.indexOf("powered by") !== -1 ||
      text.indexOf("create your own unique website") !== -1 ||
      text.indexOf("get started") !== -1;
  }

  function removeWeeblyPromotionalFooter() {
    var selectors = [
      "#weebly-footer-signup-container-v3",
      "#weebly-footer-signup-container",
      "[id^='weebly-footer-signup-container']",
      "[class*='weebly-footer-signup-container']"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(function (node) {
      if (!node.closest(".wm-footer")) node.remove();
    });

    document.querySelectorAll("a[href*='weebly.com']").forEach(function (link) {
      if (!isWeeblyPromoLink(link)) return;

      var container = link.closest(
        "[id*='weebly-footer'], [class*='weebly-footer'], " +
        "[id*='footer-signup'], [class*='footer-signup']"
      );

      if (container && !container.closest(".wm-footer")) {
        container.remove();
      } else if (!link.closest(".wm-footer")) {
        var parent = link.parentElement;
        if (parent) parent.remove();
      }
    });
  }

  function watchForWeeblyFooter() {
    removeWeeblyPromotionalFooter();
    if (!("MutationObserver" in window) || !document.body) return;

    var observer = new MutationObserver(removeWeeblyPromotionalFooter);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initWilliamMartinoTheme() {
    document.documentElement.classList.add("wm-js");
    initPrimaryMenu();
    initContactForm();
    initFaqAccordions();
    initScrollReveals();
    watchForWeeblyFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWilliamMartinoTheme);
  } else {
    initWilliamMartinoTheme();
  }
})();
