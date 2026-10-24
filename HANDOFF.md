# Handoff

The current gallery refresh targets ten inspected WorldLens-style desktop images from product source `284fc88f94487a7716099469daadeec258d97b07`. It distinguishes the unpackaged Linux capture route, real Electron zoom, measured CSS viewport, window content bounds and build provenance. Historical evidence is preserved in `public/archive/2026-10-22/`; original `public/images/` paths remain intact.

Status: all ten source originals and all four sanitized evidence records are staged and byte-verified. A Linux static-copy equivalent build was served to an isolated headless Chromium browser. All ten current images and the eight-image historical gallery loaded; eleven filter cases and clear-filter focus return passed. Both current pages had no horizontal overflow at 1280, 760 and 320 px widths. No browser page errors were observed. A narrow evidence-guide overflow from the inline source hash was corrected with wrapping and the same viewport checks passed again. Local verification is recorded in `docs/evidence/verification-2026-10-24.json`.

Publication is pending confirmation that the product source is on its main branch. No refreshed live-site result is claimed yet.

The Windows entrypoint remains `build.bat`. A Linux static-copy validation must be recorded as such, without claiming that batch entrypoint or a Windows installer ran.

The previous 22 October live verification, source backlink and homepage readback are preserved verbatim in `docs/archive/2026-10-22/`. They do not verify this refresh. Publication and live hash verification remain pending.
