import { createFileRoute } from "@tanstack/react-router";
import { SupplierPortalPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/supplier-portal")({head:()=>({meta:[{title:"Supplier portal — YARD"},{name:"description",content:"Submit and track supplier quotes."},{property:"og:title",content:"Supplier portal — YARD"},{property:"og:description",content:"Submit and track supplier quotes."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SupplierPortalPage});
