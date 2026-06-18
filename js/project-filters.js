/*!
 * Projects filter bar — show/hide cards by data-filters token. Vanilla JS.
 */
(function () {
    'use strict';

    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var items = Array.prototype.slice.call(grid.querySelectorAll('.portfolio-item'));

    function apply(filter) {
        items.forEach(function (item) {
            var tokens = (item.dataset.filters || '').split(/\s+/);
            var show = filter === 'all' || tokens.indexOf(filter) > -1;
            item.style.display = show ? '' : 'none';
        });
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
            apply(btn.dataset.filter);
        });
    });
}());
