(function exportTodoStorage(global) {
  const STORAGE_KEY = "sdd-example-todo:v1";
  const SCHEMA_VERSION = 1;
  const FILTERS = new Set(["all", "active", "completed"]);

  function freshState() {
    return { todos: [], filter: "all", active_count: 0 };
  }

  function load() {
    let raw;
    try {
      raw = global.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return { state: freshState(), error: "saved data could not be loaded" };
    }

    if (raw === null || raw === undefined) {
      return { state: freshState(), error: null };
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return { state: freshState(), error: "saved data could not be loaded" };
    }

    if (!isValidPayload(parsed)) {
      return { state: freshState(), error: "saved data could not be loaded" };
    }

    return { state: parsed.state, error: null };
  }

  // SPEC-003-PERSISTENCE invariant: persistence must NOT reach the network.
  // Keep this purely local — no fetch, no sync, no telemetry.
  function save(state) {
    const payload = JSON.stringify({ schema_version: SCHEMA_VERSION, state });

    try {
      global.localStorage.setItem(STORAGE_KEY, payload);
      return { error: null };
    } catch (err) {
      if (isQuotaError(err)) {
        return { error: "could not save changes - storage full" };
      }
      return { error: "could not save changes" };
    }
  }

  function isValidPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return false;
    }

    if (payload.schema_version !== SCHEMA_VERSION) {
      return false;
    }

    const state = payload.state;
    if (!state || typeof state !== "object") {
      return false;
    }

    if (!Array.isArray(state.todos)) {
      return false;
    }

    if (!FILTERS.has(state.filter)) {
      return false;
    }

    if (typeof state.active_count !== "number") {
      return false;
    }

    return true;
  }

  function isQuotaError(err) {
    if (!err) {
      return false;
    }

    return (
      err.name === "QuotaExceededError" ||
      err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      err.code === 22 ||
      err.code === 1014
    );
  }

  global.todoStorage = {
    load,
    save,
    STORAGE_KEY,
    SCHEMA_VERSION,
  };
})(globalThis);
