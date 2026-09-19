import { createFileRoute } from "@tanstack/react-router";
import { TeamDashboardPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/workspace-team")({head:()=>({meta:[{title:"Team & roles — YARD"},{name:"description",content:"Manage workspace roles and assignments."},{property:"og:title",content:"Team & roles — YARD"},{property:"og:description",content:"Manage workspace roles and assignments."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:TeamDashboardPage});
