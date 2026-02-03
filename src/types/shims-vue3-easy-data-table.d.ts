// src/types/shims-vue3-easy-data-table.d.ts
declare module 'vue3-easy-data-table' {
  import { DefineComponent } from 'vue'

  // The component itself (fixes default import)
  const Vue3EasyDataTable: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>

  // Explicitly declare the types you're importing (matches library's actual types)
  export type Header = {
    text: string
    value: string
    sortable?: boolean
    fixed?: boolean
    width?: number | string
    // add other optional props you use: align?, filter?, sortBy?, etc.
    [key: string]: any
  }

  export type Item = Record<string, any> // items are plain objects, very flexible

  export type FilterOption =
    | {
        field: string
        comparison: 'between'
        criteria: [number, number]
      }
    | {
        field: string
        comparison: '=' | '!='
        criteria: number | string
      }
    | {
        field: string
        comparison: '>' | '>=' | '<' | '<='
        criteria: number
      }
    | {
        field: string
        comparison: (value: any, criteria: string) => boolean
        criteria: string
      }

  // Export the component as default too
  export default Vue3EasyDataTable
}
