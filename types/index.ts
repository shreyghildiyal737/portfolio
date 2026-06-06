export interface Project {
  id: string;
  slug: string;
  title: string;
  systemId: string;
  tagline: string;
  description: string;
  heroImage?: string;
  status: "shipped" | "in-progress" | "archived";
  year: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  philosophy: string;
  links: { label: string; href: string }[];
  tags: string[];
  // Rich dossier fields — used on case study detail pages
  problem?: string;
  productExperience?: string;
  architectureLayers?: { name: string; detail: string }[];
  tradeoffs?: { decision: string; reason: string; v2?: string }[];
  aiWorkflow?: {
    helped: string[];
    judgment: string[];
    couldNotSolve: string[];
  };
  lessons?: string[];
  capabilityProof?: string;
}

export interface TimelinePhase {
  id: string;
  phase: string;
  period: string;
  title: string;
  description: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  image?: string;
  isCurrent?: boolean;
  shift?: string;
  depth?: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
