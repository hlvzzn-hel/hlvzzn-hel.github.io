// Theme Toggle (Light / Dark)
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

const savedTheme = localStorage.getItem("hza-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
  themeIcon.textContent = "☀️";
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("hza-theme", nextTheme);
  themeIcon.textContent = isDark ? "🌙" : "☀️";
});

// Project Category Filter
const projectFilterBtns = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");

projectFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    projectFilterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// Experience Tab Switch
const expBtns = document.querySelectorAll("[data-exp]");
const expWork = document.getElementById("exp-work");
const expOrg = document.getElementById("exp-org");

expBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    expBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-exp");
    if (target === "work") {
      expWork?.classList.remove("hidden");
      expOrg?.classList.add("hidden");
    } else {
      expWork?.classList.add("hidden");
      expOrg?.classList.remove("hidden");
    }
  });
});

// Unified Modal Manager
const openModal = (id) => {
  const el = document.getElementById(id);
  el?.classList.add("open");
};

const closeAllModals = () => {
  document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
};

document.getElementById("openSmartInvestModal")?.addEventListener("click", () => openModal("smartInvestModal"));
document.getElementById("openHrBriefBtn")?.addEventListener("click", () => openModal("hrBriefModal"));
document.getElementById("openHrBriefBtnNav")?.addEventListener("click", () => openModal("hrBriefModal"));

document.querySelectorAll("[data-modal-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-modal-target");
    if (targetId) openModal(targetId);
  });
});

document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", closeAllModals);
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeAllModals();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

// Animated Metric Counters
const animateCounters = () => {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target") || "0");
    const decimals = parseInt(counter.getAttribute("data-decimals") || "0", 10);
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      counter.textContent = value.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toFixed(decimals);
      }
    };
    requestAnimationFrame(step);
  });
};

window.addEventListener("DOMContentLoaded", animateCounters);

// Scroll Reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Copy Email Buttons
const bindCopyEmail = (btnId) => {
  const btn = document.getElementById(btnId);
  btn?.addEventListener("click", async () => {
    const email = btn.getAttribute("data-email");
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      const original = btn.textContent;
      btn.textContent = "Email Copied ✓";
      setTimeout(() => {
        btn.textContent = original;
      }, 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
};

bindCopyEmail("copyEmailBtn");
bindCopyEmail("copyHrEmailBtn");
