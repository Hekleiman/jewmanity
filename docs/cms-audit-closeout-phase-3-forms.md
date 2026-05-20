# Prompt: CMS Audit Closeout, Phase 3 — Form Content (Contact, Volunteer, Newsletter)

Hand this to Claude Code from inside `/Users/hek/jewmanity` for a fresh session. Reference: `docs/cms-completeness-audit-2026-05-20.md`. Closes audit sections 1.12 (Volunteer form), 1.14 (Contact form), and the Newsletter footnote/placeholder bullets in 1.1. About 40 hardcoded strings move into CMS in this phase.

Estimate: 90 to 120 minutes. Large because the schema work introduces two reusable object types (`formField`, `formMessages`) that need to compose cleanly, then both the contact and volunteer forms need parallel rewrites that drive every label, placeholder, and option from CMS data.

Do not use em-dashes anywhere. Commas, periods, parens, or rewrites instead.

The repo's `.env` contains a working `SANITY_API_TOKEN` for seed scripts. Forms route through Formspree, see saved memory: contact form `mykopjon`, volunteer form `mwvyqbze`, both owned by Belinda. This phase does not change submission routing.

PR flow per saved memory: `gh pr create` then `gh pr merge --auto --squash --delete-branch`.

**Independent of Phases 1 and 2** in terms of new schema dependencies. Can run in parallel with Phase 2 if needed, though merging in numerical order keeps the audit doc commit history readable.

Keep the existing audit pattern: every label, option, and message reads from CMS first, falls back to the current hardcoded string if Sanity returns null. The schema descriptions on `contactPage.formHeading` and `volunteerPage.formHeading` currently tell editors "the form itself is managed in code"; update those descriptions in this PR.

---

## Pre-flight

```
cd /Users/hek/jewmanity
git fetch origin
git status
git pull --ff-only
git checkout -b feat/cms-forms-content
```

---

## Piece 1: New `formField` and `formMessages` reusable object types

Both reusable across any future form on the site.

