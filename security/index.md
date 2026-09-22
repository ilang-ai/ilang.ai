# iLang Security Model: Verb Risk Classification and Runtime Requirements | Protocol Safety
Source: https://ilang.ai/security/

# Security Model

iLang is an instruction format, not an authorization bypass. All dangerous operations require host runtime confirmation, permission checks, and audit logging.

## Core principle

iLang is an instruction format, not an authorization bypass.

iLang structures what an agent is told to do. It does not grant the agent permission to do it. All dangerous operations require host runtime confirmation, permission checks, and audit logging.

## Verb risk classification

### Safe verbs (no side effects)

These verbs read, analyze, or format data without modifying external state.

| Verb | Risk | Reason |
| --- | --- | --- |
| READ, GET, LIST, STRM | Safe | Read-only access |
| FMT, CONV, SPLIT, MERGE, MAP, FILT, SORT, DEDU | Safe | In-memory transformation |
| SCAN, MTCH, CNT, STAT, EVAL, SCOR, RANK | Safe | Analysis, no state change |
| OUT, DISP, EXPT, PRNT, LOG | Safe | Output to user |
| HELP, DESC, INTR, NOOP | Safe | Informational |

### Guarded verbs (require confirmation)

These verbs modify files, send data, or change external state. Host runtime must require user confirmation before execution.

| Verb | Risk | Required safeguard |
| --- | --- | --- |
| WRIT | Guarded | Confirm file path and content before writing |
| MOVE | Guarded | Confirm source and destination |
| COPY | Guarded | Confirm destination does not overwrite |
| SEND | Guarded | Confirm recipient and content |
| SYNC | Guarded | Confirm sync direction and scope |
| CACH | Guarded | Confirm cache storage location |
| SAVE | Guarded | Confirm state checkpoint location |

### Dangerous verbs (require explicit authorization)

These verbs can cause data loss, execute arbitrary code, or modify production systems. Host runtime must enforce permission checks, dry-run mode, sandbox execution, and audit logging.

| Verb | Risk | Required safeguards |
| --- | --- | --- |
| DEL | Dangerous | User confirmation + dry-run preview + audit log |
| RUN | Dangerous | Sandbox execution + command preview + user approval |
| DPLO | Dangerous | Target environment confirmation + rollback plan + audit log |

## Runtime requirements

Any runtime that executes iLang instructions must implement these safeguards:

| Requirement | Description |
| --- | --- |
| Permission check | Verify the agent has authorization for the target resource before executing guarded or dangerous verbs |
| User confirmation | Present a preview of what will happen and require explicit user approval for guarded and dangerous verbs |
| Dry-run mode | Allow users to preview the effect of a chain without executing it |
| Sandbox execution | Dangerous verbs like RUN must execute in an isolated environment by default |
| Audit log | All guarded and dangerous verb executions must be logged with timestamp, verb, target, modifier, and user who approved |
| Host policy override | The host system can restrict or block any verb regardless of iLang instructions |

## What iLang does NOT do

| iLang does NOT | Explanation |
| --- | --- |
| Grant permissions | iLang structures intent. The host runtime enforces permissions. |
| Bypass safety layers | Behavioral definitions (`::GENE{}`) operate within the model's existing safety constraints. |
| Execute code directly | `[RUN\|cmd=...]` is an instruction to the runtime, not direct code execution. |
| Override host policies | If the host blocks DEL, no iLang instruction can override that. |

## Reporting security issues

If you discover a security concern with the iLang specification or any iLang tool, report it via [GitHub security advisory](https://github.com/ilang-ai/ilang-spec/security/advisories/new).

---
Markdown rendering of the HTML page for agents; the HTML page is canonical.
