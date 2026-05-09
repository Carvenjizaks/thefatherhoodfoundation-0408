/**
 * MGM Email Journey Content
 * 
 * 3 Cycles with distinct themes:
 * - Cycle 1 (Months 1-3): FOUNDATION — Build your marriage on Christ
 * - Cycle 2 (Months 4-6): CONNECTION — Deepen intimacy and communication
 * - Cycle 3 (Months 7-9): GROWTH — Sustain and strengthen your marriage
 * 
 * Each cycle has a unique approach and voice.
 */

export type EmailTrack = {
  month: number
  theme: string
  cycle: number
  cycleName: string
  couples1: EmailBlock
  husbands: EmailBlock
  wives: EmailBlock
  couples2: EmailBlock
}

export type EmailBlock = {
  subject: string
  title: string
  scripture: string
  scriptureRef: string
  focus: string
  action: string
  reflection: string
}

export const MGM_EMAIL_CONTENT: EmailTrack[] = [
  // ============================================================
  // CYCLE 1: FOUNDATION — Build your marriage on Christ
  // Tone: Establishing, grounding, foundational principles
  // ============================================================
  {
    month: 1,
    cycle: 1,
    cycleName: "Foundation",
    theme: "Put Christ at the Center",
    couples1: {
      subject: "Build Your Marriage on the Right Foundation",
      title: "Build Your Marriage on the Right Foundation",
      scripture: "Unless the Lord builds the house, those who build it labor in vain.",
      scriptureRef: "Psalm 127:1",
      focus: "Put Jesus back at the center of your home, your choices, and your love.",
      action: "Pray together for 3 minutes this week — start simple, start now.",
      reflection: "What is currently shaping our marriage more than Christ?",
    },
    husbands: {
      subject: "Lead with Love, Not Control",
      title: "Lead with Love, Not Control",
      scripture: "Husbands, love your wives, as Christ loved the church and gave himself up for her.",
      scriptureRef: "Ephesians 5:25",
      focus: "Husband leadership is expressed through love, sacrifice, consistency, and service.",
      action: "Do one practical act of service for your wife this week without being asked.",
      reflection: "Does my wife experience me as safe, loving, and servant-hearted?",
    },
    wives: {
      subject: "Strengthen Your Marriage with Wisdom and Warmth",
      title: "Strengthen Your Marriage with Wisdom and Warmth",
      scripture: "The wisest of women builds her house, but folly with her own hands tears it down.",
      scriptureRef: "Proverbs 14:1",
      focus: "A wise wife strengthens the atmosphere of the home through grace, truth, and intentional love.",
      action: "Encourage your husband with one specific affirmation this week.",
      reflection: "What kind of atmosphere am I helping create in our marriage?",
    },
    couples2: {
      subject: "Your Monthly Marriage Check-In Starts Here",
      title: "Your Monthly Marriage Check-In Starts Here",
      scripture: "Two are better than one, because they have a good reward for their toil.",
      scriptureRef: "Ecclesiastes 4:9-10",
      focus: "Pause and review how you are doing together.",
      action: "Schedule 20 minutes this week and complete your check-in together.",
      reflection: "What do we need to pay attention to right now?",
    },
  },
  {
    month: 2,
    cycle: 1,
    cycleName: "Foundation",
    theme: "Communicate with Grace",
    couples1: {
      subject: "Strong Marriages Learn to Talk and Listen Well",
      title: "Strong Marriages Learn to Talk and Listen Well",
      scripture: "Let every person be quick to hear, slow to speak, slow to anger.",
      scriptureRef: "James 1:19",
      focus: "Healthy communication requires listening, gentleness, and timing.",
      action: "Have one 10-minute conversation with no phones and no interrupting.",
      reflection: "Do I listen to understand or to respond?",
    },
    husbands: {
      subject: "She Needs to Feel Heard",
      title: "She Needs to Feel Heard",
      scripture: "Let every person be quick to hear, slow to speak, slow to anger.",
      scriptureRef: "James 1:19",
      focus: "Listening well is one of the clearest ways a husband loves his wife.",
      action: "Ask your wife, 'How are you really doing?' and listen fully.",
      reflection: "Does my wife feel emotionally heard by me?",
    },
    wives: {
      subject: "Speak Life into Your Marriage",
      title: "Speak Life into Your Marriage",
      scripture: "Let no corrupting talk come out of your mouths, but only such as is good for building up.",
      scriptureRef: "Ephesians 4:29",
      focus: "Your words can strengthen, heal, and build connection.",
      action: "Replace one repeated complaint with one calm, honest request.",
      reflection: "Do my words build peace or pressure?",
    },
    couples2: {
      subject: "Pause, Listen, and Check In Together This Month",
      title: "Pause, Listen, and Check In Together This Month",
      scripture: "Bear with one another and, if one has a complaint against another, forgive each other.",
      scriptureRef: "Colossians 3:13-14",
      focus: "Reflect on how you are communicating and where you need grace.",
      action: "Complete your monthly check-in and ask, 'How can I support you better?'",
      reflection: "What conversation have we been postponing?",
    },
  },
  {
    month: 3,
    cycle: 1,
    cycleName: "Foundation",
    theme: "Forgive and Move Forward",
    couples1: {
      subject: "Forgiveness Frees Your Marriage to Flourish",
      title: "Forgiveness Frees Your Marriage to Flourish",
      scripture: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
      scriptureRef: "Ephesians 4:32",
      focus: "Unforgiveness poisons intimacy. Forgiveness opens the door to healing.",
      action: "Release one grudge or resentment you have been holding this week.",
      reflection: "Is there anything I am still holding against my spouse?",
    },
    husbands: {
      subject: "Guard Your Heart Against Bitterness",
      title: "Guard Your Heart Against Bitterness",
      scripture: "See to it that no one fails to obtain the grace of God; that no root of bitterness springs up.",
      scriptureRef: "Hebrews 12:15",
      focus: "Bitterness grows silently. Choose to uproot it before it damages your marriage.",
      action: "Confess one area where bitterness has taken root and release it to God.",
      reflection: "Am I allowing past hurts to shape how I treat my wife today?",
    },
    wives: {
      subject: "Let Go and Let God Restore",
      title: "Let Go and Let God Restore",
      scripture: "Love keeps no record of wrongs.",
      scriptureRef: "1 Corinthians 13:5",
      focus: "Keeping score destroys trust. Grace rebuilds it.",
      action: "Forgive your husband for one thing you have been holding onto.",
      reflection: "Am I truly releasing the past or just managing it?",
    },
    couples2: {
      subject: "End This Cycle with a Clean Slate",
      title: "End This Cycle with a Clean Slate",
      scripture: "As far as the east is from the west, so far does he remove our transgressions from us.",
      scriptureRef: "Psalm 103:12",
      focus: "You have completed Cycle 1. Before the pause, clear the air together.",
      action: "Ask each other: 'Is there anything I need to apologize for?' Then forgive and move on.",
      reflection: "What have we learned about building our foundation together?",
    },
  },

  // ============================================================
  // CYCLE 2: CONNECTION — Deepen intimacy and communication
  // Tone: Warmer, more intimate, relationship-deepening
  // ============================================================
  {
    month: 4,
    cycle: 2,
    cycleName: "Connection",
    theme: "Rediscover Each Other",
    couples1: {
      subject: "Welcome Back — Let's Go Deeper Together",
      title: "Welcome Back — Let's Go Deeper Together",
      scripture: "Above all, keep loving one another earnestly, since love covers a multitude of sins.",
      scriptureRef: "1 Peter 4:8",
      focus: "After your rest, it's time to reconnect intentionally and go deeper.",
      action: "Plan one date this month — simple is fine, intentional is key.",
      reflection: "What do I want to rediscover about my spouse this cycle?",
    },
    husbands: {
      subject: "Pursue Her Heart Again",
      title: "Pursue Her Heart Again",
      scripture: "Many waters cannot quench love, neither can floods drown it.",
      scriptureRef: "Song of Solomon 8:7",
      focus: "Your wife needs to feel pursued, not just provided for.",
      action: "Do something this week that shows her she is still the one you choose.",
      reflection: "When did I last make my wife feel truly desired and valued?",
    },
    wives: {
      subject: "Open Your Heart to Him",
      title: "Open Your Heart to Him",
      scripture: "Set me as a seal upon your heart, as a seal upon your arm.",
      scriptureRef: "Song of Solomon 8:6",
      focus: "Vulnerability deepens connection. Let him in.",
      action: "Share one thing you have not told your husband recently — a dream, a fear, or a hope.",
      reflection: "Have I been emotionally available to my husband?",
    },
    couples2: {
      subject: "Check In and Reconnect This Month",
      title: "Check In and Reconnect This Month",
      scripture: "I am my beloved's and my beloved is mine.",
      scriptureRef: "Song of Solomon 6:3",
      focus: "Use this check-in to assess how connected you feel.",
      action: "Rate your connection from 1-10 and discuss one way to improve it.",
      reflection: "Are we growing closer or drifting apart?",
    },
  },
  {
    month: 5,
    cycle: 2,
    cycleName: "Connection",
    theme: "Nurture Physical and Emotional Intimacy",
    couples1: {
      subject: "Intimacy Is More Than Physical",
      title: "Intimacy Is More Than Physical",
      scripture: "Let him kiss me with the kisses of his mouth! For your love is better than wine.",
      scriptureRef: "Song of Solomon 1:2",
      focus: "True intimacy combines emotional safety, physical closeness, and spiritual unity.",
      action: "Initiate physical affection this week without any expectation attached.",
      reflection: "Do we prioritize intimacy or let it happen by accident?",
    },
    husbands: {
      subject: "Understand What She Really Needs",
      title: "Understand What She Really Needs",
      scripture: "Husbands, live with your wives in an understanding way.",
      scriptureRef: "1 Peter 3:7",
      focus: "Emotional connection often precedes physical desire for your wife.",
      action: "Ask her: 'What makes you feel most loved and connected to me?'",
      reflection: "Am I meeting her emotional needs before expecting physical closeness?",
    },
    wives: {
      subject: "The Gift of Physical Closeness",
      title: "The Gift of Physical Closeness",
      scripture: "Do not deprive one another, except perhaps by agreement for a limited time.",
      scriptureRef: "1 Corinthians 7:5",
      focus: "Physical intimacy is a gift you give each other — not a duty or a weapon.",
      action: "Initiate closeness this week in a way that feels natural to you.",
      reflection: "Do I view intimacy as connection or obligation?",
    },
    couples2: {
      subject: "How Connected Are You Really?",
      title: "How Connected Are You Really?",
      scripture: "Therefore a man shall leave his father and mother and hold fast to his wife, and the two shall become one flesh.",
      scriptureRef: "Ephesians 5:31",
      focus: "Oneness is built through consistent, intentional closeness.",
      action: "Discuss your intimacy honestly — what is working and what needs attention?",
      reflection: "What barriers exist between us that we need to address?",
    },
  },
  {
    month: 6,
    cycle: 2,
    cycleName: "Connection",
    theme: "Protect Your Marriage from Drift",
    couples1: {
      subject: "Don't Let Busyness Steal Your Closeness",
      title: "Don't Let Busyness Steal Your Closeness",
      scripture: "Be very careful, then, how you live — not as unwise but as wise, making the most of every opportunity.",
      scriptureRef: "Ephesians 5:15-16",
      focus: "Life pulls couples apart. Intentionality pulls them back together.",
      action: "Identify one thing stealing time from your marriage and adjust it this week.",
      reflection: "What is competing with our marriage for attention right now?",
    },
    husbands: {
      subject: "Protect the Boundaries of Your Heart",
      title: "Protect the Boundaries of Your Heart",
      scripture: "Keep your heart with all vigilance, for from it flow the springs of life.",
      scriptureRef: "Proverbs 4:23",
      focus: "Guard your eyes, your thoughts, and your emotional energy for your wife.",
      action: "Evaluate any relationship or habit that could threaten your marriage — and address it.",
      reflection: "Am I giving my best energy to my wife or to distractions?",
    },
    wives: {
      subject: "Fight for Your Marriage",
      title: "Fight for Your Marriage",
      scripture: "Be watchful, stand firm in the faith, act like men, be strong.",
      scriptureRef: "1 Corinthians 16:13",
      focus: "Your marriage is worth protecting. Be vigilant about what you allow in.",
      action: "Identify one outside influence that is negatively affecting your marriage.",
      reflection: "Am I actively protecting our marriage or passively letting it drift?",
    },
    couples2: {
      subject: "End Cycle 2 with Renewed Commitment",
      title: "End Cycle 2 with Renewed Commitment",
      scripture: "I have fought the good fight, I have finished the race, I have kept the faith.",
      scriptureRef: "2 Timothy 4:7",
      focus: "You have completed Cycle 2. Celebrate your growth and prepare for the final stretch.",
      action: "Recommit to your marriage with one specific promise to each other.",
      reflection: "How has our connection deepened over the past three months?",
    },
  },

  // ============================================================
  // CYCLE 3: GROWTH — Sustain and strengthen your marriage
  // Tone: Empowering, future-focused, legacy-building
  // ============================================================
  {
    month: 7,
    cycle: 3,
    cycleName: "Growth",
    theme: "Build a Shared Vision",
    couples1: {
      subject: "Welcome to the Final Stretch — Dream Together",
      title: "Welcome to the Final Stretch — Dream Together",
      scripture: "Where there is no vision, the people perish.",
      scriptureRef: "Proverbs 29:18 (KJV)",
      focus: "Strong marriages have shared dreams and a unified direction.",
      action: "Spend 15 minutes discussing: 'Where do we want to be in 5 years?'",
      reflection: "Do we have a shared vision or are we just surviving day to day?",
    },
    husbands: {
      subject: "Lead Your Family with Vision",
      title: "Lead Your Family with Vision",
      scripture: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil.",
      scriptureRef: "Jeremiah 29:11",
      focus: "A husband who leads with vision gives his family direction and security.",
      action: "Share one dream you have for your family and invite your wife's input.",
      reflection: "Am I leading with purpose or just reacting to life?",
    },
    wives: {
      subject: "Support and Shape the Vision Together",
      title: "Support and Shape the Vision Together",
      scripture: "An excellent wife is the crown of her husband.",
      scriptureRef: "Proverbs 12:4",
      focus: "Your wisdom and insight help shape and refine your family's direction.",
      action: "Add one idea to your husband's vision — or share one of your own.",
      reflection: "Am I contributing to our shared vision or waiting to be led?",
    },
    couples2: {
      subject: "Align Your Goals and Check In",
      title: "Align Your Goals and Check In",
      scripture: "Can two walk together, unless they are agreed?",
      scriptureRef: "Amos 3:3",
      focus: "Agreement builds momentum. Disagreement creates friction.",
      action: "Identify one area where you need better alignment — finances, parenting, or priorities.",
      reflection: "Are we walking together or in parallel?",
    },
  },
  {
    month: 8,
    cycle: 3,
    cycleName: "Growth",
    theme: "Serve Each Other and Others",
    couples1: {
      subject: "Marriage Is a Ministry",
      title: "Marriage Is a Ministry",
      scripture: "Serve one another humbly in love.",
      scriptureRef: "Galatians 5:13",
      focus: "The strongest marriages look outward — serving each other and the world together.",
      action: "Do one act of service together this week — for each other or for someone else.",
      reflection: "Are we using our marriage to bless others or only ourselves?",
    },
    husbands: {
      subject: "Serve Her Without Keeping Score",
      title: "Serve Her Without Keeping Score",
      scripture: "The Son of Man came not to be served but to serve.",
      scriptureRef: "Matthew 20:28",
      focus: "True leadership is measured by how much you give, not how much you get.",
      action: "Take one task off your wife's plate this week without being asked.",
      reflection: "Do I serve with joy or with resentment?",
    },
    wives: {
      subject: "Honor Him Through Your Actions",
      title: "Honor Him Through Your Actions",
      scripture: "Her husband is known in the gates when he sits among the elders of the land.",
      scriptureRef: "Proverbs 31:23",
      focus: "How you speak about and treat your husband shapes how others see him.",
      action: "Publicly honor your husband this week — in front of friends, family, or your children.",
      reflection: "Do my actions build him up or tear him down?",
    },
    couples2: {
      subject: "Reflect on How You Serve Together",
      title: "Reflect on How You Serve Together",
      scripture: "And let us consider how to stir up one another to love and good works.",
      scriptureRef: "Hebrews 10:24",
      focus: "Your marriage is a team — how well are you working together?",
      action: "Discuss one way you can serve your community or church together.",
      reflection: "Is our marriage inward-focused or outward-serving?",
    },
  },
  {
    month: 9,
    cycle: 3,
    cycleName: "Growth",
    theme: "Leave a Legacy of Love",
    couples1: {
      subject: "Your Marriage Is Your Legacy",
      title: "Your Marriage Is Your Legacy",
      scripture: "A good man leaves an inheritance to his children's children.",
      scriptureRef: "Proverbs 13:22",
      focus: "The greatest inheritance you can leave is the example of a loving, Christ-centered marriage.",
      action: "Write down three values you want your marriage to be known for.",
      reflection: "What will our children and grandchildren remember about our marriage?",
    },
    husbands: {
      subject: "Be the Father and Husband Worth Following",
      title: "Be the Father and Husband Worth Following",
      scripture: "Be imitators of me, as I am of Christ.",
      scriptureRef: "1 Corinthians 11:1",
      focus: "Your example sets the pattern for the next generation.",
      action: "Tell your children or someone younger what you have learned about being a husband.",
      reflection: "Am I modeling the kind of marriage I want my children to have?",
    },
    wives: {
      subject: "Pass On the Gift of a Godly Marriage",
      title: "Pass On the Gift of a Godly Marriage",
      scripture: "Older women likewise are to teach what is good, and so train the young women to love their husbands and children.",
      scriptureRef: "Titus 2:3-4",
      focus: "Your marriage can mentor others — even without saying a word.",
      action: "Encourage one younger woman or couple this week with something you have learned.",
      reflection: "Am I investing in the next generation?",
    },
    couples2: {
      subject: "Celebrate Your Journey — You Made It!",
      title: "Celebrate Your Journey — You Made It!",
      scripture: "I have fought the good fight, I have finished the race, I have kept the faith.",
      scriptureRef: "2 Timothy 4:7",
      focus: "You have completed the 9-month journey. Celebrate what God has done in your marriage!",
      action: "Plan a special celebration together — dinner, a trip, or a meaningful ritual.",
      reflection: "How has our marriage grown through this journey?",
    },
  },
]

/**
 * Get email content for a specific month and stream type
 */
export function getEmailContent(
  month: number,
  streamType: "COUPLES_1" | "HUSBANDS" | "WIVES" | "COUPLES_2"
): { track: EmailTrack; block: EmailBlock } | null {
  const track = MGM_EMAIL_CONTENT.find((t) => t.month === month)
  if (!track) return null

  const blockMap: Record<string, keyof EmailTrack> = {
    COUPLES_1: "couples1",
    HUSBANDS: "husbands",
    WIVES: "wives",
    COUPLES_2: "couples2",
  }

  const block = track[blockMap[streamType]] as EmailBlock
  return { track, block }
}

/**
 * Get cycle information for a month
 */
export function getCycleInfo(month: number): { cycle: number; cycleName: string; theme: string } | null {
  const track = MGM_EMAIL_CONTENT.find((t) => t.month === month)
  if (!track) return null
  return { cycle: track.cycle, cycleName: track.cycleName, theme: track.theme }
}
