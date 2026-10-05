import type { Metadata } from "next";

import { PROJECT } from "@/lib/config/project";

import { PlayClientView } from "./PlayClientView";

export const metadata: Metadata = {
  title: "Play",
  description: `${PROJECT.name} 3D Engine Preview — Phase 1.`,
};

export default function PlayPage() {
  return <PlayClientView />;
}
