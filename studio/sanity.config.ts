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
import {SUPPORTED_LANGUAGES, isValidLocale} from 'shared'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'productPage':
      return slug ? `/products/${slug}` : undefined
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
        // mainDocuments: defineDocuments([
        //   {
        //     route: '/',
        //     filter: `_type == "settings" && _id == "siteSettings"`,
        //   },
        //   {
        //     route: '/:slug',
        //     filter: `_type == "page" && slug.current == $slug || _id == $slug`,
        //   },
        //   {
        //     route: '/products/:slug',
        //     filter: `_type == "productPage" && slug.current == $slug`,
        //   },
        //   {
        //     route: '/:locale/products/:collection',
        //     resolve(ctx) {
        //       const locale = ctx.params.locale
        //       if (!locale || !isValidLocale(locale)) return undefined
        //       return {
        //         filter: `_type == "collection" && language == $locale && slug.current == $collection`,
        //         params: {locale, collection: ctx.params.collection},
        //       }
        //     },
        //   },
        //   {
        //     route: '/:locale/products/:collection/:model',
        //     resolve(ctx) {
        //       const locale = ctx.params.locale
        //       if (!locale || !isValidLocale(locale)) return undefined
        //       return {
        //         filter: `_type == "productPage" && language == $locale && slug.current == $model`,
        //         params: {locale, collection: ctx.params.collection, model: ctx.params.model},
        //       }
        //     },
        //   },
        // ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          productPage: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('productPage', doc?.slug)!,
                },
              ],
            }),
          }),
        },
      },
    }),
    structureTool({structure}),
    colorInput(),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: ['product', 'collection', 'productPage', 'page', 'header', 'footer'],
      languageField: 'language',
    }),
    unsplashImageAsset(),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['productPage', 'product', 'header', 'footer', 'page'],
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
