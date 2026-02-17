'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('You must be logged in to complete setup. Please sign up first.')
        setLoading(false)
        return
      }

      setUserData(user)

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('id', user.id)
        .single()

      if (existingProfile) {
        router.push('/dashboard')
        return
      }

      // Load data from user metadata
      const metadata = user.user_metadata
      const defaultOrgName = metadata?.organization_name || 'My Organization'
      const defaultSubdomain = defaultOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      setOrgName(defaultOrgName)
      setSubdomain(defaultSubdomain)
      setLoading(false)
    }

    checkUser()
  }, [])

  const handleSetup = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      if (!userData) {
        throw new Error('User data not found')
      }

      const metadata = userData.user_metadata
      const fullName = metadata?.full_name || 'Administrator'
      const role = metadata?.role || 'admin'

      // Create organization
      const orgSlug = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: orgSlug,
        })
        .select()
        .single()

      if (orgError) {
        console.error('[v0] Organization creation error:', orgError)
        throw new Error('Failed to create organization: ' + orgError.message)
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.id,
          email: userData.email!,
          full_name: fullName,
          role: role,
          organization_id: org.id,
        })

      if (profileError) {
        console.error('[v0] Profile creation error:', profileError)
        throw new Error('Failed to create profile: ' + profileError.message)
      }

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)

    } catch (err: any) {
      console.error('[v0] Setup error:', err)
      setError(err.message || 'Failed to complete setup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative h-16 w-16">
              <Image src="/images/logo.png" alt="Powerhouse Logo" width={64} height={64} className="object-contain opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,73%,40%)]/10 to-[hsl(150,40%,72%)]/10 rounded-full mix-blend-overlay" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">Welcome to Powerhouse</CardTitle>
            <CardDescription>
              Complete your organization setup to get started
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success ? (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-500">Setup complete!</p>
                <p className="text-muted-foreground mt-1">Redirecting to dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Your Organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="yourorg"
                />
                <p className="text-xs text-muted-foreground">
                  This will be used for your organization URL
                </p>
              </div>

              <Button 
                onClick={handleSetup} 
                disabled={loading || !orgName || !subdomain}
                className="w-full"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Not signed up yet?{' '}
              <a href="/auth/sign-up" className="text-primary hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
