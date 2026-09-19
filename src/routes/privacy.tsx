import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/privacy")({head:()=>({meta:[{title:"Privacy — YARD"},{name:"description",content:"How YARD handles account, supplier, and quote information."},{property:"og:title",content:"Privacy — YARD"},{property:"og:description",content:"How YARD handles account, supplier, and quote information."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=> <LegalPage kind="Privacy"/>});
