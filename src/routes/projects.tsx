import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/projects")({head:()=>({meta:[{title:"Projects — YARD"},{name:"description",content:"The connected procurement workflows inside YARD."},{property:"og:title",content:"Projects — YARD"},{property:"og:description",content:"The connected procurement workflows inside YARD."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:ProjectsPage});
