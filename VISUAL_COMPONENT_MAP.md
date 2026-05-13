## Email Setup Redesign - Visual Component Map

### Dialog Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Email Campaign Creator                                         │
│  Select recipients, compose your message, customize formatting  │
└─────────────────────────────────────────────────────────────────┘

┌─ Tab Navigation ────────────────────────────────────────────────┐
│ [👥 Recipients] [📝 Compose] [⚙️ Format] [👁️ Preview]          │
└─────────────────────────────────────────────────────────────────┘

┌─ Tab Content (scrollable) ──────────────────────────────────────┐
│                                                                 │
│  ┌─ Card ──────────────────────────────────────────────────┐   │
│  │ Title                                                    │   │
│  │ Description                                              │   │
│  │                                                          │   │
│  │ [Content varies by tab]                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ Footer Actions ────────────────────────────────────────────────┐
│  [Cancel]          [Preview] [💬 Send Campaign]               │
└─────────────────────────────────────────────────────────────────┘
```

---

### Tab 1: Recipients

```
┌─────────────────────────────────────────────────────┐
│ Select Recipients                                   │
│ Choose who receives this email campaign              │
└─────────────────────────────────────────────────────┘

┌─ Card ──────────────────────────────────────────────┐
│                                                      │
│  ○ [👥] Send to All                                │
│    All active contacts                              │
│                                                      │
│  ○ [👥] Select Individuals                         │
│    Pick specific people                             │
│                                                      │
│  ○ [📁] Send to Group                              │
│    Select a saved group                             │
│                                                      │
│  ○ [🏷️] Send by Tag                                │
│    All contacts with a tag                          │
│                                                      │
│  [If "Select Individuals" chosen]                   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Selected Recipients (5)                       │   │
│  │ [Search box...]                               │   │
│  │ [john smith] [jane doe] [bob jones] ...      │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [If "Send to Group" chosen]                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ Select Group ▼                                │   │
│  │ ├─ Team Leaders                               │   │
│  │ ├─ Newsletter Subscribers                     │   │
│  │ └─ Active Members                             │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [If "Send by Tag" chosen]                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Select Tag ▼                                  │   │
│  │ ├─ My Great Marriage                         │   │
│  │ ├─ Table Talk for Men                        │   │
│  │ ├─ Newsletter                                 │   │
│  │ ├─ Men                                        │   │
│  │ └─ Women                                      │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Tab 2: Compose

```
┌─────────────────────────────────────────────────────┐
│ Email Content                                       │
│ Write your message with personalization options     │
└─────────────────────────────────────────────────────┘

┌─ Card ──────────────────────────────────────────────┐
│                                                      │
│  Subject Line *                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Enter email subject...]                     │   │
│  └─────────────────────────────────────────────┘   │
│  42/60 characters                                   │
│                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                                      │
│  Text Formatting Tools                              │
│  ┌──────────────────────────────────────────┐      │
│  │ [B] [I] [U] | [L] [C] [R] | [🔗] [📎] [{}] │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  [If Personalization clicked]                       │
│  ┌──────────────────────────────────────────┐      │
│  │ Personalization Tags - Click to insert:   │      │
│  │                                           │      │
│  │ [First Name] [Last Name] [Email]         │      │
│  │ {{first_name}} {{last_name}} {{email}}   │      │
│  │                                           │      │
│  │ [Husband] [Wife] [Couple]                 │      │
│  │ {{husband_name}} {{wife_name}} ...        │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  Email Body *                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Write your email message here...             │   │
│  │ Use {{first_name}}, {{wife_name}}, etc.      │   │
│  │                                              │   │
│  │ [Large text area for composing...]          │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│  1247 characters                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Tab 3: Formatting

```
┌─────────────────────────────────────────────────────┐
│ Text Formatting                                     │
│ Customize the appearance of your email              │
└─────────────────────────────────────────────────────┘

┌─ Card ──────────────────────────────────────────────┐
│                                                      │
│  Font Family                                        │
│  ┌─────────────────────────────────────────┐       │
│  │ Arial ▼                                  │       │
│  │ ├─ Georgia                               │       │
│  │ ├─ Times New Roman                       │       │
│  │ ├─ Verdana                               │       │
│  │ └─ ... (8 total)                         │       │
│  └─────────────────────────────────────────┘       │
│                                                      │
│  Font Size                                          │
│  ┌─────────────────────────────────────────┐       │
│  │ Normal (14px) ▼                          │       │
│  │ ├─ Small (12px)                          │       │
│  │ ├─ Medium (16px)                         │       │
│  │ ├─ Large (18px)                          │       │
│  │ └─ ... (6 total)                         │       │
│  └─────────────────────────────────────────┘       │
│                                                      │
│  Font Color                                         │
│  ┌────────────────────────────────────┐            │
│  │ [■] [■] [■] [■] [■] [■] [■] [■]   │            │
│  │ Black Maroon Blue Green Red Purple  │            │
│  │ Orange Gray                          │            │
│  └────────────────────────────────────┘            │
│                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                      │
│  🕐 Schedule Delivery                               │
│                                                      │
│  ○ Send Now                                         │
│    Deliver immediately                              │
│                                                      │
│  ○ Schedule for Later                              │
│    Choose date and time                             │
│                                                      │
│  [If scheduled selected]                            │
│  ┌──────────────────────────────────┐              │
│  │ Date: [2026-05-20]  Time: [14:30] │              │
│  └──────────────────────────────────┘              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Tab 4: Preview

