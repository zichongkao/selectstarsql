// Set up DB
window.onload = loaddata;
function loaddata() {
  window.worker = new Worker("scripts/worker.sql.js");
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/processed_dataset.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = () => {
    var uInt8Array = new Uint8Array(xhr.response);
    worker.onmessage = event => {
       if (event.data.ready) {
         console.log('DB initialization successful');
         query('SELECT COUNT(*) FROM executions', (e) => {
          console.log(e[0].values[0] + ' rows loaded')});
       } else {
         console.log('DB initialization failed');
       }
    }

    worker.postMessage({
      id:1,
      action:'open',
      buffer: uInt8Array,
    });
  }
  xhr.send();
}

function query(sql, cb, err_cb) {
  if (err_cb) {
    worker.onerror = e => err_cb(e);
  } else {
    worker.onerror = e => { throw new Error(e.message); }
  }

  worker.onmessage = event => {
    cb(event.data.results);
  }
  worker.postMessage({
      id: 2,
      action: 'exec',
      sql: sql
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
      <div class="optionText">
        <label>
          <input type=checkbox name="input"
              data-correct=${dataCorrect}
              value=${value} />
            ${statement}
        </label>
      </div>
      <div class="hintSpan">${hint}</div>
    </div>
    `
    this.parentNode.querySelector('.sqlQuizOptions').innerHTML += quizoption;
  }
}

customElements.define('sql-quiz-option', sqlQuizOption);


class sqlQuiz extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var title = this.getAttribute('data-title') || '';
    var description = this.getAttribute('data-description') || '';

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlQuizHomeDiv';

    if (title) {
      var caption = `<div class="sqlQuizTitle">${title}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", caption);
    }

    if (description) {
      var commentbox = `
      <div class="sqlQuizDescription">
        ${description}
      </div>
      `
      homeDiv.insertAdjacentHTML("beforeend", commentbox);
    }

    var form = document.createElement('form');

    // Input Area
    var inputArea = document.createElement('div');
    inputArea.className = 'sqlQuizInputArea';

    var options = document.createElement('div');
    options.className = 'sqlQuizOptions';
    inputArea.appendChild(options);

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    inputArea.appendChild(submitButton);

    var hintButton = document.createElement('input');
    hintButton.name = "hint";
    hintButton.type = "button";
    hintButton.value = "Show Hints";
    hintButton.onclick = (e) => {
      document.querySelectorAll('.hintSpan').forEach(i => i.style.display = 'inline');
    };
    inputArea.appendChild(hintButton);
    form.appendChild(inputArea);

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
      var res = mistakes >= 2 ? mistakes + " mistakes" :
          mistakes == 1 ? mistakes + " mistake" : "All correct!"
      form.output.innerHTML = `<div class='returnOkay'>${res}</div>`;
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
    var question = this.getAttribute('data-question') || '';
    var comment = this.getAttribute('data-comment') || '';
    var defaultText = this.getAttribute('data-default-text') || '';
    var solution = this.getAttribute('data-solution') || '';

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlExHomeDiv';

    if (question) {
      var caption = `<div class="sqlExQuestion">${question}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", caption);
    }

    if (comment) {
      var commentbox = `<div class = 'sqlExComment'>${comment}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", commentbox);
    }

    var form = document.createElement('form');

    // Input Area
    var inputArea = document.createElement('div');
    inputArea.className = 'sqlExInputArea';

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
    editor.refresh();

    var runButton = `<input type="submit" value="Run &#x21e9;">`;
    inputArea.insertAdjacentHTML("beforeend", runButton);

    form['onsubmit'] = (e) => {
      e && e.preventDefault();
      var result_div = document.createElement('div');

      var handleSubmit = (submission_data) => {
        result_div.className = 'returnOkay';

        if (solution) {
          var verdict_div = document.createElement('div');
          result_div.appendChild(verdict_div);

          query(solution, (solution_data) => {
            var verdict = _.isEqual(submission_data, solution_data) ? "Correct" : "Incorrect";
            // http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
            verdict_div.innerText = verdict;
          });
        }
        if (submission_data.length < 0) {
          result_div.appendChild(datatable(submission_data));
        } else {
          result_div.insertAdjacentHTML("beforeend", `No data returned`);
        }
      }

      var handleError = (e) => {
        result_div.className = 'returnError';
        result_div.innerText = e.message;
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

    if (solution) {
      var solutionButton = document.createElement('input');
      solutionButton.name = 'solution';
      solutionButton.type = 'button';
      solutionButton.value = 'Show Solution';
      solutionButton.onclick = (e) => {
        var existingCode = editor.getValue();
        solution = "\n" + solution;
        editor.setValue(existingCode + solution.replace(/\n/g, '\n-- '));
      };
      inputArea.appendChild(solutionButton);
    };

    var resetButton = document.createElement('input');
    resetButton.type = 'button';
    resetButton.value = 'Reset';
    resetButton.onclick = (e) => {
      editor.setValue(defaultText);
      outputBox.textContent = '';
    };
    inputArea.appendChild(resetButton);
    form.appendChild(inputArea);

    // Output Area
    var outputArea = document.createElement('div');
    outputArea.className = 'sqlExOutputArea';

    var outputBox = document.createElement('output');
    outputBox.name = 'output';
    outputArea.appendChild(outputBox);
    form.appendChild(outputArea);

    homeDiv.appendChild(form);
    this.appendChild(homeDiv);
  }
}

customElements.define('sql-exercise', sqlExercise);
