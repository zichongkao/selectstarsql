/**
 * Select Star SQL — Bengali Modern UI Interactions
 * Scoped strictly to .bn-layout shell elements.
 */
(function () {
  'use strict';

  function initBnMobileDrawer() {
    var menuBtn = document.getElementById('bnMenuBtn');
    var sidebar = document.getElementById('bnSidebar');
    var backdrop = document.getElementById('bnSidebarBackdrop');
    var closeBtn = document.getElementById('bnSidebarCloseBtn');

    if (!menuBtn || !sidebar || !backdrop) {
      return;
    }

    function openDrawer() {
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-visible');
      document.body.classList.add('bn-drawer-open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      document.body.classList.remove('bn-drawer-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (sidebar.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDrawer();
      });
    }

    backdrop.addEventListener('click', function () {
      closeDrawer();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Close drawer when clicking any link inside mobile sidebar (e.g. section anchor or chapter navigation)
    sidebar.addEventListener('click', function (e) {
      var target = e.target.closest('a');
      if (target && window.innerWidth < 1024) {
        closeDrawer();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBnMobileDrawer);
  } else {
    initBnMobileDrawer();
  }
})();
