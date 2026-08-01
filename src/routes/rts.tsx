import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, PageHeader, SectionCard } from "@/components/qm/Primitives";
import { StatusPill } from "@/components/qm/StatusPill";
import { rtsList } from "@/lib/qm-data";

export const Route = createFileRoute("/rts")({
  head: () => ({
    meta: [
      { title: "Return To Supplier · Axiom WMS" },
      { name: "description", content: "Return shipments raised from NCR dispositions with approval, transport and credit note tracking" },
      { property: "og:title", content: "Return To Supplier · Axiom WMS" },
      { property: "og:description", content: "Return shipments raised from NCR dispositions with approval, transport and credit note tracking" },
    ],
  }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const rows = rtsList.filter((r) => [r.id, r.vendor, r.material, r.reason].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Quality", to: "/" }, { label: "Return To Supplier" }]}
        eyebrow="Screen 12"
        title="Return To Supplier"
        description="Return shipments raised from NCR dispositions with approval, transport and credit note tracking"
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported to XLSX")}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi l="Open returns" v="3" />
          <Kpi l="Units returned" v="45" />
          <Kpi l="Credit value" v="SAR 106.5k" />
          <Kpi l="Avg turnaround" v="6 d" />
      </div>

      <SectionCard padded={false}>
        <div className="border-b border-border p-3">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search records…" className="h-9 rounded-xl pl-9" />
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Nothing to show" description="No records match the current search. Records appear here as dispositions are created from NCRs." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                    <TableHead>RTS No.</TableHead>
                    <TableHead>NCR</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Carrier / AWB</TableHead>
                    <TableHead>Dispatch</TableHead>
                    <TableHead>Credit note</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-accent/30">
                    <TableCell className="num text-xs font-semibold text-primary">{r.id}</TableCell>
                    <TableCell className="num text-xs"><Link to="/ncr/$id" params={{ id: r.ncr }} className="hover:underline">{r.ncr}</Link></TableCell>
                    <TableCell className="max-w-[170px] truncate text-xs">{r.vendor}</TableCell>
                    <TableCell className="max-w-[170px] truncate text-xs">{r.material}</TableCell>
                    <TableCell className="num text-xs">{r.qty}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">{r.reason}</TableCell>
                    <TableCell className="text-xs">{r.approvedBy}</TableCell>
                    <TableCell className="num text-xs">{r.carrier}<p className="text-[10px] text-muted-foreground">{r.awb}</p></TableCell>
                    <TableCell className="num text-xs">{r.dispatch}</TableCell>
                    <TableCell className="num text-xs">{r.creditNote}</TableCell>
                    <TableCell><StatusPill tone={r.status === "Delivered" || r.status === "Closed" ? "success" : r.status === "Awaiting Approval" ? "warning" : "info"}>{r.status}</StatusPill></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </>
  );
}

function Kpi({ l, v }: { l: string; v: string }) {
  return (
    <div className="surface-card rounded-2xl p-4">
      <p className="text-[11px] text-muted-foreground">{l}</p>
      <p className="num mt-1 text-2xl font-semibold">{v}</p>
    </div>
  );
}
