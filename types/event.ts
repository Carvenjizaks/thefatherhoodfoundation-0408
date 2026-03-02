export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO 8601 format
  location: string
  image: string
  category: "Workshop" | "Conference" | "Webinar" | "Table Talk" | "Community Event"
}

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4"

export interface QuarterInfo {
  quarter: Quarter
  year: number
  months: string
  startMonth: number
  endMonth: number
}
