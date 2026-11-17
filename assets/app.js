/* CSS Animations 100 — 展示站程式（資料 FX + 介面） */
'use strict';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

/* ============ 吉祥物「抵家」簡化 SVG（約 4KB） ============ */
const MASCOT_SVG = document.getElementById('dijia-svg').innerHTML.trim();
const mascot = (mod, v, bubble='', face='', look=false) => `<div class="mo-mascot ${mod}"${look?' data-mo-look':''}${face?` data-face="${face}"`:''}${st(v)}>${bubble?`<span class="mo-m-bubble">${bubble}</span>`:''}${MASCOT_SVG}</div>`;

/* ============ 工具 ============ */
let UID = 0;
const st = (v='', extra='') => (v||extra) ? ` style="${v}${extra}"` : '';
const sp = t => [...t].map((c,i)=>`<span style="--i:${i}">${c===' '?'&nbsp;':c}</span>`).join('');
const pad = n => String(n).padStart(3,'0');
const I = {
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
  hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v10M5 12l7 7 7-7"/></svg>',
  pointer:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 7-6 2-2 6z"/></svg>',
  loop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
};
const ICON_HOUSE = `<path pathLength="1" d="M8 30 L32 10 L56 30"/><path pathLength="1" d="M14 26 V54 H50 V26"/><rect pathLength="1" x="27" y="38" width="10" height="16" rx="2"/>`;

/* ============ 分類 ============ */
const CATS = [
  {k:'enter',   n:'進場登場', en:'ENTRANCE',  c:'#3B82C4', d:'區塊、標題、卡片出現在畫面時的登場方式。'},
  {k:'text',    n:'文字動態', en:'TYPOGRAPHY',c:'#8E5BD0', d:'標題、重點字、數字與輪播字的文字演出。'},
  {k:'interact',n:'互動回饋', en:'FEEDBACK',  c:'#E0703A', d:'滑過、按下、送出、完成時給使用者的即時回饋。'},
  {k:'ui',      n:'介面元件', en:'COMPONENTS',c:'#1F9E8F', d:'開關、頁籤、手風琴、勾選、評分等常用元件。'},
  {k:'process', n:'流程進度', en:'PROCESS',   c:'#2F7DD1', d:'步驟、時間軸、判斷分支、跨單位傳遞——適合教學與 SOP 網站。'},
  {k:'alert',   n:'提示警示', en:'ALERTS',    c:'#E0453A', d:'公告、期限、注意事項，吸引目光但不吵鬧。'},
  {k:'loading', n:'載入等待', en:'LOADING',   c:'#64748B', d:'資料讀取、送出處理中的等待狀態。'},
  {k:'d3',      n:'3D 立體',  en:'3D',        c:'#D9480F', d:'透視、翻轉、立方體與旋轉木馬，讓畫面有深度。'},
  {k:'icon',    n:'圖示動態', en:'ICONS',     c:'#2E9E6B', d:'選單、搜尋、下載、通知等常見圖示的微互動。'},
  {k:'scene',   n:'背景情境', en:'SCENES',    c:'#0891B2', d:'轉場、背景、分隔與天氣災害情境動態。'},
  {k:'mascot',  n:'吉祥物',   en:'MASCOT',    c:'#F28C28', d:'吉祥物「抵家」的動作與表情組（可替換成自家角色）。'},
];
const TRIG = {once:['登場一次',I.play], loop:['循環',I.loop], hover:['滑過觸發',I.pointer], click:['點擊互動',I.pointer]};

/* ============ 100 式 ============
   k: CSS 區塊鍵（對應 motion-lib.css 的「==== @mo:鍵 ====」）  p: 可調參數  d: 預設秒數  sz: 預設尺寸(px)
   h(t, v): 產生 HTML；t=文字、v=CSS 變數字串 */
