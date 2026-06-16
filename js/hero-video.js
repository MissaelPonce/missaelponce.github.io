(function () {
    'use strict';

    var video = document.getElementById('hero-video');
    if (!video) return;

    // Respect reduced motion: leave the video without a src so the
    // CSS poster (header background-image) is all that ever shows.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var sources = [video.dataset.src1, video.dataset.src2];
    var current = 0;

    function playNext() {
        video.src = sources[current];
        current = (current + 1) % sources.length;
        video.load();
        video.play().catch(function () {
            // Autoplay can be blocked (e.g. low-power mode) — poster stays visible.
        });
    }

    video.addEventListener('ended', playNext);
    playNext();
})();
