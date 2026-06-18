/*!
 * Floating back-to-top button. Shows after scrolling past the hero (or one
 * screenful on pages without a hero); smooth-scrolls to top, respecting
 * prefers-reduced-motion. Vanilla JS, no dependencies.
 */
(function () {
    'use strict';

    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var header = document.querySelector('header');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    function threshold() {
        // Past the hero on the homepage; ~half a screen elsewhere.
        return header ? Math.max(header.offsetHeight - 120, 200) : window.innerHeight * 0.6;
    }

    function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        btn.classList.toggle('is-visible', y > threshold());
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    });
}());
