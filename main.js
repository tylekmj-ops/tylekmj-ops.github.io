// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Animations (GSAP) ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

if (window.gsap && !reduceMotion) {
  // Hero: stagger the text in on load
  const heroIntro = gsap.from(".hero-anim", {
    y: 28,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    delay: 0.15,
    onStart: () => root.classList.remove("js"),
  });

  // Safety net: never leave the hero text hidden if the animation can't run
  setTimeout(() => {
    if (heroIntro.progress() === 0) {
      heroIntro.progress(1);
      root.classList.remove("js");
    }
  }, 2500);

  // Sections: fade up as they scroll into view
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
  }
} else {
  // No GSAP or reduced motion: just show everything
  root.classList.remove("js");
}

// ---------- Active nav link ----------
const navLinks = document.querySelectorAll(".site-header nav a");
const sections = [...navLinks].map((a) => document.querySelector(a.hash));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        const active = a.hash === `#${entry.target.id}`;
        a.classList.toggle("active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && observer.observe(s));

// ---------- Contact form ----------
const form = document.querySelector(".contact-form");

if (form) {
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    status.textContent = "Sending…";
    status.className = "form-status";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      status.textContent = "Thanks! Your message is on its way.";
      status.classList.add("success");
    } catch {
      status.textContent = "Something went wrong. Please email me directly.";
      status.classList.add("error");
    } finally {
      button.disabled = false;
    }
  });
}
