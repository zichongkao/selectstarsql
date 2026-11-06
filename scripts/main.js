// ==========================================
// Centralized Web Worker Dispatcher & DB Setup
// ==========================================
var _queryIdCounter = 0;
var _pendingCallbacks = new Map();

function _initWorkerDispatcher(w) {
  if (!w) return;

  w.onmessage = function (event) {
    var data = event.data;
    if (!data) return;

    var reqId = data.id;
    if (reqId && _pendingCallbacks.has(reqId)) {
      var entry = _pendingCallbacks.get(reqId);
      _pendingCallbacks.delete(reqId);

      if (data.error) {
        if (entry.err_cb) {
          try {
            entry.err_cb(data.error);
          } catch (callbackErr) {
            console.error('Error in error callback for request', reqId, callbackErr);
          }
        } else {
          console.error('Unhandled SQL Error for request', reqId, data.error);
        }
      } else {
        if (entry.cb) {
          try {
            entry.cb(data.results !== undefined ? data.results : data);
          } catch (callbackErr) {
            console.error('Error in success callback for request', reqId, callbackErr);
          }
        }
      }
    }
  };

  w.onerror = function (e) {
    console.error('Fatal Web Worker Error:', e);
    _pendingCallbacks.forEach(function (entry, id) {
      if (entry.err_cb) {
        try {
          entry.err_cb({ message: e && e.message ? e.message : 'Fatal Web Worker Error' });
        } catch (err) {}
      }
    });
    _pendingCallbacks.clear();
  };
}

function loadData(dbFile) {
  if (!dbFile) { return; }
  window.worker = new Worker("/scripts/worker.sql.js");
  _initWorkerDispatcher(window.worker);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', dbFile, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = () => {
    var uInt8Array = new Uint8Array(xhr.response);

    var openReqId = ++_queryIdCounter;
    _pendingCallbacks.set(openReqId, {
      cb: function (eventData) {
        if (eventData && eventData.ready) {
          query('SELECT 1', (e) => {
            console.log('DB initialization successful');
            window.SELECT_STAR_DB_READY = true;
            document.querySelectorAll("input.sql-exercise-submit, button.sql-exercise-submit").forEach(
              (button) => { button.disabled = false; });
            document.dispatchEvent(new CustomEvent('selectstar:db-ready', { detail: { dbFile: dbFile } }));
          });
        } else {
          console.log('DB initialization failed');
        }
      },
      err_cb: function (err) {
        console.error('DB initialization failed:', err);
      }
    });

    worker.postMessage({
      id: openReqId,
      action: 'open',
      buffer: uInt8Array,
    });
  };
  xhr.send();
}

function query(sql, cb, err_cb) {
  if (!window.worker) {
    if (err_cb) err_cb({ message: 'Database engine not initialized' });
    return;
  }
  var qId = ++_queryIdCounter;
  _pendingCallbacks.set(qId, {
    cb: cb,
    err_cb: err_cb || function (e) { throw new Error(e && e.message ? e.message : String(e)); }
  });

  worker.postMessage({
    id: qId,
    action: 'exec',
    sql: sql
  });
}

function querySandbox(sql, cb, err_cb) {
  if (!window.worker) {
    if (err_cb) err_cb({ message: 'Database engine not initialized' });
    return;
  }
  var qId = ++_queryIdCounter;
  _pendingCallbacks.set(qId, {
    cb: cb,
    err_cb: err_cb || function (e) { console.error('Sandbox SQL Error:', e); }
  });

  worker.postMessage({
    id: qId,
    action: 'sandbox_exec',
    sql: sql
  });
}

function openSandboxDb(cb, err_cb) {
  if (!window.worker) {
    if (err_cb) err_cb({ message: 'Database engine not initialized' });
    return;
  }
  var qId = ++_queryIdCounter;
  _pendingCallbacks.set(qId, {
    cb: cb,
    err_cb: err_cb || function (e) { console.error('Sandbox Open Error:', e); }
  });

  worker.postMessage({
    id: qId,
    action: 'sandbox_open'
  });
}

