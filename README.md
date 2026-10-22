# 美簿 MeiBook

> 给一人美业工作室（美甲师 / 美睫师 / 美发师）的预约 + 会员卡 + 收入小账本。
> 替代的是那个**手写本**：会员余额、明天该提醒谁、这个月到底收了多少钱。
> An appointments + prepaid-membership-ledger + revenue PWA for Chinese-speaking solo beauty studios in North America. Part of the **Auctura AI** product line.

**English summary.** A Chinese-first Progressive Web App for one-person beauty studios
(nail, lash, hair) in North America: appointments, a prepaid membership-card ledger, and
revenue, replacing the paper notebook. v0.1 is front-end only: React 18, Vite 6,
react-router (hash), Context + useReducer, plain CSS, no UI library, no backend, no
sign-up; data lives in localStorage with JSON export and import. Money is stored as
integer cents; the ledger is append-only (mistakes are corrected with an adjustment
entry, never deleted). Service worker: network-first for navigation, cache-first for
assets. `node smoke-test.mjs` runs 21 pure-logic assertions on money and date helpers.
Built in June 2026 and deliberately held at v0.1 until a distribution smoke test says
real studio owners want it; the roadmap below is conditional on that signal.

## 为什么做（the lesson behind it）

灵感与教训来自 GlowDiary（澳洲同类产品）的复盘：**两周能搓出全栈 SaaS，死在不知道怎么触达目标用户**。所以 MeiBook 的开发顺序反过来：

1. v0.1（本仓库）：纯前端 PWA，无后端、无注册、数据在本机 — 30 分钟能给店主装上用起来的最小可用品
2. 先跑 distribution smoke test（小红书/微信群/地推），点击率和留资率达标再投入后端
3. 后端、云同步、多设备、在线预约页 = v0.2+，由真实用户反馈驱动

## 核心功能（v0.1）

- **今日**：今天的安排、今日实收/耗卡、明日预约一键复制提醒文案（粘贴到微信发送）
- **预约**：14 天日历条、新预约 10 秒录入（选客户→选服务→自动带价格）
- **客户**：会员卡是主角 — 充值（实收+赠送分开记）、扣卡、调整（旧本子余额导入）、完整流水
- **收入**：实收 vs 服务产值 vs 耗卡 分开统计（充值钱不重复计），服务构成、本月明细
- **设置**：店名、提醒模板（{客户} {日期} {时间} {服务} {店名}）、价目表、导出/导入 JSON 备份

刻意不做（v0.1）：作品照片管理、在线预约页、短信/微信自动发送（微信无 API，复制粘贴就是正确工作流）、多人排班。

## 跑起来

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物在 dist/
node smoke-test.mjs  # 纯逻辑断言（21 条）
```

首次打开自带**示例数据**（设置里一键清空）。手机安装：浏览器打开部署地址 → 添加到主屏幕。

## 部署（免费）

Cloudflare Pages / Netlify：把 `dist/` 拖上去即可（HashRouter，无需服务端路由配置）。
更新上线时记得把 `public/sw.js` 里 `CACHE` 版本号 +1。

## 数据与口径

- 全部数据在浏览器 localStorage（`meibook.v1`），**没有云端** — 设置页每周导出一次备份
- 余额 = 充值（实收+赠送）− 扣卡 ± 调整；流水只增不删（记账原则，错了用「调整」冲正）
- 实收 = 现金/转账 + 充值实收；**耗卡不计实收**（充值时已经收过钱）
- 金额以整数美分存储，无浮点误差

## 技术

React 18 + Vite 6 + react-router（Hash）+ Context/useReducer，纯 JS，无 UI 库。
PWA：manifest + service worker（导航 network-first，静态资源 cache-first）。
设计：「胭脂账本」— 米纸底、墨色字、胭脂红主色、金色记钱，Noto Serif SC 标题。

## Roadmap

- v0.2：云同步（登录 + 多设备）、客户作品照片、低余额提醒
- v0.3：客户自助预约页（带 "Powered by MeiBook"自传播）、双语 UI（EN）
- 商业化假设：$15 到 25/月 或 $99 终身早鸟，永不抽佣

---
*Auctura AI · 2026 · MIT License*
