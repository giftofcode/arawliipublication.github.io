/* =========================================================
   ARAWLII WEBSITE — COMMON JAVASCRIPT
   File: js/script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navigationLinks = document.querySelectorAll(".nav-links a");
  const currentYearElements = document.querySelectorAll(".current-year");

  /* ---------- CURRENT YEAR ---------- */

  currentYearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* ---------- MOBILE MENU ---------- */

  function openMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.add("active");
    navLinks.classList.add("open");
    body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleMenu() {
    if (!navLinks) return;

    const isMenuOpen = navLinks.classList.contains("open");

    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.addEventListener("click", toggleMenu);
  }

  /* ---------- CLOSE MENU AFTER LINK CLICK ---------- */

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* ---------- CLOSE MENU WITH ESCAPE KEY ---------- */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* ---------- CLOSE MENU ON OUTSIDE CLICK ---------- */

  document.addEventListener("click", (event) => {
    if (!menuToggle || !navLinks) return;

    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);
    const isMenuOpen = navLinks.classList.contains("open");

    if (isMenuOpen && !clickedInsideMenu && !clickedMenuButton) {
      closeMenu();
    }
  });

  /* ---------- RESET MENU ON DESKTOP RESIZE ---------- */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
      closeMenu();
    }
  });

  /* ---------- ACTIVE NAVIGATION LINK ---------- */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  navigationLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    if (!linkHref) return;

    const linkPage = linkHref.split("/").pop().split("#")[0];

    link.classList.remove("active");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- SMOOTH SCROLL FOR SAME-PAGE LINKS ---------- */

  const samePageLinks = document.querySelectorAll('a[href^="#"]');

  samePageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      event.preventDefault();

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      closeMenu();
    });
  });

  /* ---------- REVEAL ELEMENTS ON SCROLL ---------- */

  const revealElements = document.querySelectorAll(
    ".card, .dark-card, .info-card, .timeline-item, " +
      ".profile-card, .archive-card, .feature-item, " +
      ".section-heading, .book-stage, .quote-box"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ---------- CONTACT / MEMBERSHIP FORM ---------- */

  const forms = document.querySelectorAll(".website-form");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const requiredFields = form.querySelectorAll("[required]");
      let formIsValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          formIsValid = false;
          field.setAttribute("aria-invalid", "true");
        } else {
          field.removeAttribute("aria-invalid");
        }
      });

      if (!formIsValid) {
        event.preventDefault();

        const firstInvalidField = form.querySelector(
          '[aria-invalid="true"]'
        );

        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        showFormMessage(
          form,
          "Please complete all required fields.",
          "error"
        );

        return;
      }

      /*
        GitHub Pages does not process form submissions automatically.
        If no external form service is connected, stop submission and
        show a demo confirmation message.
      */

      const action = form.getAttribute("action");

      if (!action || action === "#") {
        event.preventDefault();

        showFormMessage(
          form,
          "Thank you. Your information has been recorded on this page. Connect a form service before publishing live submissions.",
          "success"
        );

        form.reset();
      }
    });
  });

  function showFormMessage(form, message, type) {
    let messageBox = form.querySelector(".form-message");

    if (!messageBox) {
      messageBox = document.createElement("div");
      messageBox.className = "form-message";
      messageBox.setAttribute("role", "status");
      messageBox.setAttribute("aria-live", "polite");
      form.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.classList.remove("success", "error");
    messageBox.classList.add(type);
  }

  /* ---------- SCROLL-TO-TOP BUTTON ---------- */

  const scrollTopButton = document.querySelector(".scroll-top");

  if (scrollTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        scrollTopButton.classList.add("show");
      } else {
        scrollTopButton.classList.remove("show");
      }
    });

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
