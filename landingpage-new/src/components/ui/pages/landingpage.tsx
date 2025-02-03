import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bomb, Crosshair, Users, Map, Shield, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { HeroHighlight } from "../hero-highlight"
// import Logo from '@/public/stratbook_icon.svg'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image className="h-10 w-10" src="/stratbook_icon.svg" alt="logo" width="40" height="40" />
            <span className="font-bold text-xl">Stratbook</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Log in</Button>
            <Button>Sign up</Button>
            <Button variant="ghost" className="md:hidden" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroHighlight>
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <Image
                  alt="CSGO Strategy Map"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  height="310"
                  src="/strats_overview.webp"
                  width="550"
                />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Master Your CSGO Strategies
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Collaborate with your team, manage strategies, and perfect your grenade lineups. Elevate your game with
                      Stratbook.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg">Get Started</Button>
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section></HeroHighlight>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Crosshair className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Strategy Management</h3>
                <p className="text-muted-foreground">Create, edit, and organize your CSGO strategies with ease.</p>
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevate Your Team&apos;s Performance</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  With Stratbook, you&apos;ll have all the tools you need to take your CSGO team to the next level. From strategy
                  planning to grenade practice, we&apos;ve got you covered.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple Pricing</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col p-6 bg-background shadow-lg rounded-lg justify-between border">
                <div>
                  <h3 className="text-2xl font-bold text-center mb-4">Team Plan</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Up to 10 team members</li>
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Unlimited strategies</li>
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Advanced collaboration tools</li>
                  </ul>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold">$19.99</span>/month
                  <Button className="w-full mt-4" size="lg">Get Started</Button>
                </div>
              </div>
              <div className="flex flex-col p-6 bg-background shadow-lg rounded-lg justify-between border">
                <div>
                  <h3 className="text-2xl font-bold text-center mb-4">Pro Plan</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Unlimited team members</li>
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Advanced analytics</li>
                    <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Priority support</li>
                  </ul>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold">$39.99</span>/month
                  <Button className="w-full mt-4" size="lg">Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Have questions? We&apos;re here to help. Reach out to our team for support or inquiries.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-4">
                  <Input type="email" placeholder="Enter your email" />
                  <Button type="submit" size="lg">Contact Us</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2023 Stratbook. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}