function resetSandboxDb(cb, err_cb) {
  if (!window.worker) {
    if (err_cb) err_cb({ message: 'Database engine not initialized' });
    return;
  }
  var qId = ++_queryIdCounter;
  _pendingCallbacks.set(qId, {
    cb: cb,
    err_cb: err_cb || function (e) { console.error('Sandbox Reset Error:', e); }
  });

  worker.postMessage({
    id: qId,
    action: 'sandbox_reset'
  });
}

function datatable (data) {
  var tbl = document.createElement("table");
  tbl.className = 'datatable'

  var header_labels = data[0].columns;
  for (var idx in header_labels) {
    var col = document.createElement('col');
    col.className = header_labels[idx];
    tbl.appendChild(col);
  }

  // create header row
  var thead = tbl.createTHead();
  var row = thead.insertRow(0);
  for (var idx in header_labels) {
    var cell = row.insertCell(idx);
    cell.innerHTML = header_labels[idx];
  }

  // fill table body
  var tbody = document.createElement("tbody");
  for (var row_idx in data[0]['values']) {
    var body_row = tbody.insertRow();
    for (var header_idx in header_labels) {
      var body_cell = body_row.insertCell();
      body_cell.appendChild(document.createTextNode(data[0]['values'][row_idx][header_idx]));
    }
  }
  tbl.appendChild(tbody);
  return tbl;
}


//////////////////////////
// Localization Dictionary
//////////////////////////

var I18N = {
  en: {
    checkAnswers: 'Check Answers',
    showExplanations: 'Show Explanations',
    allCorrect: 'All correct!',
    mistakeCount: function(n) {
      return n === 1 ? '1 mistake' : n + ' mistakes';
    },
    run: 'Run &#x21e9;',
    correct: 'Correct',
    incorrect: 'Incorrect',
    noDataReturned: 'No data returned',
    showSolution: 'Show Solution',
    reset: 'Reset'
  },
  bn: {
    checkAnswers: 'উত্তর যাচাই করুন',
    showExplanations: 'ব্যাখ্যা দেখুন',
    allCorrect: 'সব উত্তর সঠিক!',
    mistakeCount: function(n) {
      var bnDigits = '০১২৩৪৫৬৭৮৯';
      var bnNum = String(n).replace(/\d/g, function(d) { return bnDigits[d]; });
      return bnNum + 'টি ভুল';
    },
    run: '▷  চালান',
    correct: 'সঠিক উত্তর',
    incorrect: 'ভুল উত্তর',
    noDataReturned: 'কোনো ফলাফল পাওয়া যায়নি',
    showSolution: '💡  সমাধান দেখুন',
    reset: '↺  রিসেট'
  }
};

function getLocale() {
  var lang = (document.documentElement && document.documentElement.lang) || 'en';
  var prefix = lang.toLowerCase().split('-')[0];
  if (prefix === 'bn') {
    return I18N.bn;
  }
  return I18N.en;
}


//////////////////////////
// SQL Quiz Component
//////////////////////////

function setdiff(a, b) { // https://stackoverflow.com/a/36504668
  var seta = new Set(a);
  var setb = new Set(b);
  var res = new Set([...seta].filter(x => !setb.has(x)));
  return res
}

class sqlQuizOption extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var value = this.getAttribute('data-value') || ''
    var statement = this.getAttribute('data-statement') || '';
    var dataCorrect = this.getAttribute('data-correct') || false;
    var hint = this.getAttribute('data-hint') || '';

    var quizoption = `
    <div class='sqlOption'>
      <label>
        <input type=checkbox name="input"
            data-correct=${dataCorrect}
            value=${value} />
          <div class="optionText">
            ${statement}
            <div class="hintSpan">${hint}</div>
          </div>
      </label>
    </div>
    `
    this.parentNode.querySelector('.sqlQuizOptions').insertAdjacentHTML("beforeend", quizoption);
  }
}

customElements.define('sql-quiz-option', sqlQuizOption);


