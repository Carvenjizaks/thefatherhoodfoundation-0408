import { CalendarX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { QuarterInfo } from "@/types/event"

interface QuarterPlaceholderProps {
  quarterInfo: QuarterInfo
}

export function QuarterPlaceholder({ quarterInfo }: QuarterPlaceholderProps) {
  return (
    <Card className="border-dashed border-2 bg-muted/30">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <CalendarX className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-medium text-muted-foreground">
            No events scheduled for {quarterInfo.quarter} {quarterInfo.year}
          </p>
          <p className="text-sm text-muted-foreground/70">{quarterInfo.months}</p>
        </div>
      </CardContent>
    </Card>
  )
}
