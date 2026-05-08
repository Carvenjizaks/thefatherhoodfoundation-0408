const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefatherhoodfoundation.org"
const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "marriage@updates.thefatherhoodfoundation.org"
const FROM_NAME = process.env.EMAIL_FROM_NAME || "My Great Marriage"

export const FROM_ADDRESS = `${FROM_NAME} <${FROM_EMAIL}>`

function emailWrapper(content: string, previewText: string = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${FROM_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:Georgia,'Times New Roman',serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}${"&nbsp;&zwnj;".repeat(60)}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#3D1520;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4A574;font-family:Arial,sans-serif;">The Fatherhood Foundation</p>
            <p style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;">My Great Marriage</p>
          </td>
        </tr>

        <!-- Body -->
        ${content}

        <!-- Footer -->
        <tr>
          <td style="background:#fdf8f3;padding:28px 40px;border-top:1px solid #e8d8c8;">
            <p style="margin:0 0 8px;font-size:12px;color:#8B6B5A;font-family:Arial,sans-serif;text-align:center;">
              My Great Marriage &mdash; The Fatherhood Foundation
            </p>
            <p style="margin:0 0 12px;font-size:11px;color:#B09080;font-family:Arial,sans-serif;text-align:center;line-height:1.6;">
              Strengthening marriages through practical tools, biblical truth, and supportive community.
            </p>
            <p style="margin:0;font-size:11px;color:#B09080;font-family:Arial,sans-serif;text-align:center;">
              PLACEHOLDER_FOOTER_LINKS
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function footerLinks(husbandToken: string, wifeToken: string): string {
  return `<a href="${SITE_URL}/my-great-marriage/preferences/${husbandToken}" style="color:#8B2B3E;font-size:11px;font-family:Arial,sans-serif;">Husband Preferences</a>
  &nbsp;&bull;&nbsp;
  <a href="${SITE_URL}/my-great-marriage/preferences/${wifeToken}" style="color:#8B2B3E;font-size:11px;font-family:Arial,sans-serif;">Wife Preferences</a>
  &nbsp;&bull;&nbsp;
  <a href="${SITE_URL}/unsubscribe/${husbandToken}" style="color:#8B2B3E;font-size:11px;font-family:Arial,sans-serif;">Unsubscribe</a>`
}

function singleFooterLinks(token: string, label: string): string {
  return `<a href="${SITE_URL}/my-great-marriage/preferences/${token}" style="color:#8B2B3E;font-size:11px;font-family:Arial,sans-serif;">Manage Preferences</a>
  &nbsp;&bull;&nbsp;
  <a href="${SITE_URL}/unsubscribe/${token}" style="color:#8B2B3E;font-size:11px;font-family:Arial,sans-serif;">Unsubscribe ${label}</a>`
}

export function buildWelcomeEmail(params: {
  husbandFirstName: string
  wifeFirstName: string
  husbandToken: string
  wifeToken: string
}): { subject: string; html: string; text: string } {
  const subject = "Welcome to My Great Marriage — Your Free Check-In Template Is Here"
  const previewText = "A practical monthly tool and weekly encouragement for a stronger Christ-centered marriage."

  const body = `
    <tr><td style="padding:40px 40px 24px;">
      <p style="margin:0 0 20px;font-size:18px;color:#1a0a0e;font-family:Georgia,serif;font-weight:bold;">Hi ${params.husbandFirstName} and ${params.wifeFirstName},</p>
      <p style="margin:0 0 16px;font-size:15px;color:#3D2314;line-height:1.7;font-family:Arial,sans-serif;">
        Welcome to My Great Marriage. Strong marriages do not stay strong by accident. They are built through intentional rhythms, honest conversations, practical love, and a shared walk with Jesus.
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#3D2314;line-height:1.7;font-family:Arial,sans-serif;">
        We created this Monthly Marriage Check-In to help you pause, reflect, reconnect, and move forward together. Each week, we will also send short encouragement to help keep your marriage fresh and alive.
      </p>

      <!-- Scripture block -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="background:#fdf8f3;border-left:4px solid #8B2B3E;padding:20px 24px;border-radius:0 8px 8px 0;">
          <p style="margin:0 0 6px;font-size:15px;color:#1a0a0e;font-family:Georgia,serif;font-style:italic;">
            &ldquo;Unless the Lord builds the house, those who build it labor in vain.&rdquo;
          </p>
          <p style="margin:0;font-size:12px;color:#8B6B5A;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Psalm 127:1</p>
        </td></tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#3D2314;font-family:Arial,sans-serif;font-weight:bold;">What you will receive:</p>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#3D2314;font-family:Arial,sans-serif;line-height:2;">
        <li>Weekly shared encouragement as a couple</li>
        <li>Husband encouragement for the man</li>
        <li>Wife encouragement for the woman</li>
        <li>A monthly reminder to complete your marriage check-in together</li>
      </ul>

      <!-- CTA Button -->
      <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="background:#8B2B3E;border-radius:50px;padding:14px 32px;">
          <a href="${SITE_URL}/my-great-marriage/check-in" style="color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;">View Your Marriage Check-In</a>
        </td></tr>
      </table>

      <p style="margin:0 0 4px;font-size:14px;color:#8B6B5A;font-family:Arial,sans-serif;">
        <a href="${SITE_URL}/my-great-marriage/preferences/${params.husbandToken}" style="color:#8B2B3E;">Manage Preferences</a>
      </p>

      <p style="margin:32px 0 0;font-size:14px;color:#3D2314;line-height:1.7;font-family:Arial,sans-serif;">
        We are honored to serve your marriage.<br/>
        <strong>With you for stronger homes,</strong><br/>
        <em>The Fatherhood Foundation</em>
      </p>
    </td></tr>
  `

  const html = emailWrapper(body, previewText).replace(
    "PLACEHOLDER_FOOTER_LINKS",
    footerLinks(params.husbandToken, params.wifeToken)
  )

  const text = `Hi ${params.husbandFirstName} and ${params.wifeFirstName},

Welcome to My Great Marriage. Strong marriages do not stay strong by accident. They are built through intentional rhythms, honest conversations, practical love, and a shared walk with Jesus.

"Unless the Lord builds the house, those who build it labor in vain." — Psalm 127:1

View your Marriage Check-In: ${SITE_URL}/my-great-marriage/check-in
Manage Preferences: ${SITE_URL}/my-great-marriage/preferences/${params.husbandToken}

We are honored to serve your marriage.
The Fatherhood Foundation`

  return { subject, html, text }
}

export function buildNurtureEmail(params: {
  recipientName: string
  emailBlock: { subject: string; title: string; scripture: string; scriptureRef: string; focus: string; action: string; reflection: string; prayer: string }
  theme: string
  month: number
  ctaUrl: string
  preferenceToken: string
  recipientLabel: string
  isCouple?: boolean
  partnerName?: string
}): { subject: string; html: string; text: string } {
  const greeting = params.isCouple && params.partnerName
    ? `Hi ${params.recipientName} and ${params.partnerName},`
    : `Hi ${params.recipientName},`

  const previewText = `${params.emailBlock.title} — ${params.theme}`

  const body = `
    <tr><td style="padding:40px 40px 24px;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D4A574;font-family:Arial,sans-serif;">Month ${params.month} &mdash; ${params.theme}</p>
      <h1 style="margin:0 0 20px;font-size:24px;color:#1a0a0e;font-family:Georgia,serif;font-weight:bold;line-height:1.3;">${params.emailBlock.title}</h1>

      <p style="margin:0 0 20px;font-size:15px;color:#3D2314;line-height:1.7;font-family:Arial,sans-serif;">${greeting}</p>

      <!-- Scripture block -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="background:#fdf8f3;border-left:4px solid #8B2B3E;padding:20px 24px;border-radius:0 8px 8px 0;">
          <p style="margin:0 0 6px;font-size:15px;color:#1a0a0e;font-family:Georgia,serif;font-style:italic;">
            &ldquo;${params.emailBlock.scripture}&rdquo;
          </p>
          <p style="margin:0;font-size:12px;color:#8B6B5A;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">${params.emailBlock.scriptureRef}</p>
        </td></tr>
      </table>

      <p style="margin:0 0 16px;font-size:15px;color:#3D2314;line-height:1.7;font-family:Arial,sans-serif;">${params.emailBlock.focus}</p>

      <!-- Action -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="background:#f0e8e0;border-radius:8px;padding:18px 24px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8B6B5A;font-family:Arial,sans-serif;">This Week&apos;s Action</p>
          <p style="margin:0;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;line-height:1.6;">${params.emailBlock.action}</p>
        </td></tr>
      </table>

      <!-- Reflection -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="border:1px solid #e8d8c8;border-radius:8px;padding:18px 24px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8B6B5A;font-family:Arial,sans-serif;">Reflection</p>
          <p style="margin:0;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;font-style:italic;line-height:1.6;">${params.emailBlock.reflection}</p>
        </td></tr>
      </table>

      <!-- Prayer -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr><td style="background:#3D1520;border-radius:8px;padding:18px 24px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D4A574;font-family:Arial,sans-serif;">A Short Prayer</p>
          <p style="margin:0;font-size:14px;color:#f5e8d8;font-family:Georgia,serif;font-style:italic;line-height:1.7;">${params.emailBlock.prayer}</p>
        </td></tr>
      </table>

      <!-- CTA Button -->
      <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="background:#8B2B3E;border-radius:50px;padding:14px 32px;">
          <a href="${params.ctaUrl}" style="color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;">
            ${params.isCouple ? "Complete Your Marriage Check-In" : "Visit My Great Marriage"}
          </a>
        </td></tr>
      </table>

      <p style="margin:24px 0 0;font-size:13px;color:#8B6B5A;font-family:Arial,sans-serif;line-height:1.6;">
        With you for stronger homes,<br/><strong>The Fatherhood Foundation</strong>
      </p>
    </td></tr>
  `

  const html = emailWrapper(body, previewText).replace(
    "PLACEHOLDER_FOOTER_LINKS",
    singleFooterLinks(params.preferenceToken, params.recipientLabel)
  )

  const text = `${greeting}

${params.emailBlock.title}
Month ${params.month} — ${params.theme}

"${params.emailBlock.scripture}" — ${params.emailBlock.scriptureRef}

${params.emailBlock.focus}

This Week's Action: ${params.emailBlock.action}

Reflection: ${params.emailBlock.reflection}

Prayer: ${params.emailBlock.prayer}

${params.isCouple ? "Complete Your Marriage Check-In" : "Visit My Great Marriage"}: ${params.ctaUrl}

Manage Preferences: ${SITE_URL}/my-great-marriage/preferences/${params.preferenceToken}
Unsubscribe: ${SITE_URL}/unsubscribe/${params.preferenceToken}

The Fatherhood Foundation`

  return { subject: params.emailBlock.subject, html, text }
}

export function buildAdminNotificationEmail(params: {
  husbandFirstName: string
  husbandLastName: string
  husbandEmail: string
  wifeFirstName: string
  wifeLastName: string
  wifeEmail: string
  country: string
  city?: string | null
}): { subject: string; html: string; text: string } {
  const subject = `New MGM Signup: ${params.husbandFirstName} & ${params.wifeFirstName} ${params.husbandLastName}`

  const body = `
    <tr><td style="padding:40px;">
      <p style="margin:0 0 20px;font-size:18px;color:#1a0a0e;font-family:Georgia,serif;font-weight:bold;">New Couple Subscription</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#8B6B5A;font-family:Arial,sans-serif;width:40%;">Husband</td><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;">${params.husbandFirstName} ${params.husbandLastName} &lt;${params.husbandEmail}&gt;</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#8B6B5A;font-family:Arial,sans-serif;">Wife</td><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;">${params.wifeFirstName} ${params.wifeLastName} &lt;${params.wifeEmail}&gt;</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#8B6B5A;font-family:Arial,sans-serif;">Country</td><td style="padding:10px 0;border-bottom:1px solid #e8d8c8;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;">${params.country}${params.city ? `, ${params.city}` : ""}</td></tr>
        <tr><td style="padding:10px 0;font-size:14px;color:#8B6B5A;font-family:Arial,sans-serif;">Signed Up</td><td style="padding:10px 0;font-size:14px;color:#1a0a0e;font-family:Arial,sans-serif;">${new Date().toLocaleDateString("en-ZA", { dateStyle: "full" })}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:14px;color:#3D2314;font-family:Arial,sans-serif;">
        <a href="${SITE_URL}/admin/mygreatmarriage" style="color:#8B2B3E;font-weight:bold;">View Admin Dashboard</a>
      </p>
    </td></tr>
  `

  const html = emailWrapper(body).replace("PLACEHOLDER_FOOTER_LINKS", `<span style="color:#B09080;font-family:Arial,sans-serif;font-size:11px;">Admin notification — My Great Marriage</span>`)

  const text = `New MGM Signup\n\nHusband: ${params.husbandFirstName} ${params.husbandLastName} <${params.husbandEmail}>\nWife: ${params.wifeFirstName} ${params.wifeLastName} <${params.wifeEmail}>\nCountry: ${params.country}${params.city ? `, ${params.city}` : ""}\nSigned Up: ${new Date().toISOString()}`

  return { subject, html, text }
}
