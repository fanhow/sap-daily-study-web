/* Shared by daily tasks and the textbook reader; page numbers are PDF pages. */
(()=>{'use strict';
const pattern=()=>/Textbook\s+(?:PDF\s*)?p\s*(\d+(?:\s*[-–—]\s*\d+)?(?:\s*[、,，]\s*(?:p\s*)?\d+(?:\s*[-–—]\s*\d+)?)*)/gi;
const parse=value=>{const result=[];for(const item of String(value).split(/[、,，]/)){const m=item.trim().match(/^(?:p\s*)?(\d+)(?:\s*[-–—]\s*(\d+))?$/i);if(!m)continue;const a=+m[1],b=+(m[2]||m[1]);if(a<1||b<a||b>192)continue;for(let n=a;n<=b;n++)result.push(n);}return [...new Set(result)].sort((a,b)=>a-b);};
const references=text=>[...String(text).matchAll(pattern())].map(m=>({text:m[0],range:m[1].replace(/\s|p/gi,'').replace(/[–—]/g,'-').replace(/[、，]/g,','),pages:parse(m[1]),index:m.index}));
const url=(ref,day,task)=>{const q=new URLSearchParams({pages:ref.range});if(day)q.set('day',day);if(task)q.set('task',task);return 'textbook/?'+q+'#page-'+String(ref.pages[0]||1).padStart(3,'0');};
const formatPages=pages=>{const sorted=[...new Set(pages)].sort((a,b)=>a-b),ranges=[];for(let i=0;i<sorted.length;i++){const start=sorted[i];let end=start;while(sorted[i+1]===end+1)end=sorted[++i];ranges.push(start===end?String(start):`${start}–${end}`);}return ranges.join('、');};
const pagesForDay=day=>[...new Set((day?.tasks||[]).flatMap(task=>references(task.reading).flatMap(ref=>ref.pages)))].sort((a,b)=>a-b);
window.TextbookReferences={parse,references,url,formatPages,pagesForDay};
})();
