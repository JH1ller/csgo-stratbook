import { ChevronRight } from "lucide-react"
import { HeroCard } from "./ui/hero-card"

export type FeatureSectionProps = {
  title: string;
  description: string;
  features: string[];
  image: string;
  mobileImg?: string;
};

export function FeatureSection({ title, description, features, image, mobileImg }: FeatureSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 even:bg-zinc-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
            <p className="text-muted-foreground md:text-lg">
              {description}
            </p>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center"><ChevronRight className="mr-2 h-4 w-4" /> {feature}</li>
              ))}
            </ul>
          </div>
          <HeroCard containerClassName="aspect-w-16 aspect-h-9" image={image} mobileImg={mobileImg} />
        </div>
      </div>
    </section>
  )
}