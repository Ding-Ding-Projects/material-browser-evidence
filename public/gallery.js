const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titleCase = (value) => String(value).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const dimensions = (value) => value && Number.isFinite(value.width) && Number.isFinite(value.height) ? `${value.width} × ${value.height}` : null;
const detail = (label, value, code = false) => value === undefined || value === null || value === '' ? '' : `<dt>${escapeHtml(label)}</dt><dd>${code ? '<code>' : ''}${escapeHtml(value)}${code ? '</code>' : ''}</dd>`;
fetch('evidence.json').then((r) => { if (!r.ok) throw new Error('Evidence inventory could not be loaded.'); return r.json(); }).then((data) => {
  const gallery = document.querySelector('#gallery');
  const filters = [['surface-filter', 'surface'], ['theme-filter', 'theme'], ['language-filter', 'language']];
  for (const [id, key] of filters) {
    const values = [...new Set(data.images.map((image) => image[key]))].sort();
    const select = document.getElementById(id);
    for (const value of values) { const option = document.createElement('option'); option.value = value; option.textContent = titleCase(value); select.append(option); }
    select.addEventListener('change', render);
  }
  function render() {
    const active = filters.map(([id, key]) => [key, document.getElementById(id).value]).filter(([, value]) => value);
    const visible = data.images.filter((item) => active.every(([key, value]) => item[key] === value));
    gallery.replaceChildren(...visible.map((item) => {
      const article = document.createElement('article'); article.className = 'card';
      const geometry = [dimensions(item.windowSize) && `${dimensions(item.windowSize)} window px`, dimensions(item.cssViewport) && `${dimensions(item.cssViewport)} CSS px`, item.zoomFactor !== undefined && `${item.zoomFactor * 100}% Electron zoom`].filter(Boolean).join(' · ');
      const provenance = detail('Captured image', dimensions(item.imageDimensions) && `${dimensions(item.imageDimensions)} px`) + detail('Captured (UTC)', item.capturedAtUtc) + detail('Image SHA-256', item.imageSha256, true) + detail('Build artifact', item.artifactLabel) + detail('Build artifact SHA-256', item.artifactSha256, true) + detail('Renderer SHA-256', item.rendererSha256, true) + detail('Native host SHA-256', item.hostSha256, true) + detail('Capture receipt SHA-256', item.receiptSha256, true) + detail('Capture route', item.captureRoute || data.captureMethod) + detail('Scale method', item.scaleMethod);
      article.innerHTML = `<a class="image-link" href="${escapeHtml(item.file)}"><img src="${escapeHtml(item.file)}" alt="${escapeHtml(item.alt)}" loading="lazy"></a><div class="card-body"><p class="eyebrow">${escapeHtml(titleCase(item.surface))} · ${escapeHtml(item.theme)} · ${escapeHtml(item.language)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(geometry)}</p><details><summary>Provenance and limits</summary><dl><dt>Source revision</dt><dd><a href="https://github.com/Ding-Ding-Projects/material-browser/commit/${encodeURIComponent(item.sourceCommit)}"><code>${escapeHtml(item.sourceCommit)}</code></a></dd>${provenance}</dl><p>${escapeHtml(item.limitations || data.summaryLimitations || '')}</p></details></div>`;
      return article;
    }));
    document.querySelector('#result-count').textContent = `${visible.length} of ${data.images.length} captures shown`;
  }
  document.querySelector('#clear-filters').addEventListener('click', () => { for (const [id] of filters) document.getElementById(id).value = ''; render(); document.getElementById('surface-filter').focus(); });
  render();
}).catch((error) => { document.querySelector('#gallery').textContent = error.message; });
