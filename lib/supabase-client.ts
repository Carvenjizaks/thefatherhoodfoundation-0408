"use client"

let supabaseClient: any = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = {
    from: (table: string) => ({
      insert: async (data: any) => {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const error = await response.json()
            return { data: null, error }
          }

          return { data: data, error: null }
        } catch (error) {
          return { data: null, error: { message: (error as Error).message } }
        }
      },
    }),
  }

  return supabaseClient
}
