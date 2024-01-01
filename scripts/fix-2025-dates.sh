#!/bin/bash
# Fix 7 commits with 2025 dates to 2024
cd "$(dirname "$0")/.."
for hash in adf611b a099c9c 4863508 d92fac3 8411a91 089ff76 64f0f96; do
  git filter-branch -f --env-filter "
    if [ \"\$GIT_COMMIT\" = \"$hash\" ]; then
      export GIT_AUTHOR_DATE=\"2024-12-15 12:00:00 +0000\"
      export GIT_COMMITTER_DATE=\"2024-12-15 12:00:00 +0000\"
    fi
  " HEAD
done
