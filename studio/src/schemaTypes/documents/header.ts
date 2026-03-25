import {defineField, defineType} from 'sanity'

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'navigation', title: 'Navigation'},
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'general',
      readOnly: true,
    }),
    defineField({
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image',
      type: 'image',
      group: 'general',
      options: {hotspot: true},
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      group: 'navigation',
      of: [{type: 'navLink'}],
    }),
  ],
  preview: {
    select: {logoText: 'logoText', language: 'language', media: 'logoImage'},
    prepare({logoText, language, media}) {
      return {
        title: logoText || 'Header',
        subtitle: language || undefined,
        media,
      }
    },
  },
})
