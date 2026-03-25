import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {isUniquePerLanguage} from '../../lib/isUniquePerLanguage'
import {PageBuilderInput} from '../../component/PageBuilderInput'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'pageBuilder', title: 'Page Builder'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
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
      group: 'content',
      readOnly: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
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
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'components',
      title: 'Reusable Components',
      type: 'array',
      group: 'pageBuilder',
      components: {
        input: PageBuilderInput,
      },
      of: [
        {
          type: 'reference',
          name: 'highlightsHero',
          title: 'Highlights Hero',
          to: [{type: 'highlightsHero'}],
        },
        {
          type: 'reference',
          name: 'iconOverview',
          title: 'Icon Overview',
          to: [{type: 'iconOverview'}],
        },
        {
          type: 'reference',
          name: 'contentImageBlock',
          title: 'Content Image Block',
          to: [{type: 'contentImageBlock'}],
        },
        {
          type: 'reference',
          name: 'featureOverviewBlock',
          title: 'Feature Overview Block',
          to: [{type: 'featureOverviewBlock'}],
        },
        {
          type: 'reference',
          name: 'legacyMigration',
          title: 'Legacy Migration',
          to: [{type: 'legacyMigration'}],
        },
      ],
    }),
  ],
})
