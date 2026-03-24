import {defineField, defineType} from 'sanity'
import {isUniquePerLanguage} from '../../lib/isUniquePerLanguage'

export const productPage = defineType({
  name: 'productPage',
  title: 'Product Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
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
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'productEntry',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isDefault',
              title: 'Default Product',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              productName: 'product.name',
              productModel: 'product.modelNumber',
              isDefault: 'isDefault',
            },
            prepare({
              productName,
              productModel,
              isDefault,
            }: {
              productName?: string
              productModel?: string
              isDefault?: boolean
            }) {
              return {
                title: productName || productModel || '—',
                subtitle: isDefault ? 'Default' : undefined,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((entries: {isDefault?: boolean}[] | undefined) => {
            if (!entries?.length) return true
            const defaults = entries.filter((e) => e?.isDefault)
            if (defaults.length > 1) return 'Only one product can be the default.'
            if (defaults.length === 0) return 'One product must be marked as default.'
            return true
          }),
    }),
    defineField({
      name: 'components',
      title: 'Reusable Components',
      type: 'array',
      group: 'content',
      of: [
        {type: 'reference', name: 'highlightsHero', to: [{type: 'highlightsHero'}]},
        {type: 'reference', name: 'iconOverview', to: [{type: 'iconOverview'}]},
        {type: 'reference', name: 'contentImageBlock', to: [{type: 'contentImageBlock'}]},
        {type: 'reference', name: 'featureOverviewBlock', to: [{type: 'featureOverviewBlock'}]},
        {type: 'reference', name: 'legacyMigration', to: [{type: 'legacyMigration'}]},
      ],
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', slugCurrent: 'slug.current', language: 'language'},
    prepare({
      title,
      slugCurrent,
      language,
    }: {
      title?: string
      slugCurrent?: string | null
      language?: string | null
    }) {
      const parts = [slugCurrent, language].filter(Boolean)
      return {
        title: title,
        subtitle: parts.length > 0 ? parts.join(' — ') : undefined,
      }
    },
  },
})
