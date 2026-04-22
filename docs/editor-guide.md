# Jewmanity Editor Guide

Welcome! This is your reference for editing the Jewmanity website. You don't need to know anything technical to use it. If you can write an email, you can edit this site.

Bookmark this page — it's your go-to for everything from updating a hotline number to adding a new retreat story.

---

## Section 1 — Getting Started

### Where to log in

Go to **[https://jewmanity.sanity.studio](https://jewmanity.sanity.studio)**. This is called **Studio** — think of it as the control panel for your website's content.

### Setting up your account

You'll get an invite email from Sanity. Click the link, set a password, and you're in. If you don't see the email, check spam. If it's still missing, contact Erik (see bottom of this guide).

### Quick tour of Studio

When you open Studio, you'll see three areas:

- **Left nav** — a list of everything you can edit, grouped by type (pages, recipes, team members, etc.)
- **Center** — where the actual editing happens. When you click something on the left, it opens here.
- **Right** — sometimes shows helpful info like a preview or a history of changes

`[SCREENSHOT: Studio left navigation with content types highlighted]`

### The single most important rule: **Save ≠ Publish**

This trips up every new editor. There are two steps to making an edit go live:

1. **Save** — stores your changes as a draft. Nothing on the live site changes yet. You can close the tab and come back later.
2. **Publish** — pushes the change to the live website.

**Nothing shows up on jewmanity.org until you click Publish.** If you ever make an edit and it "didn't work," check that you actually hit Publish. A yellow "Unpublished changes" banner means you saved but didn't publish yet.

### How long do changes take to appear on the live site?

**About 2–3 minutes after you click Publish.** The site needs a moment to rebuild with your changes. If it's been longer than 5 minutes and you don't see your edit, skip to the Troubleshooting section.

---

## Section 2 — Content Types Overview

Here's everything you'll see in the left nav of Studio, with a quick description of what each one controls.

### Pages (one of each — edit to change what's on that page)

| Content Type | What It Edits | Notes |
|---|---|---|
| **Site Settings** | Organization name, EIN, footer copyright, social media links (Facebook, Instagram, Twitter, LinkedIn) | Shown on every page |
| **Homepage** | Hero section, "How We Help You" program cards, donation tiers, newsletter heading, stats bar | Your site's front door |
| **About Story** | "Our Story" text, Our Values cards, bottom call-to-action | Under About → Our Story |
| **Heads Up Program** | Hero, Safe Haven intro, Who We Support, Retreat Experience, Evidence-Based Care, What's Included, Community section, Impact stats, CTA | The largest single page |
| **Mental Health Resources** | Hero, Advocacy Pillars, Why It Matters, Common Struggles, Signs to Watch For, Crisis Hotlines | ⚠️ Crisis hotline section — keep phone numbers current |
| **Fighting Antisemitism** | Hero, Understanding Today, How It Shows Up, Taking Action steps, Learn More (articles), Organizations | Uses the separate "Recommended Articles" list for the article grid |
| **Contact Page** | Hero, intro paragraph, form heading, privacy note, Other Ways to Connect cards | Form itself is in code |
| **Volunteer Page** | Hero, Why Volunteer, How You Can Help cards, Volunteer Impact stats, Testimonials heading, FAQ heading, Application form heading, CTA | Form itself is in code |
| **Donate Page** | Hero + tax note, Impact cards, Why Give values, Cost Breakdown, FAQ heading, Bottom CTA | Donation widget itself is in code |
| **Shop Page** | Hero, Every Purchase Makes an Impact section, bottom CTA | Products themselves are in a separate "Products" list |
| **Mitzvah Project** | Bar/Bat Mitzvah project page content | |

### Collections (multiple entries — add, edit, or remove as many as you like)

Current counts (as of launch). In Studio, the left nav shows the live count next to each collection — so you can always check what's there.

| Content Type | Current Count | What It Is |
|---|---|---|
| **Recipes** | (see Studio) | Your recipe blog. Add, edit, or remove individual recipes. |
| **Retreats** | 4 | Heads Up retreat write-ups. One entry per retreat. |
| **Team Members** | (see Studio) | Staff bios for the About → Team page. |
| **Products** | 4 | Shop items (water bottle, hats, candle set). |
| **Testimonials** | (see Studio) | Participant quotes shown in carousels across the site. The **Display Context** field controls where each quote appears: `General / Homepage` → Homepage Impact Stories; `Heads Up Program` → Heads Up + Past Retreats carousels; `Volunteer` → Volunteer page carousel; `Antisemitism Story` → "Voices From Our Community" section on Community Stories. Tag each testimonial with the context that matches where it should appear. |
| **Community Stories** | 6 | Retreat and volunteer stories shown on the Community Stories page. |
| **Recommended Articles** | 6 | External articles featured on the Fighting Antisemitism → Learn More section. |
| **FAQ Items** | 20 | Questions and answers. Each FAQ is tagged with which page it appears on. |

---

## Section 3 — Common Tasks

Each task below is a 3–6 step walkthrough. If you get stuck, jump to Troubleshooting.

### 1. How to edit a section heading on the homepage

1. In Studio's left nav, click **Homepage**.
2. Click the tab at the top for the section you want to edit (e.g., "How We Help").
3. Find the heading field and type your new heading.
4. Click **Publish** in the bottom-right.
5. Wait 2–3 minutes and refresh the live site.

---

### 2. How to add a new recipe

1. In Studio's left nav, click **Recipes**.
2. Click the green **+** button (top-left of the recipe list).
3. Fill in the title, description, ingredients, instructions, and upload a photo.
4. Click **Generate** next to "URL Slug" to auto-create the web address.
5. Click **Publish**.
6. The recipe will appear on the Recipes page after the next rebuild.

---

### 3. How to add a new team member

1. In Studio's left nav, click **Team Members**.
2. Click the green **+** button.
3. Fill in name, role, short bio, and upload a headshot.
4. Set a sort order number (lower numbers appear first).
5. Click **Publish**.

---

### 3a. Adjusting team member photo framing

If a team member's face isn't visible on their card — head cut off, or a full-body shot cropped through the torso — you can reposition the focal point so the card crop centers on their face.

1. In Studio's left nav, click **Team Members**, then open the person's doc.
2. Click the photo field to open it.
3. Click the photo thumbnail to expand the edit controls.
4. Drag the circular **hotspot** marker to where the face is.
5. Click outside to save, then **Publish**.

The card will use your new hotspot on the next deploy (2–3 minutes).

---

### 4. How to edit a FAQ (and how FAQs route to pages)

Each FAQ has a **Page Context** field that tells the site which page the FAQ should appear on. Options are:

- **Volunteer Page** — shows on the Volunteer page FAQ section
- **Donate Page** — shows on the Donate page FAQ section
- **Mitzvah Project Page** — shows on the Mitzvah Project FAQ section
- **General / All Pages** — shows everywhere

**To edit an FAQ:**

1. In Studio's left nav, click **FAQ Items**.
2. Click the FAQ you want to edit.
3. Change the question, answer, or page context.
4. Click **Publish**.

**To add a new FAQ:** Click the green **+** button on the FAQ Items list, then fill in question, answer, and pick a page context.

---

### 5. How to upload a new image

Anywhere in Studio where a field shows "Upload" or a placeholder image:

1. Click the upload area (or drag an image onto it).
2. Choose a photo from your computer.
3. Once uploaded, you can drag the "hotspot" dot to tell the site which part of the photo matters most (useful for hero banners that get cropped on phones).
4. Save and Publish the page you're on.

**Tip:** Aim for landscape photos at least 1200px wide for hero banners, and 600×400px or larger for section images.

---

### 6. How to edit donation cost breakdown amounts

1. In Studio's left nav, click **Donate Page**.
2. Click the **Cost Breakdown** tab at the top.
3. Click any line item to edit its icon (emoji), title, description, or dollar amount.
4. Update the **Total Amount** at the bottom if the individual amounts change.
5. Click **Publish**.

---

### 7. How to update social media links in the footer

1. In Studio's left nav, click **Site Settings**.
2. Find the **Social Media Links** section.
3. Paste the full URL for each platform (Facebook, Instagram, Twitter, LinkedIn).
4. Leave any platform blank to hide its icon from the footer.
5. Click **Publish**. The footer on every page updates after the rebuild.

---

### 8. How to add a new retreat

1. In Studio's left nav, click **Retreats**.
2. Click the green **+** button.
3. Fill in title, subtitle, author, retreat date, and location.
4. Upload a cover photo (required).
5. Add photos to the Gallery section.
6. Write the article body — you can add paragraphs, headings, and inline images.
7. Set a participant count if you want to show that stat.
8. Click **Generate** next to URL Slug.
9. Click **Publish**.

---

### 9. How to add a new community story

1. In Studio's left nav, click **Community Stories**.
2. Click the green **+** button.
3. Fill in title, tag (Retreat / Volunteer / Community Impact), and upload an image.
4. Write a short **Preview** (this appears on the card).
5. Add the full story as multiple paragraphs in the **Story Paragraphs** list.
6. Optionally add a **Pull Quote** — a highlighted line that stands out in the article.
7. Click **Generate** next to URL Slug.
8. Click **Publish**.

---

### 10. How to update crisis hotline phone numbers

Crisis numbers change — this is an important one to keep fresh.

1. In Studio's left nav, click **Mental Health Resources**.
2. Click the **Crisis Resources** tab.
3. Click the hotline you want to update (e.g., "988 Suicide & Crisis Lifeline").
4. Update the phone number or description.
5. Click **Publish**.

> The International crisis dropdown on the live page (with 35+ countries) is currently managed in code. If a number in that dropdown changes, contact your developer.

---

### 11. How to add a new article to the Recommended Articles list

1. In Studio's left nav, click **Recommended Articles**.
2. Click the green **+** button.
3. Fill in the article title, publication name (e.g., "Times of Israel"), date (e.g., "January 2026"), full URL, and a 2-3 sentence description.
4. Set a sort order number (lower = shown first).
5. Click **Publish**.
6. The article appears in the Fighting Antisemitism → Learn More grid after rebuild.

---

### 12. How to make an edit without publishing it yet (drafts)

Every time you save without publishing, your edit is stored as a **draft**. Drafts don't appear on the live site.

1. Make your changes.
2. Click anywhere outside the field or hit **Save** (happens automatically in most cases).
3. A yellow "Unpublished changes" banner will appear — that's your draft.
4. Come back any time to continue editing.
5. When you're ready, click **Publish**.

---

### 13. How to see what the site will look like before publishing

At the moment, Studio does not have a live preview of the Jewmanity site. To check changes, **Publish**, wait 2–3 minutes, then look at the live site in another tab. If you'd like a preview inside Studio added as a feature, ask your developer — it's a supported Sanity feature.

---

### 14. How to roll back a change (revision history)

Every edit is saved. You can always undo.

1. Open the content you want to roll back (e.g., Homepage, or a specific recipe).
2. Click the **⋯ menu** (three dots, top-right) or the **History** icon.
3. You'll see a list of past versions with timestamps.
4. Click the version you want to restore.
5. Click **Restore** (or equivalent button).
6. Click **Publish** to make the restored version live.

If in doubt, rolling back is safe — it doesn't delete anything, just goes back to an earlier saved state.

---

## Section 4 — Field Safety Notes

Most fields are safe to edit. A few deserve extra care. Watch for these:

### ⚠️ Medical disclaimer — Resources page

Field: **Medical Disclaimer** (under Resources → Common Struggles tab)

This is the "Jewmanity is not a medical provider…" text. It's legal wording. **Review any changes with a lawyer before publishing.** If users in a mental health crisis misunderstand this disclaimer, it could create liability.

### ⚠️ Tax note — Donate page hero

Field: **Hero Tax Note** (under Donate Page → Hero tab)

The "501(c)(3) classification. All donors can deduct contributions." language. **Review with your accountant before changing** — it affects donor expectations about tax deductibility.

### ⚠️ Cost Breakdown citations

Field: **Citation** on each **Understanding Stat** (Fighting Antisemitism page)

If you update a statistic number, **always update its citation at the same time**. A stale citation next to a new number is misleading and can undermine credibility.

### 🔒 Form headings (Contact + Volunteer pages)

Fields: **Form Heading** on Contact Page and Volunteer Page

You can safely change the heading text itself (e.g., "Contact Us" → "Get in Touch"). But the form fields, dropdown options, and submit behavior are managed in code. **To add a form field, change a subject option, or modify how submissions are received, contact your developer.**

### ⚠️ Privacy / confidentiality notes

Anywhere you see a field labeled "Privacy Note" or "Confidentiality Note" (Contact Page, Volunteer Page):

These set user expectations about how their data is handled. **Review wording carefully before publishing** — especially if your organization's data practices have changed.

---

## Section 5 — Things You Can NOT Edit in Studio (and why)

These are intentionally built into the site's code, not in Studio. If any of these need to change, contact your developer.

- **Legal pages:** Privacy Policy, Terms of Service, Nonprofit Disclosures. Legal text should be reviewed and updated by a lawyer, not edited casually.
- **Navigation menu** (top bar and mobile menu). Adding or renaming menu items requires a developer because it can affect site structure.
- **Form fields + submission behavior:** Contact and Volunteer forms use a service called Formspree. Adding a field, renaming a label, or changing where submissions are sent all require a code change.
- **Donation widget:** The Givebutter widget on the Donate page is managed in code. Branding, preset amounts, and platform fee mode (0% with donor tips, or 3% flat with Stripe) are all configured in the Givebutter dashboard — not in Studio or code.
- **International crisis country dropdown** (Resources page): The 35+ countries and their phone numbers are currently in code. Contact your developer to update.
- **Page layouts and visual design:** Colors, fonts, spacing, button styles, card shapes, etc. are part of the design system. Changing these requires design and development work.
- **Product shop cart behavior:** The "Add to Cart" and checkout flow is managed by a service called Snipcart.

---

## Section 6 — Troubleshooting

### "I published but my change isn't showing on the live site"

1. **Wait 2–3 minutes.** The site rebuilds behind the scenes.
2. **Hard-refresh your browser** — on Mac press Cmd+Shift+R, on Windows press Ctrl+F5. Regular refresh can show a cached version.
3. **Double-check you actually published** — open the content in Studio. If you see a yellow "Unpublished changes" banner, you saved but didn't publish.
4. If it's still not showing after 10 minutes, contact your developer.

### "I can't log in"

1. At the Studio login screen, click **Forgot password?** and follow the reset email.
2. If the reset email doesn't arrive, check your spam folder.
3. If still no luck, contact your developer — they may need to re-send your invite.

### "I deleted something by accident"

Good news: Studio keeps history. See Common Tasks #14 (**How to roll back a change**). Every document has a revision history you can restore from.

If you deleted an entire document (like a recipe or team member), contact your developer — they may be able to restore it from a backup.

### "I accidentally published a mistake"

1. Open the content you edited.
2. Click the history/revision icon.
3. Pick the version from before your mistake.
4. Restore it.
5. Click **Publish**.
6. Your mistake will be replaced within 2–3 minutes on the live site.

### "Who do I contact for help?"

Erik at HEK Design Studio: **[Erik's email]**

When emailing, include:
- Which page or content type you were editing
- What you were trying to do
- What happened instead (screenshots help)

---

## Section 7 — Glossary

Plain-language definitions of terms you might see:

- **Document** — One piece of content. A recipe is a document. A team member is a document. The Homepage is also a document (just one of them).
- **Publish** — The action that makes your change appear on the live website.
- **Draft** — A saved but unpublished change. Lives only inside Studio until you publish it.
- **Field Group** — The tabs at the top of a page in Studio (e.g., "Hero," "Impact," "CTA"). They're just a way to organize related fields so Studio isn't overwhelming.
- **Reference** — A link from one document to another. For example, a recipe might "reference" a tag category. You don't need to worry about this day-to-day.
- **Asset** — An uploaded file, usually an image. Assets live in Studio's Media Library once uploaded and can be reused across multiple documents.
- **URL Slug** — The part of a web address that identifies a specific page. If a recipe's slug is `challah`, its URL becomes `jewmanity.org/community/recipes/challah`. Click "Generate" to auto-create one from the title.
- **Hotspot** — On an uploaded image, the dot that tells the site which part of the photo to prioritize when cropped.

---

**Last updated:** 2026-04-16 · Built by HEK Design Studio

*Questions? Contact Erik: [Erik's email]*
