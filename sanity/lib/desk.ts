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
  CalendarIcon,
  TagIcon,
  HelpCircleIcon,
  CogIcon,
  CommentIcon,
  ComposeIcon,
  MenuIcon,
  DocumentTextIcon,
  ErrorOutlineIcon,
  FolderIcon,
  ProjectsIcon,
  BookmarkIcon,
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
      // ── Pages (singletons, grouped by nav section) ──
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonListItem(S, 'homepage', 'Homepage', HomeIcon),

              S.listItem()
                .title('About')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('About')
                    .items([
                      singletonListItem(S, 'aboutStory', 'Our Story', BookIcon),
                      singletonListItem(S, 'aboutTeamPage', 'Team Page', UsersIcon),
                    ]),
                ),

              S.listItem()
                .title('Programs')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Programs')
                    .items([
                      singletonListItem(S, 'headsUp', 'Heads Up Program', BulbOutlineIcon),
                      singletonListItem(S, 'programsPastRetreatsPage', 'Past Retreats Page', CalendarIcon),
                    ]),
                ),

              S.listItem()
                .title('Community')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Community')
                    .items([
                      singletonListItem(S, 'fightingAntisemitism', 'Fighting Antisemitism', BlockElementIcon),
                      singletonListItem(S, 'aboutCommunityStoriesPage', 'Community Stories Page', BookIcon),
                      singletonListItem(S, 'communityRecipesPage', 'Recipes Page', ComposeIcon),
                    ]),
                ),

              S.listItem()
                .title('Get Involved')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Get Involved')
                    .items([
                      singletonListItem(S, 'volunteerPage', 'Volunteer Page', UsersIcon),
                      singletonListItem(S, 'contactPage', 'Contact Page', EnvelopeIcon),
                      singletonListItem(S, 'mitzvahProject', 'Mitzvah Project', BulbOutlineIcon),
                    ]),
                ),

              S.divider(),

              singletonListItem(S, 'notFoundPage', '404 Page', ErrorOutlineIcon),
              singletonListItem(S, 'privacyPage', 'Privacy Policy', DocumentTextIcon),
              singletonListItem(S, 'termsPage', 'Terms of Service', DocumentTextIcon),
              singletonListItem(S, 'nonprofitDisclosuresPage', 'Nonprofit Disclosures', DocumentTextIcon),
            ]),
        ),

      S.divider(),

      // ── Promoted top-level sections (Resources, Shop, Donate) ──
      singletonListItem(S, 'resources', 'Mental Health Resources', HeartIcon),

      S.listItem()
        .title('Shop')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Shop')
            .items([
              singletonListItem(S, 'shopPage', 'Shop Page', BasketIcon),
              S.listItem()
                .title('Products')
                .icon(TagIcon)
                .child(S.documentTypeList('product').title('Products')),
            ]),
        ),

      S.listItem()
        .title('Donate')
        .icon(CreditCardIcon)
        .child(
          S.list()
            .title('Donate')
            .items([
              singletonListItem(S, 'donatePage', 'Donate Page', CreditCardIcon),
            ]),
        ),

      S.divider(),

      // ── Content Library (all collection document types) ──
      S.listItem()
        .title('Content Library')
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title('Content Library')
            .items([
              S.listItem()
                .title('Team Members')
                .icon(UsersIcon)
                .child(S.documentTypeList('teamMember').title('Team Members')),
              S.listItem()
                .title('Testimonials')
                .icon(CommentIcon)
                .child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem()
                .title('Community Stories')
                .icon(BookIcon)
                .child(S.documentTypeList('communityStory').title('Community Stories')),
              S.listItem()
                .title('Recipes')
                .icon(ComposeIcon)
                .child(S.documentTypeList('recipe').title('Recipes')),
              S.listItem()
                .title('Retreats')
                .icon(CalendarIcon)
                .child(S.documentTypeList('retreat').title('Retreats')),
              S.listItem()
                .title('FAQ Items')
                .icon(HelpCircleIcon)
                .child(S.documentTypeList('faqItem').title('FAQ Items')),
              S.listItem()
                .title('Recommended Articles')
                .icon(BookmarkIcon)
                .child(S.documentTypeList('recommendedArticle').title('Recommended Articles')),
            ]),
        ),

      S.divider(),

      // ── Site Settings ───────────────────────────────
      singletonListItem(S, 'siteSettings', 'Site Settings', CogIcon),
      singletonListItem(S, 'navigation', 'Site Navigation', MenuIcon),
    ]);
