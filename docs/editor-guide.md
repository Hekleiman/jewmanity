# Jewmanity Editor Guide

Welcome! This is your reference for editing the Jewmanity website. You don't need to know anything technical to use it. If you can write an email, you can edit this site.

Bookmark this page. It's your go-to for everything from updating a hotline number to adding a new retreat story.

---

## Section 1: Getting Started

### Where to log in

Go to **[https://jewmanity.sanity.studio](https://jewmanity.sanity.studio)**. This is called **Studio**, the control panel for your website's content.

### Setting up your account

You'll get an invite email from Sanity. Click the link, set a password, and you're in. If you don't see the email, check spam. If it's still missing, contact Erik (see bottom of this guide).

### Quick tour of Studio

When you open Studio, you'll see three areas:

- **Left nav**, a list of everything you can edit. It's organized into top-level sections (Pages, Mental Health Resources, Shop, Donate, Content Library, Site Settings, Site Navigation). Most sections expand into a sub-list when you click them.
- **Center**, where the actual editing happens. When you click something on the left, it opens here.
- **Right**, sometimes shows helpful info like a preview or a history of changes.

The order of the **Pages** sub-list mirrors the site's nav (About, Programs, Community, Get Involved, plus the legal pages at the bottom), so finding a page in Studio is the same as finding it on the website.

`[SCREENSHOT: Studio left navigation with content types highlighted]`

### The single most important rule: **Save ≠ Publish**

This trips up every new editor. There are two steps to making an edit go live:

1. **Save** stores your changes as a draft. Nothing on the live site changes yet. You can close the tab and come back later.
2. **Publish** pushes the change to the live website.

**Nothing shows up on jewmanity.com until you click Publish.** If you ever make an edit and it "didn't work," check that you actually hit Publish. A yellow "Unpublished changes" banner means you saved but didn't publish yet.

### How long do changes take to appear on the live site?

**About 2–3 minutes after you click Publish.** The site needs a moment to rebuild with your changes. If it's been longer than 5 minutes and you don't see your edit, skip to the Troubleshooting section.

---

## Section 2: Content Types Overview

Here's everything you'll see in the left nav of Studio, with a quick description of what each one controls. The left nav has three flavors of thing:

1. **Pages**, one document per URL on the site. You edit them, you don't add or delete.
2. **Content Library**, collections you can add to, edit, and remove from (recipes, team members, testimonials, etc.).
3. **Site-wide settings**, single documents that apply across every page (Site Settings, Site Navigation).

### Pages (one of each, edit to change what's on that page)

Each row below shows the website URL the page drives, the click path to reach the document in Studio, and the underlying Sanity document type. The Pages sub-list is grouped by which nav section the page belongs to on the site.

| Website page | URL | Click path in Studio | Sanity document |
|---|---|---|---|
| Homepage | `/` | Pages → Homepage | `homepage` |
| Our Story | `/about/story` | Pages → About → Our Story | `aboutStory` |
| Team | `/about/team` | Pages → About → Team Page | `aboutTeamPage` (heading and intro) plus the **Team Members** collection |
| Heads Up Program | `/programs/heads-up` | Pages → Programs → Heads Up Program | `headsUp` |
| Past Retreats | `/programs/past-retreats` | Pages → Programs → Past Retreats Page | `programsPastRetreatsPage` (heading and intro) plus the **Retreats** collection |
| Fighting Antisemitism | `/community/fighting-antisemitism` | Pages → Community → Fighting Antisemitism | `fightingAntisemitism` plus the **Recommended Articles** collection for the article grid |
| Community Stories index | `/about/community-stories` | Pages → Community → Community Stories Page | `aboutCommunityStoriesPage` (heading and intro) plus the **Community Stories** collection |
| Recipes index | `/community/recipes` | Pages → Community → Recipes Page | `communityRecipesPage` (heading and intro) plus the **Recipes** collection |
| Volunteer | `/get-involved/volunteer` | Pages → Get Involved → Volunteer Page | `volunteerPage` plus the **Testimonials** and **FAQ Items** collections |
| Contact | `/get-involved/contact` | Pages → Get Involved → Contact Page | `contactPage` |
| Mitzvah Project | `/get-involved/mitzvah-project` | Pages → Get Involved → Mitzvah Project | `mitzvahProject` plus the **FAQ Items** collection |
| 404 page | (shown when a URL is wrong) | Pages → 404 Page | `notFoundPage` |
| Privacy Policy | `/privacy` | Pages → Privacy Policy | `privacyPage` |
| Terms of Service | `/terms` | Pages → Terms of Service | `termsPage` |
| Nonprofit Disclosures | `/nonprofit-disclosures` | Pages → Nonprofit Disclosures | `nonprofitDisclosuresPage` |
| Mental Health Resources | `/resources` | Mental Health Resources (top level) | `resources`. ⚠️ Crisis hotline section, keep phone numbers current |
| Shop | `/shop` | Shop → Shop Page | `shopPage` (hero plus surrounding copy). The actual items are under Shop → Products |
| Donate | `/donate` | Donate → Donate Page | `donatePage` |

### Content Library (multiple entries, add, edit, or remove as many as you like)

In Studio, the left nav shows the live count next to each collection, so you can always check what's there.

| Collection | Click path | Sanity document | What it is |
|---|---|---|---|
| **Team Members** | Content Library → Team Members | `teamMember` | Staff bios for the Team page. Sort order controls position. |
| **Testimonials** | Content Library → Testimonials | `testimonial` | Participant quotes shown in carousels across the site. The **Display Context** field controls where each quote appears: `General / Homepage` for the Homepage Impact Stories carousel; `Heads Up Program` for the Heads Up and Past Retreats carousels; `Volunteer` for the Volunteer page carousel; `Antisemitism Story` for the "Voices From Our Community" section on Community Stories. Tag each testimonial with the context that matches where it should appear. |
| **Community Stories** | Content Library → Community Stories | `communityStory` | Retreat and volunteer stories shown on the Community Stories page. Each has its own URL at `/about/community-stories/[slug]`. |
| **Recipes** | Content Library → Recipes | `recipe` | The recipe blog. Each has its own URL at `/community/recipes/[slug]`. |
| **Retreats** | Content Library → Retreats | `retreat` | Heads Up retreat write-ups, one entry per retreat. Each has its own URL at `/programs/[slug]`. |
| **FAQ Items** | Content Library → FAQ Items | `faqItem` | Questions and answers. Each FAQ is tagged with which page it appears on via the **Page Context** field (see Common Task 4). |
| **Recommended Articles** | Content Library → Recommended Articles | `recommendedArticle` | External articles featured in the Fighting Antisemitism Learn More grid. |
| **Products** | Shop → Products | `product` | Shop items. Note: Products live under **Shop**, not under Content Library, since they belong to that section. Each has its own URL at `/shop/[slug]`. |

### Site-wide settings

| Setting | Click path | Sanity document | What it controls |
|---|---|---|---|
| **Site Settings** | Site Settings (top level) | `siteSettings` | Organization name, EIN, footer copyright, tax disclaimer, social media links (Facebook, Instagram, Twitter, LinkedIn), default OG image. Shown on every page. |
| **Site Navigation** | Site Navigation (top level) | `navigation` | The menu at the top of the site. Reorder items, rename labels, edit submenu links. Both the desktop nav and the mobile menu read from this same document. |

### Required fields in the most-edited singletons

Most fields in Studio are optional in the sense that the schema does not block publish if they're empty, but leaving certain fields blank will visibly break a page. Treat these as required when editing:

- **Homepage**: Hero Heading, Hero Subtitle, Hero Primary Button (text and link), How We Help Heading, at least one Program Card, at least one Donation Amount, Donation Section Heading, Donation Section Button.
- **Donate Page**: Hero Heading (inside the Hero Section field), Hero Tax Note, Impact Section Heading, at least one Impact Card, at least one Cost Breakdown line item with title and amount, CTA Heading (in the Bottom CTA tab).
- **Contact Page**: Hero Heading (inside the Hero Section field), Intro Paragraph, Form Heading, Privacy Note, at least one Other Ways card.

If you publish a page with one of these blank, expect a broken-looking section on the live site. The rebuild will still succeed, so the safety net is reading the live site after publish.

---

## Section 3: Common Tasks

Each task below is a 3 to 6 step walkthrough. If you get stuck, jump to Troubleshooting.

### 1. How to edit a section heading on the homepage

1. In the left sidebar, click **Pages**, then click **Homepage**. The editor opens on the right.
2. Click the tab at the top for the section you want to edit (e.g., "How We Help").
3. Find the heading field and type your new heading.
4. Click **Publish** in the bottom-right.
5. Wait 2 to 3 minutes and refresh the live site.

---

### 2. How to add a new recipe

1. In the left sidebar, click **Content Library**, then click **Recipes**.
2. Click the green **+** button (top-left of the recipe list).
3. Fill in the title, description, ingredients, instructions, and upload a photo.
4. Click **Generate** next to "URL Slug" to auto-create the web address.
5. Click **Publish**.
6. The recipe will appear on the Recipes page after the next rebuild.

---

### 3. How to add a new team member

1. In the left sidebar, click **Content Library**, then click **Team Members**.
2. Click the green **+** button.
3. Fill in name, role, short bio, and upload a headshot.
4. Set a sort order number (lower numbers appear first).
5. Click **Publish**.

---

### 3a. Adjusting team member photo framing

If a team member's face isn't visible on their card (head cut off, or a full-body shot cropped through the torso), you can reposition the focal point so the card crop centers on their face.

1. In the left sidebar, click **Content Library**, then click **Team Members**, then open the person's doc.
2. Click the photo field to open it.
3. Click the photo thumbnail to expand the edit controls.
4. Drag the circular **hotspot** marker to where the face is.
5. Click outside to save, then **Publish**.

The card will use your new hotspot on the next deploy (2 to 3 minutes).

**Important: don't nudge the hotspot by accident.** The hotspot marker is easy to click on unintentionally while editing an image. If you click the hotspot and then publish, Studio saves wherever it landed, often dead-center, which can crop out a face. Rule of thumb: if you didn't open the photo with the intent of re-centering the crop, don't touch the circle at all. If you're unsure, close the image without publishing.

---

### 4. How to edit a FAQ (and how FAQs route to pages)

Each FAQ has a **Page Context** field that tells the site which page the FAQ should appear on. Options are:

- **Volunteer Page**, shows on the Volunteer page FAQ section
- **Donate Page**, shows on the Donate page FAQ section
- **Mitzvah Project Page**, shows on the Mitzvah Project FAQ section
- **General / All Pages**, shows everywhere

**To edit an FAQ:**

1. In the left sidebar, click **Content Library**, then click **FAQ Items**.
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

1. In the left sidebar, click **Donate**, then click **Donate Page**.
2. Click the **Cost Breakdown** tab at the top.
3. Click any line item to edit its icon (emoji), title, description, or dollar amount.
4. Update the **Total Amount** at the bottom if the individual amounts change.
5. Click **Publish**.

---

### 7. How to update social media links in the footer

1. In the left sidebar, click **Site Settings**.
2. Find the **Social Media Links** section.
3. Paste the full URL for each platform (Facebook, Instagram, Twitter, LinkedIn).
4. Leave any platform blank to hide its icon from the footer.
5. Click **Publish**. The footer on every page updates after the rebuild.

---

### 8. How to add a new retreat

1. In the left sidebar, click **Content Library**, then click **Retreats**.
2. Click the green **+** button.
3. Fill in title, subtitle, author, retreat date, and location.
4. Upload a cover photo (required).
5. Add photos to the Gallery section.
6. Write the article body. You can add paragraphs, headings, and inline images.
7. Set a participant count if you want to show that stat.
8. Click **Generate** next to URL Slug.
9. Click **Publish**.

---

### 9. How to add a new community story

1. In the left sidebar, click **Content Library**, then click **Community Stories**. (There's also a Community Stories Page document under Pages → Community. That's the page heading and intro, not the stories themselves.)
2. Click the green **+** button.
3. Fill in title, tag (Retreat / Volunteer / Community Impact), and upload an image.
4. Write a short **Preview** (this appears on the card).
5. Add the full story as multiple paragraphs in the **Story Paragraphs** list.
6. Optionally add a **Pull Quote**, a highlighted line that stands out in the article.
7. Click **Generate** next to URL Slug.
8. Click **Publish**.

---

### 10. How to update crisis hotline phone numbers

Crisis numbers change. This is an important one to keep fresh.

1. In the left sidebar, click **Mental Health Resources** (it's at the top level, not under Pages).
2. Click the **Crisis Resources** tab.
3. Click the hotline you want to update (e.g., "988 Suicide & Crisis Lifeline").
4. Update the phone number or description.
5. Click **Publish**.

> The International crisis dropdown on the live page (with 35+ countries) is currently managed in code. If a number in that dropdown changes, contact your developer.

---

### 11. How to add a new article to the Recommended Articles list

1. In the left sidebar, click **Content Library**, then click **Recommended Articles**.
2. Click the green **+** button.
3. Fill in the article title, publication name (e.g., "Times of Israel"), date (e.g., "January 2026"), full URL, and a 2 to 3 sentence description.
4. Set a sort order number (lower = shown first).
5. Click **Publish**.
6. The article appears in the Fighting Antisemitism → Learn More grid after rebuild.

---

### 12. How to make an edit without publishing it yet (drafts)

Every time you save without publishing, your edit is stored as a **draft**. Drafts don't appear on the live site.

1. Make your changes.
2. Click anywhere outside the field or hit **Save** (happens automatically in most cases).
3. A yellow "Unpublished changes" banner will appear. That's your draft.
4. Come back any time to continue editing.
5. When you're ready, click **Publish**.

---

### 13. How to see what the site will look like before publishing

At the moment, Studio does not have a live preview of the Jewmanity site. To check changes, **Publish**, wait 2 to 3 minutes, then look at the live site in another tab. If you'd like a preview inside Studio added as a feature, ask your developer; it's a supported Sanity feature.

---

### 14. How to roll back a change (revision history)

Every edit is saved. You can always undo.

1. Open the content you want to roll back (e.g., Homepage, or a specific recipe).
2. Click the **⋯ menu** (three dots, top-right) or the **History** icon.
3. You'll see a list of past versions with timestamps.
4. Click the version you want to restore.
5. Click **Restore** (or equivalent button).
6. Click **Publish** to make the restored version live.

If in doubt, rolling back is safe. It doesn't delete anything, just goes back to an earlier saved state.

---

## Section 4: Field Safety Notes

Most fields are safe to edit. A few deserve extra care. Watch for these:

### ⚠️ Medical disclaimer (Resources page)

Field: **Medical Disclaimer** (under Resources → Common Struggles tab)

This is the "Jewmanity is not a medical provider…" text. It's legal wording. **Review any changes with a lawyer before publishing.** If users in a mental health crisis misunderstand this disclaimer, it could create liability.

### ⚠️ Tax note (Donate page hero)

Field: **Hero Tax Note** (under Donate Page → Hero tab)

The "501(c)(3) classification. All donors can deduct contributions." language. **Review with your accountant before changing.** It affects donor expectations about tax deductibility.

### ⚠️ Cost Breakdown citations

Field: **Citation** on each **Understanding Stat** (Fighting Antisemitism page)

If you update a statistic number, **always update its citation at the same time**. A stale citation next to a new number is misleading and can undermine credibility.

### 🔒 Form headings (Contact + Volunteer pages)

Fields: **Form Heading** on Contact Page and Volunteer Page

You can safely change the heading text itself (e.g., "Contact Us" → "Get in Touch"). But the form fields, dropdown options, and submit behavior are managed in code. **To add a form field, change a subject option, or modify how submissions are received, contact your developer.**

### ⚠️ Privacy / confidentiality notes

Anywhere you see a field labeled "Privacy Note" or "Confidentiality Note" (Contact Page, Volunteer Page):

These set user expectations about how their data is handled. **Review wording carefully before publishing**, especially if your organization's data practices have changed.

---

## Section 5: Things You Can NOT Edit in Studio (and why)

These are intentionally built into the site's code, not in Studio. If any of these need to change, contact your developer.

- **Legal pages:** Privacy Policy, Terms of Service, Nonprofit Disclosures are editable in Studio under **Pages**, but legal text should be reviewed by a lawyer before publishing. Don't edit casually.
- **Navigation menu:** the top bar and mobile menu read from **Site Navigation** in Studio, which lets you reorder, rename, or change submenu links. Adding a brand new top-level section that doesn't correspond to an existing page still requires a developer.
- **Form fields + submission behavior:** Contact and Volunteer forms use a service called Formspree. Adding a field, renaming a label, or changing where submissions are sent all require a code change.
- **Donation widget:** The Givebutter widget on the Donate page is managed in code. Branding, preset amounts, and platform fee mode (0% with donor tips, or 3% flat with Stripe) are all configured in the Givebutter dashboard, not in Studio or code.
- **International crisis country dropdown** (Resources page): The 35+ countries and their phone numbers are currently in code. Contact your developer to update.
- **Page layouts and visual design:** Colors, fonts, spacing, button styles, card shapes, etc. are part of the design system. Changing these requires design and development work.
- **Product shop checkout:** Each product's "Add to Cart" button links to a Stripe Payment Link URL (set per-product in Studio under Products > [product] > Stripe Payment Link URL). The hosted checkout page is configured in the Stripe dashboard, not in Studio.

---

## Section 6: Troubleshooting

### "I published but my change isn't showing on the live site"

1. **Wait 2 to 3 minutes.** The site rebuilds behind the scenes.
2. **Hard-refresh your browser.** On Mac press Cmd+Shift+R, on Windows press Ctrl+F5. Regular refresh can show a cached version.
3. **Double-check you actually published.** Open the content in Studio. If you see a yellow "Unpublished changes" banner, you saved but didn't publish.
4. If it's still not showing after 10 minutes, contact your developer.

### "I can't log in"

1. At the Studio login screen, click **Forgot password?** and follow the reset email.
2. If the reset email doesn't arrive, check your spam folder.
3. If still no luck, contact your developer. They may need to re-send your invite.

### "I deleted something by accident"

Good news: Studio keeps history. See Common Tasks #14 (**How to roll back a change**). Every document has a revision history you can restore from.

If you deleted an entire document (like a recipe or team member), contact your developer. They may be able to restore it from a backup.

### "I accidentally published a mistake"

1. Open the content you edited.
2. Click the history/revision icon.
3. Pick the version from before your mistake.
4. Restore it.
5. Click **Publish**.
6. Your mistake will be replaced within 2 to 3 minutes on the live site.

### "Who do I contact for help?"

Erik at HEK Design Studio: **[Erik's email]**

When emailing, include:
- Which page or content type you were editing
- What you were trying to do
- What happened instead (screenshots help)

---

## Section 7: Glossary

Plain-language definitions of terms you might see:

- **Document.** One piece of content. A recipe is a document. A team member is a document. The Homepage is also a document (just one of them).
- **Singleton.** A document there's exactly one of. The Homepage is a singleton. So is every page under **Pages**, and so are **Site Settings** and **Site Navigation**. You edit singletons; you don't add or delete them.
- **Collection.** A document type that can have many entries, like Recipes or Team Members. Everything in **Content Library** (plus Products under Shop) is a collection.
- **Publish.** The action that makes your change appear on the live website.
- **Draft.** A saved but unpublished change. Lives only inside Studio until you publish it.
- **Field Group.** The tabs at the top of a page in Studio (e.g., "Hero," "Impact," "CTA"). They're just a way to organize related fields so Studio isn't overwhelming.
- **Reference.** A link from one document to another. For example, a recipe might "reference" a tag category. You don't need to worry about this day-to-day.
- **Asset.** An uploaded file, usually an image. Assets live in Studio's Media Library once uploaded and can be reused across multiple documents.
- **URL Slug.** The part of a web address that identifies a specific page. If a recipe's slug is `challah`, its URL becomes `jewmanity.com/community/recipes/challah`. Click "Generate" to auto-create one from the title.
- **Hotspot.** On an uploaded image, the dot that tells the site which part of the photo to prioritize when cropped.

---

**Last updated:** 2026-05-21 · Built by HEK Design Studio

*Questions? Contact Erik: [Erik's email]*
