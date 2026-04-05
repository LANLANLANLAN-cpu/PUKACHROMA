import { supabase } from './supabase.js'

export const SHOP_THEMES = {
  all: 'shop-all-theme',
  eureka: 'shop-eureka-theme',
  kuriru: 'shop-kuriru-theme',
  lanlan: 'shop-lanlan-theme',
  renie: 'shop-renie-theme',
  azure: 'shop-azure-theme',
  group: 'shop-group-theme'
}

export function normalizeCategory(value = '') {
  return String(value).trim().toLowerCase()
}

export function splitCategories(categoryText = '') {
  return String(categoryText)
    .split(',')
    .map(item => normalizeCategory(item))
    .filter(Boolean)
}

export function productHasCategory(product, targetCategory) {
  if (!targetCategory || targetCategory === 'all') return true
  const categories = splitCategories(product.category || '')
  return categories.includes(normalizeCategory(targetCategory))
}

export function getProductThemeClass(product) {
  const categories = splitCategories(product.category || '')
  const first = categories[0] || 'all'
  return SHOP_THEMES[first] || SHOP_THEMES.all
}

export function getThemeByCategory(category) {
  const normalized = normalizeCategory(category || 'all')
  return SHOP_THEMES[normalized] || SHOP_THEMES.all
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return ''
  return `$${price}`
}

export function getSafeCoverImage(product) {
  return product?.cover_image || 'https://via.placeholder.com/700x700'
}

export function normalizeImages(images, coverImage) {
  let list = []

  if (Array.isArray(images)) {
    list = images
  } else if (typeof images === 'string' && images.trim()) {
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed)) list = parsed
    } catch {
      list = []
    }
  }

  if (coverImage && !list.includes(coverImage)) {
    list.unshift(coverImage)
  }

  if (list.length === 0) {
    list = ['https://via.placeholder.com/700x700']
  }

  return list
}

export function youtubeToEmbed(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    return null
  } catch {
    return null
  }
}

export async function fetchAllActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('status', ['active', 'sold_out'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchProductsByCategory(category) {
  const products = await fetchAllActiveProducts()
  return products.filter(product => productHasCategory(product, category))
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
