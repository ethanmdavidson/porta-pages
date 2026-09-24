@AGENTS.md

NEVER use "send later" to schedule a PR check in. CI failures and comments are automatically reported, and CI success means there's nothing you need to do. I will tell you if anything changes with the PR that you need to respond to, so you should never schedule a check in.

NEVER spawn a subagent using the Fable model. Opus is the highest tier that should be used for subagents. If a task truly needs Fable-level work, do it in the main loop instead of delegating.
