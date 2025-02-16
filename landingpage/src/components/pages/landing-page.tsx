import { FeatureSection, FeatureSectionProps } from '../feature-section';
import { HeroSection } from '../hero-section';
import { ContactSection } from '../contact-section';

const featureSections: FeatureSectionProps[] = [
  {
    title: 'Interactive Tactics Board',
    description:
      'Plan out your strategies using our interactive map board. Place player positions, draw movement paths, and annotate key areas with ease. Collaborate in real-time with your team to perfect your tactics.',
    image: 'map_tool',
    features: ['Drag-and-drop player positions', 'Draw paths and place utilities', 'Add text annotations'],
  },
  {
    title: 'Strategy Management',
    description:
      'Create and share your strategies with your team. Keep your team on the same page and ready for match day. Use powerful quick filters to find the right strategy for the right moment.',
    image: 'strats_overview',
    mobileImg: 'strats_mobile',
    features: [
      'Unique tactics board for each strat',
      'Add steps for each player and reference them',
      'Link nade lineups and videos',
      'Add custom labels to filter by',
    ],
  },
  {
    title: 'Grenade Lineup Library',
    description:
      'Build a comprehensive library of grenade lineups for every map. Upload screenshots or videos, add step-by-step instructions, and categorize your lineups for quick access during practice or matches.',
    image: 'utility_filters',
    mobileImg: 'utility_mobile',
    features: [
      'Upload screenshots or videos',
      'Categorize lineups by map, type or side',
      'Add custom labels for advanced filtering',
    ],
  },
  {
    title: 'Team Management Dashboard',
    description:
      'Manage your team efficiently with our comprehensive dashboard. Assign roles and colors and quickly join your practice server.',
    image: 'team_page',
    features: ['Assign roles and permissions', 'Customize team colors', 'Quickly join practice server'],
  },
];

export function LandingPageComponent() {
  return (
    <main className="flex-1">
      <HeroSection />

      {featureSections.map((feature) => (
        <FeatureSection key={feature.title} {...feature} />
      ))}

      <ContactSection />
    </main>
  );
}
