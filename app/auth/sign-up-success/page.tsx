import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-xl text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative h-16 w-16">
              <Image src="/images/logo.png" alt="Powerhouse Logo" width={64} height={64} className="object-contain opacity-80" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">Check Your Email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent you a confirmation email. Please click the link in the email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Didn't receive the email?</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes and check again</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
