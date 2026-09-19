import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/settings")({head:()=>({meta:[{title:"Settings — YARD"},{name:"description",content:"Manage the yard workspace and integration readiness."},{property:"og:title",content:"Settings — YARD"},{property:"og:description",content:"Manage the yard workspace and integration readiness."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SettingsPage});
