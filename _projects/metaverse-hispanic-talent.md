---
layout: project
title: "Metaverse Hispanic Talent"
category: "Unity / Blender"
period: "Mar 2022 – Jun 2022"
tags: [Blender, Unity, C#, VRChat SDK, VR, Level Design, Multiplayer]
thumbnail: "img/projects/metaverse-hispanic-talent-thumb.jpg"
images:
  - src: "img/projects/metaverse-hispanic-talent-01.jpg"
    alt: "VRChat world — stage area (placeholder)"
  - src: "img/projects/metaverse-hispanic-talent-02.jpg"
    alt: "VRChat world — audience area (placeholder)"
collaborators:
  # Fill in your teammate's details below, then remove these comments.
  # Schema: name (required), role (optional), url (optional — LinkedIn, GitHub, portfolio)
  # - name: "Teammate Name"
  #   role: "Programming & 3D Art"
  #   url: "https://linkedin.com/in/..."
links: []
---

<!-- NEEDS: screenshots of the VRChat world — add to img/projects/ and update filenames above -->

A custom VRChat world built for a talent-show roleplay event, developed collaboratively with a teammate. The world needed to function as a real venue — stage, audience seating, backstage areas — with interactive systems that made the experience feel live.

## What I Built

**Environment art (≈65–70% of the scene)**
Modelled the stage, props, audience seating, and backstage areas in Blender, keeping VR performance and visual consistency as guiding constraints throughout.

**Interactive systems (≈50% of the codebase)**
Implemented in Unity using C# and the VRChat SDK:

- **Stage screen video player** — a functional in-world screen that plays YouTube links. Users enter a URL via an in-game browser at the back of the world and the video plays on the main stage screen for everyone simultaneously.
- **Voice amplification zone** — a defined area on stage where a player's voice is amplified across the whole world on entry. Volume returns to default when they leave — simulating a live microphone effect.
- **Admin control panels** — backstage panels requiring an admin tag to access, letting moderators control entry, video playback, and stage volume independently of regular participants.

## Tech & Tools

Blender (environment art) · Unity · VRChat SDK · C# (interaction scripting and world logic)

## What I Gained

Working at the intersection of environment art and multiplayer interactive systems meant balancing visual quality and technical constraints simultaneously. Building systems that work reliably in VR — where latency and interaction feedback are especially noticeable — pushed me to think carefully about state management, networked edge cases, and the gap between "works in testing" and "works with real users in a live event."
