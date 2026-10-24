# Gallery verification handoff

The current refresh is prepared for ten inspected WorldLens-style desktop captures from product source `284fc88f94487a7716099469daadeec258d97b07`. Read `HANDOFF.md` for the current staging, build and publication status before taking further action.

Source originals, inventory, coverage and sanitized provenance must exist before `scripts/stage-worldlens.mjs` runs. Verify all image bytes against the source inventory, validate the built gallery and filters, then verify live routes and every published image hash after deployment. Keep unpackaged Linux capture, actual Electron zoom, CSS viewport and physical display scaling distinct.

The historical 22 October gallery and verification records remain unchanged under `public/archive/2026-10-22/` and `docs/archive/2026-10-22/`. Do not overwrite those originals or apply their package and scale claims to this refresh.
