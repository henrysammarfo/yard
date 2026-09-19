import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/components/yard/dashboard-pages";
export const Route=createFileRoute("/orders/$id")({head:()=>({meta:[{title:"Purchase order — YARD"},{name:"description",content:"Purchase order details and fulfillment status."},{property:"og:title",content:"Purchase order — YARD"},{property:"og:description",content:"Purchase order details and fulfillment status."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){const {id}=Route.useParams();return <OrderDetailPage id={id}/>}
