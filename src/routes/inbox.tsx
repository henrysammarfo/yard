import { createFileRoute } from "@tanstack/react-router";
import { InboxPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/inbox")({head:()=>({meta:[{title:"Inbox — YARD"},{name:"description",content:"Supplier quote email intake and extraction."},{property:"og:title",content:"Inbox — YARD"},{property:"og:description",content:"Supplier quote email intake and extraction."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:InboxPage});
