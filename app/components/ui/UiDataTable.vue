<script setup lang="ts">
export type DataTableColumn = {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  sticky?: boolean
  stickyLeft?: string
  headerClass?: string
  cellClass?: string
}

type DataTableRow = Record<string, unknown>

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows: DataTableRow[]
    rowKey?: string
    minWidth?: string
    maxHeight?: string
    emptyText?: string
    showFooter?: boolean
    stickyHeader?: boolean
  }>(),
  {
    rowKey: 'id',
    minWidth: '1000px',
    maxHeight: undefined,
    emptyText: 'Данные не найдены',
    showFooter: false,
    stickyHeader: false,
  },
)

function getRowKey(row: DataTableRow, index: number) {
  return String(row[props.rowKey] ?? index)
}

function getAlignClass(align: DataTableColumn['align']) {
  const classes = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return classes[align ?? 'left']
}

function getStickyHeaderClass(column: DataTableColumn) {
  if (!column.sticky && !props.stickyHeader) return ''

  return column.sticky ? 'sticky z-30 bg-slate-50' : 'sticky z-20 bg-slate-50'
}

function getStickyCellClass(column: DataTableColumn) {
  if (!column.sticky) return ''

  return 'sticky z-10 bg-white group-hover:bg-slate-50'
}

function getStickyFooterClass(column: DataTableColumn) {
  return column.sticky ? 'sticky bottom-0 z-30 bg-slate-50' : 'sticky bottom-0 z-20 bg-slate-50'
}

function getStickyStyle(column: DataTableColumn) {
  if (!column.sticky || !column.stickyLeft) return undefined

  return {
    left: column.stickyLeft,
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div class="overflow-auto" :style="maxHeight ? { maxHeight } : undefined">
      <table class="w-full border-collapse text-left text-xs" :style="{ minWidth }">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-2 font-semibold"
              :class="[
                getAlignClass(column.align),
                getStickyHeaderClass(column),
                column.headerClass,
              ]"
              :style="{
                width: column.width,
                top: stickyHeader ? '0' : undefined,
                ...getStickyStyle(column),
              }"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(row, index) in rows"
            :key="getRowKey(row, index)"
            class="group bg-white transition hover:bg-slate-50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-2"
              :class="[getAlignClass(column.align), getStickyCellClass(column), column.cellClass]"
              :style="{
                width: column.width,
                ...getStickyStyle(column),
              }"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :column="column"
              >
                {{ row[column.key] ?? '—' }}
              </slot>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td :colspan="columns.length" class="px-4 py-12 text-center text-sm text-slate-500">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>

        <tfoot v-if="showFooter">
          <tr class="border-t border-slate-200 text-slate-950 shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-3 font-semibold"
              :class="[
                getAlignClass(column.align),
                getStickyFooterClass(column),
                column.cellClass,
              ]"
              :style="{
                width: column.width,
                ...getStickyStyle(column),
              }"
            >
              <slot :name="`footer-${column.key}`" :column="column" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
