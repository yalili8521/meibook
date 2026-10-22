# MeiBook

> Appointments, a prepaid membership-card ledger and a small revenue book for one-person
> beauty studios (nail, lash, hair). It replaces the **paper notebook**: who has how much
> left on their card, who to remind tomorrow, how much actually came in this month.
> Built for Chinese-speaking solo studios in North America, so the interface is in Chinese.

v0.1 is front-end only: React 18, Vite 6, react-router (hash), Context + useReducer, plain
CSS, no UI library, no backend, no sign-up; data lives in localStorage with JSON export and
import. Money is stored as integer cents; the ledger is append-only (mistakes are corrected
with an adjustment entry, never deleted). Service worker: network-first for navigation,
cache-first for assets. `node smoke-test.mjs` runs 21 pure-logic assertions on money and
date helpers. Built in June 2026 and deliberately held at v0.1 until a distribution smoke
test says real studio owners want it; the roadmap below is conditional on that signal.

## Why it exists (the lesson behind it)

The idea and the lesson come from a postmortem of GlowDiary, a comparable product in
Australia: **a full-stack SaaS can be built in two weeks and still die because nobody knew
how to reach the target users.** So MeiBook is built in the opposite order:

1. v0.1 (this repository): a pure front-end PWA, no backend, no sign-up, data on the device.
   A studio owner can install it and start using it in 30 minutes.
2. Run a distribution smoke test first (Xiaohongshu, WeChat groups, walking into studios).
   Invest in a backend only when click-through and sign-up rates clear the bar.
3. Backend, cloud sync, multiple devices and a public booking page are v0.2 and later,
   driven by real user feedback.

## Core features (v0.1)

- **Today**: today's schedule, cash received and card balance used today, and a one-tap
  copy of tomorrow's reminder text to paste into WeChat
- **Appointments**: a 14-day calendar strip; a new appointment takes about 10 seconds
  (pick customer, pick service, price fills in)
- **Customers**: the membership card is the centerpiece: top-ups (paid and bonus amounts
  recorded separately), deductions, adjustments (to import balances from the old notebook),
  and the full transaction history
- **Revenue**: cash received, service value and card balance used are counted separately
  (top-up money is never counted twice); service mix and the month's line items
- **Settings**: studio name, reminder template with `{customer} {date} {time} {service}
  {studio}` placeholders, price list, JSON backup export and import

Deliberately left out of v0.1: portfolio photo management, a public booking page, automatic
SMS or WeChat sending (WeChat has no API for this; copy and paste is the right workflow),
and multi-staff scheduling.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # output in dist/
node smoke-test.mjs  # 21 pure-logic assertions
```

The first launch ships with **sample data** (one tap in Settings clears it). To install on a
phone: open the deployed URL in the browser and add it to the home screen.

## Deploy (free)

Cloudflare Pages or Netlify: drop the `dist/` folder in (HashRouter, so no server-side
routing configuration is needed). When shipping an update, bump the `CACHE` version in
`public/sw.js`.

## Data model and definitions

- All data lives in the browser's localStorage (`meibook.v1`); **there is no cloud**, so the
  Settings page asks for a weekly backup export
- Balance = top-ups (paid + bonus) minus deductions plus or minus adjustments; the ledger
  only grows, mistakes are reversed with an adjustment entry (bookkeeping rules)
- Cash received = cash or transfer payments + the paid part of top-ups; **card deductions
  do not count as cash received** (the money came in at top-up time)
- Amounts are stored as integer cents, so there is no floating-point drift

## Tech

React 18 + Vite 6 + react-router (hash) + Context/useReducer, plain JavaScript, no UI
library. PWA: manifest + service worker (network-first for navigation, cache-first for
static assets). Design: a "rouge ledger" look, rice-paper background, ink text, rouge red
as the primary color, gold for money, Noto Serif SC for headings.

## Roadmap

- v0.2: cloud sync (login + multiple devices), customer portfolio photos, low-balance alerts
- v0.3: self-service booking page for customers (with a "Powered by MeiBook" footer for
  word of mouth), bilingual interface (English)
- Pricing hypothesis: $15 to 25 per month, or $99 lifetime early-bird; never a commission

---
*2026 · MIT License*
