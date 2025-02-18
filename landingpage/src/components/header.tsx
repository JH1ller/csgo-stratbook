import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link className="flex items-center space-x-4 cursor-pointer" href="/">
          <Image className="h-10 w-10" src="/home/stratbook_icon.svg" alt="logo" width="40" height="40" />
          <span className="font-bold text-xl">Stratbook</span>
        </Link>
        {/* <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav> */}
        <div className="flex items-center space-x-4">
          <Link href="../api/auth/steam" className="hidden sm:block" prefetch={false}><Image src="/home/steam_button.png" alt="steam login button" width="180" height="35" /></Link>
        </div>
      </div>
    </header>
  )
}