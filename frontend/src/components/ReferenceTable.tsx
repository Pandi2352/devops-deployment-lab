import type { ReactNode } from 'react'

interface ReferenceRow {
  key: string
  label: ReactNode
  value: ReactNode
}

interface ReferenceTableProps {
  caption: string
  headers: [string, string]
  rows: ReferenceRow[]
}

export function ReferenceTable({ caption, headers, rows }: ReferenceTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-subtle">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-line align-top">
              <th scope="row" className="px-4 py-3 leading-7 font-normal wrap-anywhere">
                {row.label}
              </th>
              <td className="px-4 py-3 leading-7 wrap-anywhere">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
