import {defineField, defineType} from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
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
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      group: 'navigation',
      of: [{type: 'navLink'}],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      group: 'general',
    }),
  ],
  preview: {
    select: {footerText: 'footerText', language: 'language'},
    prepare({footerText, language}) {
      return {
        title: footerText
          ? footerText.slice(0, 40) + (footerText.length > 40 ? '…' : '')
          : 'Footer',
        subtitle: language || undefined,
      }
    },
  },
})
