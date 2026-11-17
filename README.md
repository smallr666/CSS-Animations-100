# CSS Animations 100

**繁體中文 CSS 動畫庫：100 式純 CSS 網站動態，支援深色模式，沒有任何套件依賴。**

每一式都有編號、中文名稱、class 名稱和建議用途，可以在展示站即時預覽，也能調整顏色、速度、尺寸和文字，再一鍵複製 HTML、CSS 或給 AI 的指令。

> 線上展示：`https://<你的帳號>.github.io/css-animations-100/`（開啟 GitHub Pages 後生效）

---

## 檔案結構

```
css-animations-100/
├─ index.html              展示站（動畫庫原始碼也在這裡，見下方「維護方式」）
├─ favicon.ico             瀏覽器分頁圖示
├─ assets/
│  ├─ motion-lib.css       ★ 動畫庫本體：其他網站引入這個
│  ├─ motion-helpers.js    ★ 小工具：捲到才播放、拆字、漣漪、展開收合、3D 傾斜
│  ├─ dijia.svg            吉祥物「抵家」簡化版（約 4KB）
│  ├─ app.css / app.js     展示站自己的樣式與程式（不屬於動畫庫）
│  └─ favicon.svg、favicon-32.png、apple-touch-icon.png、icon-512.png
├─ README.md
├─ CHANGELOG.md
├─ .gitignore
└─ .nojekyll               讓 GitHub Pages 原封不動發布
```

## 在網站中使用

```html
<head>
  <link rel="stylesheet" href="assets/motion-lib.css">
</head>
<body>
  <h2 class="mo-fade-up mo-onview">颱風應變流程</h2>
  <script src="assets/motion-helpers.js"></script>
</body>
```

| 需求 | 寫法 |
|---|---|
| 套用動畫 | 加上 `mo-` 開頭的 class，例如 `class="mo-pop-in"` |
| 捲到畫面才播放 | 再加 `mo-onview` |
| 客製 | `style="--mo-color:#2E9E6B; --mo-dur:1.2s; --mo-size:160px"` |
| 深色模式 | 在 `<html>` 加 `data-theme="dark"` |
| 吉祥物表情 | `<div class="mo-mascot mo-mascot--wave" data-face="wink">` + `dijia.svg` 的內容 |
| 無障礙 | 系統開啟「減少動態」時，動畫會自動關閉 |

吉祥物表情共有 10 種：`happy`、`surprised`、`wink`、`laugh`、`sleep`、`worried`、`love`、`cry`、`confused`、`angry`。

## 11 個分類

| # | 分類 | 編號 | 數量 |
|---|---|---|---|
| 01 | 進場登場 | 001–007 | 7 |
| 02 | 文字動態 | 008–018 | 11 |
| 03 | 互動回饋 | 019–031 | 13 |
| 04 | 介面元件 | 032–037 | 6 |
| 05 | 流程進度 | 038–045 | 8 |
| 06 | 提示警示 | 046–054 | 9 |
| 07 | 載入等待 | 055–061 | 7 |
| 08 | 3D 立體 | 062–071 | 10 |
| 09 | 圖示動態 | 072–082 | 11 |
| 10 | 背景情境 | 083–092 | 10 |
| 11 | 吉祥物 | 093–100 | 8 |

## 命名規則（新增動畫時請遵守）

1. class 一律以 `mo-` 開頭，英文小寫，用 `-` 連接（例如 `mo-ring-timer`）。
2. 角色動作使用修飾 class：`mo-mascot mo-mascot--jump`。
3. 狀態 class：`is-on`（開啟）、`is-in`（已進入畫面）、`is-done` / `is-current`（步驟）。
4. 參數一律用 CSS 變數：`--mo-color`、`--mo-accent`、`--mo-dur`、`--mo-delay`、`--mo-size`。
5. 顏色使用 token（`--mo-surface`、`--mo-muted`、`--mo-ink`、`--mo-sub`），深色模式才會自動適用。
6. 每個 CSS 區塊以 `/* ==== @mo:名稱 ==== */` 開頭，展示站靠這個標記切出每一式的程式碼。
7. 動畫以 `transform`、`opacity` 為主，避免影響效能。

## 維護方式

動畫庫的**原始碼在 `index.html`** 裡的 `<style id="mo-lib">` 和 `<script id="mo-helpers">`。這樣在電腦上直接雙擊 `index.html` 時，CSS 和 AI 指令也能完整複製。

1. 修改 `index.html` 的 `<style id="mo-lib">`；新增一式時，也要在 `assets/app.js` 的 `FX` 清單加一筆資料。
2. 打開 `index.html` 確認預覽，再按「motion-lib.css」「motion-helpers.js」下載，覆蓋 `assets/` 裡的舊檔。
3. 在 `CHANGELOG.md` 記一筆修改，然後 commit 並 push。

## 版權

- 動畫皆為原創實作。動態分類與互動手法參考了 yui540 motions，展示介面參考了 TEXT MOTION 40、「字會動 64 式」、Animista、Uiverse，但沒有複製任何原始碼。
- 吉祥物「抵家」的著作權屬於新北市住宅及都市更新中心。若要把 repository 設為公開，請先確認中心是否同意公開角色圖檔。
