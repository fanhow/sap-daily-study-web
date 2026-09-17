(()=>{'use strict';
const data=window.STUDY_FILES;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function noteLink(name,label=name){return escape(label);}
function copyButton(){return '<span class="open-help">本機參考檔</span>';}
function noteList(names){return `<ul class="note-files">${names.split('；').map(name=>`<li>${escape(name)}</li>`).join('')}</ul><p class="open-help">這些筆記保留在本機；線上已提供 Textbook、ESR 與課前測驗閱讀器。</p>`;}
function reading(text,day,task){const refs=window.TextbookReferences.references(text);let at=0,html='';const plain=s=>s.split(/([A-Za-z0-9_]+\.md)/g).map(v=>data.notes[v]?noteLink(v):escape(v)).join('');for(const ref of refs){html+=plain(text.slice(at,ref.index))+`<a class="textbook-source-link" href="${escape(window.TextbookReferences.url(ref,day,task))}" target="_blank" rel="noopener noreferrer" title="開啟指定頁數的中英對照閱讀器">${escape(ref.text)} · 中英閱讀 ↗</a>`;at=ref.index+ref.text.length;}return html+plain(text.slice(at));}
const questionIds=['L009','L013','L040','L043','L014','L015','L022'];
function esrLink(source){if(!/^02\. ESR[\\/]/.test(source.relativePath))return '';const match=source.relativePath.match(/(?:^|[\\/])(\d{4})\.(?:heic|jpg)$/i);if(!match)return '';const page=match[1]==='0001'?1:Number(match[1].slice(0,2));return page>=1&&page<=86?`<a class="esr-source-link" href="reader/#page-${String(page).padStart(3,'0')}" target="_blank" rel="noopener noreferrer">閱讀 ESR 第 ${page} 頁 ↗</a>`:'';}
function sourceRows(rows){return rows.map(s=>`<tr><th scope="row">${escape(s.id)}</th><td><span class="source-file">${escape(s.relativePath)}</span><span class="source-pages">${escape(s.pages||'影像／影片，依內容查看')}</span>${esrLink(s)}</td><td>${copyButton(s.id)}</td></tr>`).join('');}
function questionSources(){return `<details class="question-sources"><summary>Q1–Q2 來源對照（7 個檔案）</summary><p>Q1：L009、L013、L040、L043。Q2：L013、L014、L015、L022。頁碼是 ESR 照片內的印刷頁碼。</p><div class="source-table-wrap"><table class="source-table"><thead><tr><th>ID</th><th>原始檔案／頁碼</th><th>開檔路徑</th></tr></thead><tbody>${sourceRows(questionIds.map(id=>data.sources.find(s=>s.id===id)))}</tbody></table></div></details>`;}
window.StudyResources={noteList,reading,questionSources};
document.getElementById('inventory-note-link').textContent='以下保留來源 ID、檔名及頁碼；已上線的 ESR 內容可直接點開。';
document.getElementById('notes-root').textContent=data.notesRoot;
document.getElementById('sources-root').textContent=data.sourceRoot;
document.getElementById('source-history').textContent=data.historicalNote;
function filterSources(query){const terms=query.trim().toLowerCase().split(/[\s,，；;]+/).filter(Boolean);return data.sources.filter(s=>!terms.length||terms.some(term=>(s.id+' '+s.relativePath+' '+s.pages).toLowerCase().includes(term)));}
function renderSources(){const rows=filterSources(document.getElementById('source-search').value);document.getElementById('source-rows').innerHTML=sourceRows(rows);document.getElementById('source-result-count').textContent=rows.length?`顯示 ${rows.length} / ${data.sources.length} 個檔案`:'找不到符合的檔案；可用 L009、檔名或頁碼搜尋。';}
document.getElementById('source-search').addEventListener('input',renderSources);
document.getElementById('source-filter-today').addEventListener('click',()=>{document.getElementById('source-search').value=questionIds.join(' ');renderSources();});
document.getElementById('source-filter-all').addEventListener('click',()=>{document.getElementById('source-search').value='';renderSources();});
document.addEventListener('click',async event=>{const button=event.target.closest('button[data-copy-key]');if(!button)return;const key=button.dataset.copyKey;const path=data.notes[key]||data.sources.find(s=>s.id===key)?.path;if(!path)return;const status=document.getElementById('file-action-status');const fallback=document.getElementById('file-path-fallback');try{await navigator.clipboard.writeText(path);status.textContent='已複製：'+path;fallback.hidden=true;}catch{fallback.value=path;fallback.hidden=false;fallback.focus();fallback.select();status.textContent='瀏覽器未允許自動複製。已選取完整路徑，按 Ctrl＋C 後到檔案總管貼上。';}});
renderSources();
})();
