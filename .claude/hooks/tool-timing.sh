#!/usr/bin/env bash
# Records tool-call timings as JSONL for the sdd-implement team lead to inspect.
# Invoked twice per tool call: `tool-timing.sh pre` before, `tool-timing.sh post` after.

set -eu

MODE="${1:-post}"

# Resolve repo root from the hook script's location so the log path survives `cd`.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$CLAUDE_DIR/logs"
TMP_DIR="$LOG_DIR/.tmp"
LOG_FILE="$LOG_DIR/tool-usage.jsonl"

mkdir -p "$LOG_DIR" "$TMP_DIR"

PAYLOAD="$(cat)"
NOW_MS="$(python3 -c 'import time; print(int(time.time()*1000))')"

TOOL_NAME="$(printf '%s' "$PAYLOAD" | jq -r '.tool_name // "unknown"')"
SESSION_ID="$(printf '%s' "$PAYLOAD" | jq -r '.session_id // "unknown"')"
TOOL_USE_ID="$(printf '%s' "$PAYLOAD" | jq -r '.tool_use_id // ""')"

# Pre and post must agree on a key. Prefer the harness-provided tool_use_id;
# fall back to a hash of session+tool+input so pairing still works without it.
if [ -z "$TOOL_USE_ID" ]; then
  TOOL_USE_ID="$(printf '%s' "$PAYLOAD" \
    | jq -c '{s: .session_id, t: .tool_name, i: .tool_input}' \
    | shasum | cut -d' ' -f1)"
fi

STATE_FILE="$TMP_DIR/$TOOL_USE_ID"

case "$MODE" in
  pre)
    printf '%s' "$NOW_MS" > "$STATE_FILE"
    ;;
  post)
    if [ -f "$STATE_FILE" ]; then
      START_MS="$(cat "$STATE_FILE")"
      rm -f "$STATE_FILE"
      DURATION_MS=$((NOW_MS - START_MS))
    else
      DURATION_MS=-1
    fi
    jq -cn \
      --argjson ts "$NOW_MS" \
      --argjson dm "$DURATION_MS" \
      --arg sid "$SESSION_ID" \
      --arg tn "$TOOL_NAME" \
      '{timestamp_ms: $ts, session_id: $sid, tool_name: $tn, duration_ms: $dm}' \
      >> "$LOG_FILE"
    ;;
  *)
    echo "tool-timing.sh: unknown mode '$MODE' (expected pre|post)" >&2
    exit 1
    ;;
esac

exit 0
