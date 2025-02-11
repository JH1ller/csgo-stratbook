import { Shield, ChevronRight } from "lucide-react"
import Image from "next/image"

export function FeatureSection({ title, description, features, image }: { title: string, description: string, features: string[], image: string }) {
  const imageSrc = '/home/' + image + '.webp'
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
          <Image
            alt={title}
            className="mx-auto w-full aspect-video overflow-hidden rounded-xl object-cover object-center border-4 border-emerald-900"
            height="800"
            src={imageSrc}
            width="1400"
          />
        </div>
      </div>
    </section>
  )
}