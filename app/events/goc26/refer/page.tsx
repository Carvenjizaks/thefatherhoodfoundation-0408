"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, ArrowLeft, Send, Eye } from "lucide-react"

interface Friend {
  name: string
  email: string
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

// Main component with search params
function ReferPageContent() {
  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref") || "GOC-XXX"
  
  const [friends, setFriends] = useState<Friend[]>([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" }
  ])
  const [referrerName, setReferrerName] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const updateFriend = (index: number, field: keyof Friend, value: string) => {
    const updated = [...friends]
    updated[index] = { ...updated[index], [field]: value }
    setFriends(updated)
  }

  const isValid = friends.every(f => f.name.trim() && f.email.trim() && f.email.includes("@")) && referrerName.trim()

  const handlePreview = () => {
    if (isValid) setShowPreview(true)
  }

  const handleSend = async () => {
    setIsSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    setSent(true)
  }

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
              <p className="text-sm text-[#8B6B5A] mb-3">Invited:</p>
              {friends.map((friend, i) => (
                <p key={i} className="text-[#3D2314] mb-1">• {friend.name} ({friend.email})</p>
              ))}
            </div>
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
            
            {friends.map((friend, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-[#3D2314] px-4 py-2">
                  <p className="text-[#D4A574] text-sm">To: {friend.name} &lt;{friend.email}&gt;</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#8B6B5A] mb-2">Subject: {referrerName} thinks you'd benefit from this...</p>
                  <hr className="my-4" />
                  <div className="text-[#3D2314] space-y-4">
                    <p>Hey {friend.name.split(" ")[0]},</p>
                    <p>
                      It's {referrerName}. I just registered for <strong>Gathering of Champions 2026</strong> — 
                      a men's conference happening July 17-18 in Windhoek.
                    </p>
                    <p>
                      I immediately thought of you. This isn't just another event. It's for men who are serious 
                      about stepping up — in their homes, their work, their lives.
                    </p>
                    <p>
                      I think you'd get a lot out of it. And honestly? I think you'd bring something to the room too.
                    </p>
                    <p>
                      <a href="https://thefatherhoodfoundation.org/events" style={{ color: "#8B6F47", textDecoration: "underline" }}>
                        Check it out here
                      </a>
                    </p>
                    <p>Hope to see you there,<br/>{referrerName}</p>
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
          <h1 className="text-3xl font-bold text-[#3D2314] mb-2">Invite 3 Men</h1>
          <p className="text-[#5a3a28] mb-8">
            Think of men who need this. Enter their details below.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Label htmlFor="referrer" className="text-[#3D2314] font-medium">
              Your Name
            </Label>
            <Input
              id="referrer"
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              placeholder="e.g. John Smith"
              className="mt-2 border-[#8B6F47] focus:ring-[#3D2314]"
            />
          </div>
          
          {friends.map((friend, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-lg font-semibold text-[#3D2314] mb-4">
                Friend {index + 1}
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
              Fill in all fields to continue
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
