"use client"

import { getTagColor } from "@/lib/tags"

interface TagBadgesProps {
  tags: string[] | null | undefined
  className?: string
  size?: "sm" | "md"
  emptyLabel?: string
}

/**
 * Renders an array of tag strings as small colored pill badges.
 * Core tags (MGM, FF-NL, TT4Men, Event) get distinct brand colors;
 * event-specific tags (e.g. "GoC-2026") fall back to a neutral gray.
 */
export function TagBadges({ tags, className = "", size = "sm", emptyLabel = "—" }: TagBadgesProps) {
  if (!tags || tags.length === 0) {
    return <span className="text-xs text-muted-foreground">{emptyLabel}</span>
  }

  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag) => {
        const c = getTagColor(tag)
        return (
          <span
            key={tag}
            className={`inline-flex items-center font-semibold rounded-full border ${padding}`}
            style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
          >
            {tag}
          </span>
        )
      })}
    </div>
  )
}
