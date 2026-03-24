import {defineField, defineType} from 'sanity'
import {isUniquePerLanguage} from '../../lib/isUniquePerLanguage'

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96, isUnique: isUniquePerLanguage},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
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
