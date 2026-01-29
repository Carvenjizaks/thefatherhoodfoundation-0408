// Pre-built Event Program Templates
// Based on common church service structures

export interface TemplateItem {
  title: string
  description: string
  duration_minutes: number
  item_type: string
  typical_roles: { role_name: string; description: string }[]
}

export interface EventTemplate {
  id: string
  name: string
  description: string
  category: string
  total_duration: number
  items: TemplateItem[]
}

export const SUNDAY_SERVICE_TEMPLATE: EventTemplate = {
  id: 'sunday-service',
  name: 'Sunday Service',
  description: 'Complete Sunday worship service with pre-service, main service, and post-service activities',
  category: 'Weekly Service',
  total_duration: 195,
  items: [
    {
      title: 'Preparing Church for Service',
      description: 'Ensure church and toilets are clean for service',
      duration_minutes: 30,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Setup Team Lead', description: 'Oversee preparation' }
      ]
    },
    {
      title: 'Service Co-Ordinator Check',
      description: 'Ensure worship service checklist is followed and everything is in order',
      duration_minutes: 10,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Service Coordinator', description: 'Run through checklist' }
      ]
    },
    {
      title: 'Pre-Worship Rehearsal',
      description: 'Worship dry-run and media team preparation',
      duration_minutes: 10,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Worship Leader', description: 'Lead rehearsal' },
        { role_name: 'Media Team', description: 'Prepare equipment' }
      ]
    },
    {
      title: 'Welcome Music',
      description: 'Media team plays welcoming music to create atmosphere',
      duration_minutes: 15,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Media Operator', description: 'Play welcome music' }
      ]
    },
    {
      title: 'Information Desk Setup',
      description: 'Information desk opens to assist guests',
      duration_minutes: 0,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Info Desk Volunteer', description: 'Assist visitors' }
      ]
    },
    {
      title: 'Ushers Take Positions',
      description: 'Ushers stand ready at doors to receive guests',
      duration_minutes: 10,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Head Usher', description: 'Coordinate team' },
        { role_name: 'Usher Team', description: 'Welcome at doors' }
      ]
    },
    {
      title: 'Countdown Timer',
      description: '5-minute countdown to service start',
      duration_minutes: 5,
      item_type: 'transition',
      typical_roles: [
        { role_name: 'Media Operator', description: 'Play countdown' }
      ]
    },
    {
      title: 'Praise & Worship',
      description: 'Opening worship session',
      duration_minutes: 15,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Worship Leader', description: 'Lead worship' },
        { role_name: 'Worship Team', description: 'Support worship' }
      ]
    },
    {
      title: 'Opening Prayer',
      description: 'Prayer to begin service',
      duration_minutes: 3,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Prayer Leader', description: 'Lead opening prayer' }
      ]
    },
    {
      title: 'Welcome & Announcements',
      description: 'Welcome guests and share church announcements',
      duration_minutes: 10,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Host', description: 'Welcome and announce' }
      ]
    },
    {
      title: 'Offering Message',
      description: 'Brief message about giving',
      duration_minutes: 5,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Minister', description: 'Share offering message' }
      ]
    },
    {
      title: 'Offering Prayer',
      description: 'Prayer for tithes and offerings',
      duration_minutes: 2,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Minister', description: 'Pray for offering' }
      ]
    },
    {
      title: 'Receive Offering',
      description: 'Collect tithes and offerings',
      duration_minutes: 5,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Offering Team', description: 'Collect offering' }
      ]
    },
    {
      title: 'PowerZone Dismissal',
      description: 'Children leave for PowerZone',
      duration_minutes: 0,
      item_type: 'transition',
      typical_roles: [
        { role_name: 'Children\'s Ministry', description: 'Lead children out' }
      ]
    },
    {
      title: 'Offering Count',
      description: 'Count tithes and offerings received',
      duration_minutes: 5,
      item_type: 'break',
      typical_roles: [
        { role_name: 'Counters', description: 'Count offering' }
      ]
    },
    {
      title: 'Sermon',
      description: 'Main teaching message',
      duration_minutes: 30,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Speaker', description: 'Deliver sermon' },
        { role_name: 'Media Team', description: 'Display verses/slides' }
      ]
    },
    {
      title: 'Altar Call',
      description: 'Ministry and prayer time',
      duration_minutes: 0,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Ministry Team', description: 'Pray with people' },
        { role_name: 'Worship Team', description: 'Play softly' }
      ]
    },
    {
      title: 'Closing Prayer',
      description: 'Final prayer to close service',
      duration_minutes: 2,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Minister', description: 'Close in prayer' }
      ]
    },
    {
      title: 'Closing Song',
      description: 'Final worship song',
      duration_minutes: 5,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Worship Team', description: 'Play closing song' }
      ]
    },
    {
      title: 'Fellowship',
      description: 'Post-service refreshments and connection',
      duration_minutes: 15,
      item_type: 'break',
      typical_roles: [
        { role_name: 'Fellowship Team', description: 'Serve refreshments' }
      ]
    },
    {
      title: 'Clean Church',
      description: 'Clean up church and facilities',
      duration_minutes: 15,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Cleanup Team', description: 'Clean and tidy' }
      ]
    }
  ]
}

