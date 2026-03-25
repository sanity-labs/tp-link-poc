import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {colorInput} from '@sanity/color-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {DEFAULT_LOCALE, SUPPORTED_LANGUAGES} from 'shared'
import {i18nTypes} from 'shared/locale'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'wh4ayjq9'
const dataset = process.env.SANITY_STUDIO_DATASET || 'internationalization'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

function resolveHref(
  documentType: string,
  locale: string,
  slug?: string,
  version?: string,
): string | undefined {
  switch (documentType) {
    case 'page':
      return slug ? `/${locale}/${slug}` : `/${locale}`
    case 'productPage':
      return slug ? `/${locale}/products/${slug}` : undefined
    case 'versionedProductPage':
      return slug ? `/${locale}/products/${slug}/${version}` : undefined
    case 'collection':
      return slug ? `/${locale}/collections/${slug}` : undefined
    default:
      return undefined
  }
}

export default defineConfig({
  name: 'default',
  title: 'Tapo CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/:locale/:slug',
            filter: `_type == "page" && language == $locale && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/:locale/products/:slug',
            filter: `_type == "productPage" && language == $locale && slug.current == $slug`,
          },
          {
            route: '/:locale/collections/:slug',
            filter: `_type == "collection" && language == $locale && slug.current == $slug`,
          },
        ]),
        locations: {
          page: defineLocations({
            select: {_id: '_id', name: 'name', slug: 'slug.current', locale: 'language'},
            resolve: (doc) => {
              if (!doc?.slug && !doc?._id?.includes('homePage')) {
                return undefined
              }
              const href = resolveHref('page', doc?.locale || DEFAULT_LOCALE, doc?.slug)!
              const name = doc?.name || doc?._id?.includes('homePage') ? 'Home' : 'Untitled'
              return {
                message: 'Open in Presentation for visual editing',
                locations: [
                  {
                    title: name,
                    href,
                  },
                ],
              }
            },
          }),
          productPage: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
              locale: 'language',
            },

            resolve: (doc) => {
              return {
                message: 'Open in Presentation for visual editing',
                locations: [
                  {
                    title: doc?.title || 'Untitled',
                    href: resolveHref('productPage', doc?.locale || DEFAULT_LOCALE, doc?.slug)!,
                  },
                ],
              }
            },
          }),
          collection: defineLocations({
            select: {title: 'title', slug: 'slug.current', locale: 'language'},
            resolve: (doc) => {
              const href = resolveHref('collection', doc?.locale || DEFAULT_LOCALE, doc?.slug)!
              return {
                message: 'Open in Presentation for visual editing',
                locations: [
                  {
                    title: doc?.title || 'Untitled',
                    href,
                  },
                ],
              }
            },
          }),
        },
      },
    }),

    colorInput(),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: i18nTypes,
      languageField: 'language',
    }),
    unsplashImageAsset(),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: i18nTypes,
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => {
      return prev.filter((t) => !(t.id === t.schemaType && i18nTypes.includes(t.schemaType)))
    },
  },
})
