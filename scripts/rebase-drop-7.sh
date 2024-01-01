#!/bin/sh
# Drop first 7 commits (oldest) from history
cd "$(dirname "$0")/.."
# Create a script that changes first 7 "pick" to "drop"
ed_script='1,7s/^pick /drop /'
if [ "$(uname)" = "Windows_NT" ] || [ -n "$WINDIR" ]; then
  # Windows - use PowerShell or sed from Git
  GIT_SEQUENCE_EDITOR="sed -i.bak '1,7s/^pick /drop /'" git rebase -i --root
else
  GIT_SEQUENCE_EDITOR="sed -i.bak '1,7s/^pick /drop /'" git rebase -i --root
fi
