import Link from "next/link";
import Image from "next/image";
import { HeroHighlight } from "./ui/hero-highlight";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <HeroHighlight>
      <section className="w-full py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4 items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center">
              The Best Place For Your <span className="font-bold tracking-tighter bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">Strats and Nades.</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl text-center">
              Collaborate with your team, manage strategies, and perfect your game plan with our real-time tactics board.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="../login" className="flex justify-center text-center" prefetch={false}>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 pl-4 pr-6"
                >
                  <ChevronRight />
                  <span>Open App</span>
                </HoverBorderGradient>
              </Link>
              <Link href="../api/auth/steam" className="sm:hidden"><Image src="/home/steam_button.png" alt="steam login button" width="180" height="35" /></Link>
            </div>
          </div>
        </div>
      </section>
    </HeroHighlight>
  );
}