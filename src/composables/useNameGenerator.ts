// src/composables/useNameGenerator.ts
import { useMutation } from '@tanstack/vue-query'
import { nameGeneratorApi } from '@/services/api'
import type {
  GenerateNamesRequest,
  GeneratedName,
} from '@/types/api'
import { computed } from 'vue'

export function useNameGenerator() {
  const generateNamesMutation = useMutation({
    mutationFn: (params: GenerateNamesRequest) => nameGeneratorApi.generateNames(params)
  })

  const getSimilarNamesMutation = useMutation({
    mutationFn: ({ name, count = 10 }: { name: GeneratedName; count?: number }) =>
      nameGeneratorApi.getSimilarNames(name, count)
  })

  return {
    generateNames: generateNamesMutation.mutate,
    generateNamesAsync: generateNamesMutation.mutateAsync,
    getSimilarNames: getSimilarNamesMutation.mutate,
    getSimilarNamesAsync: getSimilarNamesMutation.mutateAsync,
    isLoading: computed(() => generateNamesMutation.isPending.value || getSimilarNamesMutation.isPending.value),
    isError: computed(() => generateNamesMutation.isError.value || getSimilarNamesMutation.isError.value),
    error: computed(() => generateNamesMutation.error.value || getSimilarNamesMutation.error.value),
    names: computed(() => generateNamesMutation.data.value?.names ?? [])
  }
}
