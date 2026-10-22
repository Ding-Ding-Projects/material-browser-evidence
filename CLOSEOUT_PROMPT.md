# Gallery verification handoff

```text
Objective: keep the public Material Browser evidence gallery verified and linked from its source repository.

Repository: Ding-Ding-Projects/material-browser-evidence, branch main. This file records state up to its own commit; read the remote main reference for the final hash.

Verified on 2026-10-22 over HTTP: the live index and all eight image URLs returned 200; every live image SHA-256 matched public/evidence.json, the local public/images copy and the source repository's docs/evidence/desktop/gui-rewrite bytes. The stored repository homepage value reads https://ding-ding-projects.github.io/material-browser-evidence/. The source README links to this gallery at source commit 7035f1c047d2a29eb3081e292a9ef778e2bdc9a4, read back from the source remote main reference. ROADMAP.md and HANDOFF.md record this.

Unfinished: running build.bat on a Windows host to confirm the local site build still matches public/. Gallery content is unchanged; no new captures were added.

Blockers: none. Next safe step: when the source project publishes new reviewed captures, extend evidence.json and the images directory from inspected originals only, rebuild, redeploy and re-verify every hash over HTTP.
```
