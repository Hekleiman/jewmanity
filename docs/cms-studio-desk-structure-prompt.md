# Prompt: Sanity Studio Desk Structure Polish

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `sanity/lib/desk.ts`. Tightens the Studio left-sidebar grouping so Belinda's first visit is less overwhelming. Companion to the editor onboarding guide at `docs/editor-onboarding-belinda.md` which references the post-this-PR structure.

Estimate: 20 to 30 minutes. Single-file edit (`sanity/lib/desk.ts`) plus visual verification in Studio.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

---

## Pre-flight

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
git checkout -b chore/studio-desk-polish
```

---

## Goal

Two structural improvements, plus one bug fix.

1. **Subgroup the Pages folder by nav section.** Right now it's a flat list of 18 entries. Group into About, Programs, Community, Get Involved, plus the existing legal/404 cluster at the bottom.
2. **Add a "Content Library" parent folder** that contains all collection document types (the things Belinda will create multiple of: testimonials, recipes, etc). Right now Team Members, Retreats, Products, and FAQ Items are top-level items; the existing Community folder is a half-step toward the right pattern. Make it consistent.
3. **Bug fix: `recommendedArticle` is missing from the desk entirely.** Schema exists at `sanity/schemas/documents/recommendedArticle.ts` and the Fighting Antisemitism page reads them, but there is no list item to manage them in Studio. Add it under the Community subfolder.

---

## Target structure

```
Content
├── Pages
│   ├── Homepage
│   ├── About
│   │   ├── Our Story
│   │   ├── Team Page
│   │   └── Community Stories Page
│   ├── Programs
│   │   ├── Heads Up Program
│   │   └── Past Retreats Page
│   ├── Community
│   │   ├── Fighting Antisemitism
│   │   ├── Mental Health Resources
│   │   └── Recipes Page
│   ├── Get Involved
│   │   ├── Donate Page
│   │   ├── Shop Page
│   │   ├── Volunteer Page
│   │   ├── Contact Page
│   │   └── Mitzvah Project
│   ├── ───────────────  (divider)
│   ├── 404 Page
│   ├── Privacy Policy
│   ├── Terms of Service
│   └── Nonprofit Disclosures
├── ───────────────  (divider)
├── Content Library
│   ├── Team Members
│   ├── Testimonials
│   ├── Community Stories
│   ├── Recipes
│   ├── Retreats
│   ├── Products
│   ├── FAQ Items
│   └── Recommended Articles  ← NEW, was missing
├── ───────────────  (divider)
├── Site Settings
└── Site Navigation
```

Keep all existing icons. Pick reasonable icons for the new About/Programs/Community/Get Involved subfolder items (the same ones the pages inside use is fine, or pick something distinct like `FolderIcon` if you want to differentiate subfolders from their contents).

For "Recommended Articles", a fitting icon would be `BookmarkIcon` or `LinkIcon` from `@sanity/icons`.

The existing Community subfolder (containing Recipes, Community Stories, Testimonials) gets dissolved; its items move into the new Content Library parent alongside the other collections. This avoids the confusion of having two "Community" sections in the sidebar (one inside Pages, one as a separate folder).

---

## Verification

1. `cd sanity && npx sanity dev`, open Studio at `http://localhost:3333`.
2. Confirm the new sidebar matches the target structure exactly.
3. Click into each new subfolder, confirm every singleton/document opens correctly and shows the expected content.
4. Confirm "Recommended Articles" lists the existing entries (or shows an empty state if none have been created yet).
5. Confirm Site Settings and Site Navigation are still pinned at the bottom and editable.
6. `npm run build` succeeds (desk changes shouldn't affect the build, but verify nothing else regressed).

---

## Commit and PR

```
git add sanity/lib/desk.ts
git commit -m "chore(studio): subgroup pages by nav section, consolidate collections

Polishes the Studio left sidebar before handing access to Belinda:

- Pages folder now groups by nav section (About, Programs, Community,
  Get Involved) instead of being a flat 18-item list
- New Content Library parent folder gathers every collection document
  type (Team Members, Testimonials, Community Stories, Recipes,
  Retreats, Products, FAQ Items, Recommended Articles)
- Fixes missing Recommended Articles entry (schema existed but no
  list item; couldn't manage them in Studio)
- Site Settings and Site Navigation remain pinned at the bottom"
git push -u origin chore/studio-desk-polish
gh pr create --fill
gh pr merge --auto --squash --delete-branch
```

---

## After this PR

The editor onboarding guide at `docs/editor-onboarding-belinda.md` describes Studio using the structure this PR produces, so it becomes accurate once this merges. If you ship this PR first, the onboarding guide's screenshots and "click here" instructions are immediately correct.
