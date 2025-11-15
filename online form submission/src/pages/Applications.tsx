import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const applications = [
  {
    title: "Software Engineer",
    company: "Tech Solutions Inc.",
    status: "Under Review",
    submittedDate: "Jan 15, 2025",
    type: "Job",
  },
  {
    title: "MBA Program",
    company: "Sukkur IBA University",
    status: "Pending",
    submittedDate: "Jan 10, 2025",
    type: "Admission",
  },
  {
    title: "Data Scientist",
    company: "Analytics Corp",
    status: "Shortlisted",
    submittedDate: "Jan 5, 2025",
    type: "Job",
  },
];

const Applications = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Pending":
        return "bg-muted text-muted-foreground";
      case "Shortlisted":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">View Applications</h1>

        <div className="space-y-4">
          {applications.map((app, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{app.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {app.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{app.company}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Submitted: {app.submittedDate}
                    </span>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Applications;
