/*!
 * Media viewer — large carousel stage + thumbnail strip + click-to-zoom modal.
 * Handles both images and videos. Vanilla JS, no dependencies.
 */
(function () {
    'use strict';

    var viewer = document.querySelector('.media-viewer');
    if (!viewer) return;

    var modal = document.querySelector('.media-modal');
    var modalStage = modal ? modal.querySelector('.media-modal-stage') : null;
    var slides = Array.prototype.slice.call(viewer.querySelectorAll('.media-slide'));
    var thumbs = Array.prototype.slice.call(viewer.querySelectorAll('.media-thumb'));
    var count = slides.length;
    if (count === 0) return;

    var current = 0;

    function wrap(i) { return (i % count + count) % count; }

    // ----- Inline stage -----
    function show(index) {
        current = wrap(index);
        slides.forEach(function (s, i) {
            var active = i === current;
            s.classList.toggle('is-active', active);
            if (!active) {
                var v = s.querySelector('video');
                if (v) { try { v.pause(); } catch (e) {} }
            }
        });
        thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === current); });
        if (thumbs[current]) {
            thumbs[current].scrollIntoView({ block: 'nearest', inline: 'center' });
        }
    }

    var prev = viewer.querySelector('.media-prev');
    var next = viewer.querySelector('.media-next');
    if (prev) prev.addEventListener('click', function () { show(current - 1); });
    if (next) next.addEventListener('click', function () { show(current + 1); });

    thumbs.forEach(function (t) {
        t.addEventListener('click', function () { show(parseInt(t.dataset.index, 10)); });
    });

    // Click the active media to open the enlarged modal.
    slides.forEach(function (s) {
        s.addEventListener('click', function () {
            openModal(parseInt(s.dataset.index, 10));
        });
    });

    // ----- Modal -----
    function buildMedia(index) {
        var slide = slides[index];
        if (slide.dataset.type === 'video') {
            var src = slide.querySelector('video');
            var v = document.createElement('video');
            v.src = src.getAttribute('src');
            if (src.getAttribute('poster')) v.setAttribute('poster', src.getAttribute('poster'));
            v.controls = true;
            v.autoplay = true;
            v.loop = true;
            v.muted = true; // render clips are silent; muting allows autoplay
            v.playsInline = true;
            v.className = 'media-modal-el';
            return v;
        }
        var img0 = slide.querySelector('img');
        var img = document.createElement('img');
        img.src = img0.getAttribute('src');
        img.alt = img0.getAttribute('alt') || '';
        img.className = 'media-modal-el';
        return img;
    }

    function renderModal(index) {
        current = wrap(index);
        modalStage.innerHTML = '';
        modalStage.appendChild(buildMedia(current));
    }

    function openModal(index) {
        if (!modal) return;
        renderModal(index);
        modal.hidden = false;
        document.body.classList.add('media-modal-open');
        requestAnimationFrame(function () { modal.classList.add('is-open'); });
    }

    function closeModal() {
        if (!modal) return;
        modal.querySelectorAll('video').forEach(function (v) { try { v.pause(); } catch (e) {} });
        modal.classList.remove('is-open');
        document.body.classList.remove('media-modal-open');
        show(current); // keep inline viewer in sync with where the user navigated
        setTimeout(function () {
            modal.hidden = true;
            modalStage.innerHTML = '';
        }, 200);
    }

    if (modal) {
        var mPrev = modal.querySelector('.media-modal-prev');
        var mNext = modal.querySelector('.media-modal-next');
        var mClose = modal.querySelector('.media-modal-close');
        var mBackdrop = modal.querySelector('.media-modal-backdrop');

        if (mPrev) mPrev.addEventListener('click', function () { renderModal(current - 1); });
        if (mNext) mNext.addEventListener('click', function () { renderModal(current + 1); });
        if (mClose) mClose.addEventListener('click', closeModal);
        if (mBackdrop) mBackdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', function (e) {
            if (modal.hidden) return;
            if (e.key === 'Escape') closeModal();
            else if (e.key === 'ArrowLeft' && mPrev) renderModal(current - 1);
            else if (e.key === 'ArrowRight' && mNext) renderModal(current + 1);
        });
    }
}());
