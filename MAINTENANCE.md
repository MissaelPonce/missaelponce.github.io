# Portfolio Site — Maintenance Guide

How to update and extend the site without needing to remember how Jekyll works. Written for someone comfortable with web development basics who isn't a Jekyll expert.

---

## How the site works (30-second overview)

Jekyll is a static site generator. It reads your content files (YAML, Markdown) and template files (HTML with Liquid tags), builds a static site, and outputs it to `_site/`. GitHub Pages runs Jekyll automatically on every push — you never touch `_site/` directly.

**Content you'll edit regularly:**

| Folder / file | What lives there |
|---|---|
| `_data/projects.yml` | Homepage project grid (7 cards) |
| `_projects/{slug}.md` | Full project detail pages |
| `_data/experience.yml` | Work history + education |
| `_data/skills.yml` | Skill groups + soft skills |
| `_config.yml` | Site-level settings (title, email, logo path) |

Everything else (layouts, SCSS, JavaScript) only needs changing if you're modifying the design.

---

## Adding a new project

### Step 1 — Add a card to the homepage grid

Open `_data/projects.yml` and append a new entry:

```yaml
- title: "Your Project Title"
  slug: "your-project-slug"        # becomes the URL: /projects/your-project-slug/
  category: "Unity / Game Dev"     # shown as the label on the card
  period: "Jan 2024"               # optional — remove the line if not needed
  card_summary: "One sentence shown on the homepage card."
  thumbnail: "img/projects/your-project-thumb.jpg"
  tags: [Unity, C#, Tag3]
```

The `slug` must exactly match the filename you create in Step 2 (without `.md`). Keep it lowercase and hyphenated.

### Step 2 — Create the detail page

Create `_projects/your-project-slug.md`:

```markdown
---
layout: project
title: "Your Project Title"
category: "Unity / Game Dev"
tags: [Unity, C#, Tag3]
thumbnail: "img/projects/your-project-thumb.jpg"
images:
  - src: "img/projects/your-project-01.jpg"
    alt: "Descriptive alt text"
links:
  - label: "GitHub"
    url: "https://github.com/..."
---

Your project description in Markdown goes here.
```

Remove the `links:` block entirely if there are no links. Remove `images:` if there are no screenshots yet.

### Step 3 — Add images

Place images in `img/projects/`. Naming convention:
- `{slug}-thumb.jpg` — homepage card thumbnail
- `{slug}-01.jpg`, `{slug}-02.jpg`, etc. — detail page images

**Recommended sizes:**
- Thumbnail: 800×600px, JPEG, under 200 KB
- Detail images: 1600×900px (or 1200×900px), JPEG, under 500 KB

### How the URL is generated

A file named `_projects/skullcrusher.md` becomes `https://MissaelPonce.github.io/projects/skullcrusher/`. This is set by `permalink: /projects/:name/` in `_config.yml` — don't change it.

---

## Editing an existing project

| What to change | Where to edit |
|---|---|
| Card summary or tags | `_data/projects.yml` — find entry by `slug` |
| Detail page text | `_projects/{slug}.md` — edit the Markdown body |
| Thumbnail | Replace `img/projects/{slug}-thumb.jpg` (same filename = no other changes needed) |
| Detail images | Edit the `images:` list in `_projects/{slug}.md` front matter |
| Link buttons | Edit the `links:` list in `_projects/{slug}.md` front matter |

---

## Adding collaborators to a project

Collaborators appear on the project detail page only — not on the homepage card.

Open `_projects/{slug}.md` and add a `collaborators:` block to the front matter (alongside `images:` and `links:`):

```yaml
collaborators:
  - name: "Jane Doe"
    role: "Game Design & Level Design"
    url: "https://linkedin.com/in/janedoe"
  - name: "John Smith"
    role: "3D Art"
    url: ""
```

`name` is required. `role` and `url` are optional — omit or leave blank. If `url` is provided the name links out; otherwise it's plain text. Remove the `collaborators:` block entirely (or leave it commented out) if there are no collaborators — the section is hidden automatically.

---

## Adding a work experience entry

Open `_data/experience.yml` and prepend to the `work:` list (most recent first):

```yaml
work:
  - role: "Job Title"
    company: "Company Name"
    location: "City, Country"
    period: "Month Year – Month Year"
    highlights:
      - "First responsibility or achievement."
      - "Second responsibility or achievement."
```

To add an education entry, use the `education:` list at the bottom of the same file:

```yaml
education:
  - degree: "Degree or Qualification Name"
    institution: "School or University"
    location: "City, Country"
    period: "Sep 20XX – May 20XX"
```

---

## Adding a skill or skill group

Open `_data/skills.yml`.

**Add a skill to an existing group** — find it by `category:` and add to `skills:`:

```yaml
- category: "Languages & Scripting"
  icon: "fa-code"
  skills:
    - C#
    - Java
    - Your New Skill       # ← add here
```

**Add a new group** — copy a full block and add it to the `groups:` list:

```yaml
- category: "New Group Name"
  icon: "fa-puzzle-piece"  # Font Awesome 4 icon class
  skills:
    - Skill One
    - Skill Two
```

Browse Font Awesome 4 icons at: https://fontawesome.com/v4/icons/

**Add a soft skill** — edit the `soft_skills:` list at the bottom of the file.

---

## Swapping the logo

The logo path is set in `_config.yml`:

```yaml
logo: "img/logo/logo mp-02.svg"
```