Create `sanity/schemas/objects/formField.ts`:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  description:
    'A single field on a form. The "name" must match the HTML form field name used by the code (e.g., firstName, email, subject). Reorder fields by dragging.',
  fields: [
    defineField({
      name: 'name',
      title: 'Field Name (code identifier)',
      type: 'string',
      description:
        'The HTML field name. Must match what the form code expects. Do not change unless you have updated the corresponding Astro component.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label (visible)',
      type: 'string',
      description: 'Text shown to visitors above the field (e.g., "First Name", "Email Address").',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      description: 'Light gray hint text shown inside an empty field (e.g., "Enter your first name").',
    }),
    defineField({
      name: 'helperText',
      title: 'Helper Text (optional)',
      type: 'string',
      description: 'Small note shown under the field. Leave blank if not needed.',
    }),
    defineField({
      name: 'type',
      title: 'Input Type',
      type: 'string',
      description:
        'Controls how the field renders. text, email, tel, textarea, select, checkboxGroup, radioGroup. Set in code; only change if the form has been updated.',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Textarea (multi-line)', value: 'textarea' },
          { title: 'Select (dropdown)', value: 'select' },
          { title: 'Checkbox group', value: 'checkboxGroup' },
          { title: 'Radio group', value: 'radioGroup' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      description: 'When ON, the field shows a red asterisk and the form will not submit without it.',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Options (for select / checkbox / radio)',
      type: 'array',
      description:
        'List of choices for select, checkboxGroup, and radioGroup fields. Each option has a label (visible) and a value (sent with the form). For most cases label and value are the same.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'value',
              title: 'Submitted Value',
              type: 'string',
              description: 'What gets sent with the form. Leave blank to use the label.',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'name', type: 'type' },
    prepare({ title, subtitle, type }) {
      return { title: title || '(no label)', subtitle: `${subtitle || '?'} · ${type || 'text'}` };
    },
  },
});
```

Create `sanity/schemas/objects/formMessages.ts`:

```ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'formMessages',
  title: 'Form Messages',
  type: 'object',
  description:
    'The strings shown around form submission state (submit button, loading, success, error, and the configuration-pending placeholder).',
  fields: [
    defineField({
      name: 'submitButton',
      title: 'Submit Button Text',
      type: 'string',
      description: 'e.g., "Send Message", "Submit Volunteer Application".',
    }),
    defineField({
      name: 'submittingButton',
      title: 'Submitting Button Text',
      type: 'string',
      description: 'Shown while the form is being submitted (e.g., "Sending...", "Submitting...").',
    }),
    defineField({
      name: 'success',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      description: 'Shown after a successful submission.',
    }),
    defineField({
      name: 'error',
      title: 'Error Message',
      type: 'text',
      rows: 2,
      description: 'Shown if the submission fails (network error, server error, etc.).',
    }),
    defineField({
      name: 'configurationPending',
      title: 'Configuration Pending Message',
      type: 'text',
      rows: 3,
      description:
        'Shown when the form has not yet been wired up to Formspree. Visitors see this in place of the form.',
    }),
  ],
});
```

Register both in `sanity/schemas/index.ts` (import + push into the Objects block of `schemaTypes`).

---

## Piece 2: Extend `contactPage` with `formSection`

File: `sanity/schemas/singletons/contactPage.ts`.

Add a new `formSection` field that bundles labels, options, and messages. Place it after the existing `privacyNote` field (currently around line 46):

```ts
defineField({
  name: 'formSection',
  title: 'Form Fields and Messages',
  type: 'object',
  description:
    'Labels, placeholders, dropdown options, and submission messages for the contact form. The form has 5 fields: firstName, lastName, email, subject, message. Adding or removing fields here without a code change will not affect the form.',
  group: 'form',
  fields: [
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      description:
        'The 5 fields on the contact form. Match the "Field Name" exactly to what is in code: firstName, lastName, email, subject, message.',
      of: [{ type: 'formField' }],
    }),
    defineField({
      name: 'messages',
      title: 'Submit and Status Messages',
      type: 'formMessages',
    }),
  ],
}),
```

Update the description on the existing `formHeading` field to remove the "managed in code" caveat. New description:

```
'Heading above the contact form. The fields, dropdown options, and submission messages are now editable in the Form Fields and Messages section below.'
```

---

## Piece 3: Extend `volunteerPage` with `formSection`

File: `sanity/schemas/singletons/volunteerPage.ts`.

Same pattern. Add `formSection` after the existing `formPrivacyNote` field (around line 158):

```ts
defineField({
  name: 'formSection',
  title: 'Form Fields and Messages',
  type: 'object',
  description:
    'Labels, placeholders, dropdown options, checkbox lists, and submission messages for the volunteer application form. Fields: firstName, lastName, email, phone, location, referral, interests, about, availability.',
  group: 'form',
  fields: [
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      description:
        'The 9 fields on the volunteer form. Match the "Field Name" exactly to what is in code.',
      of: [{ type: 'formField' }],
    }),
    defineField({
      name: 'emailSubject',
      title: 'Email Subject Line',
      type: 'string',
      description:
        'Subject line of the email that Formspree sends to Belinda when someone submits this form. Default: "New Volunteer Application".',
    }),
    defineField({
      name: 'messages',
      title: 'Submit and Status Messages',
      type: 'formMessages',
    }),
  ],
}),
```

Update the description on the existing `formHeading` to remove the "managed in code" caveat.

---

## Piece 4: Extend `homepage` with newsletter strings

File: `sanity/schemas/singletons/homepage.ts`.

Inside the `newsletter` group (the existing `newsletterHeading` and `newsletterDescription` are there), add four more fields just below `newsletterDescription`:

```ts
defineField({
  name: 'newsletterEmailPlaceholder',
  title: 'Email Input Placeholder',
  type: 'string',
  description: 'Placeholder text inside the email box (default: "Enter your email").',
  initialValue: 'Enter your email',
  group: 'newsletter',
}),
defineField({
  name: 'newsletterButtonText',
  title: 'Subscribe Button Text',
  type: 'string',
  description: 'Text on the subscribe button (default: "Subscribe").',
  initialValue: 'Subscribe',
  group: 'newsletter',
}),
defineField({
  name: 'newsletterFootnote',
  title: 'Newsletter Footnote',
  type: 'string',
  description:
    'Small print under the form (default: "You can unsubscribe at any time. Review our Privacy Policy."). The Privacy Policy link is rendered automatically and wraps the words "Privacy Policy" in this text.',
  initialValue: 'You can unsubscribe at any time. Review our Privacy Policy.',
  group: 'newsletter',
}),
defineField({
  name: 'newsletterPlaceholder',
  title: 'Configuration Pending Message',
  type: 'text',
  rows: 2,
  description:
    'Shown when the Mailchimp form action is not yet configured (default: "Newsletter signup is being configured. Subscribe at launch.").',
  initialValue: 'Newsletter signup is being configured. Subscribe at launch.',
  group: 'newsletter',
}),
```

---

## Piece 5: Update GROQ in `src/lib/sanity.ts`

Extend `getContactPage()` (currently lines 464 to 475):

```ts
export async function getContactPage() {
  return client.fetch(`
    *[_type == "contactPage"][0] {
      hero,
      introText,
      formHeading,
      privacyNote,
      formSection{
        fields[]{
          name,
          label,
          placeholder,
          helperText,
          type,
          required,
          options[]{ label, value }
        },
        messages
      },
      otherWaysHeading,
      otherWaysCards
    }
  `);
}
```

Extend `getVolunteerPage()` similarly. Add `formSection{ fields[]{...}, emailSubject, messages }` projection alongside the existing fields.

Extend `getHomepage()` (currently lines 189 to 213) with the four new newsletter fields:

```ts
// ... after newsletterDescription
newsletterEmailPlaceholder,
newsletterButtonText,
newsletterFootnote,
newsletterPlaceholder,
```

---

## Piece 6: Update `ContactForm.astro` to consume `formSection`

File: `src/components/contact/ContactForm.astro`.

The cleanest approach is to keep the existing markup and pull labels/placeholders/options out of a `formSection` prop, with fallbacks to the current hardcoded strings.

Extend the Props interface (lines 1 to 5):

```astro
interface FormFieldOption {
  label: string;
  value?: string;
}
interface FormFieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  options?: FormFieldOption[];
}
interface FormMessagesConfig {
  submitButton?: string;
  submittingButton?: string;
  success?: string;
  error?: string;
  configurationPending?: string;
}
interface Props {
  heading?: string;
  privacyNote?: string;
  formSection?: {
    fields?: FormFieldConfig[];
    messages?: FormMessagesConfig;
  };
}
```

Add a helper to look up field config by name with a hardcoded fallback:

```astro
const formFields: FormFieldConfig[] = Astro.props.formSection?.fields || [];
function field(name: string, fallback: { label: string; placeholder?: string }) {
  const cms = formFields.find((f) => f.name === name);
  return {
    label: cms?.label || fallback.label,
    placeholder: cms?.placeholder || fallback.placeholder || '',
    options: cms?.options || [],
  };
}
const fFirstName = field('firstName', { label: 'First Name', placeholder: 'Enter your first name' });
const fLastName = field('lastName', { label: 'Last Name', placeholder: 'Enter your last name' });
const fEmail = field('email', { label: 'Email Address', placeholder: 'your@email.com' });
const fSubject = field('subject', { label: 'Subject', placeholder: 'Select a topic' });
const fMessage = field('message', { label: 'Message', placeholder: 'Write your message here...' });

