/* Minimal lightbox for project pages: hero and gallery images open large. No dependencies. */
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.hero-media img, .gallery figure img'));
  if (!imgs.length) return;
  var i = 0, opener = null, startX = null;

  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.hidden = true;
  box.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous image">&lsaquo;</button>' +
    '<img class="lb-img" alt="">' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next image">&rsaquo;</button>';
  document.body.appendChild(box);
  var pic = box.querySelector('.lb-img'),
      bClose = box.querySelector('.lb-close'),
      bPrev = box.querySelector('.lb-prev'),
      bNext = box.querySelector('.lb-next');
  if (imgs.length < 2) { bPrev.hidden = true; bNext.hidden = true; }

  function show(n) {
    i = (n + imgs.length) % imgs.length;
    pic.src = imgs[i].currentSrc || imgs[i].src;
    pic.alt = imgs[i].alt;
  }
  function open(n) {
    opener = imgs[n];
    show(n);
    box.hidden = false;
    document.documentElement.classList.add('lb-open');
    bClose.focus();
  }
  function close() {
    box.hidden = true;
    pic.removeAttribute('src');
    document.documentElement.classList.remove('lb-open');
    if (opener) opener.focus();
  }

  imgs.forEach(function (im, n) {
    im.classList.add('lb-trigger');
    im.tabIndex = 0;
    im.setAttribute('role', 'button');
    im.setAttribute('aria-label', 'Open image large: ' + im.alt);
    im.addEventListener('click', function () { open(n); });
    im.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });

  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  bClose.addEventListener('click', close);
  bPrev.addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
  bNext.addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && imgs.length > 1) show(i - 1);
    else if (e.key === 'ArrowRight' && imgs.length > 1) show(i + 1);
    else if (e.key === 'Tab') {
      var f = [bClose].concat(imgs.length > 1 ? [bPrev, bNext] : []);
      var k = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(k + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    }
  });

  box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null || imgs.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
