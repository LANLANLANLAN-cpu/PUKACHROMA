import { supabase } from './supabase.js'

export async function signUpWithEmail({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://lanlanlanlan-cpu.github.io/PUKACHROMA/auth-confirm.html',
      data: {
        display_name: displayName || ''
      }
    }
  })

  if (error) throw error
  return data
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  if (data.user) {
    const fallbackName =
      data.user.user_metadata?.display_name ||
      data.user.email?.split('@')[0] ||
      ''

    await ensureProfile(data.user, fallbackName)
  }

  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function ensureProfile(user, displayName = '') {
  if (!user) return null

  const payload = {
    id: user.id,
    email: user.email || '',
    display_name: displayName || user.user_metadata?.display_name || '',
    role: 'user'
  }

  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existingError) throw existingError
  if (existing) return existing

  const { error } = await supabase
    .from('profiles')
    .insert(payload)

  if (error) throw error

  return payload
}

export async function getMyProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function resendSignupEmail(email) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: 'https://lanlanlanlan-cpu.github.io/PUKACHROMA/auth-confirm.html'
    }
  })

  if (error) throw error
  return data
}

export async function verifyEmailToken(tokenHash) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'email'
  })

  if (error) throw error

  if (data.user) {
    const fallbackName =
      data.user.user_metadata?.display_name ||
      data.user.email?.split('@')[0] ||
      ''
    await ensureProfile(data.user, fallbackName)
  }

  return data
}
