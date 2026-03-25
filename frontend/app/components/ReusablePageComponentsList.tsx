import {productComponentMap} from '@/app/lib/productComponentMap'
import {dataAttr} from '@/sanity/lib/utils'

export default function ReusablePageComponentsList({
  pageId,
  pageType,
  components,
}: {
  pageId: string
  pageType: 'page' | 'productPage'
  components: any[]
}) {
  console.log(components)
  const componentsListAttr = dataAttr({
    id: pageId,
    type: pageType,
    path: 'components',
  }).toString()

  return (
    components.length > 0 && (
      <div
        className="mt-16 space-y-16 border-t border-slate-200 pt-16"
        data-sanity={componentsListAttr}
      >
        {components.map((component: any) => {
          const Component = productComponentMap[component._type]
          const blockAttr = dataAttr({
            id: pageId,
            type: pageType,
            path: `components[_key=="${component._key}"]`,
          }).toString()

          const refAttr = dataAttr({
            id: component._id,
            type: component._type,
            path: `title`,
          }).toString()

          if (Component) {
            return (
              <div key={component._key} data-sanity={blockAttr}>
                <Component data={component} />
              </div>
            )
          }
          return null
        })}
      </div>
    )
  )
}
