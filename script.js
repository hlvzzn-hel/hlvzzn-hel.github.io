// Theme Toggle (Light / Dark)
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

const savedTheme = localStorage.getItem("hza-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
  if (themeIcon) themeIcon.textContent = "☀️";
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("hza-theme", nextTheme);
  if (themeIcon) themeIcon.textContent = isDark ? "🌙" : "☀️";
});

// Mobile Navigation Drawer
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileDrawer = document.getElementById("mobileDrawer");

mobileMenuBtn?.addEventListener("click", () => {
  const isOpen = mobileDrawer?.classList.toggle("open");
  mobileMenuBtn.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileDrawer?.classList.remove("open");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
  });
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

// Experience Filter (All / Professional / Leadership)
const expBtns = document.querySelectorAll("[data-exp]");
const expItems = document.querySelectorAll("[data-exp-type]");

expBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    expBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-exp");
    expItems.forEach((item) => {
      const type = item.getAttribute("data-exp-type");
      if (target === "all" || type === target) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// Accessible Modal Manager
let lastFocusedEl = null;

const openModal = (id) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modal.classList.add("open");
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn instanceof HTMLElement) closeBtn.focus();
};

const closeAllModals = () => {
  document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
  if (lastFocusedEl instanceof HTMLElement) lastFocusedEl.focus();
};

document.getElementById("openHrBriefBtnNav")?.addEventListener("click", () => openModal("hrBriefModal"));
document.getElementById("floatingHrBtn")?.addEventListener("click", () => openModal("hrBriefModal"));
document.getElementById("openHrBriefBtnMobile")?.addEventListener("click", () => {
  mobileDrawer?.classList.remove("open");
  mobileMenuBtn?.setAttribute("aria-expanded", "false");
  openModal("hrBriefModal");
});

document.querySelectorAll("[data-modal-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-modal-target");
    if (targetId) openModal(targetId);
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const targetId = btn.getAttribute("data-modal-target");
      if (targetId) openModal(targetId);
    }
  });
});

// Animated Metric Counters
const animateCounters = () => {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target") || "0");
    const decimals = parseInt(counter.getAttribute("data-decimals") || "0", 10);
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = (target * eased).toFixed(decimals);
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

// Running Image Strip: Auto-scroll + Horizontal Scroll + Prev/Next + Drag
const visualViewport = document.getElementById("visualViewport");
const scrollPrevBtn = document.getElementById("scrollPrevBtn");
const scrollNextBtn = document.getElementById("scrollNextBtn");

if (visualViewport) {
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let didDrag = false;

  const autoScroll = () => {
    if (!isPaused && !isDragging) {
      visualViewport.scrollLeft += 0.6;
      const halfWidth = visualViewport.scrollWidth / 2;
      if (halfWidth > 0 && visualViewport.scrollLeft >= halfWidth) {
        visualViewport.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(autoScroll);
  };
  requestAnimationFrame(autoScroll);

  visualViewport.addEventListener("mouseenter", () => { isPaused = true; });
  visualViewport.addEventListener("mouseleave", () => { isPaused = false; isDragging = false; });
  visualViewport.addEventListener("touchstart", () => { isPaused = true; }, { passive: true });
  visualViewport.addEventListener("touchend", () => { setTimeout(() => { isPaused = false; }, 1200); });

  // Mouse drag to scroll horizontally
  visualViewport.addEventListener("mousedown", (e) => {
    isDragging = true;
    didDrag = false;
    startX = e.pageX - visualViewport.offsetLeft;
    scrollStart = visualViewport.scrollLeft;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - visualViewport.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 6) didDrag = true;
    visualViewport.scrollLeft = scrollStart - walk;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Prevent accidental modal open right after dragging
  visualViewport.addEventListener("click", (e) => {
    if (didDrag) {
      e.stopPropagation();
      e.preventDefault();
      didDrag = false;
    }
  }, true);

  // Prev / Next buttons
  scrollPrevBtn?.addEventListener("click", () => {
    isPaused = true;
    visualViewport.scrollBy({ left: -330, behavior: "smooth" });
    setTimeout(() => { isPaused = false; }, 1500);
  });

  scrollNextBtn?.addEventListener("click", () => {
    isPaused = true;
    visualViewport.scrollBy({ left: 330, behavior: "smooth" });
    setTimeout(() => { isPaused = false; }, 1500);
  });
}

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
