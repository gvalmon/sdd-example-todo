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

    # Tool-specific detail so slow calls are identifiable in the log.
    # Bash gets command + description; file/search tools get the target;
    # Agent gets subagent_type + description. Commands are truncated and
    # newlines collapsed so the JSONL stays one line per entry.
    DETAIL_JSON="$(printf '%s' "$PAYLOAD" | jq -c --arg tn "$TOOL_NAME" '
      def clip($n): if . == null then null
                    else (tostring | gsub("\\s+"; " ") | .[0:$n]) end;
      .tool_input as $i
      | if $tn == "Bash" then
          {command: ($i.command | clip(500)),
           description: ($i.description | clip(200))}
        elif $tn == "Agent" or $tn == "Task" then
          {subagent_type: $i.subagent_type,
           description: ($i.description | clip(200))}
        elif ($tn == "Read" or $tn == "Edit" or $tn == "Write" or $tn == "NotebookEdit") then
          {file_path: $i.file_path}
        elif ($tn == "Glob" or $tn == "Grep") then
          {pattern: ($i.pattern | clip(200)),
           path: $i.path, glob: $i.glob}
        elif $tn == "SendMessage" then
          {to: $i.to, summary: ($i.summary | clip(200))}
        else
          {}
        end
      | with_entries(select(.value != null and .value != ""))
    ' 2>/dev/null)"
    [ -z "$DETAIL_JSON" ] && DETAIL_JSON="{}"

    jq -cn \
      --argjson ts "$NOW_MS" \
      --argjson dm "$DURATION_MS" \
      --arg sid "$SESSION_ID" \
      --arg tn "$TOOL_NAME" \
      --argjson detail "$DETAIL_JSON" \
      '{timestamp_ms: $ts, session_id: $sid, tool_name: $tn, duration_ms: $dm, detail: $detail}' \
      >> "$LOG_FILE"
    ;;
  *)
    echo "tool-timing.sh: unknown mode '$MODE' (expected pre|post)" >&2
    exit 1
    ;;
esac

exit 0
