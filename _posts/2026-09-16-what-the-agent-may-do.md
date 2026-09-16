---
layout: post
title: what the agent may do
date: 2026-09-16 09:00:00
description: verified authority envelopes for AI agents in GitHub workflows
tags: verification security ai-agents lean formal-methods
categories: research
giscus_comments: false
related_posts: false
---

A coding agent in a GitHub workflow reads text anyone can write while holding a repository
token. What it can do with that is decided partly by the workflow file and partly by the
action that runs it. This note is about computing that — the agent's *authority envelope* —
and checking it with a procedure proved correct in [Lean 4](https://github.com/certior/vcore).

<div class="repo-links">
  <strong>Code</strong> <a href="https://github.com/certior/vcore">certior/vcore</a>
  <span class="sep">&middot;</span>
  <strong>Benchmark</strong> <a href="https://huggingface.co/datasets/paulibo/vcore-actions-benchmark">vcore-actions-benchmark</a>
  <span class="sep">&middot;</span>
  <strong>Corpus</strong> <a href="https://huggingface.co/datasets/paulibo/vcore-workflow-envelopes">vcore-workflow-envelopes</a>
</div>

## An agent with standing access

A few lines of YAML give a repository an agent that answers `@claude` mentions, reviews pull
requests, or triages issues. On a public repository the text it reads — an issue body, a
comment, a pull request — can be written by anyone. The agent runs with a token for the
repository and an API key, and it can read files, run commands, comment, and push.

The danger is not any single tool call. Reading a comment is fine. Reading a file is fine.
Posting a comment is fine. Reading an attacker's comment, then the file that holds the token,
then posting to a public comment, in one session, is not. This is Simon Willison's
[lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) and Meta's
[Rule of Two](https://ai.meta.com/blog/practical-ai-agent-security/): the harm is a
*combination over a session*, so the question has to be asked about sequences of tool calls,
not one call at a time.

## The authority envelope

For one triggering event, the agent's session has an *authority envelope*: the sequences of
tool calls the configuration lets it make. I write it as a policy with memory — a request is
permitted or not, and running it can tag the session
<span class="tag-u">untrusted</span> (it read text an outsider can write) or
<span class="tag-s">secret</span> (it can read a credential). Two rules then become questions
about the envelope: can the session reach a network egress or a public write while holding both
<span class="tag-u">untrusted</span> and <span class="tag-s">secret</span> (exfiltration); and
can it write to the repository after reading untrusted text (untrusted write).

Much of the envelope is set inside the action, not in the workflow file. I model
[anthropics/claude-code-action](https://github.com/anthropics/claude-code-action) at a pinned
release by reading its source: in one mode it puts the issue body and its comments into the
prompt though no line of the workflow mentions them; it grants file-reading and pushing without
being asked; and it writes the token into the repository's `.git/config`, inside the workspace
the agent reads.

## A counterexample you can read

For the action's own example workflow, on a comment on a pull request, the checker reports this
three-step sequence the configuration allows:

| # | request | session after |
|---|---------|---------------|
| 1 | `Input/entity/comments` — a comment on the thread, written by anyone | <span class="tag-u">untrusted</span> |
| 2 | `Read/.git/config` — the file that holds the repository token | <span class="tag-u">untrusted</span> <span class="tag-s">secret</span> |
| 3 | `mcp/github_comment/update_claude_comment` — the public comment | **blocked** — exfiltration |

Read it as a property of the *configuration*, not a demonstrated attack. The same workflow on
`issues: opened` satisfies both properties, because an issue that reaches the agent on that
event was opened by the account that triggered it — whom the action admits only with write
access. The verdict differs across events of the same file, and the checker says which.

## Verified, then checked against the action

The verdicts come from [vcore](https://github.com/certior/vcore), a policy checker proved
correct in Lean 4 (1,462 lines, 102 theorems, no `sorry`). It decides refinement for sessions
of *every* length, and a counterexample never needs more than three tool calls — a bound proved
tight for the trifecta rule.

A verified checker is only as good as the model it is given, so I test the model by *running the
action's own code*: an oracle executes the unmodified action against a mock GitHub API and
reports what it set up. On 3,155 generated scenarios the model and the action agree on every
field in 3,143; every disagreement leaves the envelope over-approximating the real run. I also
drove the real Claude Code CLI offline through the counterexample above, to check that its
permission engine executes the two tool calls under this configuration.

## Across public workflows

I collected the public workflows that use the action and analysed the 12,414 whose agent can
run. In **78%** the configuration admits the exfiltration sequence and in **66%** a write to the
repository after untrusted text; the token sits in `.git/config` in most of them. The dominant
pattern is the default: a comment from the thread, the token in the workspace, and the comment
the action maintains.

For a violating configuration the tool searches small workflow edits and keeps one only if the
checker then proves the property holds and the edit only removes behaviour. A single such edit
repairs most violations — often one line, `claude_args: --disallowedTools "Read(./.git/**)"`,
which keeps the token out of the agent's reach while leaving every capability the agent uses.

## What it does and does not say

It bounds permissions, not behaviour: a counterexample means the configuration *permits* the
sequence, not that a model would perform it. The ingredients are largely known — the
prompt-injection risk and the `allowed_non_write_users` risk are in the action's own security
notes, a related environment-variable exposure was reported and mitigated earlier, and
`actions/checkout` persisting a token in `.git/config` is documented. The contribution is the
session-level combination and how often it holds across real workflows, checked with a verified
tool — not a new exploit, and no repository is named. It covers one action at one release; the
method extends to other agent actions and to local coding agents.

<style>
.tag-u, .tag-s { font-family: var(--global-code-font, monospace); font-size: 0.82em; padding: 0 5px; border-radius: 3px; border: 1px solid; white-space: nowrap; }
.tag-u { color: #b06a12; border-color: #b06a12; }
.tag-s { color: #7a3fb0; border-color: #7a3fb0; }
.repo-links { border: 1px solid var(--global-divider-color); background: var(--global-code-bg-color); border-radius: 6px; padding: 10px 14px; margin: 1.2em 0 1.8em; font-size: 0.92em; line-height: 1.95; }
.repo-links strong { color: var(--global-text-color); }
.repo-links a { white-space: nowrap; }
.repo-links .sep { color: var(--global-divider-color); margin: 0 6px; }
</style>
