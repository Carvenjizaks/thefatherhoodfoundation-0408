"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading")
  const [contactName, setContactName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("no-token")
      return
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch("/api/confirm-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setContactName(data.firstName || "")
        } else {
          console.error("[v0] Email confirmation failed:", data.error)
          setErrorMessage(data.error || "Confirmation failed")
          setStatus("error")
        }
      } catch (err) {
        console.error("[v0] Email confirmation fetch error:", err)
        setErrorMessage("Unable to reach the server. Please check your connection and try again.")
        setStatus("error")
      }
    }

    confirmEmail()
  }, [token])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-[#8B2B3E] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-700">Confirming your email...</h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Fatherhood Foundation"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#8B2B3E] mb-3">
                Email Confirmed!
              </h2>
              {contactName && (
                <p className="text-lg text-gray-700 mb-2">
                  Thank you, <strong>{contactName}</strong>!
                </p>
              )}
              <p className="text-gray-600 mb-6">
                Your email has been successfully confirmed. You will now receive updates and
                notifications from The Fatherhood Foundation.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-blue-800 font-medium">Subscription Active</p>
              </div>
              <Link href="/">
                <Button className="bg-[#8B2B3E] hover:bg-[#6B1F2E] px-8">
                  Return to Homepage
                </Button>
              </Link>
            </>
          )}

          {status === "no-token" && (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">Missing Confirmation Token</h2>
              <p className="text-gray-600 mb-6">
                No confirmation token was found in the link. Please use the link from your confirmation email, or subscribe again.
              </p>
              <Link href="/">
                <Button className="bg-[#8B2B3E] hover:bg-[#6B1F2E] px-8">
                  Return to Homepage
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-3">Confirmation Failed</h2>
              <p className="text-gray-600 mb-4">
                {errorMessage || "The confirmation link is invalid or has expired."}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Please try clicking the link from your email again, or subscribe again to receive a new confirmation link. If the problem persists, contact us for assistance.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (token) {
                      setStatus("loading")
                      setErrorMessage("")
                      fetch("/api/confirm-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.success) {
                            setStatus("success")
                            setContactName(data.firstName || "")
                          } else {
                            setErrorMessage(data.error || "Confirmation failed")
                            setStatus("error")
                          }
                        })
                        .catch(() => {
                          setErrorMessage("Unable to reach the server. Please try again later.")
                          setStatus("error")
                        })
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-[#8B2B3E] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#6B1F2E] transition-colors"
                >
                  Try Again
                </button>
                <Link href="/">
                  <Button variant="outline" className="px-8 w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
