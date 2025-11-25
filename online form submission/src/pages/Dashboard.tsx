import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, FileCheck, Upload, ArrowRight, Users, Calendar, ClipboardList } from "lucide-react";

const notifications = [
  { icon: Bell, text: "Your application for 'Software Engineer' has been submitted successfully." },
  { icon: Bell, text: "Profile review pending for 'Academic Information' section." },
  { icon: Bell, text: "New job opening: 'Data Scientist' at Tech Solutions, apply now!" },
  { icon: Bell, text: "Admission results for 'MBA Program' will be announced on May 15th." },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

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
  }, []);

  // smooth animate displayed progress to `progress`
  useEffect(() => {
    let raf: number | null = null;
    const duration = 900; // ms
    const start = performance.now();
    const initial = displayProgress;
    const diff = progress - initial;

    function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
      const value = Math.round(initial + diff * eased);
      setDisplayProgress(value);
      if (t < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [progress]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl soft-glass p-6 mb-8 shadow-2xl border">
          <div className="absolute -top-10 -left-8 w-40 h-40 bg-gradient-to-tr from-primary/40 to-accent/30 rounded-full opacity-40 blur-3xl float-anim" />
          <div className="absolute -bottom-12 -right-8 w-56 h-56 bg-gradient-to-br from-info/30 to-primary/10 rounded-full opacity-30 blur-2xl float-anim" />

          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">Welcome back, {username}!</h1>
              <p className="text-muted-foreground max-w-xl">
                Your personalized portal for jobs and admissions — stay on top of applications and complete your profile for best results.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow transform hover:-translate-y-1 card-entrance fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Profile Progress</h2>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Completion</p>
                  <p className="text-lg font-semibold text-primary">{displayProgress}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={displayProgress}
                    className="h-3 rounded-full smooth-progress-inner shadow-md progress-gradient"
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-white/60 dark:bg-black/40 border soft-glass shimmer">
                    <p className="text-xs text-muted-foreground">Profile Status</p>
                    <p className="font-semibold mt-1 flex items-center gap-2"><FileCheck className="w-4 h-4 text-success"/> In Progress</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-white/60 dark:bg-black/40 border soft-glass shimmer">
                    <p className="text-xs text-muted-foreground">Documents Uploaded</p>
                    <p className="font-semibold mt-1 flex items-center gap-2"><Upload className="w-4 h-4 text-info"/> 3 of 5</p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  Complete your profile to unlock full application features and increase match accuracy for relevant roles.
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-lg soft-glass hover:shadow-xl transition-shadow card-entrance fade-up">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <Button variant="ghost" className="justify-start">Upload Documents</Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/profile/personal')}>Continue Profile Setup</Button>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-lg soft-glass hover:shadow-xl transition-shadow card-entrance fade-up">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {notifications.slice(0,3).map((n, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ClipboardList className="w-4 h-4 text-accent mt-1" />
                    <div>{n.text}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6 mb-8 rounded-2xl shadow-xl soft-glass">
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

        <Card className="p-6 bg-gradient-to-r from-primary/6 to-accent/6 border-primary/10 rounded-2xl soft-glass">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Next Steps</h2>
              <p className="text-sm text-muted-foreground">
                Complete your 'Professional Information' and 'Documents Upload' to
                activate your job applications.
              </p>
            </div>
            <Button size="lg" className="flex-shrink-0" onClick={() => navigate("/profile/personal") }>
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
