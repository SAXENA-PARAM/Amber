"use client";
import React from "react";
import { cn } from "@/lib/utils";

import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";

export function TextRevealCardPreview({className,}:{className?:string,}) {
  return (
    <div className={cn("flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-fulla",className) }>
<TextRevealCard
  text="Why AMBER??"
  revealText="Choose the BEST"
>


        
      </TextRevealCard>
    </div>
  );
}
