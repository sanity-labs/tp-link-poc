import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {colorInput} from '@sanity/color-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {DEFAULT_LOCALE, isValidLocale, SUPPORTED_LANGUAGES} from 'shared'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'wh4ayjq9'
const dataset = process.env.SANITY_STUDIO_DATASET || 'internationalization'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

function resolveHref(documentType: string, locale: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'page':
      return slug ? `/${locale}/${slug}` : `${locale}/`
    case 'productPage':
      return slug ? `/${locale}/products/${slug}` : undefined
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
            route: '/:locale/products/:collection',
            resolve(ctx) {
              const locale = ctx.params.locale
              if (!locale || !isValidLocale(locale)) return undefined
              return {
                filter: `_type == "collection" && language == $locale && slug.current == $collection`,
                params: {locale, collection: ctx.params.collection},
              }
            },
          },
          {
            route: '/:locale/products/:collection/:model',
            resolve(ctx) {
              const locale = ctx.params.locale
              if (!locale || !isValidLocale(locale)) return undefined
              return {
                filter: `_type == "productPage" && language == $locale && slug.current == $model`,
                params: {locale, collection: ctx.params.collection, model: ctx.params.model},
              }
            },
          },
        ]),
        locations: {
          page: defineLocations({
            select: {name: 'name', slug: 'slug.current', locale: 'language'},
            resolve: (doc) => {
              const href = resolveHref('page', doc?.locale || DEFAULT_LOCALE, doc?.slug)!
              return {
                message: 'Open in visual editor',
                locations: [
                  {
                    title: doc?.name || 'Untitled',
                    href,
                  },
                ],
              }
            },
          }),
          productPage: defineLocations({
            select: {title: 'title', slug: 'slug.current', locale: 'language'},
            resolve: (doc) => {
              const href = resolveHref('productPage', doc?.locale || DEFAULT_LOCALE, doc?.slug)!
              return {
                message: 'Open in visual editor',
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
    structureTool({structure}),
    colorInput(),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: ['collection', 'footer', 'header', 'page', 'product', 'productPage'],
      languageField: 'language',
    }),
    unsplashImageAsset(),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['footer', 'header', 'page', 'product', 'productPage'],
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => t.id !== t.schemaType),
  },
})
