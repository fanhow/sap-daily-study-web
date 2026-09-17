(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const data = window.ESR_DATA;
  if (!data || !Array.isArray(data.pages) || data.pages.length === 0) {
    $('pageTitle').textContent = '尚未載入文字資料';
    $('searchStatus').textContent = '找不到 data.js 或其中尚無頁面。';
    $('previousPage').disabled = true;
    $('nextPage').disabled = true;
    return;
  }
  const pages = data.pages;
  const translations = new Map((window.ESR_BILINGUAL?.pages || []).map((p) => [p.pageNumber, p]));
  const translation = (p) => translations.get(p.pageNumber);
  const hasTranslations = pages.every((p) => {
    const t = translation(p);
    return t?.htmlZh && t?.htmlBilingual && Array.isArray(t.blocks) && t.blocks.map((b) => b.en).join('\n\n') === p.text;
  });
  const storeKey = 'relyon-esr-reader-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storeKey) || '{}') || {}; } catch (_) { /* File URLs may restrict storage. */ }
  let currentIndex = 0;
  let beforeNavigate = null;
  let query = '';
  let language = hasTranslations ? (['en', 'zh', 'bilingual'].includes(saved.language) ? saved.language : 'bilingual') : 'en';
  let view = ['text', 'split', 'image'].includes(saved.view) ? saved.view : 'split';
  let fontSize = Math.max(14, Math.min(28, Number(saved.fontSize) || 18));
  const searchText = pages.map((p) => [p.title, p.section, p.text, translation(p)?.titleZh, translation(p)?.textZh].filter(Boolean).join('\n').toLocaleLowerCase());
  const save = () => { try { localStorage.setItem(storeKey, JSON.stringify({ page: pages[currentIndex].id, view, fontSize, ...(hasTranslations ? { language } : {}) })); } catch (_) { /* Reading works without storage. */ } };
  const textNode = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
  const safePath = (value, fallback = '#') => {
    const path = String(value || '').trim();
    return path && !/^(?:[a-z][a-z\d+.-]*:|[\\/]{2})/i.test(path) ? path : fallback;
  };
  const displayLabel = (p) => p.label || (p.pageNumber != null ? `第 ${p.pageNumber} 頁` : p.id);
  const pageTitle = (p) => (language !== 'en' && translation(p)?.titleZh) || p.title || displayLabel(p);
  const pageCode = (p, index) => p.pageNumber != null ? String(p.pageNumber).padStart(2, '0') : String(index + 1).padStart(2, '0');
  const makeHighlight = (content, term) => {
    const fragment = document.createDocumentFragment();
    const text = String(content || '');
    if (!term) { fragment.append(document.createTextNode(text)); return fragment; }
    const lower = text.toLocaleLowerCase();
    const needle = term.toLocaleLowerCase();
    let cursor = 0;
    let found = lower.indexOf(needle);
    while (found !== -1) {
      fragment.append(document.createTextNode(text.slice(cursor, found)));
      fragment.append(textNode('mark', text.slice(found, found + term.length)));
      cursor = found + term.length;
      found = lower.indexOf(needle, cursor);
    }
    fragment.append(document.createTextNode(text.slice(cursor)));
    return fragment;
  };
  function highlightDocument() {
    if (!query) return;
    const walker = document.createTreeWalker($('documentText'), NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && !['SCRIPT', 'STYLE', 'MARK'].includes(node.parentElement.tagName) && node.textContent.toLocaleLowerCase().includes(query.toLocaleLowerCase())) nodes.push(node);
    }
    nodes.forEach((item) => item.replaceWith(makeHighlight(item.textContent, query)));
  }
  function safeHtml(markup) {
    const template = document.createElement('template');
    template.innerHTML = String(markup);
    template.content.querySelectorAll('script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,select,video,audio,source,img,svg,math').forEach((el) => el.remove());
    template.content.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (!['class', 'colspan', 'rowspan', 'scope', 'title', 'lang', 'href'].includes(attr.name)) el.removeAttribute(attr.name);
        if (attr.name === 'href') {
          if (el.tagName === 'A') el.setAttribute('href', safePath(attr.value));
          else el.removeAttribute('href');
        }
      });
    });
    return template.content;
  }
  function renderText() {
    const p = pages[currentIndex];
    const t = translation(p);
    const markup = language === 'bilingual' ? t?.htmlBilingual : language === 'zh' ? t?.htmlZh : p.html;
    $('documentText').replaceChildren();
    $('documentText').lang = language === 'en' ? 'en' : 'zh-Hant';
    $('documentText').className = `document-text language-${language}`;
    if (markup && String(markup).trim()) $('documentText').append(safeHtml(markup));
    else if (p.text && String(p.text).trim()) {
      String(p.text).replace(/\r\n/g, '\n').split(/\n\s*\n/).forEach((paragraph) => $('documentText').append(textNode('p', paragraph)));
    } else {
      const empty = textNode('p', '本頁沒有可辨識的文字。\n可切換至原圖查看；空白頁已保留。', 'empty-page');
      empty.lang = 'zh-Hant';
      $('documentText').append(empty);
    }
    highlightDocument();
  }
  function renderList() {
    const fragment = document.createDocumentFragment();
    let section = null;
    let matches = 0;
    const needle = query.toLocaleLowerCase();
    pages.forEach((p, index) => {
      if (query && !searchText[index].includes(needle)) return;
      matches++;
      const group = p.section || 'ESR 文件';
      if (!query && section !== group) { fragment.append(textNode('div', group, 'section-label')); section = group; }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'page-item';
      button.dataset.index = String(index);
      button.title = `${displayLabel(p)} · ${pageTitle(p)}`;
      if (index === currentIndex) button.setAttribute('aria-current', 'page');
      button.append(textNode('span', pageCode(p, index), 'page-number'));
      const copy = textNode('span', '', 'page-item-copy');
      const title = textNode('span', '', 'page-item-title');
      title.append(makeHighlight(pageTitle(p), query));
      copy.append(title);
      if (query) {
        const en = String(p.text || p.section || '').replace(/\s+/g, ' ').trim();
        const zh = String(translation(p)?.textZh || '').replace(/\s+/g, ' ').trim();
        const body = zh.toLocaleLowerCase().includes(needle) && (language !== 'en' || !en.toLocaleLowerCase().includes(needle)) ? zh : en;
        const found = body.toLocaleLowerCase().indexOf(needle);
        const start = found < 0 ? 0 : Math.max(0, found - 38);
        const end = Math.min(body.length, (found < 0 ? 0 : Math.max(0, found)) + query.length + 82);
        const snippet = textNode('span', '', 'search-snippet');
        snippet.append(makeHighlight(`${start ? '…' : ''}${body.slice(start, end)}${end < body.length ? '…' : ''}`, query));
        copy.append(snippet);
      }
      button.append(copy);
      fragment.append(button);
    });
    if (matches === 0) fragment.append(textNode('p', `找不到「${query}」。\n可試試較短的英文術語。`, 'empty-results'));
    $('pageList').replaceChildren(fragment);
    $('searchStatus').textContent = query ? `「${query}」· 符合 ${matches} / ${pages.length} 頁` : `共 ${pages.length} 個頁面${hasTranslations ? ' · 可搜尋中英文' : ' · 點選開始閱讀'}`;
    $('clearSearch').hidden = !query;
  }
  function renderPage({ scroll = true, updateHash = true } = {}) {
    const p = pages[currentIndex];
    const t = translation(p);
    $('pageLabel').textContent = displayLabel(p);
    $('pageSection').textContent = p.section || 'Electrical Safety Rules';
    $('pageTitle').textContent = pageTitle(p);
    $('pageEnglishTitle').textContent = p.title || '';
    $('pageEnglishTitle').hidden = language !== 'bilingual' || p.title === pageTitle(p);
    $('textPanelTitle').textContent = language === 'bilingual' ? '中英對照（逐段）' : language === 'zh' ? '繁體中文學習譯文' : '英文 OCR 原文';
    $('languageSelect').value = language;
    $('languageNotice').textContent = language === 'en' ? '英文由照片自動辨識；數值、否定詞與表格請對照原圖。' : '中文為依英文 OCR 製作的學習譯文，非官方中文版；數值、否定詞、條款與表格請對照原圖。';
    $('pageJump').value = p.id;
    $('pagePosition').textContent = `${currentIndex + 1} / ${pages.length}`;
    $('previousPage').disabled = currentIndex === 0;
    $('nextPage').disabled = currentIndex === pages.length - 1;
    $('readingProgress').style.width = `${((currentIndex + 1) / pages.length) * 100}%`;
    $('wordCount').textContent = p.text ? `${String(p.text).trim().split(/\s+/).filter(Boolean).length.toLocaleString()} 詞` : '空白頁';
    const flags = [...(Array.isArray(p.flags) ? p.flags.filter(Boolean) : []), ...(language !== 'en' && Array.isArray(t?.notes) ? t.notes : [])];
    $('pageFlags').replaceChildren(...flags.map((flag) => textNode('span', String(flag), 'flag')));
    $('pageFlags').hidden = flags.length === 0;
    renderText();
    const image = safePath(p.image || p.sourceImage);
    const geometry = p.imageGeometry;
    if (geometry) {
      const [left, top, right, bottom] = geometry.cropRect;
      const [sourceWidth, sourceHeight] = geometry.sourceSize;
      const [outputWidth, outputHeight] = geometry.imageSize;
      const width = right - left, height = bottom - top;
      const sideways = geometry.rotationClockwise === 90;
      const rotatedWidth = sideways ? height : width;
      const rotatedHeight = sideways ? width : height;
      $('pageImageViewport').style.aspectRatio = `${outputWidth} / ${outputHeight}`;
      Object.assign($('pageDeskew').style, {
        width: `${100 * rotatedWidth / outputWidth}%`, height: `${100 * rotatedHeight / outputHeight}%`,
        transform: `translate(-50%, -50%) rotate(${-geometry.deskewDegrees}deg)`
      });
      Object.assign($('pageCrop').style, {
        width: `${100 * width / rotatedWidth}%`, height: `${100 * height / rotatedHeight}%`,
        transform: `translate(-50%, -50%) rotate(${geometry.rotationClockwise}deg)`
      });
      Object.assign($('documentImage').style, {
        width: `${100 * sourceWidth / width}%`, height: `${100 * sourceHeight / height}%`,
        left: `${-100 * left / width}%`, top: `${-100 * top / height}%`
      });
    }
    $('imageError').hidden = true;
    $('documentImage').hidden = false;
    $('documentImage').alt = `${displayLabel(p)}：${pageTitle(p)}，來源 ${p.photo || ''}`;
    $('documentImage').src = image;
    $('openImage').href = image;
    $('imageLink').href = image;
    $('imageCaption').textContent = `${displayLabel(p)} · ${p.photo || '來源照片'}`;
    $('openSource').href = safePath(p.sourceImage || p.image);
    const markdown = safePath(language === 'bilingual' ? t?.markdownBilingual : language === 'zh' ? t?.markdownZh : p.markdown);
    $('downloadPage').href = markdown;
    $('downloadPageFooter').href = markdown;
    $('sourceNote').textContent = `來源：${p.photo || '本機 JPG'}${data.generatedAt ? ` · 文字產生日期：${String(data.generatedAt).slice(0, 10)}` : ''}`;
    document.title = `${displayLabel(p)} · ${pageTitle(p)} | ESR 閱讀器`;
    if (updateHash && location.hash !== `#${p.id}`) {
      try { history.replaceState(null, '', `#${encodeURIComponent(p.id)}`); } catch (_) { location.hash = p.id; }
    }
    $('pageList').querySelectorAll('.page-item').forEach((button) => {
      if (Number(button.dataset.index) === currentIndex) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (scroll) $('readerScroll').scrollTop = 0;
    save();
    window.dispatchEvent(new CustomEvent('esr:pagechange', { detail: { pageNumber: p.pageNumber } }));
  }
  function navigate(index) {
    if (index < 0 || index >= pages.length || index === currentIndex) return;
    if (beforeNavigate && beforeNavigate({ pageNumber: pages[index].pageNumber, id: pages[index].id }) === false) { $('pageJump').value = pages[currentIndex].id; return; }
    currentIndex = index;
    renderPage();
    const active = $('pageList').querySelector('[aria-current="page"]');
    if (active) {
      const list = $('pageList');
      const offset = active.offsetTop - list.offsetTop;
      if (offset < list.scrollTop || offset + active.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = Math.max(0, offset - list.clientHeight / 2);
    }
  }
  function applyView() {
    $('documentLayout').className = `document-layout view-${view}${$('editorPanel') && !$('editorPanel').hidden ? ' is-editing' : ''}`;
    document.querySelectorAll('[data-view]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    save();
  }
  function applyFont() {
    document.documentElement.style.setProperty('--text-size', `${fontSize}px`);
    $('fontSizeValue').textContent = String(fontSize);
    $('smallerText').disabled = fontSize <= 14;
    $('largerText').disabled = fontSize >= 28;
    save();
  }
  function hashIndex() {
    let hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch (_) { /* Ignore malformed URLs. */ }
    return pages.findIndex((p) => p.id === hash);
  }
  $('libraryTitle').textContent = data.title || 'Electrical Safety Rules';
  $('librarySubtitle').textContent = data.subtitle || '原文辨識 · 圖文對照 · 離線閱讀';
  if (hasTranslations) $('librarySubtitle').textContent = 'Version 4 · 04/04/2022 · 英文／繁體中文／中英對照';
  $('languageSelect').disabled = !hasTranslations;
  $('libraryCount').textContent = `${data.sourceCount || '—'} 張照片 / ${pages.length} 個頁面`;
  pages.forEach((p) => { const option = textNode('option', displayLabel(p)); option.value = p.id; $('pageJump').append(option); });
  let initial = hashIndex();
  if (initial === -1) initial = pages.findIndex((p) => p.id === saved.page);
  currentIndex = initial >= 0 ? initial : 0;
  $('pageList').addEventListener('click', (event) => { const button = event.target.closest('.page-item'); if (button) navigate(Number(button.dataset.index)); });
  $('previousPage').addEventListener('click', () => navigate(currentIndex - 1));
  $('nextPage').addEventListener('click', () => navigate(currentIndex + 1));
  $('pageJump').addEventListener('change', () => navigate(pages.findIndex((p) => p.id === $('pageJump').value)));
  $('languageSelect').addEventListener('change', () => {
    const chosen = $('languageSelect').value;
    if (!hasTranslations || !['en', 'zh', 'bilingual'].includes(chosen)) return;
    language = chosen;
    renderList();
    renderPage({ scroll: false });
  });
  $('searchInput').addEventListener('input', () => { query = $('searchInput').value.trim(); renderList(); renderText(); });
  $('clearSearch').addEventListener('click', () => { $('searchInput').value = ''; query = ''; renderList(); renderText(); $('searchInput').focus(); });
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { view = button.dataset.view; applyView(); }));
  $('smallerText').addEventListener('click', () => { fontSize = Math.max(14, fontSize - 1); applyFont(); });
  $('largerText').addEventListener('click', () => { fontSize = Math.min(28, fontSize + 1); applyFont(); });
  $('documentImage').addEventListener('error', () => { $('documentImage').hidden = true; $('imageError').hidden = false; });
  window.addEventListener('hashchange', () => {
    const index = hashIndex();
    if (index !== -1 && index !== currentIndex) {
      if (beforeNavigate && beforeNavigate({ pageNumber: pages[index].pageNumber, id: pages[index].id }) === false) {
        try { history.replaceState(null, '', `#${encodeURIComponent(pages[currentIndex].id)}`); } catch (_) { location.hash = pages[currentIndex].id; }
        return;
      }
      currentIndex = index; renderPage({ updateHash: false }); renderList();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,button,summary,[contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(currentIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(currentIndex + 1); }
  });
  document.addEventListener('click', (event) => { if (!$('downloadMenu').contains(event.target)) $('downloadMenu').open = false; });
  window.ESR_READER = {
    getPageNumber: () => pages[currentIndex].pageNumber,
    getPage: () => ({ ...pages[currentIndex] }),
    navigateTo: (pageNumber) => navigate(pages.findIndex((p) => p.pageNumber === Number(pageNumber))),
    setBeforeNavigate: (handler) => { beforeNavigate = typeof handler === 'function' ? handler : null; },
    setView: (choice) => { if (['text', 'split', 'image'].includes(choice)) { view = choice; applyView(); } },
    reload: (options = {}) => {
      const target = pages.find((p) => p.pageNumber === Number(options.pageNumber));
      if (target) { try { history.replaceState(null, '', `#${encodeURIComponent(target.id)}`); } catch (_) { location.hash = target.id; } }
      location.reload();
    }
  };
  renderList();
  renderPage({ scroll: false });
  applyView();
  applyFont();
})();
