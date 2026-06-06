import { SITE_LINKS } from "@/lib/site";

export const person = {
  name: "Shrey Ghildiyal",
  title: "Full-stack engineer. Backend roots, building ventures across the stack.",
  tagline:
    "Full-stack engineer with Java and Spring roots, now building founder-stage products across Ireland - backend systems, AI, and the messy real-world problems in between. In active development.",
  location: "Galway, Ireland",
  metrics: [
    { label: "Live in production", value: "2" },
    { label: "Ventures in build", value: "5" },
    { label: "B.E. CGPA", value: "7.32" },
  ],
  links: SITE_LINKS,
  nav: [
    { label: "Narrative", href: "/" },
    { label: "Vault", href: "/projects" },
    { label: "Timeline", href: "/timeline" },
    { label: "Transmission", href: "/assistant" },
  ],
};