```
┌─────────────────────────────────────────────────────┐
│ Email Preview                                       │
│ This is how your email will appear to recipients     │
└─────────────────────────────────────────────────────┘

┌─ Subject Preview Card ──────────────────────────┐
│ Subject:                                         │
│ "Welcome to our community! 🎉"                  │
│ (styled with selected font, size, color)        │
└─────────────────────────────────────────────────┘

┌─ Email Body Preview Card ──────────────────────┐
│                                                 │
│ Hi {{first_name}},                             │
│                                                 │
│ We're excited to have you here!                │
│ Check out this [important link](url)           │
│                                                 │
│ Best regards,                                  │
│ The Team                                        │
│                                                 │
│ (styled with all selected formatting)          │
└─────────────────────────────────────────────────┘

┌─ Info Card ────────────────────────────────────┐
│ Font: Arial  │ Size: 14px │ Bold, Italic │     │
│ Left Aligned                                    │
└─────────────────────────────────────────────────┘
```

---

### Link Insertion Dialog

```
┌─────────────────────────────────────────────────┐
│ Insert Link                                     │
│ Add a clickable link to your email              │
└─────────────────────────────────────────────────┘

Link Text
┌─────────────────────────────────────┐
│ e.g., Learn More                    │
└─────────────────────────────────────┘

URL
┌─────────────────────────────────────┐
│ e.g., https://example.com           │
└─────────────────────────────────────┘

[Cancel] [Insert Link]
```

---

### Success Notification

```
┌─────────────────────────────────────────────────┐
│ ✓ Email campaign created successfully!          │
└─────────────────────────────────────────────────┘
(Appears for 2 seconds, then auto-closes dialog)
```

---

### Error Notification

```
┌─────────────────────────────────────────────────┐
│ ✕ Error sending email                           │
└─────────────────────────────────────────────────┘
(Appears in top-right corner, dismissible)
```

---

## Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Primary | Buttons, active states | #8B2B3E (Maroon) |
| Primary Foreground | Text on primary | #FFFFFF |
| Background | Page background | #FFFFFF |
| Muted | Secondary info, disabled | #F3F4F6 |
| Muted Foreground | Secondary text | #6B7280 |
| Border | Dividers, inputs | #E5E7EB |
| Success | Confirmations | #10B981 (Green) |
| Destructive | Errors | #EF4444 (Red) |

---

## Spacing Scale

- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `gap-8` = 32px

---

## Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | 2-3 columns |
| Desktop | > 1024px | Full 4-column grid |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Dialog Title | Inter | 24px | 700 |
| Card Titles | Inter | 18px | 600 |
| Labels | Inter | 14px | 500 |
| Body Text | Inter | 14px | 400 |
| Small Text | Inter | 12px | 400 |
| Monospace | Courier New | 14px | 400 |

---

## Component Dependencies

```
EmailSetupRedesigned
├── Dialog (radix-ui)
│   ├── DialogContent
│   ├── DialogHeader
│   ├── DialogTitle
│   ├── DialogDescription
│   └── DialogFooter
├── Tabs (radix-ui)
│   ├── TabsList
│   └── TabsContent
├── Card (shadcn/ui)
│   ├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   ├── CardContent
│   └── CardFooter
├── Button (shadcn/ui)
├── Input (shadcn/ui)
├── Textarea (shadcn/ui)
├── Select (radix-ui)
│   ├── SelectTrigger
│   ├── SelectValue
│   ├── SelectContent
│   └── SelectItem
├── Separator (radix-ui)
├── Tooltip (radix-ui)
│   ├── TooltipTrigger
│   └── TooltipContent
└── Icons (lucide-react)
    ├── Send, Clock, Bold, Italic, Underline
    ├── AlignLeft, AlignCenter, AlignRight
    ├── Link, FileText, Eye, Settings
    ├── Users, Tag, FolderOpen
    └── ... (20+ total icons)
```

---

## State Variables

```typescript
// Recipient selection
recipientType: "all" | "individuals" | "group" | "tag"
selectedRecipients: string[]
selectedGroup: string
selectedTag: string

// Email content
subject: string
body: string

// Formatting
fontFamily: string (CSS value)
fontSize: string (e.g., "14px")
fontColor: string (hex code)
isBold: boolean
isItalic: boolean
isUnderline: boolean
textAlign: "left" | "center" | "right"

// Scheduling
scheduleType: "now" | "scheduled"
scheduledDate: string (ISO date)
scheduledTime: string (HH:mm format)

// UI states
activeTab: string ("recipients" | "compose" | "formatting" | "preview")
showLinkDialog: boolean
showPersonalizationMenu: boolean
isSending: boolean
showSuccess: boolean

// Dialogs
linkText: string
linkUrl: string
```

---

## Event Handlers

| Handler | Trigger | Purpose |
|---------|---------|---------|
| `onOpenChange` | Dialog open/close | Control visibility |
| `onSend` | Send Campaign click | Submit email data |
| `insertLink` | Link insert | Add URL to content |
| `insertPersonalizationTag` | Tag click | Add personalization |
| `handleFileAttachment` | Attach button | Open file picker |
| `handleSend` | Send Campaign | Validate and send |
| `resetForm` | Cancel or success | Clear all fields |

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Navigate tabs | Tab key |
| Toggle formatting | Tab to button, Space/Enter |
| Open link dialog | Tab to link button, Enter |
| Close dialog | Escape key |
| Submit form | Focus send button, Enter |

---

This visual map should help you understand the complete structure and flow of the redesigned email interface!
