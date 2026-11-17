/* CSS Animations 100 ‧ 小工具 motion-helpers.js v2.0
   放在 body 結尾前，用 script 標籤引入 motion-helpers.js 即可
   功能：
   1. Mo.onView()   有 .mo-onview 的元素，捲到畫面內才開始播放
   2. Mo.split(el)  把文字拆成一字一 span（逐字動畫用），或在元素加 data-mo-split
   3. 點擊漣漪      有 .mo-ripple 的按鈕會自動產生漣漪
   4. data-mo-toggle 點擊後切換 .is-on（值可填選擇器，例如手風琴標題填 ".mo-accordion"）
   5. data-mo-burst  點擊後重播 .is-on（彩紙爆發）
   6. .mo-tilt      滑鼠移動時 3D 傾斜跟隨
   6b. [data-mo-look] 吉祥物視線跟著滑鼠
   7. Mo.stepper(el, n) 把步驟器推進到第 n 步
   8. Mo.replay(el) 重播一次性動畫 */
(function(){
  var Mo = {
    onView: function(root){
      root = root || document;
      var els = root.querySelectorAll('.mo-onview');
      if(!('IntersectionObserver' in window)){ els.forEach(function(el){el.classList.add('is-in')}); return; }
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, {threshold: .2});
      els.forEach(function(el){ io.observe(el); });
    },
    split: function(el){
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      Array.from(text).forEach(function(ch, i){
        var s = document.createElement('span');
        s.textContent = ch === ' ' ? ' ' : ch;
        s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--i', i);
        el.appendChild(s);
      });
    },
    ripple: function(btn, e){
      var r = btn.getBoundingClientRect();
      var ink = document.createElement('span');
      ink.className = 'mo-ripple-ink';
      ink.style.setProperty('--x', (e.clientX - r.left) + 'px');
      ink.style.setProperty('--y', (e.clientY - r.top) + 'px');
      ink.style.setProperty('--d', Math.max(r.width, r.height) * 2.2 + 'px');
      btn.appendChild(ink);
      ink.addEventListener('animationend', function(){ ink.remove(); });
    },
    stepper: function(el, step){
      var items = el.querySelectorAll('li');
      el.style.setProperty('--n', items.length);
      el.style.setProperty('--step', step);
      items.forEach(function(li, i){
        li.classList.toggle('is-done', i < step - 1);
        li.classList.toggle('is-current', i === step - 1);
      });
    },
    replay: function(el){
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    },
    init: function(){
      document.querySelectorAll('[data-mo-split]').forEach(Mo.split);
      document.querySelectorAll('.mo-stepper').forEach(function(el){
        Mo.stepper(el, +getComputedStyle(el).getPropertyValue('--step') || 1);
      });
      document.addEventListener('pointerdown', function(e){
        var b = e.target.closest && e.target.closest('.mo-ripple'); if(b) Mo.ripple(b, e);
      });
      document.addEventListener('click', function(e){
        var b = e.target.closest && e.target.closest('[data-mo-burst]');
        if(b){ b.classList.remove('is-on'); void b.offsetWidth; b.classList.add('is-on'); }
        var t = e.target.closest && e.target.closest('[data-mo-toggle]'); if(!t) return;
        var sel = t.getAttribute('data-mo-toggle');
        var host = (sel && t.closest(sel)) || t;
        host.classList.toggle('is-on');
        t.setAttribute('aria-expanded', host.classList.contains('is-on'));
      });
      document.addEventListener('pointermove', function(e){
        var el = e.target.closest && e.target.closest('.mo-tilt'); if(!el) return;
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - .5) * 24).toFixed(1) + 'deg');
        el.style.setProperty('--rx', ((.5 - y) * 18).toFixed(1) + 'deg');
        el.style.setProperty('--gx', (x * 100).toFixed(0) + '%');
        el.style.setProperty('--gy', (y * 100).toFixed(0) + '%');
      });
      document.addEventListener('pointermove', function(e){
        document.querySelectorAll('[data-mo-look]').forEach(function(m){
          var r = m.getBoundingClientRect(); if(!r.width) return;
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * .5);
          var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
          m.style.setProperty('--lx', (dx / d * 3.2 * k).toFixed(2) + 'px');
          m.style.setProperty('--ly', (dy / d * 2.6 * k).toFixed(2) + 'px');
        });
      });
      document.addEventListener('pointerout', function(e){
        var el = e.target.closest && e.target.closest('.mo-tilt');
        if(el && !el.contains(e.relatedTarget)){ ['--rx','--ry'].forEach(function(p){ el.style.removeProperty(p); }); }
      });
      Mo.onView();
    }
  };
  window.Mo = Mo;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Mo.init); else Mo.init();
})();
