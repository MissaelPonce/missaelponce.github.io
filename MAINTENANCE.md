# Portfolio Site — Maintenance Guide

How to update and extend the site without needing to remember how Jekyll works. Written for someone comfortable with web development basics who isn't a Jekyll expert.

---

## How the site works (30-second overview)

Jekyll is a static site generator. It reads your content files (YAML, Markdown) and template files (HTML with Liquid tags), builds a static site, and outputs it to `_site/`. GitHub Pages runs Jekyll automatically on every push; you never touch `_site/` directly.

**Content you'll edit regularly:**

| Folder / file | What lives there |
|---|---|
| `_data/projects.yml` | Homepage project grid (the cards) |
| `_projects/{slug}.md` | Full project detail pages |
| `_data/skills.yml` | Skill groups + soft skills |
| `_config.yml` | Site-level settings (title, email, phone, logo path) |
| `terms.md` / `privacy.md` | Legal pages linked in the footer |

Everything else (layouts, SCSS, JavaScript) only needs changing if you're modifying the design.

> **Note:** The Experience and Education sections are no longer shown on the site (that info lives in the CV). `_data/experience.yml` and `_includes/experience.html` still exist but are not included anywhere. To bring the section back, re-add `{% include experience.html %}` to `_layouts/front.html`.

---

## Per-project image & video convention

Each project keeps its media in its own folder:

```
img/portfolio/{slug}/
    header.{png|jpg|webp|gif}   ← the homepage card image (a.k.a. thumbnail)
    01.png, 02.png, 03.jpg ...  ← gallery screenshots, numbered in display order
```

- The **`header.*`** file is the image shown on the homepage card. It is also used as the **first item in the detail-page gallery** by default.
- Gallery screenshots are simply numbered `01`, `02`, … Any image extension works; match what you put in the `images:` list.

---

## Adding a new project

### Step 1 — Add a card to the homepage grid

Open `_data/projects.yml` and append a new entry:

```yaml
- title: "Your Project Title"
  slug: "your-project-slug"        # becomes the URL: /projects/your-project-slug/
  category: "Unity / Game Dev"     # shown as the label on the card
  period: "Jan 2024"               # optional; remove the line if not needed
  card_summary: "One sentence describing the project."
  thumbnail: "img/portfolio/your-project-slug/header.png"
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
period: "Jan 2024"
tags: [Unity, C#, Tag3]
thumbnail: "img/portfolio/your-project-slug/header.png"
images:
  - src: "img/portfolio/your-project-slug/01.png"
    alt: "Descriptive alt text"
  - src: "img/portfolio/your-project-slug/02.png"
    alt: "Descriptive alt text"
links:
  - label: "GitHub"
    url: "https://github.com/..."
---

Your project description in Markdown goes here.
```

Remove the `links:` block entirely if there are no links. Remove `images:` if there are no screenshots.

### Step 3 — Add the images

Place the files in `img/portfolio/your-project-slug/` following the convention above (`header.*` + numbered gallery images).

**Recommended sizes:**
- Header / card: landscape, JPEG/PNG, ideally ~1600×900 or larger, under ~400 KB.
- Gallery images: 1280×720 (16:9) reads best in the viewer. Under ~500 KB each.

---

## The project media viewer (how the gallery works)

Detail pages use a **media viewer**: one large stage that shows the current image/video, left/right arrows, and a thumbnail strip below. Clicking the large media (or a thumbnail) opens an enlarged **lightbox modal** (close with the X, click outside, or Esc). It's all driven by `js/media-viewer.js` + the `.media-*` styles in `_sass/_base.scss`.

**Media order in the viewer:** `header` image first → `images:` (in order) → `videos:` (in order).

### Adding videos to a gallery

Add a `videos:` list to the front matter (alongside `images:`):

```yaml
videos:
  - src: "img/portfolio/your-project-slug/clip.mp4"
    poster: "img/portfolio/your-project-slug/clip-poster.jpg"   # optional still frame
    alt: "Short description of the clip"
```

