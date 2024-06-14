export type IFilter = {
  f: number
  type: string
  label: string
  value: number
}

export type IPreset = {
  key: string
  name: string
  filters: Array<IFilter>
}