To use a different file: replace the image at that path, or update the `logo:` value to the new filename. The logo is referenced in `_includes/nav.html` as `{{ site.logo }}` — no other file needs changing.

**Size guidance:** SVG logos scale to any size. Aim for the logo to read clearly at 32–40px height. If using PNG, export at 2× (e.g. 80px tall source for 40px display) for retina screens.

**Note on the current SVG filename:** `logo mp-02.svg` has a space in the name. If the logo fails to load in any browser, rename the file to `logo-mp-02.svg` and update `_config.yml` to match. Spaces in filenames can cause URL encoding issues on some servers.

---

## Swapping the hero placeholder image → Blender video

When your Blender render video is ready, the swap is a one-file change in `_includes/header.html`.

**Current markup:**
```html
<header>
    <div class="header-content">
        ...
    </div>
</header>
```

**Replace with:**
```html
<header>
    <video class="hero-video" autoplay muted loop playsinline
           poster="img/header.jpg">
        <source src="img/hero.mp4" type="video/mp4">
        <source src="img/hero.webm" type="video/webm">
    </video>
    <div class="header-content">
        ...
    </div>
</header>
```

The `poster` attribute is the fallback image shown on mobile or slow connections before the video loads — keep `img/header.jpg` as the poster (or update the path to a better still frame).

Also remove the `background-image` line from the `header` rule in `_sass/_base.scss` — the video takes its place.

**Video export guidance:** Export from Blender as MP4 (H.264, web-optimised). Add a WebM version as a second `<source>` for broader browser support. Target under 5–8 MB for a looping hero clip. Use Handbrake or `ffmpeg` to compress.

---

## Changing the colour palette

All colour values are defined in `_sass/_variables.scss`:

```scss
$color-bg:        #0D1321;   // page background
$color-surface:   #1D2D44;   // cards, alternate sections
$color-accent:    #3E5C76;   // primary buttons, hover overlays
$color-highlight: #748CAB;   // links, muted text, highlights
$color-text:      #F0EBD8;   // headings and body text
$color-muted:     #748CAB;   // secondary / muted text
```

Change a value here and it propagates everywhere that variable is used. You don't need to search through `_base.scss`.

**Important:** After changing `_config.yml`, you must restart `jekyll serve`. SCSS changes hot-reload automatically (no restart needed).

---

## Updating the copyright name in the footer

Open `_includes/footer.html` and find:

```html
&copy; {{ site.time | date: '%Y' }} Missael Ponce. All rights reserved.
```

Change `Missael Ponce` to whatever you want. The year is generated automatically by Liquid at build time — it updates on every deploy with no manual change needed.

---

## Local preview

**One-time setup (after Ruby + Bundler are installed):**
```powershell
bundle install
```

**Start the local server:**
```powershell
bundle exec jekyll serve
```

Open http://localhost:4000. Jekyll watches for file changes and rebuilds automatically — except `_config.yml` changes, which require a server restart (Ctrl+C, then run the command again).

**If you get a Liquid error** in the terminal, it will name the file and line number. Fix the typo and Jekyll rebuilds.

**If the site looks broken locally** but works on GitHub Pages (or vice versa), the most common cause is a path or `baseurl` mismatch. For the personal page setup (`MissaelPonce.github.io`), `baseurl` in `_config.yml` must be `""` (empty string).

---

## Deploying via GitHub Desktop

1. Make changes locally
2. Open GitHub Desktop — changed files appear in the left panel
3. Write a short commit message (e.g. `Add Skullcrusher project page`)
4. Click **Commit to main**
5. Click **Push origin**

GitHub Pages detects the push and rebuilds automatically. Allow 1–2 minutes. Check `https://MissaelPonce.github.io` to confirm the build succeeded. If it fails, GitHub will send you an email — the most common causes are YAML syntax errors or a Liquid tag typo.

---

## Jekyll gotchas

**`_config.yml` changes require a server restart.**
Hot-reload does not apply to `_config.yml`. Stop Jekyll (Ctrl+C) and re-run `bundle exec jekyll serve` after any change to that file.

**YAML is whitespace-sensitive — use 2-space indentation, never tabs.**
If you get a build error pointing at a data file, check that all list items use the same indentation and that strings containing colons are quoted (`"Oct 2025 – Apr 2026"` not `Oct 2025 – Apr 2026`).

**SCSS partials must not have front matter.**
Only `css/main.scss` has the `---` block at the top. Files in `_sass/` (`_variables.scss`, `_base.scss`, etc.) must not have `---` — adding it to a partial will break the SCSS build.

**Liquid tags only work in files with front matter.**
A plain `.html` or `.md` file without a `---` block won't process Liquid. If you create a new include or layout and Liquid variables aren't rendering, add an empty front matter block at the top.

**Don't edit `_site/` directly.**
Jekyll overwrites the entire `_site/` folder on every build. Any direct edits there are lost immediately.

**GitHub Pages uses Jekyll 3.x.**
Some Jekyll 4 features don't work on GitHub Pages. Everything in this site is Jekyll 3-compatible. If you ever want to use Jekyll 4 features, you'd need to add a GitHub Actions workflow instead of relying on the built-in Pages build — that's a significant change, so flag it before attempting.

**The `_projects/` collection has `output: false` until Phase 4.**
Until the `layout: project` template is built and `output: true` is set in `_config.yml`, `_projects/*.md` files are content waiting to be wired up — they won't generate individual pages yet.
