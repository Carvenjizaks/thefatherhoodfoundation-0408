import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ConfirmEmailContent from "./confirm-email-content"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-[#8B2B3E] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmEmailContent />
    </Suspense>
  )
}
