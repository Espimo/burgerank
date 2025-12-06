'use client'

import { fullTextSearch, searchByTags, searchByIngredients, fuzzySearch, getPopularSuggestions } from '@/lib/api/search-advanced'

export async function searchBurgersAndRestaurants(query: string) {
  return fullTextSearch(query)
}

export async function searchBySelectedTags(tags: string[]) {
  return searchByTags(tags)
}

export async function searchBySelectedIngredients(ingredients: string[]) {
  return searchByIngredients(ingredients)
}

export async function performFuzzySearch(query: string) {
  return fuzzySearch(query)
}

export async function getSearchSuggestions() {
  return getPopularSuggestions()
}
