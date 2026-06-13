import type { Ref } from 'vue'
import type { PromotionRow, UpdatePromotionDto } from '~/types/operations'

export const useEventPromotions = (eventId: string | Ref<string>) => {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<
    PromotionRow,
    UpdatePromotionDto
  >(eventId, {
    listPath: (eventId) => `/events/${eventId}/promotions`,
    updatePath: (participantId) => `/promotions/${participantId}`,
    listUpdatedEvent: 'promotions:list-updated',
    getUpdateId: (promotion) => promotion.participantId,
  })

  return {
    promotions: rows,
    isLoading: pending,
    error,
    fetchPromotions: fetchList,
    updatePromotion: updateItem,
  }
}
