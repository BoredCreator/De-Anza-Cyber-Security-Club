import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        navigate('/auth?error=callback_failed')
        return
      }

      // Check if we were linking an account
      const linkingProvider = sessionStorage.getItem('linking_provider')
      if (linkingProvider) {
        sessionStorage.removeItem('linking_provider')

        // Check for linking errors in URL (Supabase returns errors as hash params)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorDescription = hashParams.get('error_description')

        if (errorDescription) {
          // Identity is already linked to another account
          if (errorDescription.includes('already linked') ||
              errorDescription.includes('Identity is already linked')) {
            navigate('/settings?error=already_linked')
          } else {
            navigate(`/settings?error=${encodeURIComponent(errorDescription)}`)
          }
          return
        }

        if (!session) {
          navigate('/settings?error=linking_failed')
          return
        }

        // Sync the new identity to the database before redirecting
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile && session.user.identities) {
          const existingProviders = new Set(
            (profile.linked_accounts || []).map((a: { provider: string }) => a.provider)
          )
          const hasNewIdentity = session.user.identities.some(
            i => !existingProviders.has(i.provider)
          )

          if (hasNewIdentity) {
            // Build updated linked accounts from all identities
            const newLinkedAccounts = session.user.identities.map(identity => {
              const identityData = identity.identity_data || {}
              const existing = (profile.linked_accounts || []).find(
                (a: { provider: string }) => a.provider === identity.provider
              )
              return {
                provider: identity.provider,
                provider_account_id: identity.id,
                provider_email: (identityData.email as string) || null,
                provider_username: (identityData.user_name as string) ||
                  (identityData.preferred_username as string) ||
                  (identityData.name as string) || null,
                provider_avatar_url: (identityData.avatar_url as string) ||
                  (identityData.picture as string) || null,
                linked_at: existing?.linked_at || new Date().toISOString()
              }
            })

            await supabase
              .from('users')
              .update({ linked_accounts: newLinkedAccounts })
              .eq('id', session.user.id)
          }
        }

        navigate('/settings')
        return
      }

      if (session) {

        // Check if user profile exists
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          // New user - redirect to profile setup
          navigate('/auth?step=profile')
        } else {
          navigate('/dashboard')
        }
      } else {
        navigate('/auth')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-terminal-bg text-matrix flex items-center justify-center">
      <div className="crt-overlay" />
      <div className="text-center relative z-10">
        <div className="flex items-center gap-3 justify-center">
          <svg className="animate-spin h-6 w-6 text-matrix" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-terminal text-lg neon-pulse">Verifying...</span>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
