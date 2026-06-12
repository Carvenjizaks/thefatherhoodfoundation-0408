"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface Friend {
  name: string
  email: string
}

export default function ReferPage() {
  return (
    <Suspense>
      <ReferPageContent />
    </Suspense>
  )
}

function ReferPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [referrerName, setReferrerName] = useState("")
  const [referrerEmail, setReferrerEmail] = useState("")
  const [personalNote, setPersonalNote] = useState("")
  const [friends, setFriends] = useState<Friend[]>([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    // TEST MODE: Bypass token validation
    // In production, this should validate against the database
    setIsValidating(false)
    setIsValid(true)
    setReferrerName("Carven Izaks") // Default test name
    setReferrerEmail("carvenjizaks@gmail.com") // Default test email
    
    // Original validation code (commented out for testing):
    /*
    if (!token) {
      setIsValidating(false)
      setError("No referral token provided")
      return
    }

    try {
      const response = await fetch("/api/goc26/referral/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setIsValid(true)
        setReferrerName(data.referrerName || "")
        setReferrerEmail(data.referrerEmail || "")
      } else {
        setError(data.error || "Invalid or expired link")
      }
    } catch (err) {
      setError("Failed to validate token")
    } finally {
      setIsValidating(false)
    }
    */
  }

  const handleFriendChange = (index: number, field: keyof Friend, value: string) => {
    const newFriends = [...friends]
    newFriends[index][field] = value
    setFriends(newFriends)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const validFriends = friends.filter(f => f.name && f.email)
    
    if (validFriends.length === 0) {
      setError("Please add at least one friend")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/goc26/referral/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerName,
          referrerEmail,
          personalNote,
          friends: validFriends,
          token
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSuccess(true)
      } else {
        setError(data.error || "Failed to send invitations")
      }
    } catch (err) {
      setError("An error occurred while sending invitations")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#f5ede4]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#3D2314]" />
            <p className="text-[#3D2314]">Validating your link...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#f5ede4]">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-[#3D2314] mb-2">Invalid or Expired Link</h1>
            <p className="text-[#5a3a28] mb-6">{error || "This referral link is no longer valid."}</p>
            <Button 
              onClick={() => window.location.href = "/events"}
              className="bg-[#3D2314] hover:bg-[#5a3a28] text-white"
            >
              Go to Events Page
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f5ede4]">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-[#3D2314] mb-2">Invitations Sent!</h1>
            <p className="text-[#5a3a28] mb-6">
              Your friends have been invited to GOC2026. Thank you for spreading the word!
            </p>
            <Button 
              onClick={() => window.location.href = "/events/goc26"}
              className="bg-[#3D2314] hover:bg-[#5a3a28] text-white"
            >
              Back to GOC2026
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5ede4]">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D2314] to-[#5a3a28] p-8 text-center">
              <p className="text-[#D4A574] text-sm uppercase tracking-wider mb-2">The Fatherhood Foundation</p>
              <h1 className="text-3xl font-bold text-[#f5ede4]">Invite Your Brothers</h1>
              <p className="text-[#f5ede4]/80 mt-2">Gathering of Champions 2026</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#3D2314]">Your Information</h2>
                <div>
                  <Label htmlFor="referrerName">Your Name</Label>
                  <Input
                    id="referrerName"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#3D2314]">Personal Message (Optional)</h2>
                <div>
                  <Textarea
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Add a personal note to your invitation..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#3D2314]">Invite Up to 3 Friends</h2>
                {friends.map((friend, index) => (
                  <div key={index} className="p-4 bg-[#f5ede4] rounded-lg space-y-3">
                    <p className="font-medium text-[#3D2314]">Friend {index + 1}</p>
                    <div>
                      <Label htmlFor={`friend-name-${index}`}>Name</Label>
                      <Input
                        id={`friend-name-${index}`}
                        value={friend.name}
                        onChange={(e) => handleFriendChange(index, "name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`friend-email-${index}`}>Email</Label>
                      <Input
                        id={`friend-email-${index}`}
                        type="email"
                        value={friend.email}
                        onChange={(e) => handleFriendChange(index, "email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3D2314] hover:bg-[#5a3a28] text-white py-6 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Invitations...
                  </>
                ) : (
                  "Send Invitations"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
