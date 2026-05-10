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
  // NEW CYCLE: TRUST — Restore, rebuild, and strengthen trust
  // Tone: Vulnerable, grace-filled, redemptive, honest
  // ============================================================
  {
    month: 10,
    cycle: 4,
    cycleName: "Trust",
    theme: "Enter God's Rest Through Trust",
    couples1: {
      subject: "Marriage Trust Begins Here — Enter God's Rest",
      title: "Marriage Trust Begins Here — Enter God's Rest",
      scripture: "They could not enter his rest, because of their unbelief.",
      scriptureRef: "Hebrews 3:19 (AMP)",
      focus: "Many marriages never enter the promised land because unbelief and fear stop trust. But God wants you to live in His rest now — not someday, but today.",
      action: "Together, identify one area where fear is replacing trust in your marriage. Write it down and pray about it together.",
      reflection: "What promised land are we refusing to enter together because of unbelief?",
    },
    husbands: {
      subject: "Lead by Removing Fear — Restore Trust",
      title: "Lead by Removing Fear — Restore Trust",
      scripture: "Husbands, live with your wives in an understanding way, showing honor to the woman as the weaker vessel.",
      scriptureRef: "1 Peter 3:7",
      focus: "Trust is broken when your wife fears your reactions. Husband, be the safe place where she can speak truth without defense.",
      action: "Tell your wife: 'You are safe to tell me anything. I will listen without defending myself.'",
      reflection: "Do my actions and responses make my wife feel safe or afraid?",
    },
    wives: {
      subject: "Trust Is Built on Honesty, Not Silence",
      title: "Trust Is Built on Honesty, Not Silence",
      scripture: "Therefore, putting away lying, let each one of you speak truth with his neighbor.",
      scriptureRef: "Ephesians 4:25",
      focus: "Silence does not protect your marriage — truth does. When you hide or stay quiet, trust erodes. Speak what needs to be spoken with grace.",
      action: "Share one truth you have been afraid to tell your husband. Choose the right time, speak with gentleness, and be honest.",
      reflection: "What am I hiding or avoiding that is breaking trust between us?",
    },
    couples2: {
      subject: "The 5 Principles That Restore Broken Trust",
      title: "The 5 Principles That Restore Broken Trust",
      scripture: "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
      scriptureRef: "1 John 1:9",
      focus: "Trust restores through: (1) Full Responsibility, (2) Emotional Safety, (3) Consistency, (4) Protected Vulnerability, (5) Empathy. Discuss where your marriage needs these most.",
      action: "Choose one principle and commit to practicing it this week. Report back to each other on Friday.",
      reflection: "Which principle is hardest for us to live out right now?",
    },
  },
  {
    month: 11,
    cycle: 4,
    cycleName: "Trust",
    theme: "Never Use Pain as a Weapon",
    couples1: {
      subject: "The Most Devastating Act in Marriage — Using Pain Against Each Other",
      title: "The Most Devastating Act in Marriage — Using Pain Against Each Other",
      scripture: "Above all, keep loving one another earnestly, since love covers a multitude of sins.",
      scriptureRef: "1 Peter 4:8",
      focus: "Nothing destroys trust faster than when your deepest confession becomes tomorrow's ammunition. When your pain is weaponized, so is your marriage.",
      action: "Make a commitment together: 'Your vulnerability will never be used against you. This is sacred ground.'",
      reflection: "Have I used my spouse's pain, confession, or failure against them in anger?",
    },
    husbands: {
      subject: "Become Her Safe Place — Protect What She Shares",
      title: "Become Her Safe Place — Protect What She Shares",
      scripture: "Who can find a virtuous woman? For her worth is far above rubies.",
      scriptureRef: "Proverbs 31:10",
      focus: "When she opens her heart about shame, fear, or failure, you become her protector, not her prosecutor. Satan is the accuser — never join him.",
      action: "This week, if she shares something vulnerable, respond with: 'Thank you for trusting me. Your heart is safe with me.'",
      reflection: "When my wife is vulnerable, do I protect her or judge her?",
    },
    wives: {
      subject: "Trust That Honesty Heals — Not Hides",
      title: "Trust That Honesty Heals — Not Hides",
      scripture: "Healing is a posture of humility, not shame.",
      scriptureRef: "James 5:16",
      focus: "There is deep remorse in your heart. That remorse is your redemption. Speak it. Your husband needs to hear you are sorry — truly, deeply sorry.",
      action: "If you have been hiding something, confess it. Choose the right time, speak with sincerity, and accept the consequences of honesty.",
      reflection: "Am I more afraid of his response than I am committed to his trust?",
    },
    couples2: {
      subject: "Create a Safe Culture in Your Marriage",
      title: "Create a Safe Culture in Your Marriage",
      scripture: "Let each of you look not only to his own interests, but also to the interests of others.",
      scriptureRef: "Philippians 2:4",
      focus: "Safety is not silence. It is honesty met with grace. Can you tell each other hard things and still be loved?",
      action: "Sit down and agree: What does 'safe' mean to us? What does 'unsafe' look like? How will we protect each other?",
      reflection: "Is our marriage a place of grace or a place of judgment?",
    },
  },
  {
    month: 12,
    cycle: 4,
    cycleName: "Trust",
    theme: "Rebuild Through Consistency and Empathy",
    couples1: {
      subject: "Trust Is Rebuilt Through Consistent, Humble Love",
      title: "Trust Is Rebuilt Through Consistent, Humble Love",
      scripture: "He who is faithful in little will be faithful in much.",
      scriptureRef: "Luke 16:10",
      focus: "Trust is not rebuilt through promises. It is rebuilt through repeated, consistent behavior. Your actions — not your words — restore what was broken.",
      action: "Identify one consistent behavior you will do every single week to rebuild trust. Do it without exception.",
      reflection: "Am I willing to live differently — not just talk differently?",
    },
    husbands: {
      subject: "Love Her with Empathy, Not Control",
      title: "Love Her with Empathy, Not Control",
      scripture: "Finally, all of you, be of one mind, sympathetic, loving one another tenderly, and humble.",
      scriptureRef: "1 Peter 3:8",
      focus: "Control destroys trust. Empathy restores it. Listen to her heart. Understand her pain. Care about her experience.",
      action: "This week, ask: 'How are you really feeling?' and listen for 15 minutes without trying to fix, defend, or redirect. Just listen.",
      reflection: "Do I really understand what my wife is carrying?",
    },
    wives: {
      subject: "Forgive, Release, and Believe in Transformation",
      title: "Forgive, Release, and Believe in Transformation",
      scripture: "As far as the east is from the west, so far does he remove our transgressions from us.",
      scriptureRef: "Psalm 103:12",
      focus: "Forgiveness is not forgetting. It is releasing your right to hold it against him. Believe that he can change. Give him space to become new.",
      action: "Release one thing you have been holding against your husband. Say it out loud: 'I forgive you and I am releasing this.'",
      reflection: "Am I truly letting go or just managing resentment?",
    },
    couples2: {
      subject: "Your Marriage Will Be Tested — And That's a Gift",
      title: "Your Marriage Will Be Tested — And That's a Gift",
      scripture: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.",
      scriptureRef: "James 1:2",
      focus: "Trials strengthen real marriages. Tests reveal what is true. You will be tested — and that test is meant to strengthen your bond, not destroy it. Trust the process.",
      action: "Reflect together: What test has made us stronger? How can we face the next one together?",
      reflection: "Do we see trials as threats or as opportunities to prove our commitment?",
    },
  },
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
