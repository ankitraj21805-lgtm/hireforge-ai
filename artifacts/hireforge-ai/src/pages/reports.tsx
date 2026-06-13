import { useListReports, getListReportsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const { data: reports, isLoading } = useListReports({ query: { queryKey: getListReportsQueryKey() } });

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Executive Reports
          </h1>
          <p className="text-muted-foreground mt-1">Aggregated insights and high-level summaries.</p>
        </div>
        <Button className="gap-2">
          Generate New Report
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading reports...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports?.map(report => (
            <Card key={report.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-semibold">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                  {report.summary || "No summary provided for this report."}
                </p>
                <div className="flex gap-2 mt-auto">
                  <Button variant="secondary" className="flex-1 gap-2 text-xs" size="sm">
                    <Eye className="h-3 w-3" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {reports?.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-card/30">
              <p className="text-muted-foreground">No reports generated yet.</p>
              <Button variant="link" className="mt-2 text-primary">Generate your first report</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
