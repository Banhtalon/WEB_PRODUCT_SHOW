(() => {
  "use strict";
  const progress = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  const links = [...document.querySelectorAll(".site-nav a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Thanh tiến độ, nút lên đầu trang, mục đang xem */
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    toTop.classList.toggle("show", window.scrollY > 600);

    const line = window.innerHeight * 0.35;
    let activeIndex = -1;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= line) activeIndex = i;
    });
    links.forEach((a, i) => {
      const on = i === activeIndex;
      a.classList.toggle("active", on);
      if (on) {
        const nav = a.parentElement;
        nav.scrollLeft = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
      }
    });
  }
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Hiện dần nội dung khi cuộn tới */
  const targets = document.querySelectorAll(
    ".section:not(.hero) .container > :not(.split):not(.three-grid):not(.food-grid):not(.gallery), .split > *, .three-grid > *, .food-grid > *, .gallery > *"
  );
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => {
      const i = [...el.parentElement.children].indexOf(el);
      el.style.setProperty("--d", `${Math.min(i, 4) * 0.12}s`);
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* Ảnh ở phần mở đầu nhích nhẹ theo con trỏ chuột */
  const hero = document.getElementById("top");
  const pars = [...document.querySelectorAll(".par")];
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      pars.forEach((el) => {
        const d = Number(el.dataset.depth) || 0;
        el.style.setProperty("--tx", `${nx * d}px`);
        el.style.setProperty("--ty", `${ny * d}px`);
      });
    });
    hero.addEventListener("mouseleave", () => pars.forEach((el) => {
      el.style.setProperty("--tx", "0px"); el.style.setProperty("--ty", "0px");
    }));
  }
})();
