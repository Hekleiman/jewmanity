# Editing Jewmanity: A Quick Guide

Welcome. This is a short guide to editing the Jewmanity website yourself. Reading the whole thing takes about 10 minutes. After that, most edits take less than a minute.

The website is built so you can change almost everything without a developer: page text, photos, testimonials, recipes, the navigation menu, donation amounts, products in the shop, FAQ answers, and so on. You make changes in a tool called Sanity Studio. The website then picks up your changes the next time it rebuilds (usually within a minute or two of you publishing).

---

## 1. Getting in

Open this link in your browser:

`https://jewmanity.sanity.studio`

(If the URL is different, ask Erik. Once the Studio is deployed and you have a login, this URL stays the same forever.)

Sign in with the email address Erik invited you with. You will see the Studio dashboard.

Two small things to know about the interface:

- The short URL above will redirect to a longer one (something like `sanity.io/@.../studio/.../jewmanity/`). That's normal; Sanity wraps the Studio inside their broader dashboard. Bookmark the short URL. It always works.
- At the bottom of the screen you may see a banner that says "Studio is not fully compatible with Dashboard. Content Agent is not supported." This is about a Sanity AI feature unrelated to editing the site. Click the X to dismiss it.

---

## 2. The map (what controls what)

The left sidebar is your map. Here's what each section is for:

**Pages.** Everything tied to a specific page on the site. Each page lives under a folder named after where it appears in the site nav, with one exception: Mental Health Resources, Shop, and Donate are promoted to the top level of the sidebar because they get edited often. Want to change something on the Donate page? Open **Donate → Donate Page**. Want to update the homepage hero? Open **Pages → Homepage**. Want to update a shop product? Open **Shop → Products**.

The order in the sidebar follows the site's navigation, so finding a page is the same as finding it on the website.

**Content Library.** Things the site has many of, not tied to one specific page:
- **Team Members**: the people on the About > Team page
- **Testimonials**: the quotes that appear on the homepage, Heads Up, Past Retreats, and other pages
- **Community Stories**: the full stories shown under About > Community Stories on the website
- **Recipes**: every recipe shown under Community > Recipes
- **Retreats**: each past retreat with its own article
- **Products**: items for sale in the shop
- **FAQ Items**: individual questions and answers (used on Donate, Volunteer, Mitzvah, Heads Up)
- **Recommended Articles**: articles linked from the Fighting Antisemitism page

To add a new testimonial or recipe, open the relevant Content Library section and click "Create new" at the top right.

**Site Settings.** Things that appear across every page: the logo, the footer, your tax disclaimer, default social card image, the organization's name and address (used for SEO and the legal footer).

**Site Navigation.** The menu at the top of the site. Change a label, reorder items, add a new submenu link. Both the desktop nav and the mobile menu read from this same place, so you only edit it once.

---

## 3. How to edit a page

The pattern is the same for every page:

1. Open **Pages → [section] → [page name]**.
2. Scroll through the fields. Each one is labeled with what part of the page it controls.
3. Type your changes.
4. Click the green **Publish** button at the bottom right.

Changes appear on the live site within about a minute.

### Example: change the homepage hero text

1. **Pages → Homepage**
2. Find the **Hero** fieldset near the top.
3. Edit "Heading", "Subheading", or "CTA Button Label".
4. Click **Publish**.

### Example: update the tax disclaimer in the footer

1. **Site Settings**
2. Open the **Footer** fieldset.
3. Edit **Tax Disclaimer**.
4. Click **Publish**.

### Example: add a new testimonial

1. **Content Library → Testimonials**
2. Click **Create new** (top right).
3. Fill in the quote, author name, role/affiliation if any, and where you want it to appear (which pages display it).
4. Click **Publish**.

### Example: rename a nav item

1. **Site Navigation**
2. Find the menu item you want to change (e.g., "Get Involved").
3. Edit the **Label** field. The URL stays the same unless you also change **Link**.
4. Click **Publish**.

---

## 4. About images

When you upload an image to a field that asks for it, you'll see two things:

1. The image picker itself.
2. A field called **Alt text** (sometimes "Alternative text" or just "Alt").

**Always fill in the alt text.** It's a short description of what's in the image, used by screen readers (for visually impaired visitors) and by search engines. Two sentences max. Examples:

- For a retreat photo: "Group of veterans sitting in a circle during a healing retreat session."
- For a logo: "Jewmanity logo, a stylized dove with an olive branch."

If you swap an image, update the alt text to match. The alt text travels with the image, not with the page.

---

## 5. Singletons vs collections (the only jargon)

There are two kinds of things in Studio:

**Singletons.** Pages and site-wide settings. There's exactly one of each. You can't accidentally delete the homepage or create a second one.

