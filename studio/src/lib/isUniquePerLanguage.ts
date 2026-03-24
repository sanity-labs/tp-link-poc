import type {SlugIsUniqueValidator} from 'sanity'

/**
 * Scopes slug uniqueness to the same document type + language,
 * so translated documents can share the same slug across locales.
 */
export const isUniquePerLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2024-01-01'})
  const id = document?._id?.replace(/^drafts\./, '')
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type == $type &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  return client.fetch(query, {
    draft: `drafts.${id}`,
    published: id,
    slug,
    type: document?._type,
    language: (document as any)?.language,
  })
}
