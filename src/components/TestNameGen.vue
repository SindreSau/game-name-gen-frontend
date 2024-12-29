// src/components/TestNameGen.vue // src/components/TestNameGen.vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNameGenerator } from '@/composables/useNameGenerator'
import { useStyles } from '@/composables/useStyles'
import type { GenerateNamesRequest, CaseStyle } from '@/types/api'

const { styles, isLoading: isLoadingStyles } = useStyles()
const { generateNames, names, isLoading: isGenerating, isError, error } = useNameGenerator()
const hasAttemptedSubmit = ref(false)

// Store selected style IDs but use a separate mapping for the API
const selectedStyleIds = ref<string[]>([])

// Map between UUID and style identifier
const styleIdToName = computed(() => {
  const map = new Map<string, string>()
  styles.value.forEach((style) => {
    map.set(style.id, style.name.toLowerCase()) // assuming name is the identifier
  })
  return map
})

const formData = ref<Required<Omit<GenerateNamesRequest, 'styles'>>>({
  gender: 'neutral',
  numParts: 2,
  caseStyle: 'PascalCase',
  count: 10,
  unique: false,
})

// Update the validation rules
const validations = computed(() => ({
  styles: {
    valid:
      formData.value.numParts === 1
        ? selectedStyleIds.value.length >= 1
        : selectedStyleIds.value.length >= 2,
    message:
      formData.value.numParts === 1
        ? 'Select at least one style when using one part'
        : 'Select at least two styles when using multiple parts',
  },
  numParts: {
    valid: formData.value.numParts >= 1 && formData.value.numParts <= 3,
    message: 'Number of parts must be between 1 and 3',
  },
  count: {
    valid: formData.value.count >= 1 && formData.value.count <= 20,
    message: 'Number of names must be between 1 and 20',
  },
}))

// Update the style disable logic
const isStyleDisabled = computed(() => {
  return (styleId: string) => {
    return !selectedStyleIds.value.includes(styleId) && selectedStyleIds.value.length >= 5
  }
})

// Add a watcher to enforce style selection rules when numParts changes
watch(
  () => formData.value.numParts,
  (newValue) => {
    // If switching to 1 part and we have multiple styles selected,
    // keep only the first selected style
    if (newValue === 1 && selectedStyleIds.value.length > 1) {
      selectedStyleIds.value = [selectedStyleIds.value[0]]
    }
  },
)

const isFormValid = computed(() =>
  Object.values(validations.value).every((validation) => validation.valid),
)

const handleGenerate = () => {
  hasAttemptedSubmit.value = true
  if (isFormValid.value) {
    // Convert UUID style IDs to their corresponding identifiers
    const styleIdentifiers = selectedStyleIds.value
      .map((id) => styleIdToName.value.get(id))
      .filter((name): name is string => name !== undefined)

    const payload = {
      ...formData.value,
      styles: styleIdentifiers,
      numParts: Number(formData.value.numParts),
      count: Number(formData.value.count),
    }

    generateNames(payload)
  }
}

const shouldShowError = (fieldName: keyof typeof validations.value) => {
  return hasAttemptedSubmit.value && !validations.value[fieldName].valid
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- ... header remains the same ... -->

    <div class="md:grid md:grid-cols-2 md:gap-6">
      <!-- Form Section -->
      <div class="space-y-6 bg-gray-50 p-6 rounded-lg">
        <!-- Styles Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name Styles (Choose up to five)
          </label>
          <div v-if="isLoadingStyles" class="text-gray-500">Loading styles...</div>
          <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
            <label
              v-for="style in styles"
              :key="style.id"
              :class="[
                'inline-flex items-center p-2 bg-white rounded hover:bg-gray-50',
                isStyleDisabled(style.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ]"
            >
              <input
                type="checkbox"
                v-model="selectedStyleIds"
                :value="style.id"
                :disabled="isStyleDisabled(style.id)"
                class="rounded border-gray-300"
              />
              <span class="ml-2">{{ style.name }}</span>
            </label>
          </div>
          <div
            class="mt-2 text-sm"
            :class="[shouldShowError('styles') ? 'text-red-500' : 'text-gray-500']"
          >
            Selected: {{ selectedStyleIds.length }}/5
            <span v-if="shouldShowError('styles')" class="block">
              {{ validations.styles.message }}
            </span>
          </div>
        </div>

        <!-- Number of Parts -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> Number of Parts </label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="num in [1, 2, 3]"
              :key="num"
              :class="[
                'relative inline-flex items-center justify-center px-4 py-2 rounded-full border transition-colors cursor-pointer',
                formData.numParts === num
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
            >
              <input
                type="radio"
                :value="num"
                v-model="formData.numParts"
                class="absolute appearance-none"
              />
              <span>{{ num }}</span>
            </label>
          </div>
          <div v-if="shouldShowError('numParts')" class="mt-1 text-sm text-red-500">
            {{ validations.numParts.message }}
          </div>
        </div>

        <!-- Count -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> Number of Names </label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="num in [1, 5, 10, 20]"
              :key="num"
              :class="[
                'relative inline-flex items-center justify-center px-4 py-2 rounded-full border transition-colors cursor-pointer',
                formData.count === num
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
            >
              <input
                type="radio"
                :value="num"
                v-model="formData.count"
                class="absolute appearance-none"
              />
              <span>{{ num }}</span>
            </label>
          </div>
          <div v-if="shouldShowError('count')" class="mt-1 text-sm text-red-500">
            {{ validations.count.message }}
          </div>
        </div>

        <!-- Also update the Case Style section to use badges -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Case Style</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="style in [
                { value: 'PascalCase', label: 'PascalCase' },
                { value: 'kebab-case', label: 'kebab-case' },
                { value: 'camelCase', label: 'camelCase' },
                { value: 'snake_case', label: 'snake_case' },
                { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
              ]"
              :key="style.value"
              :class="[
                'relative inline-flex items-center justify-center px-4 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap',
                formData.caseStyle === style.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
            >
              <input
                type="radio"
                :value="style.value"
                v-model="formData.caseStyle"
                class="absolute appearance-none"
              />
              <span>{{ style.label }}</span>
            </label>
          </div>
        </div>

        <!-- And update the Gender selection to use badges too -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="option in [
                { value: 'masculine', label: 'Masculine' },
                { value: 'feminine', label: 'Feminine' },
                { value: 'neutral', label: 'Neutral' },
              ]"
              :key="option.value"
              :class="[
                'relative inline-flex items-center justify-center px-4 py-2 rounded-full border transition-colors cursor-pointer',
                formData.gender === option.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="formData.gender"
                class="absolute appearance-none"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Unique Toggle -->
        <div>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="formData.unique" class="rounded border-gray-300" />
            <span class="ml-2">Generate Unique Names</span>
          </label>
        </div>

        <!-- Generate Button -->
        <button
          @click="handleGenerate"
          :disabled="isGenerating || (hasAttemptedSubmit && !isFormValid)"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isGenerating">Generating...</span>
          <span v-else-if="hasAttemptedSubmit && !isFormValid">Please fix form errors</span>
          <span v-else>Generate Names</span>
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="isError" class="text-red-500 mt-6 md:mt-0">Error: {{ error?.message }}</div>
      <div v-if="names.length" class="mt-6 md:mt-0">
        <h2 class="text-xl font-semibold mb-4">Generated Names</h2>
        <div class="space-y-4">
          <div
            v-for="name in names"
            :key="name.uniqueCode"
            class="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="text-lg font-medium">{{ name.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
