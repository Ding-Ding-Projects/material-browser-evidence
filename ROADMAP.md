# Roadmap

## Publication

- [x] Publish the eight reviewed original captures with source-bound hashes and UTC provenance.
- [x] Provide keyboard-accessible filters and direct routes between the gallery and evidence guide.
- [x] Verify the deployed Pages site and every image response over HTTP: the index and all eight images returned HTTP 200 on 2026-10-22, and every live image SHA-256 matched `public/evidence.json`, the local copy and the source repository evidence bytes. The stored repository homepage value was not read back because no authenticated GitHub CLI session was available at that time.
- [x] Add the exact gallery link to the source README after the gallery is live. Source commit `7035f1c047d2a29eb3081e292a9ef778e2bdc9a4` on `main` carries the link and was read back from the remote reference.
