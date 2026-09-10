// ========================================
// SHARED JAVASCRIPT - Bobby Reyes Portfolio
// Used across all pages
// ========================================

// ========================================
// LIGHTBOX FUNCTIONALITY
// Full-screen image viewer for project pages
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Only enable lightbox on project detail pages (not on homepage/work page)
    const isProjectPage = document.querySelector('.project-header');
    if (!isProjectPage) return;

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Handle hero images - make image clickable
    const heroImages = document.querySelectorAll('.hero-image-container img');
    heroImages.forEach(img => {
        if (img.src && !img.src.includes('[')) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt || 'Project image';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Handle feature showcase and figure images - make image clickable
    const featureImages = document.querySelectorAll('.feature-image img, .figure-single img, .figure-frame img');
    featureImages.forEach(img => {
        if (img.src && !img.src.includes('[')) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt || 'Project image';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Handle design cards - make entire card clickable
    const designCards = document.querySelectorAll('.design-card');
    designCards.forEach(card => {
        const img = card.querySelector('img');
        if (img && img.src && !img.src.includes('[')) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Project image';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Small delay before clearing src to allow fade out
        setTimeout(() => {
            lightboxImg.src = '';
        }, 200);
    }

    // Close on X button click
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click (clicking outside image)
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});

// ========================================
// SCROLL REVEAL
// Fades/slides case study sections in as they enter the viewport
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.scroll-reveal');
    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    sections.forEach(section => section.classList.add('reveal-hidden'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reveal-hidden');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    sections.forEach(section => observer.observe(section));
});

// ========================================
// SECTION SUB-NAV
// Sticky in-page nav with scroll-spy for case study pages
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const sectionNav = document.getElementById('sectionNav');
    const mainNav = document.querySelector('nav');
    if (!sectionNav || !mainNav) return;

    sectionNav.style.top = mainNav.offsetHeight + 'px';
    document.documentElement.style.scrollPaddingTop = (mainNav.offsetHeight + sectionNav.offsetHeight) + 'px';

    const links = Array.from(sectionNav.querySelectorAll('.section-nav-link'));
    const indicator = sectionNav.querySelector('.section-nav-indicator');
    const targets = links
        .map(link => document.getElementById(link.getAttribute('href').slice(1)))
        .filter(Boolean);

    if (targets.length === 0) return;

    function moveIndicator(activeLink) {
        if (!indicator || !activeLink) return;
        indicator.style.width = activeLink.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + activeLink.offsetLeft + 'px)';
    }

    function updateActiveSection() {
        const offset = mainNav.offsetHeight + sectionNav.offsetHeight + 1;
        let current = targets[0];
        for (const target of targets) {
            if (target.getBoundingClientRect().top - offset <= 0) {
                current = target;
            }
        }
        let activeLink = null;
        links.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + current.id;
            link.classList.toggle('active', isActive);
            if (isActive) activeLink = link;
        });
        moveIndicator(activeLink);
    }

    const hero = document.querySelector('.project-header') || targets[0];

    function updateVisibility() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        sectionNav.classList.toggle('visible', heroBottom <= mainNav.offsetHeight);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateActiveSection();
            updateVisibility();
            ticking = false;
        });
    });

    window.addEventListener('resize', updateActiveSection);

    updateActiveSection();
    updateVisibility();
});

// ========================================
// AUTO-HIDE MAIN NAV
// Hides the main nav on scroll down, reveals it on scroll up.
// The section sub-nav (if present) slides up to take its place.
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.querySelector('nav');
    if (!mainNav) return;
    const sectionNav = document.getElementById('sectionNav');
    const navHeight = mainNav.offsetHeight;

    let lastScrollY = window.scrollY;
    let navHidden = false;
    let suppressAutoHide = false;
    let suppressTimer = null;

    function setNavHidden(hidden) {
        if (hidden === navHidden) return;
        navHidden = hidden;
        mainNav.classList.toggle('nav-hidden', hidden);
        if (sectionNav) {
            sectionNav.style.top = (hidden ? 0 : navHeight) + 'px';
            document.documentElement.style.scrollPaddingTop =
                (hidden ? sectionNav.offsetHeight : navHeight + sectionNav.offsetHeight) + 'px';
        }
    }

    function onScroll() {
        const currentScrollY = window.scrollY;
        mainNav.classList.toggle('scrolled', currentScrollY > 24);
        if (!suppressAutoHide) {
            const scrollingDown = currentScrollY > lastScrollY;
            setNavHidden(scrollingDown && currentScrollY > navHeight);
        }
        lastScrollY = currentScrollY;
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            onScroll();
            ticking = false;
        });
    });

    function waitForScrollSettle(callback) {
        let lastY = window.scrollY;
        let stableFrames = 0;
        function check() {
            const y = window.scrollY;
            if (Math.abs(y - lastY) < 0.5) {
                stableFrames++;
            } else {
                stableFrames = 0;
                lastY = y;
            }
            if (stableFrames >= 6) {
                callback();
                return;
            }
            requestAnimationFrame(check);
        }
        requestAnimationFrame(check);
    }

    if (sectionNav) {
        sectionNav.querySelectorAll('.section-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setNavHidden(false);
                suppressAutoHide = true;
                clearTimeout(suppressTimer);
                suppressTimer = setTimeout(() => { suppressAutoHide = false; }, 4000);
                waitForScrollSettle(() => {
                    suppressAutoHide = false;
                    clearTimeout(suppressTimer);
                });
            });
        });
    }
});