const FX = [
/* ---------- 進場 ---------- */
{cat:'enter',name:'淡入上浮',cls:'mo-fade-up',k:'fade-up',trig:'once',rec:1,p:['color','dur','text'],d:.8,t:'颱風應變流程',
 desc:'由下往上淡入，最百搭的區塊登場。',use:'章節標題、卡片、段落文字捲動進場。',
 h:(t,v)=>`<div class="mo-card mo-fade-up"${st(v)}>${t}</div>`},
{cat:'enter',name:'彈跳登場',cls:'mo-pop-in',k:'pop-in',trig:'once',rec:1,p:['color','dur','text'],d:.6,t:'已完成',
 desc:'由小放大再微微回彈，有精神的出現。',use:'完成徽章、按鈕、圖示、角色登場。',
 h:(t,v)=>`<div class="mo-card mo-pop-in"${st(v)}>✨ ${t}</div>`},
{cat:'enter',name:'色塊揭示',cls:'mo-wipe-reveal',k:'wipe-reveal',trig:'once',rec:1,p:['color','dur','text'],d:1,t:'地震應變',
 desc:'色塊由左掃過，掀開後露出文字。',use:'大標題、章節封面、重點關鍵字。',
 h:(t,v)=>`<span class="mo-wipe-reveal lib-big"${st(v)}>${t}</span>`},
{cat:'enter',name:'模糊聚焦',cls:'mo-blur-in',k:'blur-in',trig:'once',rec:0,p:['dur','text'],d:.9,t:'Hello Motion',
 desc:'從模糊到清晰，像鏡頭對焦。',use:'主視覺標語、圖片進場。',
 h:(t,v)=>`<div class="lib-big mo-blur-in"${st(v)}>${t}</div>`},
{cat:'enter',name:'翻牌登場',cls:'mo-flip-in',k:'flip-in',trig:'once',rec:0,p:['dur','text'],d:.8,t:'Step 1 預警期',
 desc:'像翻開告示牌一樣由上往下翻出。',use:'步驟卡片、公告看板。',
 h:(t,v)=>`<div class="mo-card mo-flip-in"${st(v)}>${t}</div>`},
{cat:'enter',name:'依序登場',cls:'mo-stagger',k:'stagger',trig:'once',rec:1,p:['dur'],d:.6,t:'',
 desc:'子元素一個接一個出現，自動排序延遲。',use:'清單、檢核項目、卡片群組。',
 h:(t,v)=>`<div class="lib-col mo-stagger"${st(v,'font-size:12px;gap:6px;margin-top:14px')}><div class="mo-card">☐ 受信總機是否正常</div><div class="mo-card">☐ 緊急廣播系統是否正常</div><div class="mo-card">☐ 緊急發電機運轉正常</div></div>`},
{cat:'enter',name:'側滑進場',cls:'mo-slide-in',k:'slide-in',trig:'once',rec:0,p:['dur','text'],d:.7,t:'物業管理單位',
 desc:'由左側滑入，適合有方向性的內容。',use:'泳道流程左欄、側邊說明。',
 h:(t,v)=>`<div class="mo-card mo-slide-in"${st(v)}>→ ${t}</div>`},

/* ---------- 文字 ---------- */
{cat:'text',name:'逐字浮起',cls:'mo-char-rise',k:'char-rise',trig:'once',rec:1,p:['dur','text'],d:.6,t:'防災整備作業',
 desc:'文字一個一個彈跳浮起。可用 data-mo-split 自動拆字。',use:'頁面主標題、章節標題。',
 h:(t,v)=>`<h2 class="mo-char-rise lib-big"${st(v,'margin:0')}>${sp(t)}</h2>`},
{cat:'text',name:'打字機',cls:'mo-typewriter',k:'typewriter',trig:'once',rec:0,p:['color','dur','text'],d:2,t:'請於5分鐘內回傳',
 desc:'逐字打出並帶閃爍游標。以 --mo-chars 設定字數。',use:'提示語、搜尋框預設文字、角色台詞。',
 h:(t,v)=>`<span class="mo-typewriter" style="${v}--mo-chars:${[...t].length};font-size:22px;font-weight:800">${t}</span>`},
{cat:'text',name:'螢光筆劃重點',cls:'mo-marker',k:'marker',trig:'once',rec:1,p:['dur','text'],d:.9,t:'每年5月1日前',
 desc:'像拿螢光筆由左至右劃過重點。可改 --mo-mark 顏色。',use:'期限、規定、關鍵數字等必讀重點。',
 h:(t,v)=>`<p style="font-size:18px;font-weight:700;margin:0;color:var(--mo-ink)">計畫應於<span class="mo-marker"${st(v)}>${t}</span>核備。</p>`},
{cat:'text',name:'流光文字',cls:'mo-shine',k:'shine',trig:'loop',rec:0,p:['color','dur','text'],d:2.6,t:'SOP 知識庫',
 desc:'一道光澤持續掃過文字。',use:'LOGO 字、首頁大標。',
 h:(t,v)=>`<div class="mo-shine lib-big"${st(v)}>${t}</div>`},
{cat:'text',name:'數字滾動',cls:'mo-count-up',k:'count-up',trig:'once',rec:1,p:['color','dur'],d:1.6,t:'',
 desc:'數字從 0 跳到目標值，純 CSS（--mo-to 設定目標）。',use:'統計數據、完成率、戶數。',
 h:(t,v)=>`<div style="text-align:center"><b class="mo-count-up" style="${v}--mo-to:28;font-size:52px;line-height:1;color:var(--mo-color)"></b><div style="font-weight:700;color:var(--mo-sub)">處社會住宅</div></div>`},
{cat:'text',name:'波浪跳字',cls:'mo-wave-text',k:'wave-text',trig:'loop',rec:0,p:['color','dur','text'],d:1.4,t:'歡迎使用',
 desc:'文字像波浪一樣輪流跳動。',use:'歡迎語、空狀態提示。',
 h:(t,v)=>`<div class="mo-wave-text lib-big"${st(v,'color:var(--mo-color)')}>${sp(t)}</div>`},
{cat:'text',name:'底線延展',cls:'mo-underline',k:'underline',trig:'hover',rec:1,p:['color','dur','text'],d:.4,t:'下載災損報告表',
 desc:'滑過時底線由左延展、離開時往右收。',use:'文字連結、下載連結、目錄。',
 h:(t,v)=>`<a href="#" class="mo-underline" style="${v}font-size:18px;font-weight:800">${t} →</a>`},
{cat:'text',name:'漸層流動字',cls:'mo-gradient-text',k:'gradient-text',trig:'loop',rec:1,p:['color','dur','text'],d:4,t:'Animations',
 desc:'多色漸層在文字裡緩緩流動。',use:'品牌標語、主視覺大字。',
 h:(t,v)=>`<div class="mo-gradient-text lib-big"${st(v,'font-size:34px')}>${t}</div>`},
{cat:'text',name:'霓虹燈管',cls:'mo-neon',k:'neon',trig:'loop',rec:0,p:['color','dur','text'],d:3,t:'OPEN',
 desc:'發光文字偶爾閃爍，像接觸不良的霓虹燈。',use:'深色頁面標題、活動主視覺。',dark:1,
 h:(t,v)=>`<div class="mo-neon lib-big"${st(v,'font-size:40px;letter-spacing:.1em')}>${t}</div>`},
{cat:'text',name:'輪播關鍵字',cls:'mo-word-rotate',k:'word-rotate',trig:'loop',rec:1,p:['color','dur'],d:6,t:'',
 desc:'句子中的關鍵字上下輪替（最後一個重複第一個）。',use:'首頁標語「讓社宅更＿＿」。',
 h:(t,v)=>`<div class="lib-big" style="font-size:26px">讓社宅更<span class="mo-word-rotate"${st(v)}><span><b>安全</b><b>便利</b><b>溫暖</b><b>安全</b></span></span></div>`},
{cat:'text',name:'描邊填色',cls:'mo-stroke-fill',k:'stroke-fill',trig:'loop',rec:0,p:['color','dur','text'],d:3,t:'MOTION',
 desc:'空心描邊字由左至右被填滿再退去。',use:'大標裝飾字、章節數字。',
 h:(t,v)=>`<div class="mo-stroke-fill"${st(v,'font:900 46px/1 sans-serif;letter-spacing:.04em')}>${t}</div>`},

/* ---------- 互動回饋 ---------- */
{cat:'interact',name:'按壓回彈',cls:'mo-press',k:'press',trig:'hover',rec:1,p:['color','text'],t:'開始填寫',
 desc:'滑過微浮起、按下會縮小，手感扎實。',use:'所有主要按鈕。',
 h:(t,v)=>`<button class="mo-btn mo-press"${st(v)}>${t}</button>`},
{cat:'interact',name:'果凍彈跳',cls:'mo-jelly',k:'jelly',trig:'hover',rec:0,p:['color','dur','text'],d:.7,t:'看流程圖',
 desc:'滑過時像果凍一樣 Q 彈。',use:'可愛風按鈕、角色、圖示。',
 h:(t,v)=>`<button class="mo-btn mo-jelly"${st(v)}>${t}</button>`},
{cat:'interact',name:'點擊漣漪',cls:'mo-ripple',k:'ripple',trig:'click',rec:1,p:['color','dur','text'],d:.65,t:'點我試試',
 desc:'從點擊位置擴散水波紋（需 motion-helpers.js）。',use:'按鈕、清單項目、卡片。',
 h:(t,v)=>`<button class="mo-btn mo-ripple"${st(v,'padding:.9em 2em')}>${t}</button>`},
{cat:'interact',name:'錯誤抖動',cls:'mo-shake',k:'shake',trig:'once',rec:1,p:['dur'],d:.5,t:'',
 desc:'左右搖頭表示「不對喔」。',use:'表單驗證失敗、必填未填。',
 h:(t,v)=>`<div class="lib-col"><input class="lib-input mo-shake"${st(v)} value="社宅名稱" aria-invalid="true"><span class="lib-err">⚠ 請填寫物管單位</span></div>`},
{cat:'interact',name:'成功打勾',cls:'mo-check-draw',k:'check-draw',trig:'once',rec:1,p:['dur','size'],d:.5,sz:64,t:'',
 desc:'圓形彈出後，勾勾一筆畫完成。',use:'送出成功、檢核完成。',
 h:(t,v)=>`<svg class="mo-check-draw" viewBox="0 0 52 52"${st(v)}><circle cx="26" cy="26" r="25"/><path pathLength="1" d="M15 27 l7 7 15-16"/></svg>`},
{cat:'interact',name:'收藏愛心',cls:'mo-heart',k:'heart',trig:'click',rec:0,p:['size'],sz:52,t:'',
 desc:'點擊後愛心彈出並擴散光圈。',use:'收藏常用頁面、標記重要表單。',
 h:(t,v)=>`<button class="mo-heart" data-mo-toggle aria-label="收藏"${st(v)}><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3.2 4.5 6.9 4.5c2.1 0 3.6 1.1 5.1 2.9 1.5-1.8 3-2.9 5.1-2.9 3.7 0 6 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg></button>`},
{cat:'interact',name:'浮出提示',cls:'mo-toast',k:'toast',trig:'once',rec:1,p:['dur','text'],d:2.8,t:'已複製到剪貼簿',
 desc:'由下浮出、停留、淡出的小通知。',use:'複製成功、儲存完成。',
 h:(t,v)=>`<div class="mo-toast"${st(v)}>${t}</div>`},
{cat:'interact',name:'卡片浮起',cls:'mo-lift',k:'lift',trig:'hover',rec:1,p:['dur','text'],d:.35,t:'NC-01 緊急事故通報',
 desc:'滑過時卡片抬起、陰影加深。',use:'分類卡、表單下載卡、列表。',
 h:(t,v)=>`<div class="mo-card mo-lift"${st(v,'flex-direction:column;align-items:flex-start;padding:1.1em 1.3em')}><small style="color:var(--mo-sub)">文件分類</small>${t}</div>`},
{cat:'interact',name:'邊框描繪',cls:'mo-border-draw',k:'border-draw',trig:'hover',rec:0,p:['color','dur','text'],d:.5,t:'查看更多',
 desc:'滑過時邊框沿著四邊依序畫出。',use:'次要按鈕、卡片連結。',
 h:(t,v)=>`<button class="mo-border-draw"${st(v)}>${t}</button>`},
{cat:'interact',name:'光澤掃過',cls:'mo-shine-sweep',k:'shine-sweep',trig:'loop',rec:1,p:['color','dur','text'],d:2.8,t:'立即申請',
 desc:'一道斜光定期掃過按鈕，滑過時加速。',use:'主要行動按鈕（CTA）。',
 h:(t,v)=>`<button class="mo-btn mo-shine-sweep"${st(v,'padding:.9em 2em')}>${t}</button>`},
{cat:'interact',name:'箭頭推進',cls:'mo-arrow',k:'arrow-nudge',trig:'hover',rec:1,p:['color','dur','text'],d:.9,t:'閱讀完整流程',
 desc:'滑過時箭頭往前輕推，暗示「往下走」。',use:'「下一步」「了解更多」連結。',
 h:(t,v)=>`<a href="#" class="mo-arrow"${st(v,'font-size:17px')}>${t} <i>→</i></a>`},
{cat:'interact',name:'按鈕狀態變化',cls:'mo-btn-state',k:'btn-state',trig:'loop',rec:1,p:['color','dur','text'],d:4,t:'送出表單',
 desc:'按鈕縮成圓形轉圈，完成後變綠打勾。',use:'表單送出、檔案上傳。',
 h:(t,v)=>`<div class="mo-btn-state"${st(v)}><span class="mo-bs-label">${t}</span><i class="mo-bs-spin"></i><b class="mo-bs-ok">✓</b></div>`},
{cat:'interact',name:'彩紙爆發',cls:'mo-confetti',k:'confetti',trig:'click',rec:0,p:['dur','text'],d:.9,t:'全部完成',
 desc:'點擊時彩紙從中心噴出（data-mo-burst）。',use:'完成所有步驟、測驗滿分。',
 h:(t,v)=>`<button class="mo-btn mo-confetti" data-mo-burst${st(v,'padding:.9em 1.8em')}>🎉 ${t}<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></button>`},

/* ---------- 介面元件 ---------- */
{cat:'ui',name:'切換開關',cls:'mo-toggle',k:'toggle',trig:'click',rec:0,p:['color','dur','text'],d:.3,t:'只看必填項目',
 desc:'按住時圓鈕被「壓扁」，放開彈到另一側。',use:'篩選條件、顯示模式切換。',
 h:(t,v)=>`<label class="mo-toggle"${st(v)}><input type="checkbox" checked><span></span>${t}</label>`},
{cat:'ui',name:'滑動頁籤',cls:'mo-tabs',k:'tabs',trig:'click',rec:1,p:['color','dur'],d:.45,t:'',
 desc:'選中底色彈性滑到新頁籤（純 CSS）。',use:'颱風／火災／地震切換、內容分頁。',
 h:(t,v)=>{const n='tabs'+(++UID);return `<div class="mo-tabs" style="${v}--n:3;width:250px"><label><input type="radio" name="${n}" checked>颱風</label><label><input type="radio" name="${n}">火災</label><label><input type="radio" name="${n}">地震</label><i class="mo-tabs-ind"></i></div>`}},
{cat:'ui',name:'手風琴',cls:'mo-accordion',k:'accordion',trig:'click',rec:1,p:['dur','text'],d:.4,t:'1. 消防系統',
 desc:'點擊標題平滑展開／收合內容。',use:'檢核表分區、常見問題、步驟細節。',
 h:(t,v)=>`<div class="mo-accordion is-on"${st(v,'width:250px')}><button class="mo-acc-head" data-mo-toggle=".mo-accordion" aria-expanded="true">${t}</button><div class="mo-acc-body"><div>1.1 受信總機是否正常？<br>1.2 緊急廣播系統是否正常？</div></div></div>`},
{cat:'ui',name:'檢核打勾',cls:'mo-checkbox',k:'checkbox',trig:'click',rec:1,p:['color','text'],t:'緊急發電機運轉正常',
 desc:'勾選時方框 Q 彈、勾勾畫出、文字劃線變淡。',use:'線上檢核表、待辦清單。',
 h:(t,v)=>`<div class="lib-col"${st(v,'color:var(--mo-ink)')}><label class="mo-checkbox"><input type="checkbox" checked><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><path pathLength="1" d="M7 12.5l3.2 3.2L17 9"/></svg><span>${t}</span></label><label class="mo-checkbox"><input type="checkbox"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><path pathLength="1" d="M7 12.5l3.2 3.2L17 9"/></svg><span>電梯運轉正常</span></label></div>`},
{cat:'ui',name:'單選圓點',cls:'mo-radio',k:'radio',trig:'click',rec:0,p:['color','dur'],d:.35,t:'',
 desc:'選中時圓點由中心彈出。',use:'表單單選（是／否、有／無）。',
 h:(t,v)=>{const n='rd'+(++UID);return `<div class="lib-row"${st(v,'color:var(--mo-ink)')}><label class="mo-radio"><input type="radio" name="${n}" checked>是（正常）</label><label class="mo-radio"><input type="radio" name="${n}">否（異常）</label></div>`}},
{cat:'ui',name:'星等評分',cls:'mo-rating',k:'rating',trig:'click',rec:0,p:['size'],sz:30,t:'',
 desc:'滑過星星依序點亮，選中時彈一下（純 CSS）。',use:'滿意度調查、教學回饋。',
 h:(t,v)=>{const n='rt'+(++UID);return `<div class="mo-rating"${st(v)}>${[5,4,3,2,1].map(i=>`<input type="radio" name="${n}" id="${n}-${i}"${i===4?' checked':''}><label for="${n}-${i}" aria-label="${i} 顆星">★</label>`).join('')}</div>`}},

/* ---------- 流程進度 ---------- */
{cat:'process',name:'步驟推進',cls:'mo-stepper',k:'stepper',trig:'loop',rec:1,p:['color','dur'],d:.6,t:'',
 desc:'進度線延伸、完成打勾、目前步驟發光。用 Mo.stepper(el,n) 切換。',use:'多階段流程：預警→整備→應變→警戒→解除。',
 h:(t,v)=>`<div class="mo-stepper" style="${v}--n:5;--step:3;width:100%;color:var(--mo-ink)"><ol><li class="is-done">預警期</li><li class="is-done">整備期</li><li class="is-current">應變期</li><li>警戒期</li><li>解除期</li></ol></div>`,
 after:el=>{const s=$('.mo-stepper',el);let n=3;return setInterval(()=>{n=n%5+1;Mo.stepper(s,n)},1300)}},
{cat:'process',name:'時間軸描線',cls:'mo-timeline',k:'timeline',trig:'once',rec:1,p:['color','dur'],d:1.6,t:'',
 desc:'縱線由上往下畫出，節點依序出現。',use:'作業流程時序、處理歷程。',
 h:(t,v)=>`<ol class="mo-timeline"${st(v,'font-weight:700;font-size:14px;color:var(--mo-ink)')}><li>中央氣象署發布警報</li><li>填寫回傳檢核表（B）</li><li>設施整備與巡檢</li><li>回報中心承辦人員</li></ol>`},
{cat:'process',name:'流程箭頭流動',cls:'mo-flow-dash',k:'flow-dash',trig:'loop',rec:1,p:['color','dur'],d:.8,t:'',
 desc:'虛線持續往前流，表示資訊流向。',use:'流程圖連接線、通報路徑。',
 h:(t,v)=>`<svg viewBox="0 0 240 90" width="240" style="overflow:visible;font:700 12px sans-serif"><rect x="0" y="28" width="70" height="34" rx="10" fill="var(--mo-surface)" stroke="var(--mo-muted)"/><text x="35" y="49" text-anchor="middle" fill="var(--mo-ink)">物管單位</text><path class="mo-flow-dash"${st(v)} d="M74 45 C110 45 130 45 160 45"/><path d="M156 39 l8 6 -8 6" fill="none" stroke="var(--mo-color)" stroke-width="3" stroke-linecap="round"/><rect x="170" y="28" width="70" height="34" rx="10" fill="var(--mo-color)"/><text x="205" y="49" text-anchor="middle" fill="#fff">中心</text></svg>`},
{cat:'process',name:'是否判斷分支',cls:'mo-branch',k:'branch',trig:'loop',rec:1,p:['color','dur','size'],d:3.6,sz:240,t:'',
 desc:'菱形判斷亮起→兩條路徑畫出→結果框彈出。',use:'流程圖中的「判斷」節點。',
 h:(t,v)=>`<svg class="mo-branch" viewBox="0 0 240 150"${st(v)}><path class="mo-branch-path" pathLength="1" d="M90 32 H40 V100"/><path class="mo-branch-path" pathLength="1" d="M150 32 H200 V100"/><g class="mo-branch-node"><path d="M120 6 L150 32 L120 58 L90 32 Z"/><text x="120" y="32">災損?</text></g><text class="mo-branch-label" x="60" y="22">是</text><text class="mo-branch-label" x="180" y="22">否</text><g class="mo-branch-end"><rect x="0" y="104" width="84" height="34" rx="10" fill="var(--mo-danger)"/><text x="42" y="121">填災損報告</text></g><g class="mo-branch-end"><rect x="156" y="104" width="84" height="34" rx="10" fill="var(--mo-success)"/><text x="198" y="121">環境清除</text></g></svg>`},
{cat:'process',name:'進度條填滿',cls:'mo-progress',k:'progress',trig:'once',rec:1,p:['color','dur'],d:1.4,t:'',
 desc:'進度由 0 填到目標值，斜紋持續流動（--mo-value）。',use:'完成度、復原進度回報。',
 h:(t,v)=>`<div style="width:85%;color:var(--mo-ink)"><div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px;margin-bottom:6px"><span>復原進度</span><span>70%</span></div><div class="mo-progress" style="${v}--mo-value:70%"><i></i></div></div>`},
{cat:'process',name:'跨單位傳遞',cls:'mo-lane',k:'lane-pass',trig:'loop',rec:1,p:['color','dur','size'],d:3,sz:260,t:'',
 desc:'文件從左欄拋到右欄並出現「已回傳」。',use:'泳道流程：A 單位 → B 單位 的回傳。',
 h:(t,v)=>`<div class="mo-lane"${st(v)}><span>物業管理單位</span><span>中心</span><i class="mo-lane-token"></i><b class="mo-lane-ok">已回傳 ✓</b></div>`},
{cat:'process',name:'倒數計時環',cls:'mo-ring-timer',k:'ring-timer',trig:'loop',rec:1,p:['color','dur','size'],d:10,sz:120,t:'',
 desc:'圓環隨時間消退、最後轉紅（--mo-from 設定秒數）。',use:'時限提醒：「5 分鐘內回傳」。',
 h:(t,v)=>`<div class="mo-ring-timer" style="${v}--mo-from:10"><svg viewBox="0 0 100 100"><circle class="mo-ring-bg" cx="50" cy="50" r="42"/><circle class="mo-ring-fg" cx="50" cy="50" r="42" pathLength="1"/></svg><b></b><small>秒內回傳</small></div>`},
{cat:'process',name:'聚焦當前',cls:'mo-focus',k:'focus',trig:'hover',rec:1,p:['dur'],d:.35,t:'',
 desc:'滑過其中一項，其餘自動變淡，幫助專注閱讀。',use:'步驟卡、表單清單。',
 h:(t,v)=>`<div class="lib-row mo-focus"${st(v)}><div class="mo-card">A 整備計畫</div><div class="mo-card">B 檢核表</div><div class="mo-card">C 自主檢查</div></div>`},

/* ---------- 提示警示 ---------- */
{cat:'alert',name:'脈衝雷達',cls:'mo-pulse',k:'pulse-ring',trig:'loop',rec:1,p:['dur'],d:2,t:'',
 desc:'由中心向外擴散的光圈。可改 --mo-pulse-color。',use:'「立即回報」按鈕、即時狀態燈。',
 h:(t,v)=>`<button class="mo-btn mo-pulse"${st(v,'background:var(--mo-danger)')}>📞 立即回報</button>`},
{cat:'alert',name:'呼吸燈',cls:'mo-breathe',k:'breathe',trig:'loop',rec:0,p:['color','dur','text'],d:2.4,t:'目前：應變期',
 desc:'柔和的光暈一明一暗。',use:'目前狀態標籤、待處理提示。',
 h:(t,v)=>`<div class="mo-card mo-breathe"${st(v)}>● ${t}</div>`},
{cat:'alert',name:'警示閃爍',cls:'mo-blink',k:'blink',trig:'loop',rec:1,p:['dur','text'],d:1.2,t:'陸上颱風警報',
 desc:'柔和明暗閃爍（不刺眼）。',use:'警報徽章、逾期提醒。',
 h:(t,v)=>`<span class="mo-blink"${st(v,'padding:.4em 1em;border-radius:99px;background:var(--mo-danger);color:#fff;font-weight:800')}>⚠ ${t}</span>`},
{cat:'alert',name:'鈴鐺搖擺',cls:'mo-bell',k:'bell',trig:'loop',rec:0,p:['dur'],d:2.4,t:'',
 desc:'鈴鐺間歇性搖響。',use:'通知中心、新公告。',
 h:(t,v)=>`<span class="mo-bell"${st(v,'font-size:46px')}>🔔</span>`},
{cat:'alert',name:'通知徽章',cls:'mo-badge',k:'badge-pop',trig:'once',rec:0,p:['dur'],d:.5,t:'',
 desc:'右上角數字徽章彈出（data-count）。',use:'待辦數、新公告數。',
 h:(t,v)=>`<span class="mo-badge" data-count="3"${st(v)}><span class="mo-card">📋 待回傳表單</span></span>`},
{cat:'alert',name:'跑馬燈公告',cls:'mo-marquee',k:'marquee',trig:'loop',rec:1,p:['dur','text'],d:16,t:'颱風警報發布期間，請於 8 點／13 點／17 點回傳自主檢查表（C）',
 desc:'公告無縫循環，滑過暫停。內容需重複兩份。',use:'首頁緊急公告列。',
 h:(t,v)=>`<div class="mo-marquee"${st(v,'width:100%;font-weight:700;color:var(--mo-ink)')}><div class="mo-marquee-track"><span>📢 ${t}</span><span aria-hidden="true">📢 ${t}</span></div></div>`},
{cat:'alert',name:'警戒斜紋帶',cls:'mo-hazard',k:'hazard',trig:'loop',rec:1,p:['dur','text'],d:1.2,t:'緊急應變啟動中',
 desc:'黃黑斜紋持續移動的警戒帶。',use:'緊急模式橫幅、停用區塊。',
 h:(t,v)=>`<div style="width:100%;border-radius:12px;overflow:hidden"><div class="mo-hazard"${st(v,'height:12px')}></div><div style="padding:.7em;background:#1E2A3A;color:#FFD84D;text-align:center;font-weight:900">${t}</div><div class="mo-hazard"${st(v,'height:12px')}></div></div>`},
{cat:'alert',name:'注意晃動',cls:'mo-attention',k:'attention',trig:'loop',rec:1,p:['dur','text'],d:3,t:'記得回傳',
 desc:'平時靜止，每隔幾秒晃一下引起注意。',use:'未完成提醒、重要按鈕。',
 h:(t,v)=>`<span class="mo-btn mo-attention"${st(v,'background:var(--mo-accent)')}>⏰ ${t}</span>`},
{cat:'alert',name:'向下捲動提示',cls:'mo-scroll-hint',k:'scroll-hint',trig:'loop',rec:1,p:['color','dur'],d:1.6,t:'',
 desc:'滑鼠滾輪點往下滑，提示還有內容。',use:'首頁主視覺底部、長頁面開頭。',
 h:(t,v)=>`<div class="mo-scroll-hint"${st(v)}><b></b>向下捲動</div>`},

/* ---------- 載入 ---------- */
{cat:'loading',name:'三點跳動',cls:'mo-dots',k:'dots',trig:'loop',rec:1,p:['color','dur'],d:1,t:'',
 desc:'三個圓點輪流跳起。',use:'搜尋中、送出中、角色思考中。',
 h:(t,v)=>`<span class="mo-dots"${st(v,'font-size:18px')}><i></i><i></i><i></i></span>`},
{cat:'loading',name:'漸層轉圈',cls:'mo-spinner',k:'spinner',trig:'loop',rec:0,p:['color','dur','size'],d:.9,sz:48,t:'',
 desc:'帶漸層尾巴的旋轉圓環。',use:'按鈕內載入、頁面讀取。',
 h:(t,v)=>`<span class="mo-spinner"${st(v)}></span>`},
{cat:'loading',name:'骨架屏',cls:'mo-skeleton',k:'skeleton',trig:'loop',rec:1,p:['dur'],d:1.4,t:'',
 desc:'內容載入前的占位塊＋流光。',use:'列表、搜尋結果載入前。',
 h:(t,v)=>`<div style="display:grid;grid-template-columns:52px 1fr;gap:12px;width:85%;align-items:center"><span class="mo-skeleton"${st(v,'height:52px;border-radius:14px')}></span><div style="display:grid;gap:8px"><span class="mo-skeleton"${st(v,'height:14px;width:80%')}></span><span class="mo-skeleton"${st(v,'height:14px')}></span><span class="mo-skeleton"${st(v,'height:14px;width:55%')}></span></div></div>`},
{cat:'loading',name:'不定進度條',cls:'mo-indeterminate',k:'indeterminate',trig:'loop',rec:0,p:['color','dur'],d:1.3,t:'',
 desc:'不知道要等多久時的來回進度條。',use:'頁面頂端讀取、檔案上傳。',
 h:(t,v)=>`<div class="mo-indeterminate"${st(v,'width:80%')}></div>`},
{cat:'loading',name:'沙漏翻轉',cls:'mo-hourglass',k:'hourglass',trig:'loop',rec:0,p:['color','dur','size'],d:2.4,sz:44,t:'',
 desc:'沙子流完後沙漏翻面。',use:'等待審核、處理中。',
 h:(t,v)=>`<svg class="mo-hourglass" viewBox="0 0 40 56"${st(v)}><path d="M6 3h28M6 53h28M9 3c0 14 11 17 11 25S9 39 9 53M31 3c0 14-11 17-11 25s11 11 11 25"/><path class="mo-sand-top" d="M12 9h16c0 7-8 11-8 16-0-5-8-9-8-16z"/><path class="mo-sand-bot" d="M11 50h18c0-6-9-10-9-14 0 4-9 8-9 14z"/></svg>`},
{cat:'loading',name:'方陣縮放',cls:'mo-grid-loader',k:'grid-loader',trig:'loop',rec:0,p:['color','dur','size'],d:1.3,sz:44,t:'',
 desc:'九宮格方塊以斜向波紋縮放。',use:'圖庫、資料表載入。',
 h:(t,v)=>`<div class="mo-grid-loader"${st(v)}>${'<i></i>'.repeat(9)}</div>`},
{cat:'loading',name:'音量跳動條',cls:'mo-equalizer',k:'equalizer',trig:'loop',rec:0,p:['color','dur','size'],d:1,sz:36,t:'',
 desc:'五條長條像等化器上下跳動。',use:'語音播放中、即時更新中。',
 h:(t,v)=>`<div class="mo-equalizer"${st(v)}>${'<i></i>'.repeat(5)}</div>`},

/* ---------- 3D ---------- */
{cat:'d3',name:'3D 翻轉卡片',cls:'mo-flip-card',k:'flip-card',trig:'hover',rec:1,p:['color','dur','size'],d:.7,sz:200,t:'',
 desc:'滑過（或點擊）翻面，正面問題、背面答案。',use:'名詞解釋、表單代號說明、小測驗。',
 h:(t,v)=>`<div class="mo-flip-card" data-mo-toggle${st(v,'color:var(--mo-ink)')}><div class="mo-flip-inner"><div class="mo-flip-face">表單（B）是什麼？</div><div class="mo-flip-face mo-flip-face--back">颱風及豪雨（前）社宅重點檢核表</div></div></div>`},
{cat:'d3',name:'旋轉立方體',cls:'mo-cube',k:'cube',trig:'loop',rec:0,p:['color','dur','size'],d:8,sz:76,t:'',
 desc:'六面立方體持續自轉。',use:'主視覺裝飾、載入畫面。',
 h:(t,v)=>`<div class="mo-cube"${st(v)}><i>CSS</i><i>3D</i><i>100</i><i>3D</i><i></i><i></i></div>`},
{cat:'d3',name:'3D 傾斜卡片',cls:'mo-tilt',k:'tilt',trig:'hover',rec:1,p:['dur'],d:.5,t:'滑鼠移過來',
 desc:'跟著滑鼠位置 3D 傾斜並出現反光（helpers 跟隨）。',use:'精選卡片、會員卡、作品集。',
 h:(t,v)=>`<div class="mo-card mo-tilt"${st(v,'flex-direction:column;padding:1.6em 2.2em;border-radius:18px')}>${t}<small style="color:var(--mo-sub)">3D 傾斜跟隨</small></div>`},
{cat:'d3',name:'翻頁書本',cls:'mo-book',k:'page-turn',trig:'loop',rec:0,p:['color','dur','size'],d:2.6,sz:150,t:'',
 desc:'右頁沿書脊翻到左邊，連續翻頁。',use:'電子手冊、教學章節入口。',
 h:(t,v)=>`<div class="mo-book"${st(v)}><i></i><i></i></div>`},
{cat:'d3',name:'立體按鈕',cls:'mo-btn-3d',k:'btn-3d',trig:'hover',rec:1,p:['color','text'],t:'按下去',
 desc:'有厚度的按鈕，按下時真的「陷進去」。',use:'遊戲化介面、重要確認按鈕。',
 h:(t,v)=>`<button class="mo-btn mo-btn-3d"${st(v,'padding:.9em 2em;border-radius:14px')}>${t}</button>`},
{cat:'d3',name:'立體浮起字',cls:'mo-text-3d',k:'text-3d',trig:'loop',rec:0,p:['color','dur','text'],d:2.4,t:'POP!',
 desc:'文字長出厚度並往前浮起。',use:'活動標題、促銷字。',
 h:(t,v)=>`<div class="mo-text-3d"${st(v,'font:900 50px/1 sans-serif')}>${t}</div>`},
{cat:'d3',name:'摺頁展開',cls:'mo-fold',k:'fold',trig:'loop',rec:0,p:['color','dur','size'],d:3,sz:90,t:'',
 desc:'三摺頁左右兩片沿摺線闔上又打開。',use:'摺頁 DM、手冊展開。',
 h:(t,v)=>`<div class="mo-fold"${st(v)}><i></i><i></i><i></i></div>`},
{cat:'d3',name:'翻轉硬幣',cls:'mo-coin',k:'coin',trig:'loop',rec:0,p:['dur','size'],d:2.4,sz:70,t:'',
 desc:'金幣沿 Y 軸持續翻轉。',use:'集點、獎勵、繳費提示。',
 h:(t,v)=>`<div class="mo-coin"${st(v)}>100</div>`},
{cat:'d3',name:'旋轉木馬',cls:'mo-carousel-3d',k:'carousel-3d',trig:'loop',rec:0,p:['color','dur','size'],d:9,sz:110,t:'',
 desc:'六張卡片環繞成圈緩緩旋轉。',use:'精選項目、作品展示。',
 h:(t,v)=>`<div class="mo-carousel-3d"${st(v)}>${['颱風','地震','火災','停電','淹水','漏水'].map((x,i)=>`<i style="--i:${i}">${x}</i>`).join('')}</div>`},
{cat:'d3',name:'翻牌數字',cls:'mo-flip-num',k:'flip-num',trig:'loop',rec:0,p:['color','dur','size'],d:3,sz:64,t:'',
 desc:'數字牌沿 X 軸翻轉換到下一個數字。',use:'倒數天數、號碼牌、統計。',
 h:(t,v)=>`<div class="mo-flip-num"${st(v)}><span><b>9</b><b>10</b></span></div>`},

/* ---------- 圖示 ---------- */
{cat:'icon',name:'選單變叉叉',cls:'mo-menu',k:'menu',trig:'click',rec:1,p:['dur'],d:.4,t:'',
 desc:'三條線點擊後變成關閉的叉叉。',use:'手機版選單按鈕。',
 h:(t,v)=>`<button class="mo-menu" data-mo-toggle aria-label="選單"${st(v)}><i></i><i></i><i></i></button>`},
{cat:'icon',name:'搜尋放大鏡',cls:'mo-search-icon',k:'search',trig:'loop',rec:0,p:['color','dur','size'],d:2.4,sz:48,t:'',
 desc:'放大鏡繞圈「找東西」。',use:'搜尋中、查無結果插圖。',
 h:(t,v)=>`<div class="mo-search-icon"${st(v)}></div>`},
{cat:'icon',name:'下載箭頭',cls:'mo-download',k:'download',trig:'loop',rec:1,p:['color','dur','size'],d:1.4,sz:48,t:'',
 desc:'箭頭落入托盤，托盤接住時壓一下。',use:'表單下載按鈕。',
 h:(t,v)=>`<svg class="mo-download" viewBox="0 0 48 48"${st(v)}><path class="mo-dl-arrow" d="M24 6v22M15 20l9 9 9-9"/><path class="mo-dl-tray" d="M8 32v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6"/></svg>`},
{cat:'icon',name:'齒輪轉動',cls:'mo-gear',k:'gear',trig:'loop',rec:0,p:['color','dur','size'],d:4,sz:60,t:'',
 desc:'大小齒輪互相反向轉動。',use:'設定頁、系統維護中。',
 h:(t,v)=>`<div class="mo-gear"${st(v)}><svg viewBox="0 0 40 40"><circle class="mo-gear-teeth" cx="20" cy="20" r="16"/><circle class="mo-gear-body" cx="20" cy="20" r="10.5"/></svg><svg viewBox="0 0 40 40"><circle class="mo-gear-teeth" cx="20" cy="20" r="16"/><circle class="mo-gear-body" cx="20" cy="20" r="10.5"/></svg></div>`},
{cat:'icon',name:'定位圖釘',cls:'mo-pin',k:'pin-drop',trig:'loop',rec:1,p:['dur','size'],d:2,sz:44,t:'',
 desc:'圖釘從上方落下，地面擴散一圈。',use:'社宅位置、地圖標記。',
 h:(t,v)=>`<span class="mo-pin"${st(v)}><i></i></span>`},
{cat:'icon',name:'信件開啟',cls:'mo-mail',k:'mail',trig:'loop',rec:0,p:['color','dur','size'],d:3,sz:80,t:'',
 desc:'信封蓋掀開、信紙滑出。',use:'聯絡我們、通知信。',
 h:(t,v)=>`<svg class="mo-mail" viewBox="0 0 84 62"${st(v)}><rect class="mo-mail-back" x="2" y="16" width="80" height="44" rx="7"/><path class="mo-mail-flap mo-mail-flap--back" d="M6 17L42 -3L78 17Z"/><g class="mo-mail-letter"><rect x="12" y="20" width="60" height="34" rx="4"/><path d="M21 29h42M21 37h30"/></g><path class="mo-mail-front" d="M3.5 26L42 44L80.5 26V53Q80.5 58.5 75 58.5H9Q3.5 58.5 3.5 53Z"/><path class="mo-mail-flap mo-mail-flap--front" d="M6 17L42 37L78 17Z"/></svg>`},
{cat:'icon',name:'電池充電',cls:'mo-battery',k:'battery',trig:'loop',rec:0,p:['dur','size'],d:2.6,sz:70,t:'',
 desc:'電量一格一格充滿。',use:'停電整備、緊急電源說明。',
 h:(t,v)=>`<div class="mo-battery"${st(v,'color:var(--mo-ink)')}><i></i></div>`},
{cat:'icon',name:'訊號連線',cls:'mo-wifi',k:'wifi',trig:'loop',rec:0,p:['color','dur','size'],d:1.8,sz:64,t:'',
 desc:'訊號弧線由內而外依序亮起。',use:'連線中、網路狀態。',
 h:(t,v)=>`<svg class="mo-wifi" viewBox="0 0 64 52"${st(v)}><circle cx="32" cy="46" r="4"/><path d="M23 36a13 13 0 0 1 18 0"/><path d="M14 27a26 26 0 0 1 36 0"/><path d="M5 18a39 39 0 0 1 54 0"/></svg>`},
{cat:'icon',name:'垃圾桶掀蓋',cls:'mo-trash',k:'trash',trig:'hover',rec:0,p:['dur','size'],d:.45,sz:44,t:'',
 desc:'滑過時蓋子掀起，暗示「刪除」。',use:'刪除按鈕。',
 h:(t,v)=>`<div class="mo-trash"${st(v)} role="button" aria-label="刪除"><i></i></div>`},
{cat:'icon',name:'播放暫停',cls:'mo-play',k:'play-pause',trig:'click',rec:1,p:['color','dur','size'],d:.35,sz:56,t:'',
 desc:'圓角三角形與暫停雙槓旋轉互換。',use:'影片、語音導覽播放鈕。',
 h:(t,v)=>`<button class="mo-play" data-mo-toggle aria-label="播放／暫停"${st(v)}><svg class="mo-play-tri" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg><svg class="mo-play-pause" viewBox="0 0 24 24"><rect x="5" y="4" width="4.5" height="16" rx="1.6"/><rect x="14.5" y="4" width="4.5" height="16" rx="1.6"/></svg></button>`},
{cat:'icon',name:'圖示描繪',cls:'mo-icon-draw',k:'icon-draw',trig:'loop',rec:1,p:['color','dur','size'],d:2.8,sz:80,t:'',
 desc:'線條圖示一筆一筆畫出（路徑加 pathLength="1"）。',use:'分類圖示、空狀態插圖。',
 h:(t,v)=>`<svg class="mo-icon-draw" viewBox="0 0 64 64"${st(v)}>${ICON_HOUSE}</svg>`},

/* ---------- 背景情境 ---------- */
{cat:'scene',name:'雙色擦拭轉場',cls:'mo-page-wipe',k:'page-wipe',trig:'once',rec:0,p:['color','dur','text'],d:1.2,t:'NC-01 緊急事故通報',
 desc:'兩層色塊掃過畫面，適合換頁／換章節。',use:'切換頁面、切換分類的過場。',
 h:(t,v)=>`<div class="mo-page-wipe"${st(v,'position:absolute;inset:0;display:grid;place-items:center;font-weight:900;font-size:20px')}>${t}</div>`},
{cat:'scene',name:'波浪分隔',cls:'mo-wave',k:'wave-divider',trig:'loop',rec:0,p:['color','dur','size'],d:6,sz:60,t:'',
 desc:'兩層波浪持續流動的區塊分隔線。',use:'主視覺底部、水相關主題頁。',
 h:(t,v)=>`<div class="mo-wave"${st(v,'position:absolute;left:0;right:0;bottom:0')}><svg viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z"/></svg><svg viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="M0 34 Q150 8 300 34 T600 34 T900 34 T1200 34 V60 H0Z"/></svg></div>`},
{cat:'scene',name:'輕盈漂浮',cls:'mo-float',k:'float',trig:'loop',rec:0,p:['dur'],d:3.2,t:'',
 desc:'上下漂浮並微微擺動。',use:'插圖、裝飾元素。',
 h:(t,v)=>`<span class="mo-float"${st(v,'font-size:52px;display:inline-block')}>🎈</span>`},
{cat:'scene',name:'豪雨情境',cls:'mo-rain',k:'rain',trig:'loop',rec:1,p:['dur','text'],d:.5,t:'颱風及豪雨',
 desc:'斜雨持續落下的背景層（::before）。',use:'颱風豪雨主題頁背景。',dark:1,
 h:(t,v)=>`<div class="mo-rain lib-sky"${st(v)}>🌀 ${t}</div>`},
{cat:'scene',name:'地震搖晃',cls:'mo-quake',k:'quake',trig:'loop',rec:1,p:['dur'],d:2.6,t:'',
 desc:'一陣快速搖晃後停住，週期重複。',use:'地震主題頁圖示。',
 h:(t,v)=>`<div style="text-align:center;color:var(--mo-ink)"><span class="mo-quake"${st(v,'font-size:54px')}>🏢</span><div style="font-weight:800;font-size:13px">搖晃超過 15 秒</div></div>`},
{cat:'scene',name:'火焰閃動',cls:'mo-flame',k:'flame',trig:'loop',rec:1,p:['dur','size'],d:.9,sz:56,t:'',
 desc:'純 CSS 火焰，雙層搖曳。',use:'火災主題頁圖示。',
 h:(t,v)=>`<span class="mo-flame"${st(v)}></span>`},
{cat:'scene',name:'強風吹動',cls:'mo-wind',k:'wind',trig:'loop',rec:1,p:['dur'],d:1.6,t:'',
 desc:'以底部為軸被風吹彎。',use:'颱風頁植栽、旗幟、招牌。',
 h:(t,v)=>`<svg class="mo-wind" viewBox="0 0 60 80" width="70"${st(v)}><rect x="27" y="40" width="6" height="40" rx="3" fill="#8B6A4E"/><circle cx="30" cy="30" r="20" fill="#2E9E6B"/><circle cx="18" cy="38" r="12" fill="#3DB27B"/><circle cx="42" cy="38" r="12" fill="#3DB27B"/></svg>`},
{cat:'scene',name:'漸層流動背景',cls:'mo-gradient-bg',k:'gradient-bg',trig:'loop',rec:1,p:['color','dur','text'],d:10,t:'Welcome',
 desc:'多色漸層緩慢流動的背景。',use:'首頁主視覺、登入頁背景。',
 h:(t,v)=>`<div class="mo-gradient-bg"${st(v,'position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:900;font-size:24px')}>${t}</div>`},
{cat:'scene',name:'流體色塊',cls:'mo-blob',k:'blob',trig:'loop',rec:0,p:['color','dur','size'],d:8,sz:110,t:'',
 desc:'圓角不斷變形的有機色塊。',use:'背景裝飾、頭像底圖。',
 h:(t,v)=>`<div class="mo-blob"${st(v)}></div>`},
{cat:'scene',name:'旋轉光邊框',cls:'mo-spin-border',k:'spin-border',trig:'loop',rec:1,p:['color','dur','text'],d:3,t:'精選內容',
 desc:'一圈漸層光沿著卡片邊框旋轉（@property）。',use:'精選卡片、重要公告框。',
 h:(t,v)=>`<div class="mo-spin-border"${st(v,'padding:1.4em 2em;font-weight:800;color:var(--mo-ink)')}>${t}</div>`},

/* ---------- 吉祥物 ---------- */
{cat:'mascot',name:'待機呼吸',cls:'mo-mascot--idle',k:['mascot','mascot-idle'],trig:'loop',rec:1,p:['dur','size'],d:2.6,sz:120,t:'',
 desc:'身體微微伸縮呼吸＋自動眨眼。',use:'角色的預設狀態。',
 h:(t,v)=>mascot('mo-mascot--idle',v)},
{cat:'mascot',name:'連續眨眼',cls:'mo-mascot--blink',k:['mascot','mascot-blink'],trig:'loop',rec:0,p:['dur','size'],d:2.4,sz:120,t:'',
 desc:'連續眨兩下眼，像在思考。',use:'等待使用者操作時。',
 h:(t,v)=>mascot('mo-mascot--blink',v)},
{cat:'mascot',name:'揮手招呼',cls:'mo-mascot--wave',k:['mascot','mascot-wave'],trig:'loop',rec:1,p:['dur','size'],d:1.2,sz:120,t:'',
 desc:'舉手揮動打招呼。',use:'首頁歡迎、新手導覽。',
 h:(t,v)=>mascot('mo-mascot--wave',v,'','wink')},
{cat:'mascot',name:'開心跳躍',cls:'mo-mascot--jump',k:['mascot','mascot-jump'],trig:'loop',rec:1,p:['dur','size'],d:1.2,sz:120,t:'',
 desc:'蹲下蓄力→跳起舉手→落地回彈。',use:'完成檢核、回傳成功。',
 h:(t,v)=>mascot('mo-mascot--jump',v,'','laugh')},
{cat:'mascot',name:'對話泡泡',cls:'mo-mascot--talk',k:['mascot','mascot-talk'],trig:'loop',rec:1,p:['dur','size','text'],d:3,sz:110,t:'先看流程圖喔！',
 desc:'嘴巴開合＋對話泡泡彈出。',use:'操作提示、小知識。',
 h:(t,v)=>mascot('mo-mascot--talk',v,t)},
{cat:'mascot',name:'緊急警戒',cls:'mo-mascot--alert',k:['mascot','mascot-alert'],trig:'loop',rec:1,p:['dur','size'],d:1.6,sz:120,t:'',
 desc:'帽子彈起、驚嘆號跳出、身體發抖。',use:'緊急事故頁、警報發布中。',
 h:(t,v)=>mascot('mo-mascot--alert',v,'','worried')},
{cat:'mascot',name:'角落探頭',cls:'mo-peek',k:['mascot','mascot-peek'],trig:'loop',rec:1,p:['dur','size'],d:4,sz:120,t:'',
 desc:'從下方探頭左右看看再躲回去。',use:'頁尾彩蛋、空狀態。',
 h:(t,v)=>`<div class="mo-peek"${st(v,'width:100%;position:absolute;bottom:0;left:0')}>${mascot('',v,'','surprised')}</div>`},
{cat:'mascot',name:'表情切換',cls:'mo-mascot--faces',k:['mascot','mascot-faces'],trig:'loop',rec:1,p:['size'],sz:120,t:'',
 desc:'改 data-face 即可換 10 種表情；加 data-mo-look 視線跟隨滑鼠。',use:'回饋情緒：開心、疑惑、難過、生氣…',
 h:(t,v)=>mascot('mo-mascot--faces mo-mascot--idle',v,'','happy',true),
 after:el=>{const m=$('.mo-mascot',el),F=['happy','surprised','wink','laugh','sleep','worried','love','cry','confused','angry'];let i=0;return setInterval(()=>{m.dataset.face=F[i=(i+1)%F.length]},1100)}},
];
FX.forEach((f,i)=>f.id=i+1);