**Documents (collections).** Testimonials, recipes, team members, products, etc. You can have many of these. You create new ones, edit existing ones, and delete ones you no longer want.

The sidebar tells you which is which: anything inside **Pages** or labeled **Site Settings** / **Site Navigation** is a singleton (one of). Anything inside **Content Library** is a collection (many of).

---

## 6. Drafts and publishing

When you type into a field, your edit becomes a **draft**. The live site doesn't see drafts. To make the change visible:

- Click the green **Publish** button at the bottom right.

If you click away without publishing, your draft is saved automatically. The next time you open that document, your unpublished draft is still there. You can keep working on it.

To throw away an unpublished draft and go back to what's currently live: click the three-dot menu next to **Publish** and choose **Discard changes**.

---

## 7. If something looks wrong

If you publish a change and the live site doesn't update within 5 minutes:

1. Hard refresh your browser: `Cmd+Shift+R` on Mac, `Ctrl+Shift+F5` on Windows. Browsers cache aggressively and you may be looking at an old copy.
2. If it still looks wrong, message Erik. Include what page you edited and what change you expected to see.

If a field is missing or behaving strangely (you expect a field to exist but it isn't there): same thing, message Erik. The schema can be extended.

---

## 8. Things to know about specific pages

A few pages have non-obvious behaviors worth flagging:

- **Homepage's "Impact Stories" carousel.** The testimonials shown here are pulled from Content Library → Testimonials based on the **Display Context** field on each testimonial. To add a new one to the homepage rotation, create the testimonial and set **Display Context** to **General / Homepage**. The other Display Context options (Heads Up Program, Volunteer, Antisemitism Story) route the testimonial to other pages instead.

- **Mailchimp newsletter signup.** The signup form on the homepage submits subscribers to your Mailchimp account. You manage subscribers, send campaigns, and check signups from your Mailchimp dashboard, not from Studio.

- **Contact and volunteer forms.** Form submissions go to your Formspree account. You receive each submission as an email. The form labels, dropdown options, and success/error messages are editable in Studio (under **Pages → Get Involved → Contact Page** and **Volunteer Page**), but the recipient address is set in Formspree.

- **Donation tiers.** The dollar amounts shown on the homepage and Donate page are multiples of 18 (chai) by Jewish tradition. Edit the homepage amounts under **Pages → Homepage** (Donation CTA tab) and the Donate page amounts under **Donate → Donate Page**, but try to keep the chai pattern.

- **Privacy, Terms, Nonprofit Disclosures.** These are legal pages. Edit with care; if you're not sure whether a change is allowed, ask a lawyer or Erik.

---

## 9. What's NOT editable in Studio

A small list of things that still need a developer:

- The actual page URLs (e.g., changing `/about/team` to `/about/our-team`).
- The visual design (colors, fonts, button shapes).
- The list of countries in the international crisis hotlines dropdown (this is a static dataset; if a country needs to be added, ping Erik).
- Code-level features (a new section type, a new page, removing an existing page).

If something you need to change isn't in Studio, that's a developer task. Send Erik a message describing what you want.

---

## 10. Helpful patterns

- **Edit one thing at a time, then publish.** It's easier to spot what changed if you publish often.
- **Preview by clicking the link.** Many fields in Studio have a small icon that opens that page on the live site in a new tab. Edit, publish, then click to see your change.
- **Don't be afraid to experiment.** Edits don't go live until you click Publish, and you can always discard a draft.
- **Use the search bar.** Top of the Studio. Type any word and it finds documents containing that text. Faster than scrolling.

---

## Quick reference: where to edit what

| You want to change... | Go to... |
|---|---|
| The homepage hero | Pages → Homepage |
| A page's main heading or intro | Pages → [section] → that page |
| The nav menu | Site Navigation |
| The footer disclaimer | Site Settings → Footer |
| The logo | Site Settings → Organization Identity |
| The default social card image | Site Settings → Site Meta Defaults |
| Donation amounts | Donate → Donate Page (and Pages → Homepage for the homepage tiers) |
| A testimonial | Content Library → Testimonials |
| A recipe | Content Library → Recipes |
| A team member | Content Library → Team Members |
| A product in the shop | Shop → Products |
| An FAQ answer | Content Library → FAQ Items |
| A past retreat article | Content Library → Retreats |
| The privacy or terms page | Pages → Privacy Policy / Terms of Service |
| The contact form labels or dropdown options | Pages → Get Involved → Contact Page |
| The Givebutter donation widget ID | Site Settings → Donate Widget |

---

Welcome to the team. The site is yours. Most edits take less than a minute. When in doubt, edit, publish, and refresh the live site to see what happened. If something looks wrong, message Erik.
