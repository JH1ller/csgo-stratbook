import Link from "next/link";
import Image from "next/image";
import { HeroHighlight } from "./ui/hero-highlight";
import { Button } from "./ui/button";
import { HeroCard } from "./ui/hero-card";

export function HeroSection() {
  return (
    <HeroHighlight>
      <section className="w-full py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 grid-cols-[1fr] lg:gap-12 xl:grid-cols-[1fr_0.8fr]">
            <div className="flex flex-col justify-center space-y-4 items-center xl:items-start">
              <div className="space-y-2 text-center xl:text-start flex flex-col items-center xl:items-start">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  The Best Place For Your Strats and Nades.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Collaborate with your team, manage strategies, and perfect your game plan with our real-time tactics board.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row items-stretch">
                <Link href="../"><Button className="w-full" size="lg">Open app</Button></Link>
                <Link href="../api/auth/steam" className="sm:hidden"><Image src="/home/steam_button.png" alt="steam login button" width="180" height="35" /></Link>
              </div>
            </div>
            <HeroCard className="sm:w-full aspect-video" containerClassName="hidden xl:block" />
          </div>
        </div>
      </section>
    </HeroHighlight>
  );
}