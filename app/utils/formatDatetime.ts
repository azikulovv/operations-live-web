import dayjs from 'dayjs'

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  return dayjs(date).format('DD.MM.YYYY HH:mm')
}
