import {defineField, defineType} from 'sanity'

export const legacyMigration = defineType({
  name: 'legacyMigration',
  title: 'Legacy Migration',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'assets', title: 'Assets'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalAssets',
      title: 'External Assets',
      type: 'array',
      group: 'assets',
      of: [
        defineField({
          name: 'assetUrl',
          title: 'Asset URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'bodyHtml',
      title: 'Body HTML',
      type: 'text',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'legacyClassName',
      title: 'Legacy Wrapper Class',
      type: 'string',
      group: 'content',
    }),
  ],
})
