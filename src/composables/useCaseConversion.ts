// src/composables/useCaseConversion.ts
import { useMutation } from '@tanstack/vue-query'
import { nameGeneratorApi } from '@/services/api'
import type { CaseStyle } from '@/types/api'
import { computed } from 'vue';

export function useCaseConversion() {
  const convertCaseMutation = useMutation({
    mutationFn: ({ name, to }: { name: string; to: CaseStyle }) =>
      nameGeneratorApi.convertCase({ name, to })
  })

  return {
    convertCase: convertCaseMutation.mutate,
    convertCaseAsync: convertCaseMutation.mutateAsync,
    isLoading: computed(() => convertCaseMutation.isPending.value),
    isError: computed(() => convertCaseMutation.isError.value),
    error: computed(() => convertCaseMutation.error.value),
    convertedName: computed(() => convertCaseMutation.data.value?.convertedName)
  }
}