/* ============ 狀態 ============ */
const G = {color:null, speed:1, text:'', auto:true, cat:'all', q:''};
const LIB = $('#mo-lib').textContent;
const timers = new Map();
const store = {get(k){try{return localStorage.getItem(k)}catch(_){return null}}, set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};

function blocks(k){
  return ['tokens', ...[].concat(k)].map(key=>{
    const m = LIB.split(`/* ==== @mo:${key} ==== */`)[1];
    return m ? `/* ==== @mo:${key} ==== */` + m.split('/* ==== @mo:')[0].trimEnd() : '';
  }).join('\n\n');
}
function vars(o){
  let v='';
  if(o.color) v+=`--mo-color:${o.color};`;
  if(o.dur!=null) v+=`--mo-dur:${o.dur}s;`;
  if(o.size!=null) v+=`--mo-size:${o.size}px;`;
  return v;
}
function render(stage, fx, o={}){
  const id = stage.dataset.tid; if(id && timers.has(id)){clearInterval(timers.get(id)); timers.delete(id)}
  const t = o.text || (fx.p.includes('text') && G.text) || fx.t;
  const holder = $('.lib-holder', stage) || stage;
  holder.innerHTML = fx.h(t, vars({color:o.color||G.color, dur:o.dur, size:o.size}));
  if(fx.after){ const tid = Math.random().toString(36).slice(2); stage.dataset.tid = tid; timers.set(tid, fx.after(holder)); }
  rate(stage);
}
function rate(stage){ requestAnimationFrame(()=>stage.getAnimations({subtree:true}).forEach(a=>a.playbackRate=G.speed)); }
function codeOf(fx, o={}){
  const t = o.text || fx.t;
  return fx.h(t, vars(o)).replace(/ name="(tabs|rd|rt)\d+"/g,' name="$1-group"').replace(/ (id|for)="rt\d+-/g,' $1="rt-').replace(/></g,'>\n<').replace(/\n<\/(span|b|text|i|label)>/g,'</$1>');
}
function prompt(fx, html){
  const ps = {color:'--mo-color 主色',dur:'--mo-dur 動畫長度',size:'--mo-size 尺寸',text:'文字內容'};
  return `請在網頁中套用「CSS Animations 100」動畫庫的 No.${pad(fx.id)}【${fx.name}】（class：.${fx.cls}）。
‧ 效果：${fx.desc}
‧ 建議用途：${fx.use}
‧ 觸發方式：${TRIG[fx.trig][0]}${fx.trig==='once'?'（若要捲到畫面才播放，加上 class「mo-onview」並引入 motion-helpers.js）':''}
‧ 可調參數：${fx.p.map(p=>ps[p]).join('、')}
‧ 規範：沿用 mo- 前綴命名；以 transform／opacity 為主；保留 prefers-reduced-motion 無障礙設定；支援 data-theme="dark" 深色模式；中文內容為主。

【HTML】
${html}

【CSS】
${blocks(fx.k)}`;
}

/* ============ 建立畫面 ============ */
const groupsEl = $('#groups');
function build(){
  groupsEl.innerHTML = CATS.map((c,ci)=>{
    const list = FX.filter(f=>f.cat===c.k);
    return `<section class="lib-group" id="cat-${c.k}" data-cat="${c.k}" style="--c:${c.c}">
      <header class="lib-ghead"><h2><small>${String(ci+1).padStart(2,'0')} · ${c.en} · No.${pad(list[0].id)}–${pad(list.at(-1).id)}</small>${c.n}</h2><p>${c.d}</p></header>
      <div class="lib-grid">${list.map(f=>`
        <article class="lib-card" data-id="${f.id}">
          <div class="lib-stage${f.dark?' is-dark':''}" data-stage><span class="lib-badge">${TRIG[f.trig][1]}${TRIG[f.trig][0]}</span>${f.trig==='once'?`<button class="lib-replay" aria-label="重播" data-replay>${I.replay}</button>`:''}<div class="lib-holder" style="display:contents"></div></div>
          <div class="lib-foot" data-detail>
            <div class="lib-num"><i></i>No.${pad(f.id)}${f.rec?' <em>★ 推薦</em>':''}</div>
            <h3 class="lib-name">${f.name}</h3>
            <code class="lib-cls">.${f.cls}</code>
            <div class="lib-acts"><button data-copycls aria-label="複製 class" title="複製 class">${I.copy}</button><button data-detail aria-label="查看程式碼與客製" title="程式碼與客製">${I.code}</button></div>
          </div>
        </article>`).join('')}</div></section>`;
  }).join('') + '<p class="lib-empty" id="empty" hidden>找不到符合的動畫，換個關鍵字試試 🙂</p>';

  $$('.lib-card').forEach(card=>{
    const fx = FX[card.dataset.id-1], stage = $('[data-stage]', card);
    render(stage, fx); setPaused(stage, fx);
    card.addEventListener('mouseenter', ()=>{ if(fx.trig==='once') render(stage,fx); stage.classList.remove('lib-paused'); rate(stage); });
    card.addEventListener('mouseleave', ()=>setPaused(stage,fx));
    $('[data-replay]', card)?.addEventListener('click', ()=>render(stage,fx));
    $('.lib-foot', card).addEventListener('click', e=>{
      if(e.target.closest('[data-copycls]')) return copy(fx.cls.startsWith('mo-mascot--')?`mo-mascot ${fx.cls}`:fx.cls, `已複製 .${fx.cls}`);
      openDetail(fx);
    });
  });
  const io = new IntersectionObserver(es=>es.forEach(e=>e.target._vis = e.isIntersecting),{rootMargin:'100px'});
  $$('[data-stage]').forEach(s=>io.observe(s));
  setInterval(()=>{ if(!G.auto) return;
    $$('.lib-card:not([hidden])').forEach(card=>{
      const fx = FX[card.dataset.id-1], s = $('[data-stage]', card);
      if(fx.trig==='once' && s._vis && !card.matches(':hover')) render(s,fx);
    });
  }, 4200);
  // 側欄跟著捲動高亮
  const spy = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting && G.cat==='all') markNav(e.target.dataset.cat); }),{rootMargin:'-30% 0px -60% 0px'});
  $$('.lib-group').forEach(g=>spy.observe(g));
}
function setPaused(stage, fx){ stage.classList.toggle('lib-paused', !G.auto && fx.trig==='loop'); }

