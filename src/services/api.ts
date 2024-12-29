// src/services/api.ts

import axios from 'axios'
import type {
  GenerateNamesRequest,
  GenerateNamesResponse,
  StylesResponse,
  CaseConversionRequest,
  CaseConversionResponse,
  GeneratedName
} from '@/types/api'

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:3030/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const nameGeneratorApi = {
  generateNames: async (params: GenerateNamesRequest): Promise<GenerateNamesResponse> => {
    const { data } = await api.post<GenerateNamesResponse>('/names/generate', params)
    return data
  },

  getSimilarNames: async (
    originalName: GeneratedName,
    count: number = 10
  ): Promise<GenerateNamesResponse> => {
    const { data } = await api.post<GenerateNamesResponse>('/names/similar', {
      originalName,
      count
    })
    return data
  },

  getStyles: async (): Promise<StylesResponse> => {
    const { data } = await api.get<StylesResponse>('/styles')
    return data
  },

  convertCase: async (params: CaseConversionRequest): Promise<CaseConversionResponse> => {
    const { data } = await api.post<CaseConversionResponse>('/convert-case', params)
    return data
  }
}