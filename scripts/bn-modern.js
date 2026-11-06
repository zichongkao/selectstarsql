/**
 * Select Star SQL — Bengali Modern UI Interactions (Phase 5)
 * Scoped strictly to .bn-layout shell and Bengali UI elements.
 */
(function () {
  'use strict';

  var THEME_KEY = 'selectstar_bn_theme';

  /* --------------------------------------------------------------------------
     BENGALI DIGIT FORMATTER HELPER
     -------------------------------------------------------------------------- */
  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  function toBnNum(value) {
    return String(value != null ? value : 0).replace(/[0-9]/g, function (digit) {
      return BN_DIGITS[Number(digit)];
    });
  }

  /* --------------------------------------------------------------------------
     1. THEME CONTROLLER (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  function initBnTheme() {
    var toggleBtn = document.getElementById('bnThemeToggle');
    var html = document.documentElement;
    var body = document.body;

    function getSavedTheme() {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch (e) {
        return null;
      }
    }

    function setSavedTheme(theme) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    }

    function applyTheme(theme) {
      var isDark = (theme === 'dark');
      if (isDark) {
        html.classList.add('bn-theme-dark');
        body.classList.add('bn-theme-dark');
      } else {
        html.classList.remove('bn-theme-dark');
        body.classList.remove('bn-theme-dark');
      }

      if (toggleBtn) {
        var label = isDark ? 'লাইট মোড চালু করুন (Switch to Light Mode)' : 'ডার্ক মোড চালু করুন (Switch to Dark Mode)';
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.setAttribute('title', label);
      }
    }

    // Determine initial theme: stored preference, existing html class, or default to light
    var currentTheme = getSavedTheme();
    if (!currentTheme) {
      currentTheme = (html && html.classList.contains('bn-theme-dark')) ? 'dark' : 'light';
    }
    applyTheme(currentTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var isCurrentlyDark = html.classList.contains('bn-theme-dark') || body.classList.contains('bn-theme-dark');
        var newTheme = isCurrentlyDark ? 'light' : 'dark';
        applyTheme(newTheme);
        setSavedTheme(newTheme);
      });
    }
  }

  /* --------------------------------------------------------------------------
     2. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
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

    sidebar.addEventListener('click', function (e) {
      var target = e.target.closest('a');
      if (target && window.innerWidth < 1024) {
        closeDrawer();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2.5 REUSABLE MODAL ACCESSIBILITY HELPERS (WCAG 2.2 AA)
     -------------------------------------------------------------------------- */
  function setBackgroundInert(isInert) {
    var bgSelectors = ['.bn-header', '.bn-shell', '.bn-footer'];
    bgSelectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      if (isInert) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }

  function trapModalFocus(modalEl, evt) {
    if (evt.key !== 'Tab') return;
    var selector = 'button:not([disabled]):not([hidden]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var all = Array.prototype.slice.call(modalEl.querySelectorAll(selector));
    var visible = all.filter(function (el) {
      var isCmTextarea = el.tagName === 'TEXTAREA' && el.closest('.CodeMirror');
      return isCmTextarea || (el.offsetParent !== null && window.getComputedStyle(el).visibility !== 'hidden');
    });
    if (visible.length === 0) {
      evt.preventDefault();
      modalEl.focus();
      return;
    }
    var first = visible[0];
    var last = visible[visible.length - 1];

    if (evt.shiftKey) {
      if (document.activeElement === first || document.activeElement === modalEl) {
        evt.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        evt.preventDefault();
        first.focus();
      }
    }
  }

  /* --------------------------------------------------------------------------
     3. DATABASE SCHEMA & TECHNICAL GLOSSARY MODAL
     -------------------------------------------------------------------------- */
  function initBnSchemaModal() {
    var schemaBtn = document.getElementById('bnSchemaBtn');
    var overlay = document.getElementById('bnSchemaModalOverlay');
    var modal = document.getElementById('bnSchemaModal');
    var backdrop = document.getElementById('bnSchemaBackdrop');
    var closeBtn = document.getElementById('bnSchemaCloseBtn');
    var bottomCloseBtn = document.getElementById('bnModalCloseBottomBtn');
    var tabs = document.querySelectorAll('.bn-modal-tab');
    var panels = document.querySelectorAll('.bn-modal-panel');
    var searchInput = document.getElementById('bnGlossarySearch');
    var clearBtn = document.getElementById('bnGlossaryClearBtn');
    var countLabel = document.getElementById('bnGlossaryCount');
    var emptyMsg = document.getElementById('bnGlossaryEmpty');
    var cards = document.querySelectorAll('.bn-glossary-card');

    if (!overlay || !modal) {
      return;
    }

    var lastFocusedElem = null;

    function openModal() {
      lastFocusedElem = document.activeElement;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('bn-modal-open');
      setBackgroundInert(true);
      modal.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('bn-modal-open');
      setBackgroundInert(false);
      if (lastFocusedElem && typeof lastFocusedElem.focus === 'function') {
        lastFocusedElem.focus();
      }
    }

    if (schemaBtn) {
      schemaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    // Support any additional trigger buttons with [data-bn-modal="schema"]
    document.querySelectorAll('[data-bn-modal="schema"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    if (bottomCloseBtn) {
      bottomCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeModal();
      });
    }

    // Keyboard support: Escape closes modal, Tab key trap
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        trapModalFocus(modal, e);
      }
    });

    // Tab switching
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('is-active');
        });

        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        if (targetId === 'dataset-tx') {
          var pTx = document.getElementById('bnTabPanelTx');
          if (pTx) pTx.classList.add('is-active');
        } else if (targetId === 'dataset-congress') {
          var pC = document.getElementById('bnTabPanelCongress');
          if (pC) pC.classList.add('is-active');
        } else if (targetId === 'glossary') {
          var pG = document.getElementById('bnTabPanelGlossary');
          if (pG) {
            pG.classList.add('is-active');
            if (searchInput) searchInput.focus();
          }
        }
      });
    });

    // Glossary Instant Search
    if (searchInput && cards.length > 0) {
      function filterGlossary() {
        var q = searchInput.value.trim().toLowerCase();
        var matchCount = 0;

        if (clearBtn) {
          clearBtn.style.display = q.length > 0 ? 'inline-flex' : 'none';
        }

        cards.forEach(function (card) {
          var term = (card.getAttribute('data-term') || '').toLowerCase();
          var bnKeywords = (card.getAttribute('data-bn') || '').toLowerCase();
          var desc = card.textContent.toLowerCase();

          if (!q || term.indexOf(q) !== -1 || bnKeywords.indexOf(q) !== -1 || desc.indexOf(q) !== -1) {
            card.style.display = 'flex';
            matchCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (countLabel) {
          if (matchCount === 0) {
            countLabel.textContent = '০টি পরিভাষা';
          } else {
            countLabel.textContent = toBnNum(matchCount) + 'টি পরিভাষা প্রদর্শিত হচ্ছে';
          }
        }

        if (emptyMsg) {
          emptyMsg.style.display = matchCount === 0 ? 'block' : 'none';
        }
      }

      searchInput.addEventListener('input', filterGlossary);

      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          searchInput.value = '';
          filterGlossary();
          searchInput.focus();
        });
      }
    }
  }

  /* --------------------------------------------------------------------------
     4. SQL SANDBOX MODAL
     -------------------------------------------------------------------------- */
  function initBnSandboxModal() {
    var sandboxBtn = document.getElementById('bnSandboxBtn');
    var overlay = document.getElementById('bnSandboxModalOverlay');
    var modal = document.getElementById('bnSandboxModal');
    var backdrop = document.getElementById('bnSandboxBackdrop');
    var closeBtn = document.getElementById('bnSandboxCloseBtn');
    var doneBtn = document.getElementById('bnSandboxDoneBtn');
    var noDbNotice = document.getElementById('bnSandboxNoDbNotice');
    var workspace = document.getElementById('bnSandboxWorkspace');
    var dbBadge = document.getElementById('bnSandboxDbBadge');
    var dbName = document.getElementById('bnSandboxDbName');
    var presetsList = document.getElementById('bnSandboxPresetsList');
    var presetSelect = document.getElementById('bnSandboxPresetSelect');
    var textarea = document.getElementById('bnSandboxTextarea');
    var runBtn = document.getElementById('bnSandboxRunBtn');
    var runBtnText = document.getElementById('bnSandboxRunBtnText');
    var clearBtn = document.getElementById('bnSandboxClearBtn');
    var resetDataBtn = document.getElementById('bnSandboxResetDataBtn');
    var confirmBanner = document.getElementById('bnSandboxResetConfirm');
    var confirmYes = document.getElementById('bnSandboxConfirmYes');
    var confirmNo = document.getElementById('bnSandboxConfirmNo');
    var initialPrompt = document.getElementById('bnSandboxInitialPrompt');
    var outputBox = document.getElementById('bnSandboxOutputBox');

    if (!overlay || !modal) return;

    var lastFocusedElem = null;
    var editor = null;
    var isExecuting = false;

    // Detect currently loaded database from body data attribute
    var rawDbFile = (document.body && document.body.getAttribute('data-db-file')) || '';
    var activeDataset = null;

    if (rawDbFile.indexOf('tx_deathrow_small.db') !== -1) {
      activeDataset = {
        name: 'টেক্সাস ডেটাসেট (Texas Executions)',
        table: 'executions',
        rows: '৫৫৩ সারি',
        badge: 'executions · ৫৫৩ সারি',
        defaultQuery: 'SELECT * FROM executions LIMIT 5;',
        presets: [
          { label: 'প্রথম ৫টি সারি (LIMIT 5)', sql: 'SELECT * FROM executions LIMIT 5;' },
          { label: 'কাউন্টি অনুযায়ী মোট (GROUP BY)', sql: 'SELECT county, COUNT(*) AS total FROM executions GROUP BY county ORDER BY total DESC LIMIT 10;' },
          { label: 'নেপোলিয়ন বিজলির তথ্য (WHERE)', sql: "SELECT first_name, last_name, ex_age, ex_date FROM executions WHERE last_name = 'Beazley';" },
          { label: 'বয়সের পরিসংখ্যান (AVG, MIN, MAX)', sql: 'SELECT ROUND(AVG(ex_age), 1) AS avg_age, MIN(ex_age) AS min_age, MAX(ex_age) AS max_age FROM executions;' }
        ]
      };
    } else if (rawDbFile.indexOf('114_congress_small.db') !== -1) {
      activeDataset = {
        name: 'মার্কিন কংগ্রেস ডেটাসেট (114th Congress)',
        table: 'cosponsors',
        rows: '১৫,৮৯৪ সারি',
        badge: 'cosponsors · ১৫,৮৯৪ সারি',
        defaultQuery: 'SELECT * FROM cosponsors LIMIT 5;',
        presets: [
          { label: 'প্রথম ৫টি বিল (LIMIT 5)', sql: 'SELECT * FROM cosponsors LIMIT 5;' },
          { label: 'অঙ্গরাজ্যভিত্তিক বিল সংখ্যা (GROUP BY)', sql: 'SELECT sponsor_state, COUNT(DISTINCT bill_number) AS total_bills FROM cosponsors GROUP BY sponsor_state ORDER BY total_bills DESC LIMIT 10;' },
          { label: 'টেক্সাসের কো-স্পন্সর (WHERE)', sql: "SELECT bill_number, sponsor_name, cosponsor_name FROM cosponsors WHERE sponsor_state = 'TX' LIMIT 10;" },
          { label: 'শীর্ষ স্পন্সরগণ (ORDER BY)', sql: 'SELECT sponsor_name, COUNT(*) AS cosponsors_count FROM cosponsors GROUP BY sponsor_name ORDER BY cosponsors_count DESC LIMIT 8;' }
        ]
      };
    }

    // Configure UI based on dataset availability
    if (!activeDataset) {
      if (noDbNotice) noDbNotice.style.display = 'flex';
      if (workspace) workspace.style.display = 'none';
      if (dbName) dbName.textContent = 'কোনো ডেটাসেট সক্রিয় নেই';
      if (dbBadge) dbBadge.classList.add('is-offline');
    } else {
      if (noDbNotice) noDbNotice.style.display = 'none';
      if (workspace) workspace.style.display = '';
      if (dbName) dbName.textContent = activeDataset.badge;
      if (dbBadge) dbBadge.classList.remove('is-offline');

      // Populate preset dropdown
      if (presetSelect) {
        presetSelect.innerHTML = '<option value="" disabled selected>নমুনা কুয়েরি (Preset Queries)...</option>';
        activeDataset.presets.forEach(function (preset) {
          var opt = document.createElement('option');
          opt.value = preset.sql;
          opt.textContent = preset.label;
          presetSelect.appendChild(opt);
        });
        presetSelect.addEventListener('change', function () {
          if (editor && presetSelect.value) {
            editor.setValue(presetSelect.value);
            editor.focus();
          }
        });
      }

      // Populate preset buttons (fallback or alternate containers)
      if (presetsList) {
        presetsList.innerHTML = '';
        activeDataset.presets.forEach(function (preset) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'bn-sandbox-preset-btn';
          btn.textContent = preset.label;
          btn.title = preset.sql;
          btn.addEventListener('click', function () {
            if (editor) {
              editor.setValue(preset.sql);
              editor.focus();
            }
          });
          presetsList.appendChild(btn);
        });
      }
    }

    // Lazy initialization of CodeMirror editor
    function ensureEditor() {
      if (editor || !textarea || typeof CodeMirror === 'undefined') return;

      var initialText = activeDataset ? activeDataset.defaultQuery : 'SELECT 1;';
      textarea.value = initialText;

      editor = CodeMirror.fromTextArea(textarea, {
        mode: 'text/x-sql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        textWrapping: false,
        autoRefresh: true,
        theme: 'neat',
        viewportMargin: Infinity
      });

      editor.setSize('100%', '100%');

      // Shift+Enter shortcut to execute query
      editor.setOption('extraKeys', {
        'Shift-Enter': function () {
          executeSandboxQuery();
        }
      });
    }

    function openModal() {
      lastFocusedElem = document.activeElement;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('bn-modal-open');
      setBackgroundInert(true);

      ensureEditor();

      // Notify worker to initialize/preserve sandboxDb
      if (typeof openSandboxDb === 'function') {
        openSandboxDb(function () {}, function () {});
      }

      setTimeout(function () {
        if (editor) {
          editor.refresh();
          editor.focus();
        } else {
          modal.focus();
        }
      }, 150);
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('bn-modal-open');
      setBackgroundInert(false);

      if (confirmBanner) confirmBanner.style.display = 'none';

      if (lastFocusedElem && typeof lastFocusedElem.focus === 'function') {
        lastFocusedElem.focus();
      }
    }

    if (sandboxBtn) {
      sandboxBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (doneBtn) {
      doneBtn.addEventListener('click', closeModal);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // If modal is already open on initial page load, ensure editor is initialized
    if (overlay.classList.contains('is-open')) {
      ensureEditor();
    }

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (confirmBanner && confirmBanner.style.display !== 'none') {
          confirmBanner.style.display = 'none';
          if (resetDataBtn) resetDataBtn.focus();
        } else {
          closeModal();
        }
        return;
      }

      if (e.key === 'Tab') {
        trapModalFocus(modal, e);
      }
    });

    // Execute Sandbox Query
    function executeSandboxQuery() {
      if (isExecuting || !editor) return;
      var sql = editor.getValue().trim();
      if (!sql) return;

      isExecuting = true;
      if (runBtn) runBtn.disabled = true;
      if (runBtnText) runBtnText.textContent = 'চালানো হচ্ছে...';
      if (initialPrompt) initialPrompt.style.display = 'none';

      if (outputBox) {
        outputBox.innerHTML = '';
      }

      var resultContainer = document.createElement('div');
      resultContainer.className = 'bn-sandbox-result-container';

      var startTime = performance.now();

      function onQuerySuccess(results) {
        isExecuting = false;
        if (runBtn) runBtn.disabled = false;
        if (runBtnText) runBtnText.textContent = 'কুয়েরি চালান';

        var duration = Math.round(performance.now() - startTime);
        var hasRows = results && results.length > 0 && results[0].values && results[0].values.length > 0;
        var rowCount = hasRows ? results[0].values.length : 0;
        var formattedCount;
        try {
          formattedCount = typeof toBnNum === 'function' ? toBnNum(rowCount) : String(rowCount);
        } catch (fmtErr) {
          formattedCount = String(rowCount);
        }

        // Result Meta Header
        var header = document.createElement('div');
        header.className = 'sqlResultHeader';

        var meta = document.createElement('div');
        meta.className = 'sqlResultMeta';
        meta.innerHTML = '<span class="sqlResultTitle">QUERY RESULT</span> <span class="sqlRowCountBadge">' + formattedCount + ' ROWS (' + duration + ' ms)</span>';
        header.appendChild(meta);

        var statusBadge = document.createElement('div');
        statusBadge.className = 'sqlVerdict verdictCorrect';
        statusBadge.textContent = '✓ সফল (Success)';
        header.appendChild(statusBadge);

        resultContainer.appendChild(header);

        if (hasRows) {
          var tableWrap = document.createElement('div');
          tableWrap.className = 'sqlTableWrapper';
          if (typeof datatable === 'function') {
            tableWrap.appendChild(datatable(results));
          }
          resultContainer.appendChild(tableWrap);
        } else {
          var emptyDiv = document.createElement('div');
          emptyDiv.className = 'sqlEmptyResult';
          emptyDiv.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg><span>কুয়েরি সফলভাবে সম্পন্ন হয়েছে (কোনো সারি রিটার্ন করেনি / ০ টি সারি)</span>';
          resultContainer.appendChild(emptyDiv);
        }

        if (outputBox) {
          outputBox.appendChild(resultContainer);
        }
      }

      function onQueryError(err) {
        isExecuting = false;
        if (runBtn) runBtn.disabled = false;
        if (runBtnText) runBtnText.textContent = 'কুয়েরি চালান';

        var errDiv = document.createElement('div');
        errDiv.className = 'returnError';

        var errHeader = document.createElement('div');
        errHeader.className = 'sqlErrorHeader';
        errHeader.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span>SQL ERROR</span>';
        errDiv.appendChild(errHeader);

        var errMsg = document.createElement('div');
        errMsg.className = 'sqlErrorMessage';
        errMsg.textContent = err && err.message ? err.message : String(err);
        errDiv.appendChild(errMsg);

        resultContainer.appendChild(errDiv);

        if (outputBox) {
          outputBox.appendChild(resultContainer);
        }
      }

      if (typeof querySandbox === 'function') {
        querySandbox(sql, onQuerySuccess, onQueryError);
      } else {
        onQueryError({ message: 'querySandbox function not available' });
      }
    }

    if (runBtn) {
      runBtn.addEventListener('click', executeSandboxQuery);
    }

    // Clear editor
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (editor) {
          editor.setValue('');
          editor.focus();
        }
        if (presetSelect) presetSelect.selectedIndex = 0;
        if (outputBox) outputBox.innerHTML = '';
        if (initialPrompt) initialPrompt.style.display = 'flex';
      });
    }

    // Reset Sandbox Data confirmation workflow
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', function () {
        if (confirmBanner) confirmBanner.style.display = 'flex';
      });
    }

    if (confirmNo) {
      confirmNo.addEventListener('click', function () {
        if (confirmBanner) confirmBanner.style.display = 'none';
      });
    }

    if (confirmYes) {
      confirmYes.addEventListener('click', function () {
        if (typeof resetSandboxDb === 'function') {
          confirmYes.disabled = true;
          confirmYes.textContent = 'রিসেট করা হচ্ছে...';
          resetSandboxDb(function () {
            confirmYes.disabled = false;
            confirmYes.textContent = 'হ্যাঁ, ডেটা রিসেট করুন';
            if (confirmBanner) confirmBanner.style.display = 'none';

            if (editor && activeDataset) {
              editor.setValue(activeDataset.defaultQuery);
              editor.refresh();
            }
            if (presetSelect) presetSelect.selectedIndex = 0;
            if (outputBox) outputBox.innerHTML = '';

            var successNotice = document.createElement('div');
            successNotice.className = 'bn-sandbox-reset-notice';
            successNotice.textContent = '✓ স্যান্ডবক্স ডেটাবেস মূল অবস্থায় সফলভাবে পুনর্স্থাপিত হয়েছে।';
            if (outputBox) outputBox.appendChild(successNotice);

            setTimeout(function () {
              if (successNotice.parentNode) successNotice.parentNode.removeChild(successNotice);
              if (initialPrompt && (!outputBox || !outputBox.hasChildNodes())) {
                initialPrompt.style.display = 'flex';
              }
            }, 3000);
          }, function (err) {
            confirmYes.disabled = false;
            confirmYes.textContent = 'হ্যাঁ, ডেটা রিসেট করুন';
            alert('রিসেট ব্যর্থ: ' + (err.message || err));
          });
        }
      });
    }

    window.addEventListener('resize', function () {
      if (overlay.classList.contains('is-open') && editor) {
        editor.refresh();
      }
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZE ON DOM READY
     -------------------------------------------------------------------------- */
  function initAll() {
    initBnTheme();
    initBnMobileDrawer();
    initBnSchemaModal();
    initBnSandboxModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
