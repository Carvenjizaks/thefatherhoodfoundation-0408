'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Star, Users, Calendar, MapPin, Clock, Shield, Heart, AlertTriangle } from 'lucide-react'

const warmColors = {
  primary: '#800000',
  primaryLight: '#A52A2A',
  cream: '#FFF8F0',
  warmBg: '#FDF6E9',
  textDark: '#2D1810',
  textMuted: '#6B4423',
  gold: '#D4AF37'
}

export default function MyGreatMarriageConferencePage() {
  const [showForm, setShowForm] = useState(false)

  const benefits = [
    'Rebuild trust even after betrayal',
    'Master communication that actually works',
    'Reignite intimacy and connection',
    'Stop recurring conflicts for good',
    'Create a shared vision for your future',
    'Develop daily habits that strengthen your bond'
  ]

  const objections = [
    { q: 'What if my spouse doesn\'t want to come?', a: 'Many couples start with one hesitant partner. By Day 2, they\'re both fully engaged. We create a safe space where both perspectives are honored.' },
    { q: 'We\'ve tried counseling before and it didn\'t work.', a: 'This isn\'t counseling—it\'s a transformational experience. Our 3-day immersive approach creates breakthroughs that months of weekly sessions often miss.' },
    { q: 'Is this worth the investment?', a: 'Consider the cost of divorce—financially, emotionally, and for your children. This investment is a fraction of that, with the potential to transform your entire future.' },
    { q: 'What if we\'re too far gone?', a: 'We\'ve seen couples on the brink of divorce create entirely new marriages. If there\'s even 1% hope, this conference can multiply it.' }
  ]

  return (
    <div className="min-h-screen" style={{ background: warmColors.cream }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${warmColors.cream} 0%, ${warmColors.warmBg} 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full" style={{ background: warmColors.primary }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ background: warmColors.primaryLight }} />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: `${warmColors.primary}15`, color: warmColors.primary }}>
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">May 7-9, 2026 • Windhoek, Namibia</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: warmColors.textDark }}>
              Save Your Marriage.<br />
              <span style={{ color: warmColors.primary }}>Transform Your Legacy.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: warmColors.textMuted }}>
              A 3-day immersive experience for couples ready to rebuild trust, 
              reignite passion, and create the marriage they always dreamed of.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                style={{ background: warmColors.primary, color: 'white' }}
                onClick={() => setShowForm(true)}
              >
                Register Now — Early Bird $297
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                style={{ borderColor: warmColors.primary, color: warmColors.primary }}
              >
                Watch the Video
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: warmColors.textMuted }}>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Limited to 50 Couples
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> 100% Confidential
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Proven Results
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-6" style={{ background: warmColors.primary }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Silent Crisis Destroying Marriages
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every day, couples drift further apart—not because they stop loving each other, 
            but because they stop fighting for each other.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="pt-6">
                <AlertTriangle className="w-8 h-8 mb-4" />
                <h3 className="font-bold mb-2">Communication Breakdown</h3>
                <p className="text-sm opacity-80">Conversations become conflicts. Silence becomes the norm.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="pt-6">
                <AlertTriangle className="w-8 h-8 mb-4" />
                <h3 className="font-bold mb-2">Intimacy Disappears</h3>
                <p className="text-sm opacity-80">Physical and emotional connection fades into routine.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="pt-6">
                <AlertTriangle className="w-8 h-8 mb-4" />
                <h3 className="font-bold mb-2">Trust Erodes</h3>
                <p className="text-sm opacity-80">Past hurts and broken promises create walls.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 px-6" style={{ background: warmColors.warmBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: warmColors.textDark }}>
              The MyGreatMarriage Conference Experience
            </h2>
            <p className="text-xl" style={{ color: warmColors.textMuted }}>
              Three transformative days that will change everything.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2" style={{ borderColor: `${warmColors.primary}20` }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: warmColors.primary }}>
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.primary }}>Day 1: Foundation</h3>
                <p style={{ color: warmColors.textMuted }}>
                  Assess where you are. Identify root causes. Understand each other's deepest needs. 
                  Learn the 5 love languages in action.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2" style={{ borderColor: `${warmColors.primary}20` }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: warmColors.primary }}>
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.primary }}>Day 2: Connection</h3>
                <p style={{ color: warmColors.textMuted }}>
                  Master communication that works. Resolve conflicts without fighting. 
                  Rebuild trust. Create emotional safety.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2" style={{ borderColor: `${warmColors.primary}20` }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: warmColors.primary }}>
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.primary }}>Day 3: Future</h3>
                <p style={{ color: warmColors.textMuted }}>
                  Design your shared vision. Create daily habits. Build your roadmap. 
                  Leave with a personalized action plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: warmColors.textDark }}>
            What You'll Walk Away With
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: warmColors.warmBg }}>
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: warmColors.primary }} />
                <span className="text-lg" style={{ color: warmColors.textDark }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6" style={{ background: warmColors.warmBg }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: warmColors.textDark }}>
            Real Couples. Real Results.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic" style={{ color: warmColors.textMuted }}>
                  "We were on the brink of divorce. 20 years of marriage, and we were ready to give up. 
                  This conference gave us the tools we needed to rebuild. Today, we're closer than ever."
                </p>
                <p className="font-semibold" style={{ color: warmColors.textDark }}>— Michael & Jennifer R.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic" style={{ color: warmColors.textMuted }}>
                  "I was skeptical. My husband had to drag me here. But by Day 2, I was crying tears of relief. 
                  For the first time in years, I felt understood."
                </p>
                <p className="font-semibold" style={{ color: warmColors.textDark }}>— Sarah T.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic" style={{ color: warmColors.textMuted }}>
                  "The practical tools we learned changed everything. We went from arguing every day 
                  to actually enjoying each other's company again."
                </p>
                <p className="font-semibold" style={{ color: warmColors.textDark }}>— David & Lisa M.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objections Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: warmColors.textDark }}>
            Your Questions Answered
          </h2>
          <div className="space-y-4">
            {objections.map((obj, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: warmColors.primary }}>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2" style={{ color: warmColors.primary }}>{obj.q}</h3>
                  <p style={{ color: warmColors.textMuted }}>{obj.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 px-6" style={{ background: warmColors.warmBg }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: warmColors.textDark }}>
            Event Details
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Calendar className="w-12 h-12 mb-4" style={{ color: warmColors.primary }} />
              <h3 className="font-bold text-lg mb-2">Dates</h3>
              <p style={{ color: warmColors.textMuted }}>May 7-9, 2026</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-4" style={{ color: warmColors.primary }} />
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p style={{ color: warmColors.textMuted }}>Windhoek, Namibia<br />(Venue TBA)</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 mb-4" style={{ color: warmColors.primary }} />
              <h3 className="font-bold text-lg mb-2">Schedule</h3>
              <p style={{ color: warmColors.textMuted }}>9:00 AM - 6:00 PM Daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & CTA Section */}
      <section className="py-20 px-6" style={{ background: warmColors.primary }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invest in Your Marriage
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Early Bird Pricing — Save $200
          </p>
          
          <div className="bg-white/10 rounded-2xl p-8 mb-8 max-w-md mx-auto">
            <div className="text-sm mb-2 opacity-80">Regular Price: $497</div>
            <div className="text-5xl font-bold mb-4">$297</div>
            <div className="text-sm mb-6 opacity-80">per couple</div>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Full 3-day conference access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Workbook & materials
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Lunch included all 3 days
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> 30-day follow-up program
              </li>
            </ul>
            <Button 
              size="lg" 
              className="w-full text-lg py-6 bg-white hover:bg-gray-100"
              style={{ color: warmColors.primary }}
              onClick={() => setShowForm(true)}
            >
              Register Now — Limited Spots
            </Button>
          </div>
          
          <p className="text-sm opacity-80">
            100% Money-Back Guarantee. If you don't see value by Day 2, we'll refund every cent.
          </p>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 px-6" style={{ background: warmColors.gold }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: warmColors.textDark }}>
            ⚠️ Only 50 Couples Allowed
          </h2>
          <p className="text-lg mb-4" style={{ color: warmColors.textDark }}>
            To ensure personalized attention and an intimate experience, we're strictly limiting attendance.
          </p>
          <p className="font-bold text-xl" style={{ color: warmColors.primary }}>
            Early Bird pricing ends soon. Don't wait.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center" style={{ background: warmColors.textDark, color: 'white' }}>
        <p className="mb-4">The Fatherhood Foundation</p>
        <p className="text-sm opacity-60">
          Empowering men to become intentional fathers, committed husbands, and impactful leaders.
        </p>
      </footer>
    </div>
  )
}