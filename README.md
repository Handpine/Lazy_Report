# 懶人報 (Lazy Report) · AI 智能報告渲染系統

> **「化繁為簡是用戶體驗的最高境界。」**
> 懶人報是一個遵循「有機極簡 (Organic Minimalism)」美學設計的 PWA (Progressive Web App) 單頁應用程式。旨在將 AI 生成的結構化 JSON 數據，秒級渲染成極具視覺美感與專業張力的數據報告，並提供極致的行動端體驗與 A4 列印適配。

---

## 🎯 專案核心特色

* **有機極簡美學 (Organic Minimalism)**：採用暖米色背景 (`#F7F5F0`)、專業深灰字型，配以高質感的 Newsreader 襯線字體，極大降低長文閱讀疲勞。
* **豐富的智能圖表組件**：
  * **趨勢折線圖 (Line Chart)**：純 SVG 向量繪製，完美適配行動端。
  * **多分段比例條 (Distribution Bar)**：高保真比例分佈圖。
  * **多維條形圖 (Bar Chart)**：直觀的滿意度或多指標橫向對比。
  * **關鍵指標卡 (Metrics Grid)**：支援上下趨勢互動切換。
  * **其他組件**：里程碑時間軸 (Timeline)、對照方案卡 (Comparison Split)、檢查清單 (Checklist) 等。
* **行動端 & PWA 優先**：原生適配 iPhone (iOS Safari)「加入主畫面」體驗。支援 Service Worker 離線快取，在無網路的飛航模式下亦能流暢啟動。
* **高保真 PDF 列印**：特別優化 A4 紙張與列印樣式，一鍵呼叫系統列印即可導出完美的 PDF 報告。
* **即時編輯與雙向同步**：支援全介面 Inline 即時編輯、復原/重做 (Undo/Redo) 快速鍵，隨改隨看。
* **本地資料庫典藏**：內建基於 IndexedDB (Dexie.js) 的 SQLite-like 本地資料庫，可隨時檢閱、修改、刪除歷史報告。

---

## 🧠 本地儲存原理與 PWA 機制說明

懶人報 100% 執行於您的手機本地，**不需要後端伺服器**，其資料保存與離線運作由以下兩個機制分工合作：

### 1. 離線快取 (Cache API) —— 負責「網頁打得開」
* **原理**：當您首次連線時，PWA 的服務工作線程 (Service Worker, `sw.js`) 會將網頁所需的程式碼（`index.html`、本地 assets 目錄中的資源、圖示等）下載並儲存至手機中。
* **作用**：我們已將 React、React-DOM 和 Babel Standalone 全部下載到 `assets/` 目錄並納入快取。當您在飛航模式或無網路環境下打開應用程式時，手機能直接從本地快取載入並在瀏覽器中完成 React 編譯，確保程式能 100% 離線成功運作。

### 2. 本地資料庫 (IndexedDB) —— 負責「資料存得下」
* **原理**：瀏覽器配發給懶人報一個專屬的本地資料庫空間，我們使用輕量級資料庫工具 `Dexie.js` 進行管理，其行為類似於本地的 SQLite。
* **作用**：每當您新增、修改或刪除報告時，JavaScript 會直接對手機本地的資料庫倉庫進行對應的紀錄更新。所有歷史報告的標題、文字及圖表數值都安全地儲存在此。由於 iOS 安全機制，這些資料存放在 PWA 專屬的隱私沙盒中，您無法在 iPhone 的「檔案」App 中直接看到資料庫檔案。

### ⚠️ iOS Safari 的儲存限制與防護策略
* **7 天自動清理限制**：若使用普通 Safari 瀏覽器打開網頁，且連續 7 天未再次訪問，iOS 為防手機空間被塞爆，可能會自動清理該網站的本地資料庫。
* **應對策略（強烈建議）**：請在 Safari 中點擊分享按鈕，選擇 **「加入主畫面 (Add to Home Screen)」**。安裝為 PWA 後，iOS 會將其視為獨立 App，本地儲存倉庫會與 Safari 隔離且受到保護，**資料不會被系統自動清理**。
* **雙重保險備份**：App 內提供「匯出備份 (JSON)」功能，可將所有報告打包下載。此時您可以將該 JSON 檔案儲存至 iPhone 的**「檔案」App** 或雲端硬碟，在更換手機或系統重設時，透過「匯入備份」即可完美還原。
* **空間查看路徑**：您可至 iPhone 的 `設定 ➜ Safari ➜ 進階 ➜ 網站資料` 查看或手動清理各網站佔用的本地空間。

---

## 📂 檔案結構說明

```text
lazy-report/
├── index.html                  # 主要 PWA 應用程式入口 (React + Babel + Vanilla CSS)
├── manifest.json               # PWA 設定檔，定義圖示與啟動模式
├── sw.js                       # Service Worker 快取設定，實現 100% 離線可用
├── icon.png                    # App 圖標
├── brand-spec.md               # 懶人報視覺與品牌規範說明
├── assets/
│   ├── dexie.js                # 本地資料庫引擎 (已快取，確保離線可用)
│   ├── react.production.min.js # 本地 React 核心庫 (已快取，確保離線可用)
│   ├── react-dom.production.min.js # 本地 React-DOM 渲染庫 (已快取，確保離線可用)
│   └── babel.min.js            # 本地 Babel Standalone 編譯器 (已快取，確保離線可用)
└── screenshot_*.png            # 各階段設計的高保真截圖
```

---

## 🚀 快速開始與本地開發

本專案採用無編譯（瀏覽器即時編譯 React）的極簡架構，您不需要安裝繁瑣的 Node.js 依賴即可執行：

1. **本地執行**：
   使用任何靜態伺服器開啟專案目錄。例如在終端機中執行：
   ```bash
   # 使用 Python 啟動本地伺服器
   python -m http.server 8000
   ```
   然後在瀏覽器中打開 `http://localhost:8000`。
   
2. **iPhone / PWA 安裝步驟**：
   - 確保使用 HTTPS 或本地 `localhost` 伺服器連線。
   - 在 iPhone Safari 瀏覽器打開網頁。
   - 點擊分享按鈕，選擇 **「加入主畫面 (Add to Home Screen)」**。
   - 即可在桌面像原生 App 一樣打開懶人報，並享有離線快取功能。

---

## 💡 AI 處理指令工作流

1. 打開懶人報，在左側貼入您的原始素材。
2. 點擊 **「📋 複製智能 AI 處理指令」**，系統會自動生成帶有專屬 Schema 的 Prompt。
3. 將指令與素材貼給大語言模型 (如 Gemini, Claude)。
4. 將 AI 回傳的純 JSON 代碼貼回右側，點擊 **「🚀 渲染智能報告」** 即可完成！
