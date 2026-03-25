import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {localizedProductPageQuery} from '@/sanity/lib/queries'
import {isValidLocale} from '@/sanity/lib/locale'
import ProductHeroCarousel from '@/app/components/Carousel/ProductHero'
import {VersionSwitcher} from '@/app/components/VersionSwitcher'
import {stegaClean} from 'next-sanity'
import ReusablePageComponentsList from '@/app/components/ReusablePageComponentsList'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
    version?: string[]
  }>
}

function getActiveEntry(
  entries: any[],
  versionSegments: string[] | undefined,
): {activeEntry: any; defaultEntry: any; currentVersionSlug: string | null} {
  if (!entries.length) {
    return {activeEntry: null, defaultEntry: null, currentVersionSlug: null}
  }

  const defaultEntry = entries.find((e: any) => e.isDefault) ?? entries[0]
  const requestedVersionSlug =
    versionSegments && versionSegments[0] ? decodeURIComponent(versionSegments[0]) : null

  if (!requestedVersionSlug) {
    return {
      activeEntry: defaultEntry,
      defaultEntry,
      currentVersionSlug: defaultEntry.product?.versions?.versionSlug ?? null,
    }
  }

  const matchingEntry =
    entries.find(
      (entry: any) =>
        stegaClean(entry.product?.versions?.versionSlug) === stegaClean(requestedVersionSlug),
    ) ?? null

  const activeEntry = matchingEntry ?? defaultEntry
  return {
    activeEntry,
    defaultEntry,
    currentVersionSlug: activeEntry.product?.versions?.versionSlug ?? null,
  }
}

export default async function LocalizedProductPage({params}: ProductPageProps) {
  const {locale, slug, version: versionSegments} = await params
  if (!isValidLocale(locale)) notFound()

  const {data: productPage} = await sanityFetch({
    query: localizedProductPageQuery,
    params: {locale, slug},
  })

  console.log('PRODUCT PAGE: ', productPage)

  if (!productPage || !(productPage as any).products?.length) {
    notFound()
  }

  const entries = (productPage as any).products ?? []
  const {activeEntry, defaultEntry, currentVersionSlug} = getActiveEntry(entries, versionSegments)

  const effectiveEntry = activeEntry?.product
    ? activeEntry
    : defaultEntry?.product
      ? defaultEntry
      : null

  if (!effectiveEntry?.product) notFound()

  const product = effectiveEntry.product
  const components = (productPage as any).components ?? []

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <article>
        <div className="grid gap-16 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg">
            {product.images?.length ? (
              <ProductHeroCarousel images={product.images} />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No image</div>
            )}
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {product.modelNumber && (
                <p className="text-sm font-medium text-slate-500">{product.modelNumber}</p>
              )}
              {entries.length > 1 && (
                <VersionSwitcher
                  options={entries
                    .filter((entry: any) => entry.product?.versions?.versionSlug)
                    .map((entry: any) => ({
                      key: entry._key,
                      versionSlug: entry.product!.versions!.versionSlug,
                      label:
                        entry.product!.versions!.description ??
                        entry.product!.versions!.versionName,
                      isDefault: entry.isDefault,
                    }))}
                  currentVersionSlug={currentVersionSlug}
                  locale={locale}
                  model={slug}
                />
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {product.name ?? product.modelNumber ?? 'Product'}
            </h1>
            {product.features && product.features.length > 0 && (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-700">
                {product.features.map((feature: string, i: number) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}
            {product.links && product.links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4">
                {product.links.map((link: any, i: number) => (
                  <li key={i}>
                    <a
                      href={link.url ?? '#'}
                      className="text-green-600 underline hover:text-green-700"
                    >
                      {link.label ?? 'Link'}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <ReusablePageComponentsList pageId={productPage._id} pageType="productPage" components={components} />
        
      </article>
    </div>
  )
}
