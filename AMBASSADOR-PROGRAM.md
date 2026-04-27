# Ambassador Program System

A reusable ambassador/referral program built for The Fatherhood Foundation website.

## What It Does

- **Ambassador Registration**: People sign up to become ambassadors
- **Unique Referral Links**: Each ambassador gets a unique code
- **Dashboard**: Ambassadors track their progress and see who they invited
- **Admin Panel**: You manage all ambassadors and see the leaderboard
- **Multi-Event Support**: Use for MGM26, future conferences, or any event

## URLs

| Page | URL |
|------|-----|
| Registration | `/ambassadors` |
| Dashboard | `/ambassadors/dashboard?code=AMB123` |
| Admin Panel | `/ambassadors/admin` |

## Setup Steps

### 1. Database Setup

Run the SQL in `supabase/ambassador-schema.sql` in your Supabase SQL Editor.

This creates:
- `ambassadors` table
- `event_registrations` table  
- `events` table
- Indexes and security policies

### 2. Environment Variables

Make sure these are set in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GLOBALCONTROL_API_KEY=your_globalcontrol_key (optional)
```

### 3. Deploy

Push to GitHub and Vercel will auto-deploy.

## How It Works

### For Ambassadors:
1. Visit `/ambassadors` and fill out the form
2. Get their unique referral code (e.g., `AMB123ABC`)
3. Access their dashboard at `/ambassadors/dashboard?code=AMB123ABC`
4. Copy their invite link and share it
5. Track progress in real-time

### For You (Admin):
1. Visit `/ambassadors/admin`
2. See all ambassadors and their progress
3. View leaderboard (who's inviting the most)
4. Send broadcast messages
5. Export data

### For Couples Being Invited:
1. Click ambassador's link: `thefatherhoodfoundation.org/mgm26?ref=AMB123ABC`
2. Register for the event
3. Registration is tracked back to the ambassador

## Creating New Events

To use this for a future event (not MGM26):

1. Add the event to the `events` table:
```sql
INSERT INTO events (code, name, description, start_date, end_date, venue)
VALUES ('EVENT2027', 'Your Event Name', 'Description', '2027-01-01', '2027-01-03', 'Venue');
```

2. Update the registration page to use the new event code

3. Ambassadors can now sign up for the new event

## Files Created

```
app/
  ambassadors/
    page.tsx              # Registration page
    dashboard/
      page.tsx            # Ambassador dashboard
    admin/
      page.tsx            # Admin panel
  api/
    ambassadors/
      register/
        route.ts          # Registration API
      dashboard/
        route.ts          # Dashboard data API
      admin/
        route.ts          # Admin data API

supabase/
  ambassador-schema.sql   # Database setup
```

## Next Steps

1. Run the database schema
2. Test the registration flow
3. Share `/ambassadors` link with your 20 selected people
4. Watch the dashboard fill up!

## Future Enhancements

- [ ] Automated WhatsApp notifications
- [ ] Email templates for ambassadors
- [ ] Payment integration for paid events
- [ ] Advanced analytics
- [ ] Mobile app for ambassadors
