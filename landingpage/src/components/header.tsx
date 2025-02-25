import Link from 'next/link';
import Image from 'next/image';

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog';
import { SteamButton } from './steam-button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link className="flex items-center space-x-4 cursor-pointer" href="/">
          <Image className="h-10 w-10" src="/home/stratbook_icon.svg" alt="logo" width="40" height="40" />
          <span className="font-bold text-xl">Stratbook</span>
        </Link>
        <div className="flex items-center space-x-4">
          <SteamButton className="hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
