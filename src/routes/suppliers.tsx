import { createFileRoute } from "@tanstack/react-router";
import { SuppliersPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/suppliers")({head:()=>({meta:[{title:"Suppliers — YARD"},{name:"description",content:"Supplier directory and procurement performance."},{property:"og:title",content:"Suppliers — YARD"},{property:"og:description",content:"Supplier directory and procurement performance."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SuppliersPage});
