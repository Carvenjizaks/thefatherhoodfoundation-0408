'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { CheckCircle, Shield, EyeOff } from 'lucide-react'

const categories = [
  { id: 'marriage', label: 'Marriage & Relationships', color: 'bg-rose-100 text-rose-800' },
  { id: 'parenting', label: 'Parenting & Fatherhood', color: 'bg-blue-100 text-blue-800' },
  { id: 'spiritual', label: 'Spiritual Growth', color: 'bg-purple-100 text-purple-800' },
  { id: 'career', label: 'Career & Finances', color: 'bg-green-100 text-green-800' },
  { id: 'health', label: 'Health & Wellness', color: 'bg-orange-100 text-orange-800' },
  { id: 'community', label: 'Community & Support', color: 'bg-teal-100 text-teal-800' }
]

const commonChallenges = [
  'Communication issues with spouse',
  'Balancing work and family',
  'Disciplining children effectively',
  'Financial stress and provision',
  'Lack of time for personal growth',
  'Feeling isolated as a father',
  'Spiritual dryness or doubt',
  'Managing anger and frustration',
  'Intimacy and connection in marriage',
  'Setting healthy boundaries'
]

export default function FeedbackPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    challenge: '',
    customChallenge: '',
    urgency: 5,
    category: '',
    comments: ''
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: formData.customChallenge || formData.challenge,
          urgency: formData.urgency,
          category: formData.category,
          comments: formData.comments
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
              <p className="text-slate-600 mb-4">
                Your feedback has been received anonymously. We appreciate your honesty and will use this to better serve fathers and families.
              </p>
              <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Anonymous Notice */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-[#8B2B3E]/10 border border-[#8B2B3E]/20 rounded-lg p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#8B2B3E] flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                Anonymous Survey
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Your responses are completely anonymous. We do not collect any personally identifiable information. 
                Your honest feedback helps us understand the challenges fathers face and improve our programs.
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-800">
              Share Your Challenges
            </CardTitle>
            <CardDescription className="text-center">
              Help us understand what matters most to you. Your input shapes our programs and resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Step {step} of 4</span>
                <span>{Math.round((step / 4) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div
                  className="h-2 bg-[#8B2B3E] rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Challenge Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Label className="text-lg font-medium">What is your biggest challenge right now?</Label>
                <RadioGroup
                  value={formData.challenge}
                  onValueChange={(value) => setFormData({ ...formData, challenge: value })}
                  className="space-y-2"
                >
                  {commonChallenges.map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <RadioGroupItem value={challenge} id={challenge} />
                      <Label htmlFor={challenge} className="cursor-pointer">{challenge}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other (specify below)</Label>
                  </div>
                </RadioGroup>
                
                {formData.challenge === 'other' && (
                  <Textarea
                    placeholder="Describe your challenge..."
                    value={formData.customChallenge}
                    onChange={(e) => setFormData({ ...formData, customChallenge: e.target.value })}
                    className="mt-2"
                  />
                )}

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.challenge || (formData.challenge === 'other' && !formData.customChallenge)}
                  className="w-full bg-[#8B2B3E] hover:bg-[#7a2636]"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Category */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Label className="text-lg font-medium">Which category best describes this challenge?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.category === cat.id
                          ? 'border-[#8B2B3E] bg-[#8B2B3E]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${cat.color}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.category}
                    className="flex-1 bg-[#8B2B3E] hover:bg-[#7a2636]"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Urgency */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-lg font-medium">How urgent is this challenge?</Label>
                  <p className="text-sm text-slate-500 mb-4">1 = Not urgent, 10 = Extremely urgent</p>
                  
                  <div className="px-2">
                    <Slider
                      value={[formData.urgency]}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value[0] })}
                      max={10}
                      min={1}
                      step={1}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>1</span>
                      <span className="font-bold text-[#8B2B3E] text-lg">{formData.urgency}</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      {formData.urgency <= 3 && 'This is a low-urgency challenge that can be addressed over time.'}
                      {formData.urgency > 3 && formData.urgency <= 6 && 'This is a moderate challenge that should be addressed in the near future.'}
                      {formData.urgency > 6 && formData.urgency <= 8 && 'This is a high-priority challenge requiring attention soon.'}
                      {formData.urgency > 8 && 'This is a critical challenge requiring immediate attention.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 bg-[#8B2B3E] hover:bg-[#7a2636]"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Additional Comments */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-lg font-medium">Anything else you'd like to share?</Label>
                  <p className="text-sm text-slate-500 mb-2">Optional - your additional thoughts help us understand better</p>
                  <Textarea
                    placeholder="Share any additional details, context, or suggestions..."
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">Summary</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li><strong>Challenge:</strong> {formData.customChallenge || formData.challenge}</li>
                    <li><strong>Category:</strong> {categories.find(c => c.id === formData.category)?.label}</li>
                    <li><strong>Urgency:</strong> {formData.urgency}/10</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#8B2B3E] hover:bg-[#7a2636]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Your privacy is our priority. No personal information is collected or stored. 
          <br />
          Responses are used solely to improve our programs and resources.
        </p>
      </div>
    </div>
  )
}