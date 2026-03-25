import {defineField, defineType} from 'sanity'
import {isUniquePerLanguage} from '../../lib/isUniquePerLanguage'

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
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
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      readOnly: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96, isUnique: isUniquePerLanguage},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language', media: 'image'},
    prepare({title, slug, language, media}) {
      const parts = [slug ? `/${slug}` : null, language].filter(Boolean)
      return {
        title: title || 'Untitled collection',
        subtitle: parts.length > 0 ? parts.join(' — ') : undefined,
        media,
      }
    },
  },
})
