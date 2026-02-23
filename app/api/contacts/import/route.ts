import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const organizationId = formData.get('organizationId') as string | null

    if (!file || !organizationId) {
      return NextResponse.json({ error: 'File and organizationId are required' }, { status: 400 })
    }

    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 })
    }

    // Fetch existing tags for this org (for tag column mapping)
    const { data: existingTags } = await supabase
      .from('contact_tags')
      .select('id, name')
      .eq('organization_id', organizationId)

    const tagMap = new Map((existingTags || []).map((t) => [t.name.toLowerCase(), t.id]))

    let imported = 0

    for (const row of rows) {
      const firstName = row['first_name'] || row['firstname'] || row['first name'] || ''
      const lastName = row['last_name'] || row['lastname'] || row['last name'] || ''
      const email = (row['email'] || '').trim().toLowerCase()
      const phone = (row['phone'] || row['telephone'] || row['mobile'] || '').trim()
      const city = (row['city'] || row['town'] || '').trim()
      const tagString = row['tags'] || row['tag'] || row['groups'] || row['group'] || ''

      if (!firstName && !lastName && !email) continue

      // Upsert contact
      let contactId: string | null = null

      if (email) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id')
          .eq('organization_id', organizationId)
          .ilike('email', email)
          .single()

        if (existing) {
          contactId = existing.id
          await supabase
            .from('contacts')
            .update({
              first_name: firstName || undefined,
              last_name: lastName || undefined,
              phone: phone || undefined,
              city: city || undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId)
        }
      }

      if (!contactId) {
        const { data: inserted } = await supabase
          .from('contacts')
          .insert({
            organization_id: organizationId,
            first_name: firstName,
            last_name: lastName,
            email: email || null,
            phone: phone || null,
            city: city || null,
            status: 'active',
          })
          .select('id')
          .single()

        contactId = inserted?.id ?? null
      }

      // Assign tags
      if (contactId && tagString) {
        const tagNames = tagString.split(/[;,]/).map((t: string) => t.trim()).filter(Boolean)

        for (const name of tagNames) {
          let tagId = tagMap.get(name.toLowerCase())

          // Create tag if it doesn't exist
          if (!tagId) {
            const { data: newTag } = await supabase
              .from('contact_tags')
              .insert({ organization_id: organizationId, name, color: '#6366f1' })
              .select('id')
              .single()

            if (newTag) {
              tagId = newTag.id
              tagMap.set(name.toLowerCase(), tagId)
            }
          }

          if (tagId) {
            // Check if assignment already exists
            const { data: existingAssignment } = await supabase
              .from('contact_tag_assignments')
              .select('id')
              .eq('contact_id', contactId)
              .eq('tag_id', tagId)
              .single()

            if (!existingAssignment) {
              await supabase
                .from('contact_tag_assignments')
                .insert({ contact_id: contactId, tag_id: tagId })
            }
          }
        }
      }

      imported++
    }

    return NextResponse.json({ count: imported })
  } catch (err: any) {
    console.error('Import error:', err)
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 500 })
  }
}
