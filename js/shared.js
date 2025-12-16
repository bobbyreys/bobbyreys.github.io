// ========================================
// SHARED JAVASCRIPT - Bobby Reyes Portfolio
// Used across all pages
// ========================================

// State management
let isTransitioning = false;
let transitionCleanupTimeouts = [];

function toggleFunMode() {
    const body = document.body;
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    const toggleLabels = document.querySelectorAll('.mode-toggle-label');

    if (toggleSwitches.length === 0 || toggleLabels.length === 0) return;

    body.classList.toggle('fun-mode-active');

    // Update all toggle switches on the page
    toggleSwitches.forEach(toggle => {
        toggle.classList.toggle('active');
    });

    // Update all labels based on current state
    const labelText = body.classList.contains('fun-mode-active') ? 'Work Mode' : 'Play Mode';
    toggleLabels.forEach(label => {
        label.textContent = labelText;
    });

    // Trigger glitch effect when entering fun mode
    if (body.classList.contains('fun-mode-active')) {
        triggerEasterEgg();
    }
}

function triggerEasterEgg() {
    // Prevent multiple simultaneous transitions
    if (isTransitioning) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Simple gentle fade for users who prefer reduced motion
        document.body.style.animation = 'gentleFade 0.4s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 400);
        return;
    }

    try {
        isTransitioning = true;

        // Clear any existing timeouts
        transitionCleanupTimeouts.forEach(timeout => clearTimeout(timeout));
        transitionCleanupTimeouts = [];

        // Get toggle switch position for ripple origin (use first visible toggle)
        const toggleSwitch = document.querySelector('.toggle-switch');
        const toggleRect = toggleSwitch ? toggleSwitch.getBoundingClientRect() : null;
        const rippleX = toggleRect ? toggleRect.left + (toggleRect.width / 2) : window.innerWidth - 100;
        const rippleY = toggleRect ? toggleRect.top + (toggleRect.height / 2) : 50;

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${rippleX}px;
            top: ${rippleY}px;
            width: 100vh;
            height: 100vh;
            margin-left: -50vh;
            margin-top: -50vh;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 186, 188, 0.4) 0%, rgba(0, 186, 188, 0) 70%);
            pointer-events: none;
            z-index: 9998;
            animation: rippleExpand 0.8s ease-out forwards;
        `;
        document.body.appendChild(ripple);

        // Create color wash effect
        const colorWash = document.createElement('div');
        colorWash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(0, 186, 188, 0.3) 25%,
                rgba(0, 186, 188, 0.3) 75%,
                transparent 100%);
            pointer-events: none;
            z-index: 9999;
            animation: colorWash 0.9s ease-in-out forwards;
        `;
        document.body.appendChild(colorWash);

        // Cleanup after animations complete
        const cleanup = setTimeout(() => {
            try {
                ripple?.parentNode?.removeChild(ripple);
                colorWash?.parentNode?.removeChild(colorWash);
            } catch (error) {
                console.error('Error during cleanup:', error);
            } finally {
                isTransitioning = false;
            }
        }, 1000);

        transitionCleanupTimeouts.push(cleanup);

    } catch (error) {
        console.error('Error in transition effect:', error);
        isTransitioning = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const toggleLabels = document.querySelectorAll('.mode-toggle-label');
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    const body = document.body;

    // Ensure labels and toggle states are correct on page load
    const isFunMode = body.classList.contains('fun-mode-active');
    const labelText = isFunMode ? 'Work Mode' : 'Play Mode';

    toggleLabels.forEach(label => {
        label.textContent = labelText;
    });

    // Sync toggle switch visual state with body class
    toggleSwitches.forEach(toggle => {
        if (isFunMode) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    });
});

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