In the viewer a video shows its poster with a ▶ badge; clicking it opens the modal where it plays (muted, with controls). Compress clips with ffmpeg first (see the hero-video section for the command).

### Hiding the card image on a specific project page

By default the `header` (card) image is the first gallery item. To **omit it** on a particular detail page (e.g. when the card is a logo you don't want repeated, or the project should show only a build), add:

```yaml
hide_card_in_gallery: true
```

Currently used on CyberSchijf, GamePoint, and Colorblind Test.

---

## Editing an existing project

| What to change | Where to edit |
|---|---|
| Card summary, tags, period | `_data/projects.yml` (find entry by `slug`) |
| Detail page text | `_projects/{slug}.md` (Markdown body) |
| Card / header image | Replace `img/portfolio/{slug}/header.*` (same filename = no other change needed) |
| Gallery images | Edit the `images:` list in `_projects/{slug}.md` front matter |
| Gallery videos | Edit the `videos:` list in `_projects/{slug}.md` front matter |
| Link buttons | Edit the `links:` list in `_projects/{slug}.md` front matter |

---

## Adding collaborators to a project

Collaborators appear on the detail page only. Add a `collaborators:` block to the front matter:

```yaml
collaborators:
  - name: "Jane Doe"
    role: "Game Design & Level Design"
    url: "https://linkedin.com/in/janedoe"
  - name: "John Smith"
    role: "3D Art"
    url: ""
```

`name` is required; `role` and `url` are optional. If `url` is blank the name is plain text. Remove the block entirely if there are no collaborators; the section hides automatically.

---

## The hero background videos

The homepage hero plays two looping clips in sequence (`header-video-1.mp4` → `header-video-2.mp4` → repeat), with `img/header/poster.jpg` as the still fallback (shown on `prefers-reduced-motion` and before the video loads). Logic is in `js/hero-video.js`; the `<video>` element is in `_includes/header.html`.

### Swapping the hero videos

1. Drop your new clips in `img/header/` and reference them in `_includes/header.html` via the `data-src1` / `data-src2` attributes (these map to `dataset.src1` / `dataset.src2` in the JS — keep the **no-hyphen-before-digit** naming).
2. **Always compress before committing.** Raw renders are huge; GitHub Pages has a soft repo-size budget. Targets used here were ~1–2 MB per clip at 720p:

   ```bash
   ffmpeg -i input.mp4 -vf "scale=-2:720" -c:v libx264 -preset slow -crf 26 \
          -pix_fmt yuv420p -an -movflags +faststart output.mp4
   ```
3. Regenerate the poster from a frame:

   ```bash
   ffmpeg -ss 00:00:01 -i header-video-1.mp4 -vframes 1 -q:v 3 img/header/poster.jpg
   ```

(There's no system ffmpeg on this machine; the dev tooling uses the `ffmpeg-static` npm package — `node -e "console.log(require('ffmpeg-static'))"` prints the binary path.)

---

## Deploying a Unity WebGL build (e.g. Colorblind Test)

Playable builds live under `games/{slug}/` and are embedded with an `<iframe>` on the project page.

1. Export the Unity WebGL build **with "Decompression Fallback" enabled** (so the `.unityweb` files load on a static host like GitHub Pages without server headers).
2. Copy the whole build folder to `games/{slug}/` (it needs `index.html`, `Build/`, `TemplateData/`, `StreamingAssets/`).
3. For a responsive embed, make sure the build's `index.html` lets the canvas fill its container (the Colorblind build has a small `<style>` override + `canvas.style.width/height = "100%"` for this).
4. On the project page, embed it:

   ```html
   <iframe src="{{ site.baseurl }}/games/{slug}/index.html"
           class="webgl-embed" loading="lazy" allowfullscreen
           title="Project playable build"></iframe>
   ```

`keep_files: [games]` in `_config.yml` stops Jekyll from wiping the `games/` output. Builds are large (the Colorblind `.wasm` is ~10 MB); keep an eye on total repo size.

---

## Editing the legal pages & phone number

- **Terms / Privacy:** edit `terms.md` and `privacy.md` (Markdown bodies). They use the `legal` layout and are linked from the footer.
- **Phone number:** set once in `_config.yml` (`phone:`). It's referenced as `{{ site.phone }}` in the Contact section and the legal pages' contact info. (It was intentionally removed from the footer.)
- **Email / LinkedIn / GitHub:** also in `_config.yml` (`email`, `linkedin_username`, `github_username`).

---

## Writing-style conventions

- **No em-dashes (`—`) in body text.** Use commas, colons, parentheses, or separate sentences instead. (Titles and section headings are exempt, but the site currently avoids them there too.)
- **No double spaces** between words or sentences.

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

**Add a new group** — copy a full block and add it to the `groups:` list. Browse Font Awesome 4 icons at https://fontawesome.com/v4/icons/ . **Add a soft skill** via the `soft_skills:` list at the bottom of the file.

---

## Swapping the logo

The logo path is set in `_config.yml`:

```yaml
logo: "img/logo/logo_mp-02.png"
```

To use a different file, replace the image at that path or update `logo:` to the new filename. It's referenced as `{{ site.logo }}` in `_includes/nav.html` and `_includes/footer.html`; no other file needs changing.

**Sizes used:** navbar logo 48px tall, footer logo 64px tall (set in `_sass/_base.scss` as `.nav-logo` / `.footer-logo`). If you change the navbar logo height, keep the navbar `min-height` (72px) and the `.navbar-brand` height in sync so the bottom border never overlaps the logo. Export PNGs at ~2× the display height for retina sharpness.

---

## Changing the colour palette

All colour values live in `_sass/_variables.scss`:

```scss
$color-bg:        #0D1321;   // page background
$color-surface:   #1D2D44;   // cards, About & Contact sections
$color-accent:    #3E5C76;   // primary buttons, hover overlays
$color-highlight: #748CAB;   // links, highlights
$color-text:      #F0EBD8;   // headings and body text
$color-muted:     #748CAB;   // secondary / muted text
```

Change a value here and it propagates everywhere that variable is used.

---

## Updating the copyright name in the footer

Open `_includes/footer.html` and change `{{ site.title }}` / the name in the `&copy;` line. The year is generated automatically by Liquid at build time.

---

## Local preview

```powershell
bundle install          # one-time, after Ruby + Bundler are installed
bundle exec jekyll serve
```

Open http://localhost:4000 . Jekyll watches for changes and rebuilds automatically, **except** `_config.yml` changes, which require a restart (Ctrl+C, then run the command again).

If the site looks broken locally but fine on GitHub Pages (or vice versa), the usual cause is a `baseurl` mismatch. For `MissaelPonce.github.io`, `baseurl` must be `""`.

---

## Deploying via GitHub Desktop

1. Make changes locally and preview them.
2. Open GitHub Desktop; changed files appear in the left panel.
3. Write a short commit message (e.g. `Add new project page`).
4. Click **Commit to main**, then **Push origin**.

GitHub Pages rebuilds automatically (allow 1–2 minutes). If it fails, GitHub emails you; the usual causes are YAML syntax errors or a Liquid typo.

---

## Jekyll gotchas

**`_config.yml` changes require a server restart.** Hot-reload doesn't apply to it.

**YAML is whitespace-sensitive — 2 spaces, never tabs.** Quote strings containing colons or en-dashes (`"Oct 2025 – Apr 2026"`).

**SCSS partials must not have front matter.** Only `css/main.scss` has the `---` block. Files in `_sass/` must not.

**Liquid only runs in files with front matter.** A new include/layout won't render Liquid unless it has a `---` block (or is included by a file that does).

**Don't edit `_site/` directly.** It's overwritten on every build.

**GitHub Pages uses Jekyll 3.x.** Everything here is Jekyll 3-compatible. Using Jekyll 4 features would require a GitHub Actions workflow instead of the built-in Pages build.

**Dev-only tooling is git-ignored / excluded.** `node_modules/`, `tests/`, `assets-src/`, and `ColorBlindBuild/` (the original build drop) are excluded from the Jekyll output and ignored by git. The Playwright QA scripts live in `tests/`.
