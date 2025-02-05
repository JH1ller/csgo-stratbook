"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";

export function HeroCard({ className }: { className?: string }) {
  return (
    <CardContainer className={className}>
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-1 border">
        <Image
          src="/home/strats_overview.webp"
          height="800"
          width="1400"
          className="w-full object-cover rounded-xl group-hover/card:shadow-xl"
          alt="thumbnail"
        />
      </CardBody>
    </CardContainer>
  );
}