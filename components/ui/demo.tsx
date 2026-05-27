"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export type CardT = {
  image: string;
  name: string;
  handle: string;
  quote?: string;
};

const DEFAULT_DATA: CardT[] = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    quote: "Radiant made undercutting all of our competitors an absolute breeze.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    quote: "Radiant made undercutting all of our competitors an absolute breeze.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    quote: "Radiant made undercutting all of our competitors an absolute breeze.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Avery Johnson",
    handle: "@averywrites",
    quote: "Radiant made undercutting all of our competitors an absolute breeze.",
  },
];

const Card = ({ card }: { card: CardT }) => (
  <div className="mx-4 w-72 shrink-0 rounded-lg bg-white p-4 shadow transition-all duration-200 hover:shadow-lg">
    <div className="flex gap-2">
      <Image className="size-11 rounded-full object-cover" src={card.image} alt={card.name} width={44} height={44} unoptimized />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="font-medium text-gray-950">{card.name}</p>
          <BadgeCheck className="size-3.5 fill-blue-500 text-white" aria-label="Verified" />
        </div>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="pt-4 text-sm leading-6 text-gray-800">
      {card.quote ?? "Radiant made undercutting all of our competitors an absolute breeze."}
    </p>
  </div>
);

function MarqueeRow({
  data,
  reverse = false,
  speed = 25,
}: {
  data: CardT[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = React.useMemo(() => [...data, ...data], [data]);

  return (
    <div className="relative mx-auto w-full max-w-6xl isolate overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent blur-md md:w-32" />
      <div
        className={`flex min-w-[200%] transform-gpu ${
          reverse ? "pb-10 pt-5" : "pb-5 pt-10"
        }`}
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((card, index) => (
          <Card key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent blur-md md:w-32" />
    </div>
  );
}

export default function Marquee({
  row1 = DEFAULT_DATA,
  row2 = DEFAULT_DATA,
}: {
  row1?: CardT[];
  row2?: CardT[];
}) {
  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeScroll"] {
            animation-play-state: paused;
          }
        }
      `}</style>
      <div className="flex flex-col gap-6">
        <MarqueeRow data={row1} reverse={false} speed={25} />
        <MarqueeRow data={row2} reverse={true} speed={25} />
      </div>
    </>
  );
}