const messages = Astro.props.formSection?.messages || {};
const submitText = messages.submitButton || 'Send Message';
const submittingText = messages.submittingButton || 'Sending...';
const successText = messages.success || 'Thank you! Your message has been sent.';
const errorText = messages.error || 'Something went wrong. Please try again.';
const configPendingText = messages.configurationPending
  || 'The contact form is being configured. Please email us at the address shown on this page or check back soon.';

const fallbackSubjectOptions: FormFieldOption[] = [
  { label: 'General Inquiry' },
  { label: 'Program Information' },
  { label: 'Volunteer Opportunities' },
  { label: 'Donation Questions' },
  { label: 'Mitzvah Project' },
  { label: 'Partnership' },
  { label: 'Other' },
];
const subjectOptions = fSubject.options.length > 0 ? fSubject.options : fallbackSubjectOptions;
```

Then replace the hardcoded label text, placeholders, `<option>` list, and message paragraphs. For example:

- Line 36: `>First Name<` becomes `>{fFirstName.label}<`
- Line 44: `placeholder="Enter your first name"` becomes `placeholder={fFirstName.placeholder}`
- Lines 91 to 97: `<option>` loop becomes `{subjectOptions.map((opt) => <option value={opt.value || opt.label}>{opt.label}</option>)}`. Keep the initial disabled placeholder option using `fSubject.placeholder`.
- Line 123: button label `Send Message` becomes `{submitText}`
- Line 137: `Thank you! Your message has been sent.` becomes `{successText}`
- Line 146: `Something went wrong. Please try again.` becomes `{errorText}`
- Line 151: configuration-pending paragraph becomes `{configPendingText}`

In the `<script>` block at the bottom (lines 158 to 192), the strings `'Sending...'` and `'Send Message'` are hardcoded. Two ways to fix:
1. (Preferred) Pass them through a `data-` attribute on the form element (`data-submit-text={submitText} data-submitting-text={submittingText}`) and read them in JS.
2. Hand-inline them in a `<script define:vars={{ submitText, submittingText }}>` block. Astro supports `define:vars`, see `Layout.astro` for the JSON-LD pattern.

Pick option 1; it is cleaner. Update the JS:

```ts
const initialBtnText = submitBtn.textContent;
const submittingText = submitBtn.dataset.submittingText || 'Sending...';
// ...
submitBtn.textContent = submittingText;
// ...
submitBtn.textContent = initialBtnText;
```

---

## Piece 7: Update `VolunteerForm.astro` similarly

File: `src/components/volunteer/VolunteerForm.astro`.

Same pattern as Piece 6, but with 9 fields: `firstName`, `lastName`, `email`, `phone`, `location`, `referral`, `interests`, `about`, `availability`. The `interests` field is `checkboxGroup`; iterate over `fInterests.options` to render the checkbox list (currently lines 138 to 155 with the 4 hardcoded strings). The `referral` and `availability` fields are `select`; same pattern as the contact subject dropdown.

Add the `emailSubject` to the hidden input on line 34:

```astro
const emailSubject = Astro.props.formSection?.emailSubject || 'New Volunteer Application';
// ...
<input type="hidden" name="_subject" value={emailSubject} />
```

---

## Piece 8: Update pages to pass `formSection` down

File: `src/pages/get-involved/contact.astro`. The page already calls `getContactPage()`. Pass `formSection={cms?.formSection}` on `<ContactForm ... />`.

File: `src/pages/get-involved/volunteer.astro`. Same edit on `<VolunteerForm ... />`.

---

## Piece 9: Update `Newsletter.astro` to consume CMS strings

File: `src/components/home/Newsletter.astro`.

Extend the Props interface:

```astro
interface Props {
  heading?: string;
  description?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  footnote?: string;
  configurationPending?: string;
}
```

Destructure with fallbacks:

```astro
const {
  heading,
  description,
  emailPlaceholder = 'Enter your email',
  buttonText = 'Subscribe',
  footnote = 'You can unsubscribe at any time. Review our Privacy Policy.',
  configurationPending = 'Newsletter signup is being configured. Subscribe at launch.',
} = Astro.props;
```

Wire them into the JSX:
- Line 50 `placeholder="Enter your email"` becomes `placeholder={emailPlaceholder}`
- Line 57 `Subscribe` becomes `{buttonText}`
- Line 65 placeholder text becomes `{configurationPending}`
- Lines 69 to 72 footnote: split the footnote on the literal "Privacy Policy" so the link can render. A simple approach:

```astro
<p class="mx-auto mt-4 max-w-[450px] text-center font-body text-xs text-text-muted">
  {footnote.split('Privacy Policy')[0]}
  <a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>
  {footnote.split('Privacy Policy')[1] || '.'}
