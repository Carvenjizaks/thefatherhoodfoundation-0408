import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const organizationId = searchParams.get('organizationId')
  const tagId = searchParams.get('tagId')
  const status = searchParams.get('status')

  if (!organizationId) {
    return NextResponse.json({ error: 'organizationId is required' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    let contactIds: string[] | null = null

    // If filtering by tag, get contact IDs with that tag first
    if (tagId && tagId !== 'all') {
      const { data: assignments } = await supabase
        .from('contact_tag_assignments')
        .select('contact_id')
        .eq('tag_id', tagId)

      contactIds = (assignments || []).map((a) => a.contact_id)
      if (contactIds.length === 0) {
        // Return empty CSV
        return new Response('first_name,last_name,email,phone,city,status,tags\n', {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        })
      }
    }

    // Build query
    let query = supabase
      .from('contacts')
      .select(`
        id, first_name, last_name, email, phone, city, status,
        contact_tag_assignments ( tag:contact_tags ( name ) )
      `)
      .eq('organization_id', organizationId)
      .order('last_name')

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (contactIds) {
      query = query.in('id', contactIds)
    }

    const { data: contacts, error } = await query

    if (error) throw error

    // Build CSV
    const header = 'first_name,last_name,email,phone,city,status,tags'
    const rows = (contacts || []).map((c: any) => {
      const tagNames = (c.contact_tag_assignments || [])
        .map((a: any) => a.tag?.name)
        .filter(Boolean)
        .join('; ')

      const escape = (val: string | null | undefined) => {
        if (!val) return ''
        const str = String(val)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      return [
        escape(c.first_name),
        escape(c.last_name),
        escape(c.email),
        escape(c.phone),
        escape(c.city),
        escape(c.status),
        escape(tagNames),
      ].join(',')
    })

    const csv = [header, ...rows].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 })
  }
}
