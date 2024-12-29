// src/composables/useStyles.ts
import { useQuery } from '@tanstack/vue-query'
import { nameGeneratorApi } from '@/services/api'
import { computed } from 'vue'

export function useStyles() {
  const query = useQuery({
    queryKey: ['styles'],
    queryFn: () => nameGeneratorApi.getStyles(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })

  const styles = computed(() => query.data.value?.styles ?? [])

  return {
    styles,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    fetchStyles: query.refetch
  }
}