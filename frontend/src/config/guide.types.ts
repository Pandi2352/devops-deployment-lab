export interface GuidePage<Id extends string = string> {
  id: Id
  path: string
  title: string
  summary: string
  label?: string
}

export interface GuideGroup<Id extends string = string> {
  title: string
  pages: GuidePage<Id>[]
}

export interface Phase<Id extends string = string> {
  label: string
  name: string
  path: string
  overview: GuidePage<Id>
  groups: GuideGroup<Id>[]
}