class sqlQuiz extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var t = getLocale();
    var title = this.getAttribute('data-title') || '';
    var enTitle = this.getAttribute('data-en-title') || '';
    var description = this.getAttribute('data-description') || '';
    var enDescription = this.getAttribute('data-en-description') || '';

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlQuizHomeDiv';

    var isBn = (document.documentElement && document.documentElement.lang === 'bn');

    if (isBn) {
      if (title || enTitle) {
        var qHeader = `
          <div class="sqlQuizCardHeader">
            <span class="sqlQuizBadge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              কুইজ • SQL QUIZ
            </span>
          </div>
        `;
        homeDiv.insertAdjacentHTML("beforeend", qHeader);

        if (title && enTitle) {
          var bilingualBox = `
            <div class="sqlQuizBilingualQuestion">
              <div class="sqlQuizQuestionBn">
                <span class="sqlQuizLangBadge">বাংলা প্রশ্ন</span>
                <div class="sqlQuizQuestionText">${title}</div>
              </div>
              <div class="sqlQuizQuestionDivider"></div>
              <div class="sqlQuizQuestionEn">
                <span class="sqlQuizLangBadge">ENGLISH QUESTION</span>
                <div class="sqlQuizQuestionText">${enTitle}</div>
              </div>
            </div>
          `;
          homeDiv.insertAdjacentHTML("beforeend", bilingualBox);
        } else {
          var singleBox = `
            <div class="sqlQuizQuestionSingle">
              <div class="sqlQuizQuestionText">${title || enTitle}</div>
            </div>
          `;
          homeDiv.insertAdjacentHTML("beforeend", singleBox);
        }
      }

      if (description || enDescription) {
        var descHtml = '';
        if (description && enDescription) {
          descHtml = `
            <div class="sqlQuizBilingualDesc">
              <div class="sqlQuizDescBn">${description}</div>
              <div class="sqlQuizDescEn">${enDescription}</div>
            </div>
          `;
        } else {
          descHtml = description || enDescription;
        }
        var commentbox = `<div class="sqlQuizDescription">${descHtml}</div>`;
        homeDiv.insertAdjacentHTML("beforeend", commentbox);
      }
    } else {
      if (title || enTitle) {
        var captionHtml = title || enTitle;
        var caption = `<div class="sqlQuizTitle">${captionHtml}</div>`;
        homeDiv.insertAdjacentHTML("beforeend", caption);
      }

      if (description || enDescription) {
        var commentbox = `<div class="sqlQuizDescription">${description || enDescription}</div>`;
        homeDiv.insertAdjacentHTML("beforeend", commentbox);
      }
    }

    var form = document.createElement('form');

    if (isBn) {
      // Options container
      var options = document.createElement('div');
      options.className = 'sqlQuizOptions';
      form.appendChild(options);

      // Dedicated Toolbar for Buttons
      var toolbar = document.createElement('div');
      toolbar.className = 'sqlQuizToolbar';

      var submitButton = document.createElement('button');
      submitButton.name = 'check';
      submitButton.type = 'submit';
      submitButton.className = 'sqlQuizSubmit sqlBtnPrimary';
      submitButton.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>উত্তর যাচাই করুন</span>
      `;
      toolbar.appendChild(submitButton);

      var hintButton = document.createElement('button');
      hintButton.name = "hint";
      hintButton.type = "button";
      hintButton.className = 'sqlQuizHint sqlBtnSecondary';
      hintButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>
        <span>ব্যাখ্যা দেখুন</span>
      `;
      hintButton.onclick = (e) => {
        document.querySelectorAll('.hintSpan').forEach(i => i.style.display = 'block');
      };
      toolbar.appendChild(hintButton);
      form.appendChild(toolbar);
    } else {
      var inputArea = document.createElement('div');
      inputArea.className = 'sqlQuizInputArea';

      var options = document.createElement('div');
      options.className = 'sqlQuizOptions';
      inputArea.appendChild(options);

      var submitButton = document.createElement('input');
      submitButton.name = 'check';
      submitButton.type = 'submit';
      submitButton.className = 'sqlQuizSubmit';
      submitButton.value = t.checkAnswers;
      inputArea.appendChild(submitButton);

      var hintButton = document.createElement('input');
      hintButton.name = "hint";
      hintButton.type = "button";
      hintButton.className = 'sqlQuizHint';
      hintButton.value = t.showExplanations;
      hintButton.onclick = (e) => {
        document.querySelectorAll('.hintSpan').forEach(i => i.style.display = 'table-row');
      };
      inputArea.appendChild(hintButton);
      form.appendChild(inputArea);
    }

    // Output Area
    var outputArea = document.createElement('div');
    outputArea.className = 'sqlQuizOutputArea';

    var outputBox = document.createElement('output');
    outputBox.name = 'output';
    outputArea.appendChild(outputBox);

    // Link everything together
    form.appendChild(outputArea);
    form['onsubmit'] = (e) => {
      e && e.preventDefault();
      var value = Array.prototype.filter.call(form.input, i => i.checked).map(i => i.value);
      var correct = Array.prototype.filter.call(form.input, i => i.dataset.correct === "true").map(i => i.value);
      var mistakes = setdiff(correct, value).size + setdiff(value, correct).size;
      var isAllCorrect = mistakes === 0;
      var res = mistakes >= 1 ? t.mistakeCount(mistakes) : t.allCorrect;
      var verdictClass = isAllCorrect ? 'quizVerdictSuccess' : 'quizVerdictError';
      var verdictIcon = isAllCorrect ? '✓ ' : '✕ ';
      form.output.innerHTML = `<div class='returnOkay ${verdictClass}'>${verdictIcon}${res}</div>`;
    };

    homeDiv.append(form);
    this.append(homeDiv);
  }
}
customElements.define('sql-quiz', sqlQuiz);

