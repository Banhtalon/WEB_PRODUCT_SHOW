(() => {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const fullButton = document.getElementById('full');
  const counter = document.getElementById('counter');
  const progressBar = document.getElementById('progressBar');

  if (!slides.length || !prevButton || !nextButton || !fullButton || !counter || !progressBar) {
    console.error('Không tìm thấy thành phần điều khiển trình chiếu. Vui lòng kiểm tra index.html.');
    return;
  }

  let currentIndex = 0;
  let touchStartX = null;

  function showSlide(requestedIndex) {
    currentIndex = Math.max(0, Math.min(slides.length - 1, requestedIndex));

    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    document.title = `${currentIndex + 1}/${slides.length} · Ẩm thực Việt Nam`;
  }

  prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Trình duyệt không cho phép đổi chế độ toàn màn hình:', error);
    }
  }

  fullButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullButton.textContent = document.fullscreenElement ? '⤢' : '⛶';
    fullButton.setAttribute('aria-label', document.fullscreenElement ? 'Thoát toàn màn hình' : 'Bật toàn màn hình');
    fullButton.title = document.fullscreenElement ? 'Thoát toàn màn hình' : 'Toàn màn hình';
  });

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const tagName = event.target?.tagName?.toLowerCase();
    if (['input', 'textarea', 'select', 'button'].includes(tagName)) {
      if (event.target === prevButton || event.target === nextButton) {
        // Let the arrow shortcuts work even if a navigation button has focus.
      } else {
        return;
      }
    }

    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex - 1);
    } else if (event.key === 'Home') {
      showSlide(0);
    } else if (event.key === 'End') {
      showSlide(slides.length - 1);
    } else if (event.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  const presentation = document.getElementById('presentation');
  presentation?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.screenX ?? null;
  }, { passive: true });

  presentation?.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0]?.screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 60) showSlide(currentIndex + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  showSlide(0);
})();
