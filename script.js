document.addEventListener("DOMContentLoaded", () => {

    // ===== PARTICLE NETWORK BACKGROUND =====
    const canvas = document.getElementById("canvas-bg");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let raf;

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function initParticles() {
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 85);
            particles = Array.from({ length: count }, () => ({
                x:  Math.random() * canvas.width,
                y:  Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.38,
                vy: (Math.random() - 0.5) * 0.38,
                r:  Math.random() * 1.4 + 0.4,
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const c = "0, 212, 255";

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0)             p.x = canvas.width;
                if (p.x > canvas.width)  p.x = 0;
                if (p.y < 0)             p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c}, 0.55)`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q  = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 128) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${c}, ${(1 - d / 128) * 0.14})`;
                        ctx.lineWidth   = 0.8;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        }

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
            resize();
            initParticles();
            draw();
            window.addEventListener("resize", () => {
                cancelAnimationFrame(raf);
                resize();
                initParticles();
                draw();
            }, { passive: true });
        }
    }

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
        }, { threshold: 0.1 });

        reveals.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min((i % 7) * 75, 450)}ms`;
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