function navs(){
  const items = [{k:'all',n:'全部',c:'var(--ink)',count:FX.length},{k:'rec',n:'★ 推薦',c:'var(--accent)',count:FX.filter(f=>f.rec).length},
    ...CATS.map(c=>({k:c.k,n:c.n,c:c.c,count:FX.filter(f=>f.cat===c.k).length}))];
  const html = items.map((c,i)=>`${i===2?'<hr>':''}<button class="lib-nav" data-k="${c.k}" style="--c:${c.c}" aria-current="${c.k==='all'}"><i></i>${c.n}<span>${c.count}</span></button>`).join('');
  $('#sideNav').innerHTML = '<h2>CATEGORIES</h2>' + html;
  $('#chips').innerHTML = html.replace('<hr>','');
  const onClick = e=>{ const b=e.target.closest('.lib-nav'); if(!b) return; const k=b.dataset.k;
    if(k==='all'||k==='rec'){ G.cat=k; filter(); markNav(k); scrollTo({top:$('#library').offsetTop-70}); }
    else { if(G.cat!=='all'){ G.cat='all'; filter(); } markNav(k); $('#cat-'+k).scrollIntoView(); } };
  $('#sideNav').addEventListener('click', onClick); $('#chips').addEventListener('click', onClick);
}
function markNav(k){ $$('.lib-nav').forEach(b=>b.setAttribute('aria-current', b.dataset.k===k)); }
function filter(){
  const q = G.q.trim().toLowerCase(); let shown=0;
  $$('.lib-card').forEach(card=>{
    const f = FX[card.dataset.id-1], cat = CATS.find(c=>c.k===f.cat);
    const okCat = G.cat==='all' || (G.cat==='rec'?f.rec:f.cat===G.cat);
    const hay = [f.name,f.cls,f.desc,f.use,cat.n,cat.en,pad(f.id),String(f.id)].join(' ').toLowerCase();
    const ok = okCat && (!q || q.split(/\s+/).every(w=>hay.includes(w)));
    card.hidden = !ok; if(ok) shown++;
  });
  $$('.lib-group').forEach(g=>g.hidden = !$('.lib-card:not([hidden])', g));
  $('#empty').hidden = shown>0;
}
function rerenderAll(){ $$('.lib-card').forEach(card=>{ const fx=FX[card.dataset.id-1], s=$('[data-stage]', card); render(s,fx); setPaused(s,fx); }); }

