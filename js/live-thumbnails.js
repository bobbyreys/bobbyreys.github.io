// ========================================
// LIVE THUMBNAILS - scroll guard
// While the page is scrolling, cards that slide under a resting pointer would
// count as hovered (playing their interaction and showing a pointer cursor).
// Flag the page as scrolling so the chapters ignore the pointer until it stops.
// ========================================

(function () {
    var root = document.documentElement;
    var timer;

    window.addEventListener('scroll', function () {
        root.classList.add('is-scrolling');
        clearTimeout(timer);
        timer = setTimeout(function () {
            root.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });
})();
