import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
  ],
}
