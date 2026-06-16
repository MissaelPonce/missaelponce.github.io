---
layout: project
title: "Metaverse Hispanic Talent"
category: "Unity / Blender"
period: "Mar 2022 – Jun 2022"
tags: [Blender, Unity, C#, VRChat SDK, VR, Level Design, Multiplayer]
thumbnail: "img/portfolio/metaverse-hispanic-talent/header.jpg"
# Full set: all 18 world screenshots (the header image leads the gallery).
images:
  - src: "img/portfolio/metaverse-hispanic-talent/01.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 1"
  - src: "img/portfolio/metaverse-hispanic-talent/02.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 2"
  - src: "img/portfolio/metaverse-hispanic-talent/03.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 3"
  - src: "img/portfolio/metaverse-hispanic-talent/04.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 4"
  - src: "img/portfolio/metaverse-hispanic-talent/05.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 5"
  - src: "img/portfolio/metaverse-hispanic-talent/06.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 6"
  - src: "img/portfolio/metaverse-hispanic-talent/07.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 7"
  - src: "img/portfolio/metaverse-hispanic-talent/08.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 8"
  - src: "img/portfolio/metaverse-hispanic-talent/09.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 9"
  - src: "img/portfolio/metaverse-hispanic-talent/10.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 10"
  - src: "img/portfolio/metaverse-hispanic-talent/11.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 11"
  - src: "img/portfolio/metaverse-hispanic-talent/12.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 12"
  - src: "img/portfolio/metaverse-hispanic-talent/13.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 13"
  - src: "img/portfolio/metaverse-hispanic-talent/14.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 14"
  - src: "img/portfolio/metaverse-hispanic-talent/15.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 15"
  - src: "img/portfolio/metaverse-hispanic-talent/16.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 16"
  - src: "img/portfolio/metaverse-hispanic-talent/17.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 17"
  - src: "img/portfolio/metaverse-hispanic-talent/18.png"
    alt: "Metaverse Hispanic Talent VRChat world, screenshot 18"
collaborators:
  # Fill in your teammate's details below, then remove these comments.
  # Schema: name (required), role (optional), url (optional — LinkedIn, GitHub, portfolio)
  # - name: "Teammate Name"
  #   role: "Programming & 3D Art"
  #   url: "https://linkedin.com/in/..."
links:
  - label: "Visit the VRChat World"
    url: "https://vrchat.com/home/launch?worldId=wrld_e8a541f9-9fb0-4008-9048-3abc09d862fb&instanceId=90253~hidden(usr_3a77d476-5abb-4307-9f72-20f619e97df4)~region(eu)~nonce(dc6c8a3d-c6ab-4593-acb9-06190cd101f6)"
---

A custom VRChat world built for a talent-show roleplay event, developed collaboratively with a teammate. The world needed to function as a real venue (stage, audience seating, backstage areas) with interactive systems that made the experience feel live.

## What I Built

**Environment art (≈65–70% of the scene)**
Modelled the stage, props, audience seating, and backstage areas in Blender, keeping VR performance and visual consistency as guiding constraints throughout.

**Interactive systems (≈50% of the codebase)**
Implemented in Unity using C# and the VRChat SDK:

- **Stage screen video player:** a functional in-world screen that plays YouTube links. Users enter a URL via an in-game browser at the back of the world and the video plays on the main stage screen for everyone simultaneously.
- **Voice amplification zone:** a defined area on stage where a player's voice is amplified across the whole world on entry. Volume returns to default when they leave, simulating a live microphone effect.
- **Admin control panels:** backstage panels requiring an admin tag to access, letting moderators control entry, video playback, and stage volume independently of regular participants.

## Tech & Tools

Blender (environment art) · Unity · VRChat SDK · C# (interaction scripting and world logic)

## What I Gained

Working at the intersection of environment art and multiplayer interactive systems meant balancing visual quality and technical constraints simultaneously. Building systems that work reliably in VR (where latency and interaction feedback are especially noticeable) pushed me to think carefully about state management, networked edge cases, and the gap between "works in testing" and "works with real users in a live event."
