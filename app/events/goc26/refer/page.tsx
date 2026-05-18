"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, ArrowLeft, Send, Share2 } from "lucide-react"
import Link from "next/link"

interface Friend {
  name: string
  email: string
}

function ReferPageContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  
  const [friends, setFriends] = useState<Friend[]>([{ name: "", email: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [senderName, setSenderName] = useState("")

  const addFriend = () => setFriends([...friends, { name: "", email: "" }])
  
  const updateFriend = (index: number, field: keyof Friend, value: string) => {
    const updated = [...friends]
    updated[index][field] = value
    setFriends(updated)
  }

  const removeFriend = (index: number) => {
    if (friends.length > 1) setFriends(friends.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const validFriends = friends.filter(f => f.name && f.email)
      
      for (const friend of validFriends) {
        await fetch("/api/goc26/referral/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referrerName: senderName,
            referrerCode: code,
            friendName: friend.name,
            friendEmail: friend.email,
          }),
        })
      }
      
      setSubmitSuccess(true)
    } catch (err) {
      alert("Failed to send invitations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareOnWhatsApp = () => {
    const message = `Join me at GOC26 - Gathering of Champions 2026! Register here: https://thefatherhoodfoundation.org/events/goc26?ref=${code}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const copyLink = () => {
    const link = `https://thefatherhoodfoundation.org/events/goc26?ref=${code}`
    navigator.clipboard.writeText(link)
    alert("Link copied to clipboard!")
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-[#f5ede4]">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-[#8B2B3E] mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please register first to get your referral code.</p>
            <Link href="/events/goc26">
              <Button className="bg-[#8B2B3E]">Register Now</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#f5ede4]">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#8B2B3E] mb-4">Invitations Sent!</h1>
            <p className="text-gray-600 mb-8">Your friends will receive an email with your personal invitation.</p>
            <div className="space-y-4">
              <Button onClick={shareOnWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
                <Share2 className="w-5 h-5 mr-2" /> Share on WhatsApp
              </Button>
              <Button onClick={copyLink} variant="outline" className="w-full">
                Copy Referral Link
              </Button>
            </div>
            <Link href="/events/goc26" className="block mt-8 text-[#8B2B3E] hover:underline">
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to GOC26
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5ede4]">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Link href="/events/goc26" className="text-[#8B2B3E] hover:underline mb-6 inline-block">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to GOC26
          </Link>
          
          <h1 className="text-3xl font-bold text-[#8B2B3E] mb-2">Invite Your Friends</h1>
          <p className="text-gray-600 mb-8">Share GOC26 with men who need to be there. Enter their details below.</p>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input 
                  value={senderName} 
                  onChange={(e) => setSenderName(e.target.value)} 
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium">Friends to Invite</label>
                {friends.map((friend, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={friend.name} 
                      onChange={(e) => updateFriend(index, "name", e.target.value)} 
                      placeholder="Friend's name"
                      required
                    />
                    <Input 
                      value={friend.email} 
                      onChange={(e) => updateFriend(index, "email", e.target.value)} 
                      placeholder="Friend's email"
                      type="email"
                      required
                    />
                    {friends.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => removeFriend(index)}>Remove</Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFriend} className="w-full">
                  + Add Another Friend
                </Button>
              </div>
              
              <Button type="submit" className="w-full bg-[#8B2B3E]" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Invitations</>}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-4">Or share your referral link:</p>
              <div className="flex gap-2">
                <Input value={`https://thefatherhoodfoundation.org/events/goc26?ref=${code}`} readOnly />
                <Button onClick={copyLink} variant="outline">Copy</Button>
              </div>
              <Button onClick={shareOnWhatsApp} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                <Share2 className="w-5 h-5 mr-2" /> Share on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ReferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReferPageContent />
    </Suspense>
  )
}