/* ============ 詳細視窗 ============ */
const M = {fx:null,o:{},tab:'html'};
const modal = $('#modal');
const SW = ['#004A85','#2E9E6B','#F28C28','#E0453A','#8E5BD0'];
function openDetail(fx){
  M.fx=fx; M.o={color:G.color, dur:null, size:null, text:(fx.p.includes('text')&&G.text)||fx.t}; M.tab='html';
  const c = CATS.find(c=>c.k===fx.cat);
  $('#mTitle').textContent = fx.name;
  $('#mMeta').innerHTML = `<span style="--c:${c.c}"><i></i>No.${pad(fx.id)} · ${c.n}</span><code>.${fx.cls}</code>${fx.rec?'<em>★ 推薦</em>':''}`;
  $('#mKv').innerHTML = `<dt>效果</dt><dd>${fx.desc}</dd><dt>建議用途</dt><dd>${fx.use}</dd><dt>觸發</dt><dd>${TRIG[fx.trig][0]}</dd>`;
  let h = '<h4>CUSTOMIZE · 即時預覽</h4>';
  if(fx.p.includes('color')) h += `<div class="lib-param">主色<div class="lib-field-row">${SW.map(x=>`<button class="lib-sw" style="background:${x}" data-c="${x}" aria-label="${x}"></button>`).join('')}<input type="color" data-p="color" value="${M.o.color||'#004A85'}" aria-label="自訂主色"></div></div>`;
  if(fx.p.includes('dur')) h += `<div class="lib-param">速度<input type="range" data-p="dur" min=".1" max="${Math.max(6,fx.d*2)}" step=".1" value="${fx.d}"><output>${fx.d}s</output></div>`;
  if(fx.p.includes('size')) h += `<div class="lib-param">尺寸<input type="range" data-p="size" min="${Math.round(fx.sz*.5)}" max="${Math.round(fx.sz*1.8)}" step="1" value="${fx.sz}"><output>${fx.sz}px</output></div>`;
  if(fx.p.includes('text')) h += `<div class="lib-param">文字<input type="text" data-p="text" value="${M.o.text}" maxlength="40"></div>`;
  h += `<div class="lib-pbtns"><button class="lib-btn" id="mReplay">${I.replay}重播</button><button class="lib-btn" id="mReset">重設</button></div>`;
  const P = $('#mParams'); P.innerHTML = h;
  P.oninput = e=>{ const p=e.target.dataset.p; if(!p) return;
    M.o[p] = (p==='text'||p==='color') ? e.target.value : +e.target.value;
    const out = e.target.nextElementSibling; if(out?.tagName==='OUTPUT') out.textContent = e.target.value + (p==='dur'?'s':'px');
    upd(); };
  P.onclick = e=>{ const sw=e.target.closest('[data-c]'); if(sw){ M.o.color=sw.dataset.c; $('[data-p=color]',P).value=sw.dataset.c; upd(); }
    if(e.target.closest('#mReplay')) upd(); if(e.target.closest('#mReset')) openDetail(fx); };
  $('#mStage').className = 'lib-stage'+(fx.dark?' is-dark':'');
  upd(); setTab('html');
  modal.classList.add('is-open'); document.body.style.overflow='hidden'; $('#mClose').focus();
  buddySay('可以調整參數喔！','mo-mascot--wave','wink');
}
function upd(){ render($('#mStage'), M.fx, {color:M.o.color, dur:M.o.dur, size:M.o.size, text:M.o.text}); showCode(); }
function curCode(){ const fx=M.fx, html = codeOf(fx,{color:M.o.color,dur:M.o.dur,size:M.o.size,text:M.o.text});
  return M.tab==='html'? html : M.tab==='css'? blocks(fx.k) : prompt(fx, html); }