export const SPECIAL_EVENT_TEMPLATE: EventTemplate = {
  id: 'special-event',
  name: 'Special Event Service',
  description: 'Sunday service with special event (Baby Dedication, Baptism, etc.)',
  category: 'Special Service',
  total_duration: 205,
  items: [
    ...SUNDAY_SERVICE_TEMPLATE.items.slice(0, 15), // All items up to offering count
    {
      title: 'Special Event Segment',
      description: 'Baby Dedication, Baptism, or other special ceremony',
      duration_minutes: 10,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Officiating Minister', description: 'Lead ceremony' }
      ]
    },
    ...SUNDAY_SERVICE_TEMPLATE.items.slice(15) // Rest of the service
  ]
}

export const MIDWEEK_SERVICE_TEMPLATE: EventTemplate = {
  id: 'midweek-service',
  name: 'Midweek Service',
  description: 'Simplified midweek service structure',
  category: 'Weekly Service',
  total_duration: 90,
  items: [
    {
      title: 'Setup & Welcome',
      description: 'Prepare space and welcome attendees',
      duration_minutes: 15,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Setup Team', description: 'Prepare venue' }
      ]
    },
    {
      title: 'Opening Worship',
      description: 'Brief worship time',
      duration_minutes: 10,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Worship Leader', description: 'Lead worship' }
      ]
    },
    {
      title: 'Opening Prayer',
      description: 'Prayer to begin',
      duration_minutes: 3,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Prayer Leader', description: 'Open in prayer' }
      ]
    },
    {
      title: 'Teaching/Bible Study',
      description: 'Main teaching session',
      duration_minutes: 40,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Teacher', description: 'Lead study' }
      ]
    },
    {
      title: 'Discussion Time',
      description: 'Group discussion and questions',
      duration_minutes: 15,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Facilitator', description: 'Guide discussion' }
      ]
    },
    {
      title: 'Closing Prayer',
      description: 'Final prayer',
      duration_minutes: 2,
      item_type: 'session',
      typical_roles: [
        { role_name: 'Leader', description: 'Close in prayer' }
      ]
    },
    {
      title: 'Cleanup',
      description: 'Clean and pack up',
      duration_minutes: 5,
      item_type: 'setup',
      typical_roles: [
        { role_name: 'Cleanup Team', description: 'Tidy venue' }
      ]
    }
  ]
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  SUNDAY_SERVICE_TEMPLATE,
  SPECIAL_EVENT_TEMPLATE,
  MIDWEEK_SERVICE_TEMPLATE
]

export function getTemplateById(id: string): EventTemplate | undefined {
  return EVENT_TEMPLATES.find(t => t.id === id)
}

export function calculateStartTimes(items: TemplateItem[], startTime: string): { start_time: string; end_time: string }[] {
  const times: { start_time: string; end_time: string }[] = []
  let currentTime = startTime
  
  items.forEach(item => {
    const [hours, minutes] = currentTime.split(':').map(Number)
    const startDate = new Date(2000, 0, 1, hours, minutes)
    const endDate = new Date(startDate.getTime() + item.duration_minutes * 60000)
    
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
    
    times.push({ start_time: currentTime, end_time: endTime })
    currentTime = endTime
  })
  
  return times
}
