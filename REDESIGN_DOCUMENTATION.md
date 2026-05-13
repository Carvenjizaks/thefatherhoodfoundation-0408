# Email Campaign Designer - Redesign Documentation

## Overview

The redesigned email setup interface provides a modern, intuitive experience for composing and sending email campaigns. The interface is organized into four key tabs that guide users through the campaign creation process step-by-step.

## Features

### 1. **Recipients Tab**
- **All Contacts**: Send to all active subscribers
- **Select Individuals**: Pick specific people from your contact list
- **Send to Group**: Select predefined contact groups
- **Send by Tag**: Filter and send to all contacts with specific tags (MGM, FF-NL, TT4Men, etc.)

**Key Features:**
- Clear radio button selections for each recipient type
- Visual icons for easy identification
- Count badges showing number of recipients
- Responsive design for mobile and desktop

### 2. **Compose Tab**
- **Subject Line Input**: Clear, large input field with character counter
- **Rich Text Formatting Toolbar** with quick access to:
  - Bold, Italic, Underline
  - Text alignment (Left, Center, Right)
  - Insert links
  - Attach files
  - Personalization tags

**Personalization Tags Available:**
- `{{first_name}}` - Recipient's first name
- `{{last_name}}` - Recipient's last name
- `{{email}}` - Recipient's email address
- `{{husband_name}}` - Husband's first name
- `{{wife_name}}` - Wife's first name
- `{{couple_name}}` - Both names combined (e.g., "John & Jane")

**Text Editor Features:**
- Large textarea for comfortable writing
- Character counter
- Real-time updates
- Support for formatting tokens
- File attachment support

### 3. **Formatting Tab**
Customize the visual appearance of emails:

**Font Controls:**
- **Font Family**: 8 professional fonts (Arial, Georgia, Times New Roman, Verdana, Tahoma, Trebuchet MS, Helvetica, Courier New)
- **Font Size**: 6 size options from 12px to 24px
- **Font Color**: 8 professional colors (Black, Maroon, Blue, Green, Red, Purple, Orange, Gray)

**Scheduling Options:**
- **Send Now**: Immediate delivery
- **Schedule for Later**: Pick specific date and time

### 4. **Preview Tab**
- Live preview of email appearance
- Shows subject line with formatting applied
- Full email body preview with all styling
- Display information card showing:
  - Selected font family
  - Font size
  - Text styles applied (Bold, Italic, Underline)
  - Text alignment

## User Interface Design

### Layout Structure
- **Modal Dialog**: Centered, scrollable interface (max-width: 1024px)
- **Tab Navigation**: Clear tab headers with icons and labels
- **Responsive Tabs**: Show text on desktop, icons on mobile
- **Card-based Content**: Each section organized in visually distinct cards

### Visual Hierarchy
- **Headers**: Clear titles and descriptions for each section
- **Icons**: Intuitive icons for quick visual scanning
- **Color Coding**: 
  - Primary color for active states and CTA buttons
  - Muted backgrounds for secondary information
  - Status colors for success/error messages

### Accessibility Features
- Semantic HTML with proper heading hierarchy
- Tooltip help text on all formatting buttons
- Clear visual feedback for active states
- Focus indicators on interactive elements
- Alt text and descriptions for all icons

## Core Actions

### Sending Emails

1. **Select Recipients** (Tab 1)
   - Choose recipient type (All, Individuals, Group, or Tag)
   - Confirm selection

2. **Compose Message** (Tab 2)
   - Enter subject line
   - Write email body
   - Use formatting toolbar to add rich text
   - Insert personalization tags and links

3. **Format & Schedule** (Tab 3)
   - Adjust font family and size
   - Choose text color
   - Set text styling (bold, italic, underline)
   - Choose alignment
   - Select send time (now or scheduled)

4. **Preview & Send** (Tab 4)
   - Review email appearance
   - See all formatting applied
   - Click "Send Campaign" button

### Key Buttons

- **Cancel**: Close dialog without sending, reset form
- **Preview**: Jump to preview tab to review email
- **Send Campaign**: Submit email campaign (enabled only when subject and body are filled)

## Component Composition

```
EmailSetupRedesigned
├── Dialog (Modal Container)
├── DialogHeader (Title & Description)
├── Tabs (Tab Navigation)
│   ├── Recipients Tab
│   │   └── Recipient Selection Cards
│   ├── Compose Tab
│   │   ├── Subject Input
│   │   ├── Formatting Toolbar
│   │   ├── Personalization Menu
│   │   └── Text Editor
│   ├── Formatting Tab
│   │   ├── Font Family Select
│   │   ├── Font Size Select
│   │   ├── Color Picker
│   │   └── Schedule Options
│   └── Preview Tab
│       └── Email Preview
├── Dialogs (Modals)
│   └── Link Insertion Dialog
└── Footer (Actions)
    ├── Cancel Button
    ├── Preview Button
    └── Send Campaign Button
```

## State Management

The component uses React hooks to manage:
- `activeTab`: Current tab selection
- `recipientType`: Type of recipients (all/individuals/group/tag)
- `subject`, `body`: Email content
- `fontFamily`, `fontSize`, `fontColor`: Styling
- `isBold`, `isItalic`, `isUnderline`, `textAlign`: Text formatting
- `scheduleType`, `scheduledDate`, `scheduledTime`: Send scheduling
- `isSending`, `showSuccess`: Send status

## API Integration

The component accepts an `onSend` callback that receives `EmailData` object containing:
```typescript
{
  subject: string
  body: string
  fontFamily: string
  fontSize: string
  fontColor: string
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  textAlign: "left" | "center" | "right"
  recipientType: "all" | "individuals" | "group" | "tag"
  recipients?: string[]
  groupId?: string
  tagId?: string
  scheduledAt?: string
}
```

## Styling Approach

- Uses Tailwind CSS utility classes
- Semantic design tokens from theme
- Responsive breakpoints (sm, md, lg)
- Consistent spacing (4px base unit)
- Consistent border radius (6px, 8px, 12px)
- Color palette from design system

## Accessibility Considerations

✓ Keyboard navigation support
✓ Semantic HTML structure
✓ ARIA labels and descriptions
✓ Color contrast compliance
✓ Focus indicators on all interactive elements
✓ Tooltip help text
✓ Screen reader friendly labels
✓ Form field validation feedback

## Mobile Responsiveness

- Tab labels hidden on mobile (icons only)
- Grid layouts adjust from 1 to 4 columns
- Touch-friendly button sizes (min 44px)
- Scrollable content areas
- Stacked layout for smaller screens

## Future Enhancements

- Rich HTML editor mode
- Template library
- A/B testing functionality
- Delivery analytics
- Draft saving
- Email history
- Drag-and-drop block editor
- Image uploads and gallery
- Google Drive file integration
