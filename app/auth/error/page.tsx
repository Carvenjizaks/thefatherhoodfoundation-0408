import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-xl text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center gap-3 items-center">
            <div className="relative h-12 w-12">
              <Image src="/images/logo.png" alt="Powerhouse Logo" width={48} height={48} className="object-contain opacity-60" />
            </div>
            <div className="rounded-full bg-destructive/10 p-2.5">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/auth/login">Try Again</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
