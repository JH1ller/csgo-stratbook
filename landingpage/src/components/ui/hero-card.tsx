"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { getImagePath } from "@/lib/assetsPath";

type HeroCardProps = { className?: string; containerClassName?: string; image: string; mobileImg?: string };

export function HeroCard({ className, containerClassName, image, mobileImg }: HeroCardProps) {
  return (
    <CardContainer className={className} containerClassName={containerClassName}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] w-auto h-auto rounded-xl border-emerald-900 border-2 ring-4 ring-neutral-950">
        <Image
          src={getImagePath(image)}
          height="800"
          width="1400"
          className="w-full object-cover rounded-xl group-hover/card:shadow-xl"
          alt="thumbnail"
        />
        {mobileImg && <CardItem
          as="div"
          translateZ="60"
          className="absolute top-[10%] right-[7%] shadow-xl rounded-md group-hover/card:shadow-2xl group-hover/card:shadow-emerald-500/[0.1] w-[25%] border-emerald-900 border-2 ring-4 ring-neutral-950 hover:opacity-50"
        >
          <Image
            src={getImagePath(mobileImg)}
            height="700"
            width="320"
            className="object-cover rounded-md"
            alt="mobile strats"
          />
        </CardItem>}
      </CardBody>
    </CardContainer>
  );
}