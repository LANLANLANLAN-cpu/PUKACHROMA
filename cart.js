import { supabase } from './supabase.js'
import { getCurrentUser } from './auth.js'

export async function getOrCreateCart() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Please log in first.')

  const { data: existingCart, error: existingError } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) throw existingError
  if (existingCart) return existingCart

  const { data: newCart, error: insertError } = await supabase
    .from('carts')
    .insert({ user_id: user.id })
    .select()
    .single()

  if (insertError) throw insertError
  return newCart
}

export async function addToCart(productId, quantity = 1) {
  const cart = await getOrCreateCart()

  const { data: existingItem, error: existingError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existingError) throw existingError

  if (existingItem) {
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)

    if (updateError) throw updateError
    return
  }

  const { error: insertError } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cart.id,
      product_id: productId,
      quantity
    })

  if (insertError) throw insertError
}

export async function getMyCartItems() {
  const cart = await getOrCreateCart()

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product_id,
      products (*)
    `)
    .eq('cart_id', cart.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function removeCartItem(cartItemId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)

  if (error) throw error
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  if (quantity <= 0) {
    await removeCartItem(cartItemId)
    return
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)

  if (error) throw error
}

export async function getCartCount() {
  const user = await getCurrentUser()
  if (!user) return 0

  const cart = await getOrCreateCart()

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cart.id)

  if (error) throw error

  return (data || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)
}

export async function renderCartCount(targetId = 'cartCount') {
  const el = document.getElementById(targetId)
  if (!el) return

  try {
    const count = await getCartCount()
    el.textContent = count > 0 ? String(count) : ''
  } catch {
    el.textContent = ''
  }
}
