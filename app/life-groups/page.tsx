'use client'

import Image from 'next/image'
import { Mail, MapPin, Users, Calendar, ChevronRight, Heart } from 'lucide-react'

const LEADERS = [
  {
    id: 1,
    name: 'Leader Name',
    district: 'District 1',
    region: 'North',
    area: 'Placeholder Area',
    email: 'leader1@powerhousec.org',
    photo: '/images/life-groups/leader-1.jpg',
    members: 12,
    day: 'Tuesdays',
    time: '7:00 PM',
    gradient: 'from-blue-600 to-blue-400',
    badgeBg: '#EFF6FF',
    badgeColor: '#1D4ED8',
    badgeBorder: '#BFDBFE',
  },
  {
    id: 2,
    name: 'Leader Name',
    district: 'District 2',
    region: 'South',
    area: 'Placeholder Area',
    email: 'leader2@powerhousec.org',
    photo: '/images/life-groups/leader-2.jpg',
    members: 9,
    day: 'Wednesdays',
    time: '6:30 PM',
    gradient: 'from-emerald-600 to-teal-400',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    badgeBorder: '#A7F3D0',
  },
  {
    id: 3,
    name: 'Leader Name',
    district: 'District 3',
    region: 'East',
    area: 'Placeholder Area',
    email: 'leader3@powerhousec.org',
    photo: '/images/life-groups/leader-3.jpg',
    members: 14,
    day: 'Thursdays',
    time: '7:00 PM',
    gradient: 'from-violet-600 to-purple-400',
    badgeBg: '#F5F3FF',
    badgeColor: '#5B21B6',
    badgeBorder: '#DDD6FE',
  },
  {
    id: 4,
    name: 'Leader Name',
    district: 'District 4',
    region: 'West',
    area: 'Placeholder Area',
    email: 'leader4@powerhousec.org',
    photo: '/images/life-groups/leader-4.jpg',
    members: 11,
    day: 'Fridays',
    time: '6:00 PM',
    gradient: 'from-rose-500 to-pink-400',
    badgeBg: '#FFF1F2',
    badgeColor: '#9F1239',
    badgeBorder: '#FECDD3',
  },
  {
    id: 5,
    name: 'Leader Name',
    district: 'District 5',
    region: 'Central',
    area: 'Placeholder Area',
    email: 'leader5@powerhousec.org',
    photo: '/images/life-groups/leader-5.jpg',
    members: 16,
    day: 'Saturdays',
    time: '10:00 AM',
    gradient: 'from-amber-500 to-orange-400',
    badgeBg: '#FFFBEB',
    badgeColor: '#92400E',
    badgeBorder: '#FDE68A',
  },
]

export default function LifeGroupsPage() {
  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(225,73%,38%) 0%, hsl(210,65%,42%) 50%, hsl(150,40%,42%) 100%)' }}>
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-16 pb-20 text-center sm:pt-24">
          <div className="mb-6 flex justify-center">
            <Image src="/images/logo.png" alt="Powerhouse Community" width={60} height={60} className="object-contain drop-shadow-md" priority />
          </div>

          <span className="inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm mb-5">
            #WeCare
          </span>

          <h1 className="text-4xl font-bold text-white text-balance leading-tight mb-3 sm:text-5xl">
            Life Groups
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-lg mx-auto text-pretty sm:text-lg">
            Find your community. Choose a District Group Leader below and sign up to grow, connect, and belong.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/75">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 5 District Groups</span>
            <span className="h-4 w-px bg-white/30 hidden sm:block" />
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Across the City</span>
            <span className="h-4 w-px bg-white/30 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> Open to Everyone</span>
          </div>
        </div>

        {/* Wave */}
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0,48 C480,0 960,40 1440,12 L1440,48 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </div>

      {/* ── Sub-heading ── */}
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-2 text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl text-balance">Meet Your District Leaders</h2>
        <p className="mt-2 text-muted-foreground text-pretty max-w-xl mx-auto">
          Click <strong>Email Leader</strong> with any questions, or <strong>Sign Up</strong> to join their group.
        </p>
      </div>

      {/* ── Leader cards grid ── */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERS.map((leader) => (
            <div
              key={leader.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Accent bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${leader.gradient}`} />

              {/* Photo */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={leader.photo}
                  alt={`${leader.name} — ${leader.district}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* District badge overlay */}
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                    style={{ background: leader.badgeBg + 'cc', color: leader.badgeColor, borderColor: leader.badgeBorder }}
                  >
                    {leader.district} &mdash; {leader.region}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-foreground">{leader.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{leader.area}</p>

                <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {leader.day} at {leader.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {leader.members} members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {leader.area}
                  </span>
                </div>

                <div className="my-4 h-px bg-border/60" />

                {/* Action buttons */}
                <div className="mt-auto flex gap-2">
                  <a
                    href={`mailto:${leader.email}?subject=Question about ${leader.district} Life Group&body=Hi ${leader.name},%0D%0A%0D%0AI have a question about your Life Group.%0D%0A%0D%0AThank you!`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={`Email ${leader.name}`}
                    title="Email Leader"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${leader.email}?subject=Sign Up — ${leader.district} Life Group&body=Hi ${leader.name},%0D%0A%0D%0AI would like to sign up for your Life Group!%0D%0A%0D%0AName: %0D%0AContact Number: %0D%0A%0D%0ALooking forward to connecting!`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, hsl(225,73%,40%), hsl(150,40%,50%))` }}
                  >
                    Sign Up
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Not sure which group to join?{' '}
          <a href="mailto:info@powerhousec.org?subject=Life Groups Enquiry" className="font-medium text-primary hover:underline">
            Contact us
          </a>{' '}
          and we will help you find the right fit.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Powerhouse Community &mdash; #WeCare
        </p>
      </footer>
    </div>
  )
}
