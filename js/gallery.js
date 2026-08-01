/* ==========================================================================
   GALLERY.JS - MASONRY FILTERING & LIGHTBOX MODAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();
});

let currentGalleryIndex = 0;
let visibleGalleryItems = [];

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const items = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  function updateVisibleItems() {
    visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item'))
      .filter(item => window.getComputedStyle(item).display !== 'none');
  }

  function openLightbox(index) {
    updateVisibleItems();
    if (visibleGalleryItems.length === 0) return;

    currentGalleryIndex = index;
    const targetItem = visibleGalleryItems[currentGalleryIndex];
    const src = targetItem.getAttribute('data-src');
    const alt = targetItem.getAttribute('data-caption') || 'Foto Boda';

    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    updateVisibleItems();
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrev() {
    updateVisibleItems();
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  // Event Listeners for Gallery Items
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const visibleIndex = visibleGalleryItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
