# Belinda Walkthrough Call Script

A 30-minute live walkthrough of Sanity Studio for Belinda's first onboarding call. Follow this verbatim. Click paths match the current Studio nav (post 2026-05-21).

**Total runtime:** 30 minutes.
- Opening: 5 min
- Section 1, editing a singleton (homepage): 10 min
- Section 2, adding to a collection (recipe): 10 min
- Section 3, publish and rebuild: 5 min
- Q&A: any time remaining at the close

**Before the call.** Have two browser tabs open: `https://jewmanity.sanity.studio` (signed in) and `https://jewmanity.com` (the live site). Share the Studio tab. Make sure your Recipes list has at least one recipe in it so Belinda can see what a populated collection looks like.

---

## Opening (5 minutes, 0:00 to 5:00)

> "Hi Belinda, thanks for making time. The plan for the next thirty minutes: I'll show you how to log in, then we'll edit one page together, then we'll add a new recipe. At the end I'll show you what happens when you click Publish so the live site updates. Sound good?"

### Studio URL (1 min)

> "The URL you'll bookmark is `https://jewmanity.sanity.studio`. That's your entry point. Type it in your browser now and let me see what you see."

(Wait for her to load it. The short URL redirects to a longer `sanity.io/...` URL. Reassure her that's normal.)

> "The address bar may end up showing something longer, like `sanity.io/@.../studio/.../jewmanity/`. That's Sanity's dashboard wrapper. Bookmark the short URL only. The long one is generated each session."

### Logging in (2 min)

> "You should have an invite email from Sanity. The sender is `accounts@sanity.io`. Click the link in that email to set your password, then come back to the Studio URL and sign in with your email."

(If she runs into a login problem, fall back to: "Click Forgot password on the login screen, follow the reset email, then come back here.")

> "Once you're in, you'll see the Studio interface. The left side is the navigation, the middle is where you edit, and the right side sometimes shows version history."

### About the Content Agent banner (30 sec)

> "At the bottom you may see a banner that says 'Studio is not fully compatible with Dashboard. Content Agent is not supported.' That's a Sanity AI feature you're not using. Click the X to dismiss it. It won't affect anything."

### Where to find help (1 min 30 sec)

> "If you get stuck, you have three places to go. First, the editor guide at `docs/editor-guide.md` in the project. I'll send you a link after this call. Second, the quick-start onboarding doc I sent earlier. Third, just message me. For anything that breaks the live site or anything you can't undo, message me first, don't worry about figuring it out on your own."

---

## Section 1: Editing a singleton (10 minutes, 5:00 to 15:00)

> "We're going to change one piece of text on the homepage. This is the most common kind of edit you'll do, and it's the same pattern for every page on the site."

### Concept first (1 min)

> "Singletons are pages that exist exactly once. Homepage, Donate, Contact, Volunteer, the About story. There's one of each, and you edit them; you don't add or delete them. Anything inside the **Pages** section on the left is a singleton. So are **Site Settings** and **Site Navigation** at the bottom."

### Walk to the homepage editor (2 min)

> "In the left sidebar, click **Pages**. You'll see a sub-list open up: Homepage at the top, then the site's nav sections (About, Programs, Community, Get Involved), and then the legal pages at the bottom."

> "Click **Homepage**. The editor opens on the right."

(Wait for her to do it. Watch for confusion if she expects everything at the top level.)

> "Notice the tabs across the top: Hero, How We Help, Impact Stories, Donation CTA, Newsletter, Stats Bar. These are field groups. They organize the homepage by section so you don't scroll through one giant form. The Hero tab is open by default."

### Edit the hero heading (3 min)

> "Find the field labeled **Hero Heading**. Click into it. Whatever's there now is what's on the live site at this moment."

> "Type something new. Anything. For the demo, change one word."

(Wait. As she types, point out the indicator that says "Unpublished changes" appearing somewhere on the screen.)

> "See that indicator at the top right that says **Unpublished changes**? That's the most important thing to understand about Studio. What you just typed is saved as a **draft**. The live site doesn't see drafts. If you closed the tab right now and came back tomorrow, your draft would still be here waiting for you. But the live site at jewmanity.com still shows the old heading."

### What Publish means (2 min)

> "To make a draft visible on the live site, you click the green **Publish** button at the bottom right. Go ahead and click it now."

(Wait. The button changes state. The "Unpublished changes" indicator disappears, replaced with "Published just now" or similar.)

> "That's it. The change is now live, or it will be in about 2 to 3 minutes once the site rebuilds. We'll come back to the rebuild step in Section 3."

### Quick recap of the loop (2 min)

> "So the full loop is: open the document, edit a field, click Publish. That's it for any singleton. The Donate page, the Contact page, the Volunteer page, all of them work the same way. The only difference is what fields they have. The Donate page has a Cost Breakdown tab with dollar amounts, the Contact page has a Privacy Note field, and so on."

> "A few fields visibly break a section if you leave them blank: Hero Heading, Hero Subtitle, the primary CTA button text and link, and at least one Program Card on the homepage. The schema won't stop you from publishing with them empty, but the live page will look broken. So treat those as required. The full list is in the editor guide."

> "Any questions on this before we move to collections?"

(Brief Q&A if needed; otherwise move on.)

---

## Section 2: Adding to a collection (10 minutes, 15:00 to 25:00)

> "Now we'll add a new recipe. This shows you the second pattern: creating a brand new document inside a collection."

### Concept first (1 min)

> "Collections are content types where you can have many entries. Recipes, Team Members, Testimonials, Community Stories, Retreats, FAQ Items, Recommended Articles. They all live under **Content Library** in the left sidebar. Products are the one exception; they live under **Shop** because they belong to that section, but they work the same way."

> "Quick note before we open Recipes: the **Recipes collection** (the individual recipes) lives under Content Library. The **Recipes index page** heading and intro live separately under Pages > Community > Recipes Page. Two different documents, both editable, both already populated. We're going to the collection now."

### Walk to the recipes list (1 min)

> "In the left sidebar, click **Content Library**. You'll see all seven collections. Click **Recipes**. The list opens with all current recipes shown. The number next to the title is the live count, always up to date."

### Create a new recipe (3 min)

> "At the top of the recipe list, you'll see a green **+** icon (sometimes labeled **Create**). Click it. A blank recipe document opens on the right."

> "The form is long. The fields appear in this order: **Recipe Title**, **URL Slug**, **Short Description**, **Recipe Photo**, then a stretch of optional fields (Tags, Prep Time, Cook Time, Servings, Difficulty, Recipe Author, Publish Date), then **Ingredients** and **Instructions**, then a few more optional fields below. For the demo we'll fill in the required fields and the photo. Scroll past the optional middle for now; we can come back to those later if there's time."

> "Start with **Recipe Title**. Type anything. We'll delete this recipe at the end."

(Wait. As she types, the URL Slug field below it will auto-suggest a slug. Point that out briefly; we'll come back to it.)

> "Skip down to **Short Description**. One or two sentences, anything. Then we'll do the photo next."

### Image upload (2 min)

> "Find the **Recipe Photo** field. Click the upload area, then choose any image from your computer."

(Wait for upload.)

> "Once it uploads, you'll see an **Alt Text** field appear below the photo. Always fill it in: a short sentence describing what's in the photo. Screen readers and search engines use it."

> "You'll also see a small circle on the photo, called the hotspot. It tells the site which part of the photo to keep in view when the image gets cropped on mobile. For most photos the default is fine. For headshots, drag it onto the face. We covered hotspot etiquette in the editor guide."

### Ingredients and Instructions (2 min)

> "Scroll past the optional middle fields (Tags, Prep Time, Cook Time, Servings, Difficulty, Recipe Author, Publish Date) until you hit **Ingredients**. That's a list of strings: hit the **Add** button below the last line for a new entry, type the ingredient, repeat."

> "Below that is **Instructions**. It's a rich text editor, not a list. To add a new step, hit Enter for a new line. Use the numbered list button in the toolbar at the top to make the lines auto-number as steps."

(Coach if she gets stuck. Ingredients is a list of strings, hit the Add button below the last line. Instructions is a rich text editor, hit Enter for a new line and use the numbered list button in the toolbar for steps.)

### URL slug (1 min)

> "Scroll back up to the **URL Slug** field, just under the title. Next to it is a **Generate** button. Click Generate. It auto-creates the URL from the title. So if your title is 'Honey Cake', the slug becomes `honey-cake`, and the recipe's live URL becomes `jewmanity.com/community/recipes/honey-cake`."

### Publish the new recipe (1 min)

> "Click the green **Publish** button. The recipe is now live, pending rebuild."

### Clean up the demo recipe (1 min)

> "Since this was just for the demo, let's delete it. Click the three-dot menu in the top-right of the recipe editor, then choose **Delete**. Confirm. The recipe is removed and won't be on the next rebuild."

> "Important: every collection works exactly like this. Click into the collection, click +, fill in the fields, click Publish. Adding a new team member, a new testimonial, a new community story, a new FAQ, a new article: same pattern every time. The only thing that varies is the fields."

> "One thing worth flagging: testimonials have a **Display Context** field that controls which page they appear on. The options in the dropdown are **General / Homepage**, **Heads Up Program**, **Volunteer**, and **Antisemitism Story**. If you create a testimonial without setting that, it won't appear anywhere. The editor guide has the full mapping."

---

## Section 3: Publish, rebuild, and what to do if something looks wrong (5 minutes, 25:00 to 30:00)

> "Last section. This is what happens after you click Publish."

### The rebuild (2 min)

> "Clicking Publish updates Sanity, but the live website at jewmanity.com is built ahead of time as static files. So your edit triggers an automatic rebuild on a service called Vercel. The rebuild takes about 1 to 2 minutes. From the moment you click Publish to the moment your change is visible at jewmanity.com, expect 2 to 3 minutes."

> "You don't have to do anything during the rebuild. It runs in the background. Open the live site in another tab and refresh after a couple of minutes to see your change."

### Cache and the hard refresh (1 min)

> "Sometimes your browser will show you the old version because it cached the page. If you don't see your change after 3 minutes, do a hard refresh. On Mac that's Cmd+Shift+R. On Windows it's Ctrl+F5. That bypasses the cache."

### If it's still wrong after 5 minutes (1 min)

> "If you've waited 5 minutes, hard-refreshed, and still don't see your change, the most likely cause is that you saved but didn't publish. Open the document in Studio. If you see a yellow 'Unpublished changes' indicator, click Publish."

> "If the indicator says published and you still don't see the change live, message me. Include what page you edited, what change you expected, and a screenshot of the live site as it looks now."

### Reverting a mistake (1 min)

> "If you publish something and immediately regret it, you can roll back. Open the document, click the three-dot menu or the history icon in the top-right, pick a previous version, click Restore, then click Publish. The old version is back live within 2 to 3 minutes. Nothing is ever truly lost in Studio; everything has a revision history."

---

## Close and Q&A (any time remaining)

> "That's the whole loop. To recap:
>
> 1. To edit a page, open Pages, click the page, edit a field, click Publish.
> 2. To add to a collection, open Content Library, click the collection, click +, fill in fields, click Publish.
> 3. The live site updates 2 to 3 minutes after Publish. Hard-refresh if needed.
> 4. You can always roll back from history.
>
> What questions do you have?"

(Field any questions. Common ones to anticipate:)

- **"What if I'm not sure whether to edit or whether to ask?"** Always feel free to ask. For text edits, photos, and adding to collections, just go ahead. For anything labeled with a ⚠️ in the editor guide (medical disclaimer, tax note, citations, form fields), check with me first.
- **"How do I know which testimonials show where?"** The Display Context field on each testimonial. Editor guide, Section 2 has the mapping.
- **"Can I preview before publishing?"** Not inside Studio right now. Publish, wait 2 to 3 minutes, look at the live site in another tab. If you want a real preview added, I can wire that up; it's a standard Sanity feature.
- **"What if I accidentally delete a recipe?"** Message me. Sanity keeps deleted documents in history for 30 days, and I can restore.

> "Thanks Belinda. I'll send you the editor guide and the quick onboarding doc after this call. Happy editing."

---

## Facilitator notes (don't read aloud)

- If Belinda is fast, lean into Q&A. If she's slow on the homepage edit, skip the recipe creation and just walk through the Content Library + Recipes list visually so she understands where it lives. The collection pattern is the same as the singleton pattern with one extra click (+ to create).
- If Studio shows a permission error or doesn't load her account, fall back to a shared screen of your own account and tell her you'll resolve access separately.
- The Vercel rebuild can occasionally take longer than 3 minutes if there's a queue. If she watches and doesn't see the change at the 3 minute mark during the call, don't panic. Move on. Tell her to check back in 10 minutes and message you if it still isn't live.
- Skip Site Settings, Site Navigation, and the field-safety section unless she asks. They're in the editor guide. The goal of this call is confidence with the two main loops, not coverage.
