import type { StructureResolver } from 'sanity/structure';
import {
  HomeIcon,
  BookIcon,
  BulbOutlineIcon,
  BlockElementIcon,
  HeartIcon,
  CreditCardIcon,
  BasketIcon,
  UsersIcon,
  EnvelopeIcon,
  DocumentsIcon,
  EarthGlobeIcon,
  CalendarIcon,
  TagIcon,
  HelpCircleIcon,
  CogIcon,
  CommentIcon,
  ComposeIcon,
} from '@sanity/icons';

// Helper: create a singleton list item that goes straight to the editor
function singletonListItem(
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  icon: React.ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Pages (singletons) ──────────────────────────
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonListItem(S, 'homepage', 'Homepage', HomeIcon),
              singletonListItem(S, 'aboutStory', 'Our Story', BookIcon),
              singletonListItem(S, 'headsUp', 'Heads Up Program', BulbOutlineIcon),
              singletonListItem(S, 'fightingAntisemitism', 'Fighting Antisemitism', BlockElementIcon),
              singletonListItem(S, 'resources', 'Mental Health Resources', HeartIcon),
              singletonListItem(S, 'donatePage', 'Donate Page', CreditCardIcon),
              singletonListItem(S, 'shopPage', 'Shop Page', BasketIcon),
              singletonListItem(S, 'volunteerPage', 'Volunteer Page', UsersIcon),
              singletonListItem(S, 'contactPage', 'Contact Page', EnvelopeIcon),
              singletonListItem(S, 'mitzvahProject', 'Mitzvah Project', BulbOutlineIcon),
            ]),
        ),

      S.divider(),

      // ── Team Members ────────────────────────────────
      S.listItem()
        .title('Team Members')
        .icon(UsersIcon)
        .child(S.documentTypeList('teamMember').title('Team Members')),

      // ── Community ───────────────────────────────────
      S.listItem()
        .title('Community')
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title('Community')
            .items([
              S.listItem()
                .title('Recipes')
                .icon(ComposeIcon)
                .child(S.documentTypeList('recipe').title('Recipes')),
              S.listItem()
                .title('Community Stories')
                .icon(BookIcon)
                .child(S.documentTypeList('communityStory').title('Community Stories')),
              S.listItem()
                .title('Testimonials')
                .icon(CommentIcon)
                .child(S.documentTypeList('testimonial').title('Testimonials')),
            ]),
        ),

      // ── Retreats ────────────────────────────────────
      S.listItem()
        .title('Retreats')
        .icon(CalendarIcon)
        .child(S.documentTypeList('retreat').title('Retreats')),

      // ── Products ────────────────────────────────────
      S.listItem()
        .title('Products')
        .icon(TagIcon)
        .child(S.documentTypeList('product').title('Products')),

      // ── FAQ Items ───────────────────────────────────
      S.listItem()
        .title('FAQ Items')
        .icon(HelpCircleIcon)
        .child(S.documentTypeList('faqItem').title('FAQ Items')),

      S.divider(),

      // ── Site Settings ───────────────────────────────
      singletonListItem(S, 'siteSettings', 'Site Settings', CogIcon),
    ]);
