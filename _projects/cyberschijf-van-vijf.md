---
layout: project
title: "CyberSchijf van Vijf"
category: "Web Development"
tags: [Vanilla JS, Firebase, Firestore, Canvas API, Chart.js, HTML5, CSS3]
thumbnail: "img/projects/cyberschijf-thumb.jpg"
images:
  - src: "img/projects/cyberschijf-flow.jpg"
    alt: "Participant app running on iPad — placeholder"
  - src: "img/projects/cyberschijf-dashboard.jpg"
    alt: "Facilitator analytics dashboard — placeholder"
  - src: "img/projects/cyberschijf-scorewiel.jpg"
    alt: "Custom radial score chart (Scorewiel) — placeholder"
links: []
---

<!-- NEEDS: replace placeholder images once screenshots are provided -->

A production web application serving as the digital layer of a cybersecurity board game. Dutch companies attend escape-room-style workshops where participants use shared iPads to self-assess their cybersecurity posture across 60 questions. Responses flow into a Firebase backend and surface in real time on a facilitator analytics dashboard.

**Currently live and used in paid workshops with real clients.**

## The Problem

The client ran workshops with a fully physical card game. Participants scored themselves on printed cards; facilitators manually collected and tallied results afterward — slow, error-prone, no aggregate data.

**Constraints:**
- 5 iPads running simultaneously per session, shared between participants
- Participants are non-technical — zero tolerance for confusing UI
- Must work reliably on restricted corporate WiFi (common in Dutch enterprise environments)
- No dedicated server — low-maintenance and cost-efficient

## The Solution

**Participant flow — 5 steps:** unlock with a physical code → drag-and-drop theme ranking → weak question selection across 5 themes (60 questions total) → top 3 priority selection → company profile + safe code reveal.

**Facilitator dashboard — 8 views:** session KPIs with a custom circular score visualisation (Scorewiel), per-theme question-level breakdowns, priority rankings, sector distribution and cross-sector comparison charts, participant detail view, and CSV export.

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| State management | Custom JS state machine |
| Data persistence | Firebase Firestore |
| Authentication | Firebase Authentication |
| Hosting | Firebase Hosting + Cloudflare DNS |
| Charts | Chart.js 4.4 + custom Canvas API |

**Why no framework?** The client needed a maintainable codebase without ongoing framework updates or build tooling. Vanilla JS with a clear module structure was the right call.

## Technical Challenges

### Custom radial score chart (Scorewiel)

The Scorewiel is a canvas-based radial bar chart showing all 60 questions grouped into 5 colour-coded themes. No charting library produces this layout — built entirely with the Canvas 2D API. Bar length is inversely proportional to how many participants marked a question as weak. The chart reads from theme prefix patterns rather than question IDs, making it robust against question content changes.

### Self-hosted fonts for corporate network compatibility

The app originally loaded the Anton display font from Google Fonts. On corporate networks that block Google CDNs — common in Dutch enterprise environments — this render-blocking link tag caused the entire app to hang for 30+ seconds before timing out. Solved by self-hosting WOFF2 + TTF font files directly on Firebase Hosting, eliminating the external dependency.

### Firestore CSP on mobile

After deploying Content Security Policy headers, Firestore writes stopped working on Android and iPad but continued on desktop. Remote DevTools on a real Android device revealed the cause: the Firebase Auth SDK loads a hidden iframe from the project's `.firebaseapp.com` domain on initialisation. Without an explicit `frame-src` directive, mobile browsers blocked this iframe — preventing the SDK from establishing auth context and causing all writes to fail with a misleading "permissions" error. Fix: added `frame-src` to explicitly whitelist the Firebase auth domain.

## Outcome

- Live at a custom domain, used in paid workshops with real clients
- Facilitator has instant aggregate data per session instead of manual post-processing
- Runs reliably on restricted corporate WiFi with no external CDN dependencies

## Lessons Learned

**Test on real devices early.** Multiple production bugs were invisible in desktop DevTools but immediate on an actual iPad or Android device.

**CSP requires holistic thinking.** `connect-src` and `frame-src` are separate directives. `https://` wildcards don't cover `wss://`. Every SDK internal — not just resources you know about — needs to be considered against every directive.

**Self-hosting fonts is always worth it for production apps.** Not for the performance gain — for eliminating a hard external dependency that can silently break the app on restricted networks.

---

*Built independently as a freelance project. Client details omitted.*
