import { NextRequest, NextResponse } from 'next/server'
import { upsertContact } from '@/lib/contacts/upsert-contact'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, firstName, lastName, email, phone, tags, involvement } = body

    if (!organizationId || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'organizationId, firstName, and lastName are required' },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'At least one of email or phone is required' },
        { status: 400 }
      )
    }

    const result = await upsertContact({
      organizationId,
      firstName,
      lastName,
      email,
      phone,
      tags,
      involvement,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Contact upsert error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
