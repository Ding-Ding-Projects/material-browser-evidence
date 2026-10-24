const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titleCase = (value) => value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
fetch('evidence.json').then((r) => { if (!r.ok) throw new Error('Evidence inventory could not be loaded.'); return r.json(); }).then((data) => {
  const gallery = document.querySelector('#gallery');
  const filters = [
    ['surface-filter', 'surface'], ['theme-filter', 'theme'], ['language-filter', 'language']
  ];
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
      article.innerHTML = `<a class="image-link" href="${escapeHtml(item.file)}"><img src="${escapeHtml(item.file)}" alt="${escapeHtml(item.alt)}" loading="lazy"></a><div class="card-body"><p class="eyebrow">${escapeHtml(titleCase(item.surface))} · ${escapeHtml(item.theme)} · ${escapeHtml(item.language)}</p><h3>${escapeHtml(item.title)}</h3><p>${item.viewport.width} × ${item.viewport.height} CSS px · runtime scale ${item.scale}</p><details><summary>Provenance and limits</summary><dl><dt>Source revision</dt><dd><a href="https://github.com/Ding-Ding-Projects/material-browser/commit/${item.sourceCommit}"><code>${item.sourceCommit}</code></a></dd><dt>Captured (UTC)</dt><dd><time datetime="${item.capturedAtUtc}">${item.capturedAtUtc}</time></dd><dt>Image SHA-256</dt><dd><code>${item.imageSha256}</code></dd><dt>Package SHA-256</dt><dd><code>${item.packageSha256}</code></dd><dt>Renderer SHA-256</dt><dd><code>${item.rendererSha256}</code></dd><dt>Host SHA-256</dt><dd><code>${item.hostSha256}</code></dd><dt>Scale method</dt><dd>${escapeHtml(item.scaleMethod)}</dd></dl></details></div>`;
      return article;
    }));
    document.querySelector('#result-count').textContent = `${visible.length} of ${data.images.length} captures shown`;
  }
  document.querySelector('#clear-filters').addEventListener('click', () => { for (const [id] of filters) document.getElementById(id).value = ''; render(); document.getElementById('surface-filter').focus(); });
  render();
}).catch((error) => { document.querySelector('#gallery').textContent = error.message; });
