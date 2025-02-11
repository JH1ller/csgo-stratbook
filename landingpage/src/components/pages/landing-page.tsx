'use client'

import { Crosshair, Users, Map, Menu } from 'lucide-react'
import { FeatureSection } from "../feature-section"
import { HeroSection } from "../hero-section"
import { ContactSection } from "../contact-section"

const featureSections = [
  {
    title: 'Interactive Tactics Board',
    description: 'Plan out your strategies using our interactive map board. Place player positions, draw movement paths, and annotate key areas with ease. Collaborate in real-time with your team to perfect your tactics.',
    image: 'map_tool',
    features: [
      'Drag-and-drop player positions',
      'Draw arrows and paths',
      'Add text annotations',
    ],
  },
  {
    title: 'Strategy Management',
    description: 'Build a comprehensive library of grenade lineups for every map. Upload screenshots or videos, add step-by-step instructions, and categorize your lineups for quick access during practice or matches.',
    image: 'strats_overview',
    features: [
      'Upload screenshots or videos',
      'Add step-by-step instructions',
      'Categorize lineups by map',
    ],
  },
  {
    title: 'Grenade Lineup Library',
    description: 'Build a comprehensive library of grenade lineups for every map. Upload screenshots or videos, add step-by-step instructions, and categorize your lineups for quick access during practice or matches.',
    image: 'utility_filters',
    features: [
      'Upload screenshots or videos',
      'Add step-by-step instructions',
      'Categorize lineups by map',
    ],
  },
  {
    title: 'Team Management Dashboard',
    description: 'Manage your team efficiently with our comprehensive dashboard. Assign roles, track strategy familiarity, and schedule practice sessions all in one place. Keep your team organized and focused on improvement.',
    image: 'team_page',
    features: [
      'Assign roles and permissions',
      'Track strategy familiarity',
      'Schedule practice sessions',
    ],
  },
]

export function LandingPageComponent() {
  return (
    <main className="flex-1">
      <HeroSection />


      {featureSections.map((feature) => (
        <FeatureSection key={feature.title} {...feature} />
      ))}

      <ContactSection />
    </main>

  )
}