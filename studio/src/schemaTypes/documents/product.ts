import {defineField, defineType} from 'sanity'
import {adminOnlyReadOnly} from '../../lib/access'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'e.g., Omada 20-Port Gigabit Easy Managed Switch',
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'modelNumber',
      title: 'Model Number',
      type: 'string',
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'productId',
      title: 'Product ID',
      type: 'number',
      validation: (Rule) => Rule.required(),
      readOnly: adminOnlyReadOnly,
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
      type: 'string',
      description: 'Legacy URL slug.',
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'collection'}]}],
      validation: (Rule) => Rule.required(),
      readOnly: adminOnlyReadOnly,
    }),

    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', type: 'string', title: 'Alt Text', readOnly: adminOnlyReadOnly}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{type: 'string'}],
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'links',
      title: 'Footer Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Link Label', readOnly: adminOnlyReadOnly},
            {name: 'url', type: 'string', title: 'URL', readOnly: adminOnlyReadOnly},
          ],
        },
      ],
      readOnly: adminOnlyReadOnly,
    }),
    defineField({
      name: 'versions',
      title: 'Version',
      type: 'object',
      fields: [
        {name: 'versionName', title: 'Version Name', type: 'string', readOnly: adminOnlyReadOnly},
        {
          name: 'description',
          title: 'Version Description',
          type: 'string',
          readOnly: adminOnlyReadOnly,
        },
        defineField({
          name: 'versionSlug',
          title: 'Version Slug',
          type: 'slug',
          options: {
            source: (_, {parent}) => {
              const p = parent as {versionName?: string; description?: string}
              return [p?.versionName, p?.description].filter(Boolean).join(' ')
            },
            maxLength: 96,
          },
          readOnly: adminOnlyReadOnly,
        }),
      ],
      readOnly: adminOnlyReadOnly,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'modelNumber',
      language: 'language',
      media: 'images',
    },
    prepare({title, subtitle, language, media}) {
      const parts = [subtitle, language].filter(Boolean)
      return {
        title: title || 'Untitled Product',
        subtitle: parts.length > 0 ? parts.join(' — ') : undefined,
        media: Array.isArray(media) ? media[0] : media,
      }
    },
  },
})
