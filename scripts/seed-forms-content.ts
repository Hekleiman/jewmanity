/**
 * Seeds form-related CMS content for the contact form, volunteer form,
 * and newsletter signup. Idempotent via setIfMissing patches.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   npx tsx scripts/seed-forms-content.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN env var required.');
  process.exit(1);
}

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
      { _key: 'flexible', label: "Flexible, tell me what's needed", value: 'Flexible' },
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

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