function showCode(){ $('#mCode').textContent = curCode(); }
function setTab(t){ M.tab=t; $$('#mTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t)); showCode(); }
$('#mTabs').addEventListener('click', e=>{ const b=e.target.closest('button'); if(b) setTab(b.dataset.t); });
$('#mCopy').addEventListener('click', ()=>copy(curCode(), M.tab==='ai'?'已複製 AI 指令':'已複製 '+M.tab.toUpperCase()));
function closeDetail(){ modal.classList.remove('is-open'); document.body.style.overflow=''; const s=$('#mStage'); if(timers.has(s.dataset.tid)) clearInterval(timers.get(s.dataset.tid)); }
$('#mClose').addEventListener('click', closeDetail);
modal.addEventListener('click', e=>{ if(e.target===modal) closeDetail(); });

/* ============ 複製／下載／吉祥物 ============ */
async function copy(text, msg){
  try{ await navigator.clipboard.writeText(text); }
  catch(_){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  toast(msg||'已複製'); buddyCheer();
}
function toast(msg){ $('#toastHost').innerHTML=`<div class="mo-toast">${msg}</div>`; }
function download(name, text, type){
  if(window.self!==window.top) return copy(text, '預覽環境無法下載，已改為複製 '+name+' 內容');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000); toast('已下載 '+name); buddyCheer();
}
$('#dlCss').onclick = ()=>download('motion-lib.css', LIB.trim()+'\n', 'text/css');
$('#dlJs').onclick = ()=>download('motion-helpers.js', $('#mo-helpers').textContent.trim()+'\n', 'text/javascript');
$('#copyAll').onclick = ()=>copy(
  'CSS Animations 100 動畫庫索引。使用時請引入 motion-lib.css 與 motion-helpers.js，class 皆為 mo- 前綴，參數用 CSS 變數 --mo-color、--mo-dur、--mo-size 調整，深色模式在 html 加 data-theme="dark"。\n\n' +
  CATS.map(c=>`【${c.n}】\n`+FX.filter(f=>f.cat===c.k).map(f=>`No.${pad(f.id)} ${f.name}（.${f.cls}｜${TRIG[f.trig][0]}）：${f.desc} 用途：${f.use}`).join('\n')).join('\n\n'),
  '已複製 100 式索引，可貼給 AI');

const buddy = $('#buddy');
buddy.innerHTML = `<div class="mo-mascot mo-mascot--idle" data-mo-look style="--mo-size:100%"><span class="mo-m-bubble">嗨！</span>${MASCOT_SVG}</div>`;
let bt;
function buddySay(msg, mod='mo-mascot--idle', face='happy'){
  const m = $('.mo-mascot', buddy); m.className='mo-mascot '+mod; m.dataset.face=face;
  $('.mo-m-bubble', m).textContent = msg; buddy.classList.add('is-say');
  clearTimeout(bt); bt=setTimeout(()=>{ buddy.classList.remove('is-say'); m.className='mo-mascot mo-mascot--idle'; m.dataset.face='happy'; }, 2400);
}
function buddyCheer(){ buddySay(['複製好了！','收到～','完成 ✓','讚喔！'][Math.floor(Math.random()*4)], 'mo-mascot--jump', 'laugh'); }
const TIPS=[['點「</>」可以調顏色喔','wink'],['右上角能切換深色模式','happy'],['按 / 可以快速搜尋','surprised'],['有 100 種動畫等你挑','love']];
buddy.addEventListener('click', ()=>{ const [t,f]=TIPS[Math.floor(Math.random()*TIPS.length)]; buddySay(t,'mo-mascot--wave',f); });

/* ============ 主標拆字、展示區 ============ */
$$('[data-split]').forEach(el=>{ el.innerHTML=[...el.textContent].map((c,i)=>`<span class="t-char" style="--i:${i+(+el.dataset.split||0)}">${c===' '?'&nbsp;':c}</span>`).join(''); });
$('#show1').insertAdjacentHTML('afterbegin', mascot('mo-mascot--wave','--mo-size:150px;','','wink',true));
$('#show2').insertAdjacentHTML('afterbegin', FX.find(f=>f.k==='cube').h('',''));
$('#show3').insertAdjacentHTML('afterbegin', FX.find(f=>f.k==='equalizer').h('',''));

/* ============ 設定、主題 ============ */
const root = document.documentElement;
function setTheme(t){ root.dataset.theme=t; store.set('ca100-theme',t); $('#themeBtn').setAttribute('aria-label', t==='dark'?'切換為淺色模式':'切換為深色模式'); }
$('#themeBtn').addEventListener('click', ()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
setTheme(root.dataset.theme||'light');
const pop = $('#pop'), popBtn = $('#popBtn');
popBtn.addEventListener('click', e=>{ e.stopPropagation(); const o=!pop.classList.contains('is-open'); pop.classList.toggle('is-open',o); popBtn.setAttribute('aria-expanded',o); });
document.addEventListener('click', e=>{ if(!pop.contains(e.target) && e.target!==popBtn){ pop.classList.remove('is-open'); popBtn.setAttribute('aria-expanded',false); } });
function setColor(c){ G.color=c; $('#gColor').value=c||'#004A85'; $$('#pop .lib-sw').forEach(b=>b.setAttribute('aria-pressed', b.dataset.c===c)); rerenderAll(); }
$('#gColor').addEventListener('input', e=>setColor(e.target.value));
$$('#pop .lib-sw').forEach(b=>b.addEventListener('click',()=>setColor(b.dataset.c||null)));
$('#gSpeed').addEventListener('input', e=>{ G.speed=+e.target.value; $('#gSpeedV').textContent=G.speed+'×'; $$('[data-stage]').forEach(rate); });
let tt; $('#gText').addEventListener('input', e=>{ clearTimeout(tt); tt=setTimeout(()=>{ G.text=e.target.value.trim(); rerenderAll(); },250); });
$('#gAuto').addEventListener('change', e=>{ G.auto=e.target.checked; $$('.lib-card').forEach(card=>setPaused($('[data-stage]',card), FX[card.dataset.id-1])); });
$('#q').addEventListener('input', e=>{ G.q=e.target.value; filter(); if(G.q) $('#library').scrollIntoView(); });
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ if(modal.classList.contains('is-open')) closeDetail(); pop.classList.remove('is-open'); }
  if(e.key==='/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){ e.preventDefault(); $('#q').focus(); }
});

navs(); build();
setTimeout(()=>buddySay('嗨！我是抵家，點我看看～','mo-mascot--wave','wink'), 1000);
