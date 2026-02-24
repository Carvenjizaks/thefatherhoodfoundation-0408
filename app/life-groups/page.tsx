'use client'

import Image from 'next/image'
import { Mail, MapPin, Users, Heart } from 'lucide-react'

const LEADERS = [
  {
    id: 1,
    name: 'Leader Name 1',
    district: 'District 1 — North',
    area: 'Placeholder Area',
    email: 'leader1@powerhousec.org',
    photo: '/images/life-groups/leader-1.jpg',
    members: 12,
    day: 'Tuesdays',
    time: '7:00 PM',
  },
  {
    id: 2,
    name: 'Leader Name 2',
    district: 'District 2 — South',
    area: 'Placeholder Area',
    email: 'leader2@powerhousec.org',
    photo: '/images/life-groups/leader-2.jpg',
    members: 9,
    day: 'Wednesdays',
    time: '6:30 PM',
  },
  {
    id: 3,
    name: 'Leader Name 3',
    district: 'District 3 — East',
    area: 'Placeholder Area',
    email: 'leader3@powerhousec.org',
    photo: '/images/life-groups/leader-3.jpg',
    members: 14,
    day: 'Thursdays',
    time: '7:00 PM',
  },
  {
    id: 4,
    name: 'Leader Name 4',
    district: 'District 4 — West',
    area: 'Placeholder Area',
    email: 'leader4@powerhousec.org',
    photo: '/images/life-groups/leader-4.jpg',
    members: 11,
    day: 'Fridays',
    time: '6:00 PM',
  },
  {
    id: 5,
    name: 'Leader Name 5',
    district: 'District 5 — Central',
    area: 'Placeholder Area',
    email: 'leader5@powerhousec.org',
    photo: '/images/life-groups/leader-5.jpg',
    members: 16,
    day: 'Saturdays',
    time: '10:00 AM',
  },
]

export default function LifeGroupsPage() {
  return (
    <div className="min-h-screen bg-background font-sans">

      {/* Hero */}
      <div
        style={{
          background:
            'linear-gradient(135deg, hsl(225,73%,38%) 0%, hsl(200,60%,45%) 50%, hsl(150,40%,50%) 100%)',
        }}
        className="relative overflow-hidden"
      >
        {/* subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 80%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 px-4 py-16 text-center">
          {/* Logo / brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-white/90 font-semibold text-lg tracking-wide">
              Powerhouse Community
            </span>
          </div>

          <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white mb-5">
            #WeCare
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-balance leading-tight mb-4">
            Life Groups
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto text-pretty leading-relaxed">
            Find your community. Choose a District Group Leader below and sign up to join their
            Life Group — a place to grow, connect, and belong.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users className="h-4 w-4" />
              <span>5 District Groups</span>
            </div>
            <div className="h-4 w-px bg-white/30" />
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Across the City</span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-10 overflow-hidden">
          <svg
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <path
              d="M0,40 C300,0 900,40 1200,10 L1200,40 Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </div>

      {/* Leader cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEADERS.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-12 leading-relaxed">
          Not sure which group to join?{' '}
          <a
            href={`mailto:info@powerhousec.org`}
            className="text-primary hover:underline font-medium"
          >
            Email us
          </a>{' '}
          and we will help you find the right fit.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Powerhouse Community &mdash; #WeCare
        </p>
      </div>
    </div>
  )
}

function LeaderCard({ leader }: { leader: (typeof LEADERS)[number] }) {
  return (
    <div className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Photo */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <Image
          src={leader.photo}
          alt={`Photo of ${leader.name}`}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* district badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20"
            style={{ background: 'linear-gradient(135deg, hsl(225,73%,40%,0.85), hsl(150,40%,50%,0.85))' }}
          >
            {leader.district}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-foreground">{leader.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{leader.area}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {leader.members} members
          </span>
          <span className="h-3 w-px bg-border" />
          <span>{leader.day} &bull; {leader.time}</span>
        </div>

        {/* Divider */}
        <div className="mt-4 mb-4 h-px bg-border/60" />

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <a
            href={`mailto:${leader.email}?subject=Life Group Sign-Up — ${leader.district}&body=Hi ${leader.name},%0D%0A%0D%0AI would like to join your Life Group.%0D%0A%0D%0AName: %0D%0AContact Number: %0D%0A%0D%0ALooking forward to connecting!`}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors py-2.5"
            aria-label={`Email ${leader.name}`}
          >
            <Mail className="h-4 w-4 text-primary" />
            Email Leader
          </a>
          <a
            href={`mailto:${leader.email}?subject=Life Group Sign-Up — ${leader.district}&body=Hi ${leader.name},%0D%0A%0D%0AI would like to join your Life Group.%0D%0A%0D%0AName: %0D%0AContact Number: %0D%0A%0D%0ALooking forward to connecting!`}
            className="flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors"
            style={{ background: 'linear-gradient(135deg, hsl(225,73%,40%), hsl(150,40%,50%))' }}
            aria-label={`Sign up with ${leader.name}`}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}
