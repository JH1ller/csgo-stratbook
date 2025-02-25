'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import Image from 'next/image';

function steamRedirect() {
  window.location.href = '/api/auth/steam';
}

function loginRedirect() {
  window.location.href = '/login';
}

export function SteamButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    const hasSeenAlert = localStorage.getItem('steam-disclaimer');
    if (hasSeenAlert) {
      steamRedirect();
    } else {
      setOpen(true);
      localStorage.setItem('steam-disclaimer', 'true');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button onClick={handleOpen} className={className}>
        <Image
          className="cursor-pointer"
          src="/home/steam_button.png"
          alt="steam login button"
          width="180"
          height="35"
        />
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Steam Login</AlertDialogTitle>
          <AlertDialogDescription>
            Hey there! If your Steam account is not linked to a Stratbook account yet, click okay and you will be
            redirected to the Steam login.
            <br />
            <br />
            Note: If you previously created an account without Steam, please log in with your email and password and
            then link your Steam account on your profile page. Once your accounts are linked, you can log in with Steam.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={loginRedirect}>Go to Login</AlertDialogCancel>
          <AlertDialogAction autoFocus onClick={steamRedirect}>
            Continue to Steam
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
