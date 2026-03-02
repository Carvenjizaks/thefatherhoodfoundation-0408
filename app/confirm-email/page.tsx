"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [contactName, setContactName] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
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
          setStatus("error")
        }
      } catch {
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <svg
                  className="w-8 h-8 text-green-600 mx-auto mb-2"
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
                <p className="text-green-800 font-medium">Subscription Active</p>
              </div>
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
              <p className="text-gray-600 mb-6">
                The confirmation link is invalid or has expired. Please try subscribing again
                or contact us for assistance.
              </p>
              <Link href="/">
                <Button className="bg-[#8B2B3E] hover:bg-[#6B1F2E] px-8">
                  Return to Homepage
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
