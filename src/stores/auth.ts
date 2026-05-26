import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: 'client' | 'organizer' | 'admin'
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isOrganizer = computed(() => profile.value?.role === 'organizer' || profile.value?.role === 'admin')
  const isAdmin = computed(() => profile.value?.role === 'admin')

  async function fetchProfile() {
    if (!user.value) return null

    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()

    if (err) {
      console.error('Error fetching profile:', err)
      return null
    }

    profile.value = data
    return data
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (err) throw err

      session.value = data.session
      user.value = data.user
      await fetchProfile()

      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, fullName: string, phone?: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null
          }
        }
      })

      if (err) throw err

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          phone: phone || null,
          role: 'client'
        })
      }

      session.value = data.session
      user.value = data.user
      await fetchProfile()

      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur d\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true

    try {
      await supabase.auth.signOut()
      user.value = null
      profile.value = null
      session.value = null
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      loading.value = false
    }
  }

  async function initialize() {
    loading.value = true

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await fetchProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null

        if (event === 'SIGNED_IN' && newSession) {
          await fetchProfile()
        } else if (event === 'SIGNED_OUT') {
          profile.value = null
        }
      })
    } catch (err) {
      console.error('Auth init error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    error,
    isAuthenticated,
    isOrganizer,
    isAdmin,
    signIn,
    signUp,
    signOut,
    fetchProfile,
    initialize
  }
})
