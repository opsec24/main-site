document.addEventListener("DOMContentLoaded", () => {

    // ===== TOPBAR SCROLL STATE =====
    const topbar = document.getElementById("topbar");
    if (topbar) {
        window.addEventListener("scroll", () => {
            topbar.classList.toggle("scrolled", window.scrollY > 40);
        }, { passive: true });

        // Mobile menu
        const menuBtn = topbar.querySelector(".menu-btn");
        const nav     = document.getElementById("site-nav");

        if (menuBtn && nav) {
            menuBtn.addEventListener("click", () => {
                const open = topbar.classList.toggle("menu-open");
                menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
            });

            nav.addEventListener("click", (e) => {
                if (e.target instanceof HTMLAnchorElement) {
                    topbar.classList.remove("menu-open");
                    menuBtn.setAttribute("aria-expanded", "false");
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 760) {
                    topbar.classList.remove("menu-open");
                    menuBtn.setAttribute("aria-expanded", "false");
                }
            }, { passive: true });
        }
    }

    // ===== SCROLL REVEAL =====
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px 60px 0px" });

        reveals.forEach((el) => {
            revealObs.observe(el);
        });
    } else {
        reveals.forEach((el) => el.classList.add("show"));
    }

    // ===== COUNTER ANIMATION =====
    const counters = Array.from(document.querySelectorAll(".stat-num[data-target]"));
    if (counters.length && "IntersectionObserver" in window) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach((el) => counterObs.observe(el));
    }

    function animateCounter(el) {
        const target   = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start    = performance.now();
        (function update(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(update);
        })(performance.now());
    }

    // ===== FOOTER YEAR =====
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
