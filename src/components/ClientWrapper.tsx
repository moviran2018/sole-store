"use client";

import dynamic from "next/dynamic";
import { shoes as staticShoes } from "@/data/shoes";
import type { Shoe } from "@/types/shoe";

const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });

export default function ClientWrapper({ products: mergedProducts }: { products?: Shoe[] }) {
  const products = mergedProducts || staticShoes;
  return <ChatBot products={products} />;
}
