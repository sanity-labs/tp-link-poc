import {
  BlockElementIcon,
  CogIcon,
  ComposeIcon,
  PackageIcon,
  HomeIcon,
  DesktopIcon,
  InsertAboveIcon,
  InsertBelowIcon,
  StackIcon,
  FilterIcon,
} from '@sanity/icons'
import {AddDocumentIcon} from '@sanity/icons'
import React, {type ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {LOCALES} from 'shared'

function flagEmojiFromLocale(locale: string): string {
  const country = locale.split('-').pop()?.toUpperCase() ?? ''
  if (country.length !== 2) return '🏳️'
  return String.fromCodePoint(...country.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

function createFlagIcon(locale: string): ComponentType<{style?: React.CSSProperties}> {
  const flag = flagEmojiFromLocale(locale)
  return function FlagIcon(props) {
    return React.createElement(
      'span',
      {
        'role': 'img',
        'aria-label': `Flag for ${locale}`,
        'style': {fontSize: '1em', lineHeight: 1, ...props?.style},
      },
      flag,
    )
  }
}

const COMPONENT_TYPES = [
  'highlightsHero',
  'icon',
  'iconOverview',
  'contentImageBlock',
  'featureOverviewBlock',
  'legacyMigration',
] as const

const COMPONENT_TITLES: Record<string, string> = {
  highlightsHero: 'Highlights Heroes',
  icon: 'Icons',
  iconOverview: 'Icon Overviews',
  contentImageBlock: 'Content Image Blocks',
  featureOverviewBlock: 'Feature Overview Blocks',
  legacyMigration: 'Legacy Migrations',
}

function localeGroupedList(
  S: StructureBuilder,
  schemaType: string,
  label: string,
  apiVersion: string,
  icon: ComponentType<{style?: React.CSSProperties}>,
  extraFilter?: string,
) {
  const baseFilter = `_type == "${schemaType}"`
  const fullFilter = extraFilter ? `${baseFilter} && ${extraFilter}` : baseFilter

  return S.list()
    .title(label)

    .items([
      S.listItem()
        .title(`All ${label}`)
        .id(`${schemaType}-all`)
        .icon(icon)
        .child(
          S.documentList()
            .id(`${schemaType}-all-list`)
            .title(`All ${label}`)
            .schemaType(schemaType)
            .apiVersion(`v${apiVersion}`)
            .filter(fullFilter),
        ),
      ...LOCALES.map(({value, title}) =>
        S.listItem()
          .title(title)
          .id(`${schemaType}-${value}`)
          .icon(createFlagIcon(value))
          .child(
            S.documentTypeList(schemaType)
              .id(`${schemaType}-${value}-list`)
              .title(`${label} — ${title}`)
              .schemaType(schemaType)
              .apiVersion(`v${apiVersion}`)
              .filter(`${fullFilter} && language == $locale`)
              .params({locale: value})
              .initialValueTemplates([S.initialValueTemplateItem(`${schemaType}-${value}`)]),
          ),
      ),
    ])
}

const apiVersion = '2026-02-27'

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── Website ──────────────────────────────────────────
      S.divider().title('Website'),

      S.listItem()
        .title('Pages')
        .icon(DesktopIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(
                  S.list()
                    .title('Home Page')
                    .items(
                      LOCALES.map(({value, title}) =>
                        S.listItem()
                          .title(title)
                          .id(`homePage-${value}`)
                          .icon(createFlagIcon(value))
                          .child(
                            S.document()
                              .schemaType('page')
                              .documentId(`homePage-${value}`)
                              .initialValueTemplate(`page-${value}`),
                          ),
                      ),
                    ),
                ),
              S.listItem()
                .title('Product Pages')
                .icon(PackageIcon)
                .child(
                  localeGroupedList(S, 'productPage', 'Product Pages', apiVersion, PackageIcon),
                ),
              S.listItem()
                .title('Landing Pages')
                .icon(ComposeIcon)
                .child(
                  localeGroupedList(
                    S,
                    'page',
                    'Landing Pages',
                    apiVersion,
                    ComposeIcon,
                    '!(_id match "homePage*")',
                  ),
                ),
            ]),
        ),

      S.listItem()
        .title('Site Config')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Config')
            .items([
              S.listItem()
                .title('Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('settings').documentId('siteSettings')),
              S.listItem()
                .title('Header')
                .icon(InsertBelowIcon)
                .child(localeGroupedList(S, 'header', 'Headers', apiVersion, InsertBelowIcon)),
              S.listItem()
                .title('Footer')
                .icon(InsertAboveIcon)
                .child(localeGroupedList(S, 'footer', 'Footers', apiVersion, InsertAboveIcon)),
            ]),
        ),

      S.listItem()
        .title('Components')
        .icon(BlockElementIcon)
        .child(
          S.list()
            .title('Components')
            .items(
              S.documentTypeListItems()
                .filter((item) =>
                  COMPONENT_TYPES.includes(item.getId() as (typeof COMPONENT_TYPES)[number]),
                )
                .map((item) => {
                  const title = COMPONENT_TITLES[item.getId() ?? '']
                  return title ? item.title(title) : item
                }),
            ),
        ),

      // ── Merchandising ────────────────────────────────────
      S.divider().title('Merchandising'),

      S.listItem()
        .title('Collections')
        .icon(FilterIcon)
        .child(localeGroupedList(S, 'collection', 'Collections', apiVersion, FilterIcon)),

      S.listItem()
        .title('Products')
        .icon(PackageIcon)
        .child(localeGroupedList(S, 'product', 'Products', apiVersion, PackageIcon)),
    ])
