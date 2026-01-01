const textElement = document.getElementById('typewriter');
const phrases = ['Cloud Penetration Testing', 'NETWORK SECURITY', 'LLM Red Teaming', 'Application Security'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Deleting is faster
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Typing speed
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before new phrase
    }

    setTimeout(type, typeSpeed);
}

// Start the animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    type();

    // Show cert badge images when available, otherwise show fallback icons
    const cards = document.querySelectorAll('.cert-card');
    cards.forEach(card => {
        const img = card.querySelector('img.cert-badge');
        const fallback = card.querySelector('.cert-fallback');
        if (!img) return;

        // If image loads successfully, show it and hide fallback; otherwise show fallback
        if (img.complete) {
            if (img.naturalWidth === 0) {
                img.style.display = 'none';
                if (fallback) fallback.style.display = 'block';
            } else {
                img.style.display = 'block';
                if (fallback) fallback.style.display = 'none';
            }
        } else {
            img.addEventListener('load', () => {
                img.style.display = 'block';
                if (fallback) fallback.style.display = 'none';
            });
            img.addEventListener('error', () => {
                img.style.display = 'none';
                if (fallback) fallback.style.display = 'block';
            });
        }
    });

    // Adjust certification grid columns based on number of cards so boxes look arranged
    function updateCertGrid() {
        const grid = document.getElementById('cert-grid');
        if (!grid) return;
        const count = grid.querySelectorAll('.cert-card').length;
        const maxCols = 4; // limit how wide the row becomes
        const cols = Math.min(Math.max(1, count), maxCols);

        if (window.innerWidth >= 600) {
            grid.style.gridTemplateColumns = `repeat(${cols}, minmax(220px, 1fr))`;
        } else {
            grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(180px, 1fr))`;
        }
        grid.style.justifyContent = 'center';
    }

    updateCertGrid();
    window.addEventListener('resize', updateCertGrid);

    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.getElementById('primary-navigation');
    let _savedScroll = 0; // stores scroll position when menu opens

    // Prevent background scrolling while keeping the page scrollbar visible
    let _preventScrollHandler = (e) => {
        // Allow scrolling inside the nav overlay
        if (navLinks && navLinks.contains(e.target)) return;
        e.preventDefault();
    };

    function preventBodyKeyScroll(e) {
        // keys that cause page scroll
        const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
        if (keys.includes(e.key)) {
            // If focus is inside nav overlay allow normal behavior
            if (navLinks && navLinks.contains(document.activeElement)) return;
            e.preventDefault();
        }
    }

    function lockBodyScroll() {
        _savedScroll = window.scrollY || window.pageYOffset;
        document.body.classList.add('menu-open');
        // Prevent scroll gestures outside the nav overlay but keep scrollbar visible
        document.addEventListener('wheel', _preventScrollHandler, { passive: false });
        document.addEventListener('touchmove', _preventScrollHandler, { passive: false });
        document.addEventListener('keydown', preventBodyKeyScroll, true);
    }

    function unlockBodyScroll() {
        document.body.classList.remove('menu-open');
        document.removeEventListener('wheel', _preventScrollHandler, { passive: false });
        document.removeEventListener('touchmove', _preventScrollHandler, { passive: false });
        document.removeEventListener('keydown', preventBodyKeyScroll, true);
        window.scrollTo(0, _savedScroll || 0);
    }

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            const open = navbar.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // toggle icon between bars and X
            const icon = navToggle.querySelector('i');
            if (icon) icon.classList.toggle('fa-times', open);

            if (open) {
                // Freeze background scroll and reset inner menu
                lockBodyScroll();
                if (navLinks) {
                    navLinks.scrollTop = 0;
                    const firstLink = navLinks.querySelector('a');
                    if (firstLink) firstLink.focus({preventScroll: true});
                }
            } else {
                unlockBodyScroll();
            }
        });

        // Close menu with Escape key for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.classList.remove('fa-times');
                unlockBodyScroll();
                if (navToggle) navToggle.focus();
            }
        });
        // Close menu when a link is clicked
        navLinks && navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.classList.remove('fa-times');
                unlockBodyScroll();
            }
        });

        // Close menu automatically if viewport expands beyond mobile
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 && navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.classList.remove('fa-times');
                unlockBodyScroll();
            }
        });
    }

    // Swap nav logo to mobile-friendly image when on small screens
    const navLogo = document.getElementById('navLogo');
    const defaultLogo = navLogo ? navLogo.getAttribute('src') : null;
    const mobileLogo = navLogo ? navLogo.getAttribute('data-mobile-src') : null;
    function updateNavLogo() {
        if (!navLogo) return;
        if (window.innerWidth <= 900 && mobileLogo) {
            navLogo.src = mobileLogo;
        } else if (defaultLogo) {
            navLogo.src = defaultLogo;
        }
    }
    updateNavLogo();
    window.addEventListener('resize', updateNavLogo);
});