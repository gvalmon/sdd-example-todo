(function exportTodoState(global) {
  const FILTERS = new Set(["all", "active", "completed"]);

  const initialState = {
    todos: [],
    filter: "all",
    active_count: 0,
  };

  function add(state, title, meta = {}) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return state;
    }

    const now = meta.now;
    const todo = {
      id: meta.id,
      title: trimmedTitle,
      completed: false,
      created_at: now,
      updated_at: now,
    };

    return withActiveCount({
      ...state,
      todos: [...state.todos, todo],
    });
  }

  function toggle(state, id, meta = {}) {
    let changed = false;
    const todos = state.todos.map((todo) => {
      if (todo.id !== id) {
        return todo;
      }

      changed = true;
      return {
        ...todo,
        completed: !todo.completed,
        updated_at: meta.now,
      };
    });

    return changed ? withActiveCount({ ...state, todos }) : state;
  }

  function toggleAll(state, meta = {}) {
    if (state.todos.length === 0) {
      return state;
    }

    const shouldComplete = state.todos.some((todo) => !todo.completed);
    const todos = state.todos.map((todo) => {
      if (todo.completed === shouldComplete) {
        return todo;
      }

      return {
        ...todo,
        completed: shouldComplete,
        updated_at: meta.now,
      };
    });

    return withActiveCount({ ...state, todos });
  }

  function editTitle(state, id, title, meta = {}) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return state;
    }

    let changed = false;
    const todos = state.todos.map((todo) => {
      if (todo.id !== id || todo.title === trimmedTitle) {
        return todo;
      }

      changed = true;
      return {
        ...todo,
        title: trimmedTitle,
        updated_at: meta.now,
      };
    });

    return changed ? { ...state, todos } : state;
  }

  function remove(state, id) {
    const todos = state.todos.filter((todo) => todo.id !== id);

    if (todos.length === state.todos.length) {
      return state;
    }

    return withActiveCount({ ...state, todos });
  }

  function clearCompleted(state) {
    const todos = state.todos.filter((todo) => !todo.completed);

    if (todos.length === state.todos.length) {
      return state;
    }

    return withActiveCount({ ...state, todos });
  }

  function setFilter(state, filter) {
    if (!FILTERS.has(filter) || state.filter === filter) {
      return state;
    }

    return { ...state, filter };
  }

  function visibleTodos(state) {
    if (state.filter === "active") {
      return state.todos.filter((todo) => !todo.completed);
    }

    if (state.filter === "completed") {
      return state.todos.filter((todo) => todo.completed);
    }

    return state.todos;
  }

  function withActiveCount(state) {
    return {
      ...state,
      active_count: state.todos.filter((todo) => !todo.completed).length,
    };
  }

  global.todoState = {
    add,
    clearCompleted,
    editTitle,
    initialState,
    remove,
    setFilter,
    toggle,
    toggleAll,
    visibleTodos,
  };
})(globalThis);
