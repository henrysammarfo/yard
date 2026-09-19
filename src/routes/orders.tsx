import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/orders")({head:()=>({meta:[{title:"Purchase orders — YARD"},{name:"description",content:"Approved purchases and fulfillment status."},{property:"og:title",content:"Purchase orders — YARD"},{property:"og:description",content:"Approved purchases and fulfillment status."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:OrdersPage});
