'use client'

import { Crosshair, Users, Map, Menu } from 'lucide-react'
import { FeatureSection } from "../feature-section"
import { HeroSection } from "../hero-section"
import { ContactSection } from "../contact-section"

const featureSections = [
  {
    title: 'Interactive Strategy Board',
    description: 'Create and edit strategies using our interactive map board. Place player positions, draw movement paths, and annotate key areas with ease. Collaborate in real-time with your team to perfect your tactics.',
    image: 'map_tool',
    features: [
      'Drag-and-drop player positions',
      'Draw arrows and paths',
      'Add text annotations',
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
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/20 p-4 rounded-full">
                <Crosshair className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Strategy Management</h3>
              <p className="text-muted-foreground">Create, edit, and organize your CS2 strategies with ease.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/20 p-4 rounded-full">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Team Collaboration</h3>
              <p className="text-muted-foreground">Work together with your team in real-time on strategies and tactics.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/20 p-4 rounded-full">
                <Map className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Grenade Lineups</h3>
              <p className="text-muted-foreground">Store and share precise grenade lineups for every map.</p>
            </div>
          </div>
        </div>
      </section>

      {featureSections.map((feature) => (
        <FeatureSection key={feature.title} {...feature} />
      ))}

      <ContactSection />
    </main>

  )
}