import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/dashboard")({head:()=>({meta:[{title:"Dashboard — YARD"},{name:"description",content:"Daily procurement overview for Adom Yard."},{property:"og:title",content:"Dashboard — YARD"},{property:"og:description",content:"Daily procurement overview for Adom Yard."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:DashboardPage});
