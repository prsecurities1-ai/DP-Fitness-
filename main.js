(() => {
  "use strict";

  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#primaryNav");
  const backToTop = document.querySelector("#backToTop");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateScrollUI = () => {
    const isScrolled = window.scrollY > 24;
    nav?.classList.toggle("scrolled", isScrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 500);
  };
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  const closeMenu = () => {
    navMenu?.classList.remove("show");
    nav?.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navMenu?.classList.toggle("show", !isOpen);
    nav?.classList.toggle("menu-open", !isOpen);
  });
  navMenu?.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      navToggle.focus();
    }
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll(".count-up");
  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reducedMotion) {
      element.textContent = String(target);
      return;
    }
    const duration = 1300;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const track = document.querySelector("#testimonialTrack");
  const slides = track ? Array.from(track.children) : [];
  const progress = document.querySelector("#testimonialProgress");
  let activeSlide = 0;
  const showSlide = (index) => {
    if (!track || !slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeSlide * 100}%)`;
    if (progress) progress.style.transform = `translateX(${activeSlide * 100}%)`;
    track.setAttribute("aria-label", `Testimonial ${activeSlide + 1} of ${slides.length}`);
  };
  document.querySelector("#testimonialPrev")?.addEventListener("click", () => showSlide(activeSlide - 1));
  document.querySelector("#testimonialNext")?.addEventListener("click", () => showSlide(activeSlide + 1));
  showSlide(0);

  document.querySelectorAll(".choose-plan").forEach((button) => {
    button.addEventListener("click", () => {
      const planSelect = document.querySelector("#plan");
      if (planSelect) planSelect.value = button.dataset.plan || "";
    });
  });

  const form = document.querySelector("#enquiryForm");
  const feedback = document.querySelector("#formFeedback");
  const validationMessage = (field) => {
    if (field.validity.valueMissing) return "Please complete this field.";
    if (field.validity.typeMismatch) return "Please enter a valid email address.";
    if (field.validity.tooShort) return `Please enter at least ${field.minLength} characters.`;
    if (field.validity.patternMismatch) return "Please enter a valid phone number.";
    return "";
  };

  form?.querySelectorAll("input[required], select[required]").forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("is-invalid");
      const error = field.parentElement?.querySelector(".field-error");
      if (error) error.textContent = "";
      if (feedback) feedback.classList.remove("show");
    });
    field.addEventListener("change", () => {
      field.classList.remove("is-invalid");
      const error = field.parentElement?.querySelector(".field-error");
      if (error) error.textContent = "";
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form || !feedback) return;
    feedback.classList.remove("show");
    let firstInvalid = null;
    form.querySelectorAll("input[required], select[required]").forEach((field) => {
      const error = field.parentElement?.querySelector(".field-error");
      const message = validationMessage(field);
      field.classList.toggle("is-invalid", Boolean(message));
      if (error) error.textContent = message;
      if (message && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      feedback.textContent = "Please check the highlighted fields and try again.";
      feedback.classList.add("show");
      firstInvalid.focus();
      return;
    }
    feedback.textContent = "Thanks for your interest! Your details have not been sent or stored in this demo. Please contact our team directly to continue.";
    feedback.classList.add("show");
    form.reset();
  });

  const year = document.querySelector("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
})();
