// src/types/api.ts

export type CaseStyle = 'PascalCase' | 'kebab-case' | 'camelCase' | 'snake_case' | 'CONSTANT_CASE';
export type Gender = 'masculine' | 'feminine' | 'neutral';

export interface NameComponent {
    id: string;
    component: string;
}

export interface GeneratedName {
    name: string;
    components: NameComponent[];
    uniqueCode?: string;
}

export interface GenerateNamesRequest {
    styles?: string[];
    gender?: Gender;
    numParts?: number;
    caseStyle?: CaseStyle;
    unique?: boolean;
    count?: number;
}

export interface GenerateNamesResponse {
    success: boolean;
    names: GeneratedName[];
    count: number;
}

export interface NameStyle {
    id: string;
    name: string;
}

export interface StylesResponse {
    success: boolean;
    styles: NameStyle[];
    count: number;
}

export interface CaseConversionRequest {
    name: string;
    to: CaseStyle;
}

export interface CaseConversionResponse {
    success: boolean;
    convertedName: string;
}
