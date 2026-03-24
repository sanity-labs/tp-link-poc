import {defineField, defineType} from 'sanity'

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
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
