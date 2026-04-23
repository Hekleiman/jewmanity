# Phase 0: Git state

## What I checked

1. `git rev-parse HEAD`
2. `git rev-parse --abbrev-ref HEAD`
3. `git log --oneline -20`
4. `git status --short`
5. `git diff --stat HEAD`
6. `git stash list`
7. `git remote -v`
8. `git log origin/main..HEAD --oneline`
9. `git log HEAD..origin/main --oneline`
10. `git log 8c94e84..HEAD --oneline | wc -l` (commits since prior audit)
11. `git ls-files --others --exclude-standard` (untracked files)

## Evidence

### HEAD and branch
```
fbadfc56ea9e1f3c7bcecdab44e3fe89e5872a1b
main
```

### `git log --oneline -20`
```
fbadfc5 feat: hotspot-aware team photos + urlForCropped utility
309ef8b content: port retreat posts from Squarespace to Sanity
a43ee41 content: seed team member bios and photos from current Jewmanity site
27b7e0a content: remove em-dashes from recipe content
c962563 feat: belinda round 1 layout/content fixes (hero gradient, headsup testimonials, fallback parity)
2fbda15 docs: add stale-note to project audit reflecting cleanup session
76ca270 wip: Givebutter platform migration (placeholder IDs pending Belinda)
8d6d82d feat(scripts): add Sanity seed scripts for singletons and retreats
48b483f chore(sanity): set studioHost for production studio deploy
351fed1 feat: wire CMS data through get-involved pages
db7c9a7 feat: wire CMS data through donate, shop, and resources pages
e214d7e feat: wire CMS data through programs and community pages
ffca683 feat: wire CMS data through homepage and about pages
02e7f26 feat(groq): extend query projections for new schema fields
cd51a28 feat(schema): add reusable object types and expand singletons
304f2e9 docs: add project audits and editor guide
b45a788 schema: recipe metadata + gallery, testimonial antisemitism context, wire authorImage through carousel
8c94e84 Wire homepage donation cards to Donorbox with pre-selected amount
9be7093 Update images, components, retreat pages, and community story routing
8a05e1c Update Mitzvah Project page with full PDF content and quote blocks
```

### `git status --short`
```
(empty — working tree is clean)
```

### `git diff --stat HEAD`
```
(empty — no staged or unstaged changes)
```

### `git stash list`
```
(empty — no stashes)
```

### `git remote -v`
```
origin	https://github.com/Hekleiman/jewmanity.git (fetch)
origin	https://github.com/Hekleiman/jewmanity.git (push)
```

### `git log origin/main..HEAD --oneline`
```
(empty — not ahead of origin/main)
```

### `git log HEAD..origin/main --oneline`
```
(empty — not behind origin/main)
```

### `git log 8c94e84..HEAD --oneline`
```
fbadfc5 feat: hotspot-aware team photos + urlForCropped utility
309ef8b content: port retreat posts from Squarespace to Sanity
a43ee41 content: seed team member bios and photos from current Jewmanity site
27b7e0a content: remove em-dashes from recipe content
c962563 feat: belinda round 1 layout/content fixes (hero gradient, headsup testimonials, fallback parity)
2fbda15 docs: add stale-note to project audit reflecting cleanup session
76ca270 wip: Givebutter platform migration (placeholder IDs pending Belinda)
8d6d82d feat(scripts): add Sanity seed scripts for singletons and retreats
48b483f chore(sanity): set studioHost for production studio deploy
351fed1 feat: wire CMS data through get-involved pages
db7c9a7 feat: wire CMS data through donate, shop, and resources pages
e214d7e feat: wire CMS data through programs and community pages
ffca683 feat: wire CMS data through homepage and about pages
02e7f26 feat(groq): extend query projections for new schema fields
cd51a28 feat(schema): add reusable object types and expand singletons
304f2e9 docs: add project audits and editor guide
b45a788 schema: recipe metadata + gallery, testimonial antisemitism context, wire authorImage through carousel
```
Count: **17 commits**

### `git ls-files --others --exclude-standard`
```
(empty)
```

## Findings

- **Commits since prior audit HEAD (`8c94e84`)**: 17. Range spans schema expansion (`cd51a28`, `02e7f26`), CMS wiring across all page groups (`ffca683` → `351fed1`), a deliberately-WIP Givebutter migration (`76ca270`), content seed scripts (`8d6d82d`), content seeds for recipes/team/retreats (`27b7e0a`, `a43ee41`, `309ef8b`), Belinda round-1 fixes (`c962563`), and the hotspot-aware team photos + `urlForCropped` utility (`fbadfc5`).
- **Working tree is 100% clean**: zero dirty files, zero staged, zero untracked, zero stashes.
- **Working tree is exactly at `origin/main`**: 0 ahead, 0 behind, no divergence.
- **Untracked paths the prior audit didn't mention**: none (no untracked files at all prior to this audit run).
- **Git remote**: single `origin` pointing at `https://github.com/Hekleiman/jewmanity.git`.
- Commit `76ca270` ("wip: Givebutter platform migration (placeholder IDs pending Belinda)") is a published commit on `main` that the subject line itself flags as WIP. Any Givebutter code reached HEAD from there forward unless reverted or overridden.

## Open questions

- None for Phase 0 — git state is unambiguous.
