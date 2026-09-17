/* Render source figures and saved local attachments using text-safe DOM nodes. */
(() => {
  'use strict';
  const safe = src => typeof src === 'string' && /^(?:figures\/page-\d{3}-figure-\d{2}\.webp|attachments\/[a-f0-9]{64}\.png)$/.test(src);
  const normal = text => (text || '').replace(/\s+/g, '').toLowerCase();
  function figure(item, lang) {
    const box = document.createElement('figure'); box.className = 'textbook-figure';
    if (/page-006-figure/.test(item.src)) box.classList.add('symbol-figure');
    const link = document.createElement('a'); link.href = item.src; link.target = '_blank'; link.rel = 'noopener';
    const img = document.createElement('img'); img.src = item.src; img.loading = 'lazy'; img.decoding = 'async';
    img.alt = (lang === 'en' ? item.captionEn : item.captionZh) || item.captionZh || item.captionEn || '本頁圖片';
    link.setAttribute('aria-label', img.alt + ' — 放大檢視'); link.append(img);
    const caption = document.createElement('figcaption'); caption.textContent = img.alt;
    const hint = document.createElement('span'); hint.className = 'figure-hint'; hint.textContent = lang === 'en' ? 'Click to enlarge' : '點圖放大';
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
