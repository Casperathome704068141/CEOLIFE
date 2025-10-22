import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, UploadCloud, Plus } from "lucide-react";
import { documents } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function RecentDocuments() {
  return (
    <Card className="h-full">
      <CardHeader>
         <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Vault & Docs Hub
        </CardTitle>
        <CardDescription>
          Securely store and organize your personal documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
          <h3 className="text-sm font-semibold">Upload Documents</h3>
          <p className="text-xs text-muted-foreground mb-4">Drag & drop or click to upload</p>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Docs</h4>
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
            <div key={doc.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.type}</p>
              </div>
              <p className="text-xs text-muted-foreground">{doc.date}</p>
            </div>
          )})}
        </div>
      </CardContent>
    </Card>
  );
}
