"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, ArrowLeft, Send, Eye, ShieldAlert } from "lucide-react"

interface Friend {
  name: string
  email: string
}

interface ReferrerInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  registrationCode: string
}

// Loading fallback for Suspense
function ReferPageLoading() {
  return (
    <div className="min-h-screen bg-[#f5ede4]">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-[#8B6F47]/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-[#8B6F47]/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Access Denied Component
function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#f5ede4]">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#3D2314] mb-4">Access Restricted</h1>
          <p className="text-[#5a3a28] mb-6">
            This referral page is private and can only be accessed through your personal invitation link.
          </p>
          <p className="text-sm text-[#8B6B5A] mb-8">
            If you&apos;ve registered for Gathering of Champions 2026, you&apos;ll receive an email with your unique referral link the day after registration.
          </p>
          <Button 
            onClick={() => window.location.href = "/events"}
            className="bg-[#3D2314] hover:bg-[#5a3a28] text-[#f5ede4]"
          >
            View Events
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Main component with search params
function ReferPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  
  const [friends, setFriends] = useState<Friend[]>([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" }
  ])
  const [personalNote, setPersonalNote] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null)

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValidating(false)
        setIsValidToken(false)
        return
      }

      try {
        const response = await fetch(`/api/goc26/referral/validate-token?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setIsValidToken(true)
          setReferrerInfo(data.referrer)
        } else {
          setIsValidToken(false)
        }
      } catch (error) {
        console.error("Token validation error:", error)
        setIsValidToken(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const updateFriend = (index: number, field: keyof Friend, value: string) => {
    const updated = [...friends]
    updated[index] = { ...updated[index], [field]: value }
    setFriends(updated)
  }

  const filledFriends = friends.filter(f => f.name.trim() && f.email.trim() && f.email.includes("@"))
  const isValid = filledFriends.length > 0 && referrerInfo

  const handlePreview = () => {
    if (isValid) setShowPreview(true)
  }

  const handleSend = async () => {
    if (!referrerInfo) return
    
    setIsSending(true)
    try {
      const response = await fetch("/api/goc26/referral/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerName: `${referrerInfo.firstName} ${referrerInfo.lastName}`,
          referrerId: referrerInfo.id,
          referrerEmail: referrerInfo.email,
          personalNote,
          friends: filledFriends,
          token,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send invitations")
      }
      
      setSent(true)
    } catch (error) {
      console.error("Error sending referrals:", error)
      alert(error instanceof Error ? error.message : "Failed to send invitations. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  // Show loading state while validating
  if (isValidating) {
    return <ReferPageLoading />
  }

  // Show access denied if no valid token
  if (!isValidToken || !referrerInfo) {
    return <AccessDenied />
  }

  const referrerFullName = `${referrerInfo.firstName} ${referrerInfo.lastName}`

  if (sent) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#3D2314] mb-4">Invitations Sent!</h1>
            <p className="text-[#5a3a28] mb-6">
              Your friends will receive their personalized invitations shortly.
            </p>
            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-[#8B6B5A] mb-3">You invited:</p>
              {filledFriends.map((friend, i) => (
                <p key={i} className="text-[#3D2314] mb-1">• {friend.name} ({friend.email})</p>
              ))}
            </div>
            <p className="text-sm text-[#8B6B5A] mb-6">
              Thank you for helping spread the word about GOC26, {referrerInfo.firstName}!
            </p>
            <Button 
              onClick={() => window.location.href = "/events"}
              className="bg-[#3D2314] hover:bg-[#5a3a28] text-[#f5ede4]"
            >
              Back to Events
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (showPreview) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setShowPreview(false)}
              className="flex items-center text-[#3D2314] mb-6 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to form
            </button>
            
            <h1 className="text-2xl font-bold text-[#3D2314] mb-2">Preview Invitations</h1>
            <p className="text-[#5a3a28] mb-8">This is how your invitation will look to each friend:</p>
            
            {filledFriends.map((friend, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-[#3D2314] px-4 py-2">
                  <p className="text-[#D4A574] text-sm">To: {friend.name} &lt;{friend.email}&gt;</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#8B6B5A] mb-2">Subject: {referrerFullName} thinks you&apos;d benefit from this...</p>
                  <hr className="my-4" />
                  <div className="text-[#3D2314] space-y-4">
                    <p>Hey {friend.name.split(" ")[0]},</p>
                    <p>
                      It&apos;s <strong>{referrerFullName}</strong>. I just registered for <strong>Gathering of Champions 2026</strong> — 
                      a men&apos;s conference happening July 17-18 in Windhoek.
                    </p>
                    {personalNote && (
                      <div className="bg-[#f5ede4] border-l-4 border-[#D4A574] p-4 rounded-r italic">
                        <p className="text-[#5a3a28]">&quot;{personalNote}&quot;</p>
                        <p className="text-sm text-[#8B6B5A] mt-2">— {referrerFullName}</p>
                      </div>
                    )}
                    <p>
                      I immediately thought of you. This isn&apos;t just another event. It&apos;s for men who are serious 
                      about stepping up — in their homes, their work, their lives.
                    </p>
                    <p>
                      I think you&apos;d get a lot out of it. And honestly? I think you&apos;d bring something to the room too.
                    </p>
                    <p>
                      <a href="https://thefatherhoodfoundation.org/events" style={{ color: "#8B6F47", textDecoration: "underline" }}>
                        Check it out here
                      </a>
                    </p>
                    <p>Hope to see you there,<br/><strong>{referrerFullName}</strong></p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="flex-1 border-[#3D2314] text-[#3D2314]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button 
                onClick={handleSend}
                disabled={isSending}
                className="flex-1 bg-[#3D2314] hover:bg-[#5a3a28] text-[#f5ede4]"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Invitations</>
                )}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">
          <div className="bg-[#D4A574]/20 border border-[#D4A574]/40 rounded-lg p-4 mb-6">
            <p className="text-[#3D2314] text-sm">
              <strong>Hi {referrerInfo.firstName}!</strong> You&apos;re inviting friends to Gathering of Champions 2026.
            </p>
          </div>
          
          <h1 className="text-3xl font-bold text-[#3D2314] mb-2">Invite Up to 3 Men</h1>
          <p className="text-[#5a3a28] mb-8">
            Think of men who need this. Enter their details below. You can invite 1, 2, or all 3.
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Label htmlFor="personalNote" className="text-[#3D2314] font-medium">
              Personal Note <span className="text-[#8B6B5A] font-normal">(optional but recommended)</span>
            </Label>
            <p className="text-sm text-[#8B6B5A] mt-1 mb-3">
              Add a personal message to make your invitation more meaningful
            </p>
            <textarea
              id="personalNote"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="e.g. I've been thinking about you lately and this event reminded me of our conversations about being better men. Would mean a lot to have you there with me."
              className="w-full min-h-[100px] px-3 py-2 border border-[#8B6F47] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D2314] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-[#8B6B5A] mt-1 text-right">{personalNote.length}/500</p>
          </div>
          
          {friends.map((friend, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-lg font-semibold text-[#3D2314] mb-4">
                Friend {index + 1} {index === 0 && <span className="text-[#8B6B5A] font-normal text-sm">(required)</span>}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`name-${index}`} className="text-[#3D2314]">
                    Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    value={friend.name}
                    onChange={(e) => updateFriend(index, "name", e.target.value)}
                    placeholder="e.g. Mike Johnson"
                    className="mt-1 border-[#8B6F47] focus:ring-[#3D2314]"
                  />
                </div>
                <div>
                  <Label htmlFor={`email-${index}`} className="text-[#3D2314]">
                    Email
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={friend.email}
                    onChange={(e) => updateFriend(index, "email", e.target.value)}
                    placeholder="mike@example.com"
                    className="mt-1 border-[#8B6F47] focus:ring-[#3D2314]"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            onClick={handlePreview}
            disabled={!isValid}
            className="w-full bg-[#3D2314] hover:bg-[#5a3a28] text-[#f5ede4] py-6 text-lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview Invitations
          </Button>
          
          {!isValid && (
            <p className="text-center text-sm text-[#8B6B5A] mt-4">
              Fill in at least one friend&apos;s details to continue
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// Wrapper component with Suspense
export default function ReferPage() {
  return (
    <div className="min-h-screen bg-[#f5ede4]">
      <Suspense fallback={<ReferPageLoading />}>
        <ReferPageContent />
      </Suspense>
    </div>
  )
}