</p>
```

If `footnote` does not contain the literal string "Privacy Policy", the link still renders cleanly because `split` returns `[footnote]` and the trailing fallback `'.'` keeps the punctuation.

File: `src/pages/index.astro`. Find the `<Newsletter ... />` usage and pass the four new props from the CMS:

```astro
<Newsletter
  heading={homepage?.newsletterHeading}
  description={homepage?.newsletterDescription}
  emailPlaceholder={homepage?.newsletterEmailPlaceholder}
  buttonText={homepage?.newsletterButtonText}
  footnote={homepage?.newsletterFootnote}
  configurationPending={homepage?.newsletterPlaceholder}
/>
```

---

## Piece 10: Seed Sanity with current values

Create `scripts/seed-forms-content.ts`. The script seeds three things: `contactPage.formSection`, `volunteerPage.formSection`, and the four new newsletter fields on `homepage`. Idempotent via per-field `setIfMissing` patches.

```ts
/**
 * Seeds form-related CMS content for the contact form, volunteer form,
 * and newsletter signup. Idempotent.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-forms-content.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) { console.error('Error: SANITY_API_TOKEN env var required.'); process.exit(1); }

const client = createClient({
  projectId: '9pc3wgri',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const contactFields = [
  { _key: 'firstName', _type: 'formField', name: 'firstName', label: 'First Name', placeholder: 'Enter your first name', type: 'text', required: true },
  { _key: 'lastName', _type: 'formField', name: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', type: 'text', required: true },
  { _key: 'email', _type: 'formField', name: 'email', label: 'Email Address', placeholder: 'your@email.com', type: 'email', required: true },
  {
    _key: 'subject', _type: 'formField', name: 'subject', label: 'Subject',
    placeholder: 'Select a topic', type: 'select', required: true,
    options: [
      { _key: 'general', label: 'General Inquiry' },
      { _key: 'programs', label: 'Program Information' },
      { _key: 'volunteer', label: 'Volunteer Opportunities' },
      { _key: 'donate', label: 'Donation Questions' },
      { _key: 'mitzvah', label: 'Mitzvah Project' },
      { _key: 'partnership', label: 'Partnership' },
      { _key: 'other', label: 'Other' },
    ],
  },
  {
    _key: 'message', _type: 'formField', name: 'message', label: 'Message',
    placeholder: 'Write your message here...', type: 'textarea', required: true,
  },
];

const contactMessages = {
  submitButton: 'Send Message',
  submittingButton: 'Sending...',
  success: 'Thank you! Your message has been sent.',
  error: 'Something went wrong. Please try again.',
  configurationPending:
    'The contact form is being configured. Please email us at the address shown on this page or check back soon.',
};

const volunteerFields = [
  { _key: 'firstName', _type: 'formField', name: 'firstName', label: 'First Name', placeholder: 'Enter your first name', type: 'text', required: true },
  { _key: 'lastName', _type: 'formField', name: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', type: 'text', required: true },
  { _key: 'email', _type: 'formField', name: 'email', label: 'Email Address', placeholder: 'your@email.com', type: 'email', required: true },
  { _key: 'phone', _type: 'formField', name: 'phone', label: 'Phone Number', placeholder: '(555) 123-4567', type: 'tel' },
  { _key: 'location', _type: 'formField', name: 'location', label: 'City / Location', placeholder: 'e.g. San Diego, CA', type: 'text' },
  {
    _key: 'referral', _type: 'formField', name: 'referral', label: 'How did you hear about us?',
    placeholder: 'Select an option', type: 'select',
    options: [
      { _key: 'social', label: 'Social Media' },
      { _key: 'friend', label: 'Friend or Family' },
      { _key: 'synagogue', label: 'Synagogue or Community Org' },
      { _key: 'web', label: 'Web Search' },
      { _key: 'event', label: 'Event' },
      { _key: 'other', label: 'Other' },
    ],
  },
  {
    _key: 'interests', _type: 'formField', name: 'interests', label: 'Areas of Interest', type: 'checkboxGroup',
    options: [
      { _key: 'meals', label: 'Preparing and Serving Meals' },
      { _key: 'hosting', label: 'Hosting Dinners and Gatherings' },
      { _key: 'daytoday', label: 'Day-to-Day Support' },
      { _key: 'other', label: 'Other' },
    ],
  },
  {
    _key: 'about', _type: 'formField', name: 'about', label: 'Tell us about yourself',
    placeholder: "Share anything you'd like us to know, your background, availability, or what drew you to volunteer.",
    type: 'textarea',
  },
  {
    _key: 'availability', _type: 'formField', name: 'availability', label: 'Availability',
    placeholder: 'Select your availability', type: 'select',
    options: [
      { _key: 'hours', label: 'A few hours per retreat' },
      { _key: 'fullretreat', label: 'Full retreat (5-7 days)' },
      { _key: 'ongoing', label: 'Ongoing/regular basis' },
      { _key: 'flexible', label: "Flexible, tell me what's needed" },
    ],
  },
];

const volunteerMessages = {
  submitButton: 'Submit Volunteer Application',
  submittingButton: 'Submitting...',
  success: "Thank you for your application! We'll be in touch soon.",
  error: 'Something went wrong. Please try again.',
  configurationPending:
    'The volunteer application form is being configured. Please check back soon or reach out via the contact page.',
};

async function patchContactPage() {
  console.log('Patching contactPage.formSection...');
  await client.patch('contactPage').setIfMissing({
    formSection: { fields: contactFields, messages: contactMessages },
  }).commit();
  console.log('  done.');
}

async function patchVolunteerPage() {
  console.log('Patching volunteerPage.formSection...');
  await client.patch('volunteerPage').setIfMissing({
    formSection: {
      fields: volunteerFields,
      emailSubject: 'New Volunteer Application',
      messages: volunteerMessages,
    },
  }).commit();
  console.log('  done.');
}

async function patchHomepage() {
  console.log('Patching homepage newsletter fields...');
  await client.patch('homepage').setIfMissing({
    newsletterEmailPlaceholder: 'Enter your email',
    newsletterButtonText: 'Subscribe',
    newsletterFootnote: 'You can unsubscribe at any time. Review our Privacy Policy.',
    newsletterPlaceholder: 'Newsletter signup is being configured. Subscribe at launch.',
  }).commit();
  console.log('  done.');
}

async function main() {
  await patchContactPage();
  await patchVolunteerPage();
  await patchHomepage();

  const verify = await client.fetch(`{
    "contact": *[_id == "contactPage"][0]{
      "fieldCount": count(formSection.fields),
      "fieldNames": formSection.fields[].name,
      "hasMessages": defined(formSection.messages.submitButton)
    },
    "volunteer": *[_id == "volunteerPage"][0]{
      "fieldCount": count(formSection.fields),
      "fieldNames": formSection.fields[].name,
      "emailSubject": formSection.emailSubject,
      "hasMessages": defined(formSection.messages.submitButton)
    },
    "homepage": *[_id == "homepage"][0]{
      newsletterEmailPlaceholder,
      newsletterButtonText,
      newsletterFootnote,
      newsletterPlaceholder
    }
  }`);
  console.log('\nVerification:');
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
```

Note the em-dash workaround: any string with an em-dash in the original copy has been rewritten with a comma to comply with project memory. If you find that source code already had em-dashes embedded literally (the original `Flexible — tell me what's needed` on line 186 of VolunteerForm uses one), keep this rewritten version. The form is going through CMS now anyway, so editor-facing copy is the source of truth, not the old hardcoded version.

Run:

```
set -a; source .env; set +a
npx tsx scripts/seed-forms-content.ts
```

---

## Piece 11: Update `verify-cms-state.mjs`

Add three checks at the end of the `checks` array:

```js
{
  name: 'Contact form CMS content (phase 3)',
  groq: `*[_type=="contactPage"][0]{
    "fieldCount": count(formSection.fields),
    "fieldNames": formSection.fields[].name,
    "subjectOptionCount": count(formSection.fields[name == "subject"][0].options),
    "messagesSet": defined(formSection.messages.submitButton)
  }`,
},
{
  name: 'Volunteer form CMS content (phase 3)',
  groq: `*[_type=="volunteerPage"][0]{
    "fieldCount": count(formSection.fields),
    "fieldNames": formSection.fields[].name,
    "interestOptionCount": count(formSection.fields[name == "interests"][0].options),
    "availabilityOptionCount": count(formSection.fields[name == "availability"][0].options),
    "emailSubject": formSection.emailSubject,
    "messagesSet": defined(formSection.messages.submitButton)
  }`,
},
{
  name: 'Homepage newsletter strings (phase 3)',
  groq: `*[_type=="homepage"][0]{
    newsletterEmailPlaceholder,
    newsletterButtonText,
    newsletterFootnote,
    newsletterPlaceholder
  }`,
},
```

Run `node scripts/verify-cms-state.mjs` and confirm.

---

## Verification

1. `npm run build` succeeds with zero TypeScript errors.
2. `npm run dev`, then load `/get-involved/contact`, `/get-involved/volunteer`, and the homepage. For each:
   - Every label, placeholder, dropdown option, and button text matches what was there before this branch.
   - Submit the contact form with a test message; the success message renders correctly with the CMS string.
   - Submit the volunteer form similarly.
3. In Studio:
   - Open Contact Page and find the new "Form Fields and Messages" section. Edit the `firstName` field's label to "Given Name", publish, reload `/get-involved/contact`, confirm the label updates.
   - Revert the change so the seed value sticks.
4. Run `node scripts/verify-cms-state.mjs` and confirm all three new checks return populated.

---

## Commit, push, PR, merge

```
git add sanity/schemas/objects/formField.ts \
  sanity/schemas/objects/formMessages.ts \
  sanity/schemas/singletons/contactPage.ts \
  sanity/schemas/singletons/volunteerPage.ts \
  sanity/schemas/singletons/homepage.ts \
  sanity/schemas/index.ts \
  src/lib/sanity.ts \
  src/components/contact/ContactForm.astro \
  src/components/volunteer/VolunteerForm.astro \
  src/components/home/Newsletter.astro \
  src/pages/get-involved/contact.astro \
  src/pages/get-involved/volunteer.astro \
  src/pages/index.astro \
  scripts/seed-forms-content.ts \
  scripts/verify-cms-state.mjs

git commit -m "feat(cms): contact, volunteer, and newsletter content in Sanity (phase 3)

Closes audit sections 1.12 (volunteer form), 1.14 (contact form), and
the newsletter-related bullets in 1.1, from
docs/cms-completeness-audit-2026-05-20.md.

Two new reusable object types:
- formField: name, label, placeholder, helper text, type, required,
  options.
- formMessages: submit, submitting, success, error, configuration
  pending.

contactPage and volunteerPage each get a new formSection object that
bundles their field list and messages. Volunteer also exposes the
Formspree email subject. homepage gains newsletter email placeholder,
button text, footnote, and configuration-pending placeholder.

ContactForm, VolunteerForm, and Newsletter components now read all
labels, placeholders, dropdown/checkbox options, button text, and
status messages from CMS with hardcoded fallbacks. About 40 strings
that were previously code-only are now Belinda-editable.

Seed script populates current values. Schema descriptions on the
existing formHeading fields updated to drop the 'managed in code'
caveat."

git push -u origin feat/cms-forms-content
gh pr create --title "feat(cms): contact, volunteer, and newsletter content in Sanity (phase 3)" --body "$(cat <<'EOF'
Phase 3 of 4 closing out docs/cms-completeness-audit-2026-05-20.md.

Independent of Phases 1 and 2 in terms of schema dependencies.

Closes audit sections 1.12 and 1.14, plus the newsletter bullets in 1.1.

Belinda can now edit:
- Every label, placeholder, and helper text on the contact and
  volunteer forms.
- The contact subject dropdown (7 options).
- The volunteer referral dropdown (6 options), interest checkboxes
  (4 options), and availability dropdown (4 options).
- All submit button text and submitting/loading state text.
- All success and error messages.
- The configuration-pending placeholder shown before Formspree is
  wired up.
- The Formspree email subject line for volunteer submissions.
- The newsletter email placeholder, subscribe button, footnote, and
  configuration-pending placeholder.

Verification:
- npm run build clean.
- Forms submit through Formspree as before, no routing change.
- node scripts/verify-cms-state.mjs prints the new sections populated.
EOF
)"
gh pr merge --auto --squash --delete-branch
```
