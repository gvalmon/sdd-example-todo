const {
  add,
  clearCompleted,
  editTitle,
  remove,
  setFilter,
  toggle,
  visibleTodos,
} = window.todoState;

const { load: loadStorage, save: saveStorage } = window.todoStorage;

const loaded = loadStorage();
let state = loaded.state;
let editingId = null;
let storageNotice = loaded.error;

const inputRegion = document.querySelector("#todo-input");
const listRegion = document.querySelector("#todo-list");
const footerRegion = document.querySelector("#todo-footer");
const noticeRegion = document.querySelector("#storage-notice");

renderInput();
render();

const newTodoInput = document.querySelector("#new-todo");
newTodoInput.focus();

inputRegion.addEventListener("keydown", (event) => {
  if (event.target.id !== "new-todo" || event.key !== "Enter") {
    return;
  }

  const nextState = add(state, event.target.value, {
    id: createTodoId(),
    now: currentTimestamp(),
  });

  if (nextState !== state) {
    event.target.value = "";
    commitState(nextState);
  }

  document.querySelector("#new-todo").focus();
});

listRegion.addEventListener("click", (event) => {
  const toggleButton = event.target.closest(".todo-toggle");
  if (toggleButton) {
    commitState(toggle(state, toggleButton.dataset.todoId, { now: currentTimestamp() }));
    return;
  }

  const deleteButton = event.target.closest(".todo-delete");
  if (deleteButton) {
    commitState(remove(state, deleteButton.dataset.todoId));
  }
});

listRegion.addEventListener("dblclick", (event) => {
  const title = event.target.closest(".todo-title");
  if (!title) {
    return;
  }

  enterEditMode(title.dataset.todoId);
});

listRegion.addEventListener("keydown", (event) => {
  if (event.target.classList.contains("todo-title") && isActivationKey(event.key)) {
    event.preventDefault();
    enterEditMode(event.target.dataset.todoId);
    return;
  }

  if (!event.target.classList.contains("todo-edit")) {
    return;
  }

  if (event.key === "Enter") {
    commitEdit(event.target);
  }

  if (event.key === "Escape") {
    editingId = null;
    render();
  }
});

listRegion.addEventListener(
  "blur",
  (event) => {
    if (
      event.target.classList.contains("todo-edit") &&
      event.target.dataset.todoId === editingId
    ) {
      commitEdit(event.target);
    }
  },
  true,
);

footerRegion.addEventListener("click", (event) => {
  const filterButton = event.target.closest(".filter-btn");
  if (filterButton) {
    commitState(setFilter(state, filterButton.dataset.filter));
    return;
  }

  if (event.target.closest("#clear-completed")) {
    commitState(clearCompleted(state));
  }
});

function commitState(nextState) {
  if (nextState !== state) {
    state = nextState;
    const { error } = saveStorage(state);
    storageNotice = error;
  }
  editingId = null;
  render();
}

function render() {
  renderNotice();
  renderList();
  renderFooter();
}

function renderNotice() {
  if (storageNotice) {
    noticeRegion.textContent = storageNotice;
    noticeRegion.hidden = false;
  } else {
    noticeRegion.textContent = "";
    noticeRegion.hidden = true;
  }
}

function renderInput() {
  inputRegion.innerHTML = `
    <label class="visually-hidden" for="new-todo">New todo</label>
    <input id="new-todo" type="text" autocomplete="off" placeholder="What needs doing?">
  `;
}

function renderList() {
  const todos = visibleTodos(state);

  if (todos.length === 0) {
    listRegion.innerHTML = `
      <p class="empty-state">${emptyStateCopy(state.filter)}</p>
    `;
    return;
  }

  listRegion.replaceChildren(...todos.map((todo) => renderTodo(todo)));
}

function renderTodo(todo) {
  const row = document.createElement("article");
  row.className = "todo-row";
  row.dataset.completed = String(todo.completed);

  const checkbox = document.createElement("input");
  checkbox.className = "todo-toggle";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.dataset.todoId = todo.id;
  checkbox.setAttribute("aria-label", `Mark "${todo.title}" ${todo.completed ? "active" : "completed"}`);

  row.append(checkbox);

  if (todo.id === editingId) {
    const editInput = document.createElement("input");
    editInput.className = "todo-edit";
    editInput.type = "text";
    editInput.value = todo.title;
    editInput.dataset.todoId = todo.id;
    editInput.setAttribute("aria-label", `Edit "${todo.title}"`);
    row.append(editInput);
  } else {
    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.title;
    title.dataset.todoId = todo.id;
    title.tabIndex = 0;
    title.role = "button";
    title.setAttribute("aria-label", `Edit "${todo.title}"`);
    row.append(title);
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "todo-delete";
  deleteButton.type = "button";
  deleteButton.dataset.todoId = todo.id;
  deleteButton.setAttribute("aria-label", `Delete "${todo.title}"`);
  deleteButton.textContent = "Delete";

  row.append(deleteButton);
  return row;
}

function renderFooter() {
  const completedCount = state.todos.length - state.active_count;
  const itemWord = state.active_count === 1 ? "item" : "items";

  footerRegion.innerHTML = `
    <p id="todo-count">${state.active_count} ${itemWord} left</p>
    <nav class="filters" aria-label="Todo filters">
      ${filterButton("all", "All")}
      ${filterButton("active", "Active")}
      ${filterButton("completed", "Completed")}
    </nav>
    ${
      completedCount > 0
        ? '<button id="clear-completed" type="button">Clear completed</button>'
        : ""
    }
  `;
}

function filterButton(filter, label) {
  const active = state.filter === filter;

  return `
    <button
      class="filter-btn"
      type="button"
      data-filter="${filter}"
      aria-pressed="${active}"
    >
      ${label}
    </button>
  `;
}

function focusEditInput() {
  const editInput = document.querySelector(".todo-edit");
  if (!editInput) {
    return;
  }

  editInput.focus();
  editInput.select();
}

function enterEditMode(id) {
  editingId = id;
  render();
  focusEditInput();
}

function isActivationKey(key) {
  return key === "Enter" || key === " ";
}

function commitEdit(input) {
  commitState(editTitle(state, input.dataset.todoId, input.value, { now: currentTimestamp() }));
}

function createTodoId() {
  return crypto.randomUUID();
}

function currentTimestamp() {
  return new Date().toISOString();
}

function emptyStateCopy(filter) {
  if (filter === "active") {
    return "No open todos.";
  }

  if (filter === "completed") {
    return "No completed todos.";
  }

  return "Nothing to do.";
}
