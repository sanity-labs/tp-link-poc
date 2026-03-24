'use client'

import {useRouter} from 'next/navigation'
import {stegaClean} from 'next-sanity'

interface VersionSwitcherProps {
  options: {
    key: string
    versionName: string
    label: string
    isDefault: boolean
  }[]
  currentVersionName: string | null
  locale: string
  model: string
}

export function VersionSwitcher({
  options,
  currentVersionName,
  locale,
  model,
}: VersionSwitcherProps) {
  const router = useRouter()

  if (!options?.length) return null

  const handleChange = (versionName: string) => {
    console.log('VERISON NAME: ', versionName)
    const base = `/${locale}/products/${model}`
    const selected = options.find((v) => v.versionName === versionName)

    const href = selected?.isDefault ? base : `${base}/${stegaClean(versionName)}`
    router.push(href)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="version-select" className="text-sm font-medium text-slate-700">
        Version
      </label>
      <select
        id="version-select"
        value={currentVersionName ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.versionName}>
            {opt.label}
            {opt.isDefault ? ' (default)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
