export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const fallbackNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about/story',
    children: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Our Team', href: '/about/team' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs/heads-up',
    children: [
      { label: 'Heads Up', href: '/programs/heads-up' },
      { label: 'Past Retreats', href: '/programs/past-retreats' },
    ],
  },
  {
    label: 'Community',
    href: '/community/fighting-antisemitism',
    children: [
      { label: 'Community Stories', href: '/about/community-stories' },
      { label: 'Fighting Antisemitism', href: '/community/fighting-antisemitism' },
      { label: 'Recipes', href: '/community/recipes' },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved/volunteer',
    children: [
      { label: 'Volunteer', href: '/get-involved/volunteer' },
      { label: 'Mitzvah Project', href: '/get-involved/mitzvah-project' },
      { label: 'Contact', href: '/get-involved/contact' },
    ],
  },
  { label: 'Resources', href: '/resources' },
  { label: 'Shop', href: '/shop' },
];

export const fallbackNavCta = { text: 'Support Healing', href: '/donate' };
