import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {isUniquePerLanguage} from '../../lib/isUniquePerLanguage'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      hidden: ({document}) => document?._id?.includes('homePage') ?? false,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?._id?.includes('homePage')) return true
          return value ? true : 'Name is required'
        }),
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
      hidden: ({document}) => document?._id?.includes('homePage') ?? false,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?._id?.includes('homePage')) return true
          return value ? true : 'Slug is required'
        }),
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [{type: 'callToAction'}, {type: 'infoSection'}],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/studio/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
})
