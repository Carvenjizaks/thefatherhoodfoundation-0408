import { createClient as createSupabaseClient } from '@supabase/supabase-js'

interface UpsertContactParams {
  organizationId: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  tags?: string[]
  involvement?: Record<string, boolean>
}

interface UpsertContactResult {
  contactId: string
  isNew: boolean
}

/**
 * Find-or-create a contact by email (primary) or phone (fallback).
 * If found, merges missing fields and updates involvement.
 * If not found, creates a new contact record.
 * Returns the contact ID and whether it was newly created.
 */
export async function upsertContact(
  params: UpsertContactParams
): Promise<UpsertContactResult> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const {
    organizationId,
    firstName,
    lastName,
    email,
    phone,
    tags = [],
    involvement = {},
  } = params

  const normalizedEmail = email?.trim().toLowerCase() || null
  const normalizedPhone = phone?.trim() || null

  // --- Try to find existing contact by email first, then phone ---
  let existingContact: Record<string, unknown> | null = null

  if (normalizedEmail) {
    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, involvement')
      .eq('organization_id', organizationId)
      .eq('email', normalizedEmail)
      .single()
    existingContact = data
  }

  if (!existingContact && normalizedPhone) {
    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, involvement')
      .eq('organization_id', organizationId)
      .eq('phone', normalizedPhone)
      .single()
    existingContact = data
  }

  // --- Found: merge missing fields + update involvement ---
  if (existingContact) {
    const updates: Record<string, unknown> = {}

    // Fill in missing fields
    if (!existingContact.phone && normalizedPhone) updates.phone = normalizedPhone
    if (!existingContact.email && normalizedEmail) updates.email = normalizedEmail
    if (!existingContact.first_name && firstName) updates.first_name = firstName.trim()
    if (!existingContact.last_name && lastName) updates.last_name = lastName.trim()

    // Merge involvement flags
    const currentInvolvement = (existingContact.involvement as Record<string, boolean>) || {}
    const mergedInvolvement = { ...currentInvolvement, ...involvement }
    if (JSON.stringify(mergedInvolvement) !== JSON.stringify(currentInvolvement)) {
      updates.involvement = mergedInvolvement
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString()
      await supabase
        .from('contacts')
        .update(updates)
        .eq('id', existingContact.id)
    }

    // Add any new tags
    if (tags.length > 0) {
      await addTagsToContact(supabase, existingContact.id as string, organizationId, tags)
    }

    return { contactId: existingContact.id as string, isNew: false }
  }

  // --- Not found: insert new contact ---
  const { data: newContact, error } = await supabase
    .from('contacts')
    .insert({
      organization_id: organizationId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      status: 'active',
      involvement: involvement,
    })
    .select('id')
    .single()

  if (error || !newContact) {
    throw new Error(`Failed to create contact: ${error?.message || 'Unknown error'}`)
  }

  // Add tags
  if (tags.length > 0) {
    await addTagsToContact(supabase, newContact.id, organizationId, tags)
  }

  return { contactId: newContact.id, isNew: true }
}

/**
 * Adds tags to a contact, creating any tags that don't exist.
 */
async function addTagsToContact(
  supabase: ReturnType<typeof createSupabaseClient>,
  contactId: string,
  organizationId: string,
  tagNames: string[]
) {
  for (const tagName of tagNames) {
    // Find or create the tag
    let tagId: string | null = null

    const { data: existingTag } = await supabase
      .from('contact_tags')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('name', tagName)
      .single()

    if (existingTag) {
      tagId = existingTag.id
    } else {
      const { data: newTag } = await supabase
        .from('contact_tags')
        .insert({ organization_id: organizationId, name: tagName, color: '#3B82F6' })
        .select('id')
        .single()
      tagId = newTag?.id || null
    }

    if (tagId) {
      // Link tag to contact (ignore duplicate)
      await supabase
        .from('contact_tag_assignments')
        .upsert(
          { contact_id: contactId, tag_id: tagId },
          { onConflict: 'contact_id,tag_id' }
        )
    }
  }
}
