# GOC2026 Referral System - Implementation Summary

## Overview
Complete referral system for Gathering of Champions 2026 that triggers 24 hours after registration.

## Files Created

### 1. Email Templates

#### `/emails/goc2026-referral-request.html`
- **Purpose**: Email sent to registrant asking them to invite 3 men
- **Trigger**: 24 hours after registration
- **CTA**: "Invite 3 Men" button linking to referral form
- **Personalization**: Uses registrant's first name

#### `/emails/goc2026-friend-invitation.html`
- **Purpose**: Personal invitation sent to friends
- **From**: "[Referrer Name] via The Fatherhood Foundation"
- **Subject**: "[Referrer Name] thinks you'd benefit from this..."
- **Features**: Shows referrer's initial, personal message, event details

### 2. Referral Form Page

#### `/app/events/goc26/refer/page.tsx`
- **Route**: `/events/goc26/refer?token={registrationId}`
- **Fields**:
  - Your Name (optional)
  - Your Email (optional)
  - Personal Message (optional)
  - Friend 1: Name, Email
  - Friend 2: Name, Email
  - Friend 3: Name, Email
- **Features**:
  - Preview section showing how invitation email will look
  - Send button to dispatch invitations
  - Success state with confirmation

### 3. API Endpoints

#### `/app/api/goc26/referral/preview/route.ts`
- **Method**: POST
- **Purpose**: Returns invitation preview HTML
- **Body**: `{ referrerName, friendName, personalMessage }`
- **Response**: `{ referrerName, friendName, html }`

#### `/app/api/goc26/referral/send/route.ts`
- **Method**: POST
- **Purpose**: Sends invitations to 3 friends
- **Body**: `{ token, referrerName, referrerEmail, personalMessage, friends[] }`
- **Actions**:
  - Sends personalized email to each friend
  - Stores referral records in database
  - Returns success count

### 4. Database Schema

#### `/scripts/create-goc26-referrals-table.sql`
```sql
-- New table: goc26_referrals
- id (UUID, primary key)
- referrer_email (TEXT)
- referrer_name (TEXT)
- friend_name (TEXT, required)
- friend_email (TEXT, required)
- personal_message (TEXT)
- status (TEXT: sent/opened/clicked/registered)
- sent_at (TIMESTAMPTZ)
- opened_at (TIMESTAMPTZ)
- clicked_at (TIMESTAMPTZ)
- registered_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

-- Added to event_registrations:
- referral_email_sent (BOOLEAN)
- referral_email_sent_at (TIMESTAMPTZ)
```

### 5. 24-Hour Trigger Script

#### `/scripts/send-referral-emails.ts`
- **Purpose**: Finds registrations from ~24 hours ago and sends referral request emails
- **Query**: Registrations between 23-25 hours ago where `referral_email_sent IS NULL`
- **Action**:
  1. Finds qualifying GOC2026 registrations
  2. Sends referral request email to each registrant
  3. Marks `referral_email_sent = true`
- **Usage**: Run via cron every hour

## Setup Instructions

### 1. Database Setup
Run the SQL script to create the referrals table:
```bash
psql -d your_database -f scripts/create-goc26-referrals-table.sql
```

### 2. Environment Variables
Ensure these are set in your environment:
```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_API_KEY=
SMTP_CHANNEL=default
SMTP_SENDER_EMAIL=noreply@thefathersfoundations.org
SMTP_SENDER_NAME="The Fatherhood Foundation"
NEXT_PUBLIC_SITE_URL=https://thefatherhoodfoundation.org
```

### 3. Cron Job Setup
Add to your cron jobs (runs every hour):
```cron
0 * * * * cd /path/to/fatherhood-source && npx ts-node scripts/send-referral-emails.ts >> /var/log/goc26-referrals.log 2>&1
```

Or use Vercel Cron (add to vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/send-referral-emails",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Referral Flow

1. **User Registers** → Registration stored in `event_registrations`
2. **24 Hours Later** → Cron script finds registration
3. **Referral Request Email Sent** → Registrant receives email with "Invite 3 Men" CTA
4. **User Clicks CTA** → Directed to `/events/goc26/refer?token={id}`
5. **User Fills Form** → Enters up to 3 friends' details
6. **User Previews** → Sees how invitation will look
7. **User Sends** → API sends personalized emails to each friend
8. **Records Stored** → Referrals logged in `goc26_referrals` table

## Testing

### Test Preview API
```bash
curl -X POST http://localhost:3000/api/goc26/referral/preview \
  -H "Content-Type: application/json" \
  -d '{"referrerName":"John","friendName":"Mike","personalMessage":"You should come!"}'
```

### Test Send API
```bash
curl -X POST http://localhost:3000/api/goc26/referral/send \
  -H "Content-Type: application/json" \
  -d '{
    "referrerName":"John",
    "referrerEmail":"john@example.com",
    "personalMessage":"Join me at GOC!",
    "friends":[{"name":"Mike","email":"mike@example.com"}]
  }'
```

### Test 24-Hour Trigger
```bash
npx ts-node scripts/send-referral-emails.ts
```

## Integration with Existing Email Service

The referral system uses the same SMTP.com configuration as the existing `email-service.tsx`:
- SMTP_API_KEY for authentication
- SMTP_CHANNEL for routing
- Consistent from address and branding

## Security Considerations

1. **Token Validation**: The referral form accepts a token parameter (registration ID) for tracking
2. **Email Validation**: All friend emails are validated before sending
3. **Rate Limiting**: Consider adding rate limiting to the send endpoint
4. **Permission**: Users confirm they have permission to share friends' emails

## Future Enhancements

- Add referral tracking (opened, clicked, registered statuses)
- Add referral rewards/incentives
- Add admin dashboard to view referral stats
- Add reminder emails for friends who haven't registered
