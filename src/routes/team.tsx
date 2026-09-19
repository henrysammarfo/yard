import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/team")({head:()=>({meta:[{title:"Team — YARD"},{name:"description",content:"Meet the Accra-based team building YARD."},{property:"og:title",content:"Team — YARD"},{property:"og:description",content:"Meet the Accra-based team building YARD."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:TeamPage});
