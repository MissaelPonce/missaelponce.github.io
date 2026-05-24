/*!
 * Scroll-reveal animations — replaces WOW.js
 * Uses IntersectionObserver to add .is-visible to .reveal-on-scroll elements.
 */
(function () {
    'use strict';

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // animate once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe all reveal targets once DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    });
}());
