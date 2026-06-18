---
layout: project
title: "CyberSchijf van Vijf"
category: "Web Development"
tags: [Vanilla JS, Firebase, Firestore, Canvas API, Chart.js, HTML5, CSS3]
thumbnail: "img/portfolio/cyberschijf-van-vijf/header.png"
# Exception: the card/portrait image is not shown in the on-page media viewer.
hide_card_in_gallery: true
images:
  - src: "img/portfolio/cyberschijf-van-vijf/01.png"
    alt: "CyberSchijf van Vijf — application screenshot"
links: []
---

Built and deployed a production web application for a client running escape-room-style workshops. The touchscreen-first application is used on shared iPads during live client sessions, allowing participants to self-report their cybersecurity posture across 60 questions while facilitators monitor results in real time through a custom analytics dashboard. Developed using vanilla JavaScript, HTML, CSS, Firebase, Firestore, and Chart.js, with a strong focus on security, reliability, and maintainability. The platform includes real-time data visualisation, CSV exports, offline resilience, authentication, and secure data.

## How I Built It

A touchscreen-first single-page app in vanilla JavaScript, HTML, and CSS, no framework. Given the context (long-term maintainability, built a tool for management), a clean vanilla codebase was the right call over a framework the client would have to keep updated.

Firebase handles data, authentication, and hosting, so there is no server to maintain, and the app is built to stay reliable on restricted corporate networks even if the connection drops mid-session.

## The Result

- Live on a custom .nl domain, used in real paid workshops
- Facilitators get instant session results instead of analysing paper by hand
- Runs reliably on restricted corporate networks, with no external dependencies that can silently break it
- Cross-session analytics across sectors, company sizes, and themes

---

*Built independently as a freelance project. Client details skipped.*