//////////////////////////
// SQL Exercise Component
//////////////////////////

class sqlExercise extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var t = getLocale();
    var question = this.getAttribute('data-question') || '';
    var enQuestion = this.getAttribute('data-en-question') || '';
    var comment = this.getAttribute('data-comment') || '';
    var defaultText = this.getAttribute('data-default-text') || '';
    var solution = this.getAttribute('data-solution') || '';
    var orderSensitive = this.getAttribute('data-orderSensitive') || false;

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlExHomeDiv';

    var isBn = (document.documentElement && document.documentElement.lang === 'bn');

    if (isBn) {
      if (question || enQuestion) {
        var qSec = document.createElement('div');
        qSec.className = 'sqlExQuestionSection';

        var qHeader = `
          <div class="sqlExCardHeader">
            <span class="sqlExBadge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              অনুশীলনী • SQL PRACTICE
            </span>
          </div>
        `;
        qSec.insertAdjacentHTML("beforeend", qHeader);

        if (question && enQuestion) {
          var bilingualBox = `
            <div class="sqlExBilingualQuestion">
              <div class="sqlExQuestionBn">
                <span class="sqlExLangBadge">বাংলা প্রশ্ন</span>
                <div class="sqlExQuestionText">${question}</div>
              </div>
              <div class="sqlExQuestionDivider"></div>
              <div class="sqlExQuestionEn">
                <span class="sqlExLangBadge">ENGLISH QUESTION</span>
                <div class="sqlExQuestionText">${enQuestion}</div>
              </div>
            </div>
          `;
          qSec.insertAdjacentHTML("beforeend", bilingualBox);
        } else {
          var singleBox = `
            <div class="sqlExQuestionSingle">
              <div class="sqlExQuestionText">${question || enQuestion}</div>
            </div>
          `;
          qSec.insertAdjacentHTML("beforeend", singleBox);
        }

        if (comment) {
          var commentBox = `
            <div class="sqlExCommentText">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>${comment}</span>
            </div>
          `;
          qSec.insertAdjacentHTML("beforeend", commentBox);
        }

        homeDiv.appendChild(qSec);
      }
    } else {
      if (question || enQuestion) {
        var caption = `<div class="sqlExQuestion">${question || enQuestion}</div>`;
        homeDiv.insertAdjacentHTML("beforeend", caption);
      }
      if (comment) {
        var commentbox = `<div class = 'sqlExComment'>${comment}</div>`;
        homeDiv.insertAdjacentHTML("beforeend", commentbox);
      }
    }

    var form = document.createElement('form');

    // Input Area
    var inputArea = document.createElement('div');
    inputArea.className = 'sqlExInputArea';

    if (isBn) {
      var editorHeader = document.createElement('div');
      editorHeader.className = 'sqlExEditorHeader';
      editorHeader.innerHTML = `
        <div class="sqlExEditorTitle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
          <span>SQL EDITOR</span>
        </div>
        <div class="sqlExEngineBadge">
          <span class="sqlExEngineDot"></span>
          <span>SQLite</span>
        </div>
      `;
      inputArea.appendChild(editorHeader);
    }

    var textArea = document.createElement('textarea');
    textArea.textContent = defaultText;
    textArea.name = 'input';
    inputArea.appendChild(textArea);

    var editor = CodeMirror.fromTextArea(textArea, {
      mode: 'text/x-sql',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      textWrapping: false,
      autoRefresh: true,
      theme: 'neat',
      viewportMargin: Infinity
    });

    editor.setSize('100%', 'auto');

    if (isBn) {
      var toolbar = document.createElement('div');
      toolbar.className = 'sqlExToolbar';

      var toolbarLeft = document.createElement('div');
      toolbarLeft.className = 'sqlExToolbarLeft';

      var runButton = document.createElement('button');
      runButton.className = 'sql-exercise-submit sqlBtnPrimary';
      runButton.type = 'submit';
      runButton.disabled = true;
      runButton.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>কুয়েরি চালান</span>
        <span class="sqlBtnKbdHint">(Shift+Enter)</span>
      `;
      toolbarLeft.appendChild(runButton);

      if (solution) {
        var solutionButton = document.createElement('button');
        solutionButton.name = 'solution';
        solutionButton.type = 'button';
        solutionButton.className = 'sqlBtnSecondary';
        solutionButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>সমাধান দেখুন</span>
        `;
        solutionButton.onclick = (e) => {
          var existingCode = editor.getValue();
          editor.setValue(existingCode + "\n/* " + solution);
        };
        toolbarLeft.appendChild(solutionButton);
      }
      toolbar.appendChild(toolbarLeft);

      var toolbarRight = document.createElement('div');
      toolbarRight.className = 'sqlExToolbarRight';

      var resetButton = document.createElement('button');
      resetButton.name = 'reset';
      resetButton.type = 'button';
      resetButton.className = 'sqlBtnTertiary';
      resetButton.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        <span>রিসেট</span>
      `;
      resetButton.onclick = (e) => {
        editor.setValue(defaultText);
        outputBox.innerHTML = '';
      };
      toolbarRight.appendChild(resetButton);

      toolbar.appendChild(toolbarRight);
      inputArea.appendChild(toolbar);
    } else {
      var runButton = `<input class="sql-exercise-submit" type="submit" value="${t.run}" disabled>`;
      inputArea.insertAdjacentHTML("beforeend", runButton);
      if (solution) {
        var solutionButton = document.createElement('input');
        solutionButton.name = 'solution';
        solutionButton.type = 'button';
        solutionButton.value = t.showSolution;
        solutionButton.onclick = (e) => {
          var existingCode = editor.getValue();
          editor.setValue(existingCode + "\n/* " + solution);
        };
        inputArea.appendChild(solutionButton);
      }
      var resetButton = document.createElement('input');
      resetButton.name = 'reset';
      resetButton.type = 'button';
      resetButton.value = t.reset;
      resetButton.onclick = (e) => {
        editor.setValue(defaultText);
        outputBox.textContent = '';
      };
      inputArea.appendChild(resetButton);
    }
    form.appendChild(inputArea);

    // Output Area
    var outputArea = document.createElement('div');
    outputArea.className = 'sqlExOutputArea';

    var outputBox = document.createElement('output');
    outputBox.name = 'output';
    outputArea.appendChild(outputBox);
    form.appendChild(outputArea);

    form['onsubmit'] = (e) => {
      e && e.preventDefault();
      var result_div = document.createElement('div');

      var handleSubmit = (submission_data) => {
        result_div.className = 'returnOkay';
        var rowCount = (submission_data && submission_data[0] && submission_data[0].values) ? submission_data[0].values.length : 0;

        if (isBn) {
          var resultHeader = document.createElement('div');
          resultHeader.className = 'sqlResultHeader';

          var resultMeta = document.createElement('div');
          resultMeta.className = 'sqlResultMeta';
          resultMeta.innerHTML = `<span class="sqlResultTitle">QUERY RESULT</span> <span class="sqlRowCountBadge">${rowCount} ROWS</span>`;
          resultHeader.appendChild(resultMeta);

          if (solution) {
            var verdict_div = document.createElement('div');
            verdict_div.className = 'sqlVerdict sqlVerdictChecking';
            verdict_div.innerText = 'যাচাই করা হচ্ছে...';
            resultHeader.appendChild(verdict_div);

            query(solution, (solution_data) => {
              var submission_u = submission_data[0].values;
              var solution_u = solution_data[0].values;
              if (!orderSensitive) {
                  submission_u.sort();
                  solution_u.sort();
              }
              var isCorrect = arraysEqual(submission_u, solution_u);
              var verdict = isCorrect ? 'সঠিক উত্তর (Correct)' : 'ভুল উত্তর (Incorrect)';
              verdict_div.className = 'sqlVerdict ' + (isCorrect ? 'verdictCorrect' : 'verdictIncorrect');
              verdict_div.innerText = (isCorrect ? '✓ ' : '✕ ') + verdict;
            });
          }
          result_div.appendChild(resultHeader);

          if (submission_data.length > 0 && rowCount > 0) {
            var tableWrapper = document.createElement('div');
            tableWrapper.className = 'sqlTableWrapper';
            tableWrapper.appendChild(datatable(submission_data));
            result_div.appendChild(tableWrapper);
          } else {
            result_div.innerHTML += `<div class="sqlEmptyResult"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg><span>${t.noDataReturned} (০ টি সারি)</span></div>`;
          }
        } else {
          if (solution) {
            var verdict_div = document.createElement('div');
            result_div.appendChild(verdict_div);

            query(solution, (solution_data) => {
              var submission_u = submission_data[0].values;
              var solution_u = solution_data[0].values;
              if (!orderSensitive) {
                  submission_u.sort();
                  solution_u.sort();
              }
              var isCorrect = arraysEqual(submission_u, solution_u);
              var verdict = isCorrect ? t.correct : t.incorrect;
              verdict_div.className = 'sqlVerdict ' + (isCorrect ? 'verdictCorrect' : 'verdictIncorrect');
              verdict_div.innerText = (isCorrect ? '✓ ' : '✕ ') + verdict;
            });
          }
          if (submission_data.length > 0) {
            result_div.appendChild(datatable(submission_data));
          } else {
            result_div.insertAdjacentHTML("beforeend", t.noDataReturned);
          }
        }
      }

      var handleError = (e) => {
        result_div.className = 'returnError';
        if (isBn) {
          result_div.textContent = '';
          var errorHeader = document.createElement('div');
          errorHeader.className = 'sqlErrorHeader';
          errorHeader.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span>SQL ERROR</span>';
          result_div.appendChild(errorHeader);

          var errorMsg = document.createElement('div');
          errorMsg.className = 'sqlErrorMessage';
          errorMsg.textContent = e && e.message ? e.message : String(e);
          result_div.appendChild(errorMsg);
        } else {
          result_div.innerText = e.message;
        }
      }

      query(editor.getValue(), handleSubmit, handleError);
      outputBox.innerHTML = '';
      outputBox.appendChild(result_div);
    };

    form['onkeydown'] = (e) => {
      if (e.keyCode == 13 && e.shiftKey) {
        e.preventDefault();
        form.onsubmit();
      };
    };

    homeDiv.appendChild(form);
    this.appendChild(homeDiv);
    setTimeout(function() {
      editor.refresh();
    }, 1);
  }
}
customElements.define('sql-exercise', sqlExercise);


//////////////////////////
// Utility functions
//////////////////////////

function arraysEqual(a,b) {
  /*
  https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  Array-aware equality checker:
  Returns whether arguments a and b are == to each other;
  however if they are equal-lengthed arrays, returns whether their
  elements are pairwise == to each other recursively under this
  definition.
  */
  if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) { // assert same length
      return false;
    }
    for (var i=0; i<a.length; i++) { // assert each element equal
      if (!arraysEqual(a[i],b[i]))
        return false;
    }
    return true;
  } else {
    return a == b;  // if not both arrays, should be the same
  }
}
