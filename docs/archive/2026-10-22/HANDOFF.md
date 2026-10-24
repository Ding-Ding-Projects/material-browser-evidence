# Handoff

The public gallery is implemented in `public/` and is built through the root `build.bat`. Its selected evidence is limited to eight visually inspected images from source revision `baa9512ecbc2727929547059f3b5d95f7cde989f`. The page states that physical display scaling, native keyboard delivery, installer behavior, and unlisted states remain unverified.

Verified on 2026-10-22: the live index at `https://ding-ding-projects.github.io/material-browser-evidence/` and all eight image URLs returned HTTP 200, and every live image SHA-256 matched `public/evidence.json`, the local `public/images` copy and the source repository's `docs/evidence/desktop/gui-rewrite` bytes. The source README links to this gallery home page as of source commit `7035f1c047d2a29eb3081e292a9ef778e2bdc9a4`, read back from the remote main reference.

Remaining work: read back the repository homepage value with an authenticated GitHub CLI session and run `build.bat` on a Windows host to confirm the local site build still matches `public/`. The gallery content itself is unchanged.
