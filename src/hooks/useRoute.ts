import { useCallback, useEffect, useState } from 'react'
import { sectionById, type SectionId } from '../graph'

export type Route = { section?: SectionId; item?: string }

function parse(): Route {
  const [section, item] = window.location.hash.replace(/^#\/?/, '').split('/')
  const node = sectionById(section)
  if (!node) return {}
  return { section: node.id, item: node.items.some((i) => i.id === item) ? item : undefined }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const go = useCallback((section?: SectionId, item?: string) => {
    window.location.hash = section ? `/${section}${item ? `/${item}` : ''}` : '/'
  }, [])

  return { route, go }
}
