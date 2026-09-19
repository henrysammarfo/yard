import { createFileRoute } from "@tanstack/react-router";
import { QuoteDetailPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/quotes/$id")({head:()=>({meta:[{title:"Quote detail — YARD"},{name:"description",content:"Review a quote, evidence, and approval history."},{property:"og:title",content:"Quote detail — YARD"},{property:"og:description",content:"Review a quote, evidence, and approval history."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){const {id}=Route.useParams();return <QuoteDetailPage id={id}/>}
