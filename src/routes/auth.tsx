import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/auth")({head:()=>({meta:[{title:"Sign in — YARD"},{name:"description",content:"Choose a role and enter the YARD demo workspace."},{property:"og:title",content:"Sign in — YARD"},{property:"og:description",content:"Choose a role and enter the YARD demo workspace."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AuthPage});
