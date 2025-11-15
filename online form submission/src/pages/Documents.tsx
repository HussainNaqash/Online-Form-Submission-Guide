import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

const documents = [
  { name: "CNIC Copy", uploaded: true },
  { name: "Educational Certificates", uploaded: true },
  { name: "Experience Letter", uploaded: true },
  { name: "Passport Photo", uploaded: false },
  { name: "Domicile Certificate", uploaded: false },
];

const Documents = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground mb-6">
          Upload required documents to complete your profile. All documents must
          be in PDF or image format.
        </p>

        <div className="grid gap-4">
          {documents.map((doc, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      doc.uploaded
                        ? "bg-success/10"
                        : "bg-muted"
                    }`}
                  >
                    {doc.uploaded ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.uploaded ? "Uploaded successfully" : "Not uploaded"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={doc.uploaded ? "outline" : "default"}
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {doc.uploaded ? "Replace" : "Upload"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6 bg-muted/30">
          <h3 className="font-semibold mb-2">Document Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All documents must be clear and readable</li>
            <li>• Maximum file size: 5MB per document</li>
            <li>• Accepted formats: PDF, JPG, PNG</li>
            <li>• Documents should not be older than 6 months</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
