import Link from "next/link";
import { Button } from "./ui/button";
import Image from 'next/image';
import dynamic from "next/dynamic";

const BackgroundBeams = dynamic(() => import("./ui/background-beams"), { ssr: false });

export function ContactSection() {
  return (
    <section id="contact" className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Have questions? We&apos;re here to help. Reach out to our team for support or inquiries.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6" >
            <Link href="https://discord.com/invite/mkxzQJGRgq"><Button type="submit" size="lg"><Image src="/home/discord.svg" alt="Discord Logo" width="32" height="32" />Join the Discord</Button></Link>
            <Link href="https://ko-fi.com/Q5Q02X2XQ" target="_blank"><Button size="lg"><Image src="/home/kofi.png" alt="Kofi Logo" width="32" height="32" />Buy me a coffee</Button></Link>
          </div>
        </div>
      </div>
      <BackgroundBeams className="pointer-events-none" />
    </section>
  )
}