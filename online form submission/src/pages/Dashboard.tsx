import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, FileCheck, Upload, ArrowRight } from "lucide-react";

const notifications = [
  { icon: Bell, text: "Your application for 'Software Engineer' has been submitted successfully." },
  { icon: Bell, text: "Profile review pending for 'Academic Information' section." },
  { icon: Bell, text: "New job opening: 'Data Scientist' at Tech Solutions, apply now!" },
  { icon: Bell, text: "Admission results for 'MBA Program' will be announced on May 15th." },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
<<<<<<< HEAD
=======
  const [progress, setProgress] = useState(0);
>>>>>>> 25a7b61 (front Fixation)

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.username) setUsername(user.username);
      } catch (err) {
        console.error("Failed to parse user info:", err);
      }
    }
<<<<<<< HEAD
=======

    // compute profile completion progress
    const sections = ["personalInfo", "addressInfo", "educationalInfo", "certifications", "experience"];
    let completed = 0;
    sections.forEach((key) => {
      try {
        const v = localStorage.getItem(key);
        if (v) {
          // for arrays, check non-empty
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) {
            if (parsed.length > 0) completed += 1;
          } else if (typeof parsed === 'object') {
            // check at least one field filled
            if (Object.keys(parsed).length > 0) completed += 1;
          } else {
            completed += 1;
          }
        }
      } catch (err) {
        // if parse fails, but item exists, count it
        if (localStorage.getItem(key)) completed += 1;
      }
    });
    const pct = Math.round((completed / sections.length) * 100);
    setProgress(pct);
>>>>>>> 25a7b61 (front Fixation)
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome, {username}!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your personalized portal for jobs and admissions in Pakistan. Here's a
          quick overview of your progress.
        </p>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Profile Completion
                  </span>
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-4">
                  Complete your profile to unlock full application features.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileCheck className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profile Status</p>
                  <p className="font-semibold">In Progress</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-info/10">
                  <Upload className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Documents Uploaded</p>
                  <p className="font-semibold">3 of 5</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Important Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Icon className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{notification.text}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Next Steps</h2>
              <p className="text-sm text-muted-foreground">
                Complete your 'Professional Information' and 'Documents Upload' to
                activate your job applications.
              </p>
            </div>
            <Button size="lg" className="flex-shrink-0" onClick={() => navigate("/profile/personal")}>
              Continue Profile Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
