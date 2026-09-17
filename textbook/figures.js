/* Render source figures and saved local attachments using text-safe DOM nodes. */
(() => {
  'use strict';
  const safe = src => typeof src === 'string' && /^(?:figures\/page-\d{3}-figure-\d{2}\.webp|attachments\/[a-f0-9]{64}\.png)$/.test(src);
  const normal = text => (text || '').replace(/\s+/g, '').toLowerCase();
  let viewer, preview, viewport, zoomLabel, zoomOut, zoomIn, zoom = 1, fitting = true, returnFocus;
  const element = (tag, text, cls) => { const el = document.createElement(tag); if (text) el.textContent = text; if (cls) el.className = cls; return el; };
  function resizePreview(value, fit = false) {
    fitting = fit;
    if (!preview.naturalWidth) return;
    const centreX = (viewport.scrollLeft + viewport.clientWidth / 2) / zoom;
    const centreY = (viewport.scrollTop + viewport.clientHeight / 2) / zoom;
    zoom = fit ? Math.min(1, Math.max(.01, (viewport.clientWidth - 32) / preview.naturalWidth), Math.max(.01, (viewport.clientHeight - 32) / preview.naturalHeight)) : Math.max(.1, Math.min(4, value));
    preview.style.width = Math.round(preview.naturalWidth * zoom) + 'px';
    preview.style.height = Math.round(preview.naturalHeight * zoom) + 'px';
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom <= .1; zoomIn.disabled = zoom >= 4;
    viewport.scrollLeft = fit ? 0 : centreX * zoom - viewport.clientWidth / 2;
    viewport.scrollTop = fit ? 0 : centreY * zoom - viewport.clientHeight / 2;
  }
  function createViewer() {
    viewer = element('dialog', '', 'image-viewer'); viewer.id = 'textbook-image-viewer';
    viewer.setAttribute('aria-labelledby', 'image-viewer-title');
    const heading = element('div', '', 'image-viewer-heading');
    const title = element('h2', '圖片放大檢視'); title.id = 'image-viewer-title';
    const close = element('button', '關閉圖片'); close.type = 'button'; close.autofocus = true; close.addEventListener('click', () => viewer.close());
    heading.append(title, close);
    const controls = element('div', '', 'image-viewer-controls');
    const action = (text, fn) => { const b = element('button', text); b.type = 'button'; b.addEventListener('click', fn); controls.append(b); return b; };
    zoomOut = action('縮小 −', () => resizePreview(zoom / 1.25));
    zoomLabel = element('output', '100%'); zoomLabel.setAttribute('aria-live', 'polite'); controls.append(zoomLabel);
    zoomIn = action('放大 ＋', () => resizePreview(zoom * 1.25));
    action('符合視窗', () => resizePreview(1, true)); action('原始尺寸', () => resizePreview(1));
    viewport = element('div', '', 'image-viewer-viewport'); viewport.tabIndex = 0; viewport.setAttribute('aria-label', '放大圖片，可捲動查看');
    preview = element('img'); preview.draggable = false;
    preview.addEventListener('load', () => { preview.hidden = false; resizePreview(1, true); });
    const error = element('p', '圖片無法載入，請關閉後重試。'); error.hidden = true;
    preview.addEventListener('error', () => { preview.hidden = true; error.hidden = false; });
    viewport.append(preview, error); viewer.append(heading, controls, viewport); document.body.append(viewer);
    viewer.addEventListener('click', event => { if (event.target === viewer) { const r = viewer.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) viewer.close(); } });
    viewer.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); });
    window.addEventListener('resize', () => { if (viewer.open && fitting) resizePreview(1, true); });
  }
  function openViewer(src, title) {
    const url = new URL(src, location.href), prefix = new URL('./', location.href).pathname;
    const relative = url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) : '';
    if (url.origin !== location.origin || !(safe(relative) || /^images\/page-\d{3}\.webp$/.test(relative))) return false;
    if (!viewer) createViewer();
    returnFocus = document.activeElement;
    viewer.querySelector('h2').textContent = title || '圖片放大檢視';
    preview.alt = title || '教材圖片'; preview.hidden = true; viewport.querySelector('p').hidden = true;
    fitting = true; zoom = 1; zoomLabel.textContent = '載入中…';
    if (!viewer.open) viewer.showModal();
    preview.src = url.href;
    if (preview.complete && preview.naturalWidth) { preview.hidden = false; resizePreview(1, true); }
    return true;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.textbook-figure a, #full-image, #image-link, #edit-scan');
    if (link && openViewer(link.href, link.querySelector('img')?.alt || '原始掃描頁 · 放大檢視')) event.preventDefault();
  });
  function figure(item, lang) {
    const box = document.createElement('figure'); box.className = 'textbook-figure';
    if (/page-006-figure/.test(item.src)) box.classList.add('symbol-figure');
    const link = document.createElement('a'); link.href = item.src; link.target = '_blank'; link.rel = 'noopener';
    const img = document.createElement('img'); img.src = item.src; img.loading = 'lazy'; img.decoding = 'async';
    img.alt = (lang === 'en' ? item.captionEn : item.captionZh) || item.captionZh || item.captionEn || '本頁圖片';
    link.setAttribute('aria-label', img.alt + ' — 放大檢視'); link.append(img);
    const caption = document.createElement('figcaption'); caption.textContent = img.alt;
    const hint = document.createElement('button'); hint.type = 'button'; hint.className = 'figure-hint'; hint.textContent = lang === 'en' ? 'Click to enlarge' : '點圖放大';
    hint.addEventListener('click', () => openViewer(item.src, img.alt));
    caption.append(hint); box.append(link, caption);
    img.addEventListener('error', () => { hint.textContent = '圖片未載入，請點圖重試或核對原始掃描。'; });
    return box;
  }
  function append(col, text, lang, images, paragraph) {
    const parts = text.split(lang === 'zh' ? /\n+/ : /\n\s*\n/);
    const pending = (images || []).filter(item => safe(item.src)).map(item => {
      const anchor = lang === 'en' ? item.afterEn : item.afterZh;
      return { item, at: anchor ? parts.findIndex(part => normal(part).includes(normal(anchor))) : -1 };
    });
    // Keep scan order even when an edited paragraph no longer matches its anchor.
    let previous = 0;
    pending.forEach((entry, index) => {
      if (entry.at < 0) entry.at = pending.slice(index + 1).find(next => next.at >= 0)?.at ?? parts.length - 1;
      entry.at = Math.max(previous, entry.at); previous = entry.at;
    });
    parts.forEach((part, index) => {
      col.append(paragraph(part));
      for (const entry of pending.filter(entry => entry.at === index)) col.append(figure(entry.item, lang));
    });
  }
  function markdown(images) {
    const lines = (images || []).filter(item => safe(item.src)).map(item => {
      const caption = [item.captionZh, item.captionEn].filter(Boolean).join(' / ').replace(/[\\[\]]/g, '\\$&');
      return `![${caption || '本頁圖片'}](${new URL(item.src, location.href).href})`;
    });
    return lines.length ? '\n\n## 本頁圖片\n\n' + lines.join('\n\n') : '';
  }
  window.TextbookFigures = { append, safe, markdown };
})();
