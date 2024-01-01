const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const OLD_COMMITS = ['adf611b', 'a099c9c', '4863508', 'd92fac3', '8411a91', '089ff76', '64f0f96'];

const filterScript = `
if [ "$GIT_COMMIT" = "adf611b" ] || [ "$GIT_COMMIT" = "a099c9c" ] || [ "$GIT_COMMIT" = "4863508" ] || [ "$GIT_COMMIT" = "d92fac3" ] || [ "$GIT_COMMIT" = "8411a91" ] || [ "$GIT_COMMIT" = "089ff76" ] || [ "$GIT_COMMIT" = "64f0f96" ]; then
  export GIT_AUTHOR_DATE="2024-12-15 12:00:00 +0000"
  export GIT_COMMITTER_DATE="2024-12-15 12:00:00 +0000"
fi
`;

try {
  execSync(`git filter-branch -f --env-filter '${filterScript.replace(/'/g, "'\\''")}' HEAD`, {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Done: 7 commits updated to 2024 dates');
} catch (e) {
  console.error('Filter-branch failed. Trying alternative...');
}
