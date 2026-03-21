export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'organizationName', title: 'Organization Name', type: 'string' },
    { name: 'ein', title: 'EIN', type: 'string' },
    { name: 'yearEstablished', title: 'Year Established', type: 'string' },
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'socialLinks', title: 'Social Links', type: 'object', fields: [
      { name: 'facebook', title: 'Facebook', type: 'url' },
      { name: 'instagram', title: 'Instagram', type: 'url' },
      { name: 'twitter', title: 'Twitter/X', type: 'url' },
      { name: 'linkedin', title: 'LinkedIn', type: 'url' },
    ]},
  ],
};
