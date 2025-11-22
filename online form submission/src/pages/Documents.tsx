import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

const Documents = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return; // nothing to do if unauthenticated
      const res = await fetch("http://localhost:8000/api/profile", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.data || {});
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Build documents list including each education entry separately
  const docsListBase = [
    { key: "cnicCopy", label: "CNIC Copy", url: profile?.documents?.cnicCopy || profile?.personal?.cnicCopy || null },
    { key: "experienceLetter", label: "Experience Letter", url: profile?.documents?.experienceLetter || null },
    { key: "passportPhoto", label: "Passport Photo", url: profile?.personal?.passportPhoto || profile?.documents?.passportPhoto || null },
    { key: "domicile", label: "Domicile Certificate", url: profile?.documents?.domicile || profile?.address?.files?.domicile || null },
  ];

  const docsList = [...docsListBase];
  const edu = profile?.education || [];
  edu.forEach((entry: any, i: number) => {
    const label = `Education ${i + 1} - ${entry.level || entry.degree || entry.institute || "Entry"}`;
    const url = entry.certificate || entry.marksheet || null;
    docsList.push({ key: `education-${i}-certificate`, label, url });
  });

  // For educational certificates we'll show count / first preview
  const getEducationInfo = () => {
    const edu = profile?.education || [];
    const count = edu.length;
    const firstCert = edu[0]?.certificate || edu[0]?.marksheet || null;
    return { count, firstCert };
  };

  const handleChooseFile = (docKey: string) => {
    setActiveDocKey(docKey);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocKey) return;
    // basic client-side validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "image/webp"];
    if (!validTypes.includes(file.type)) return alert("Please select PDF or image file");
    if (file.size > 5 * 1024 * 1024) return alert("File too large (max 5MB)");

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // if not authenticated, store in localStorage as preview
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          // store in localStorage similar keys used elsewhere
          const personal = JSON.parse(localStorage.getItem("personalInfo") || "{}");
          const addr = JSON.parse(localStorage.getItem("addressInfo") || "{}");
          if (activeDocKey === "passportPhoto") {
            personal.passportPhoto = preview;
            localStorage.setItem("personalInfo", JSON.stringify(personal));
          } else if (activeDocKey === "domicile") {
            const files = addr.files || {};
            files.domicile = preview;
            addr.files = files;
            localStorage.setItem("addressInfo", JSON.stringify(addr));
          } else {
            // store generic documents key
            const docs = JSON.parse(localStorage.getItem("documents") || "{}");
            docs[activeDocKey] = preview;
            localStorage.setItem("documents", JSON.stringify(docs));
          }
          alert("Saved locally (not uploaded). Log in to sync with server.");
        };
        reader.readAsDataURL(file);
        return;
      }

      const form = new FormData();
      form.append("file", file);
      form.append("docKey", activeDocKey);

      const res = await fetch("http://localhost:8000/api/profile/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      // if education-specific key, update education entry
      if (activeDocKey.startsWith("education-")) {
        // format: education-<index>-certificate or -marksheet
        const parts = activeDocKey.split("-");
        const idx = parseInt(parts[1], 10);
        const field = parts[2] || "certificate";
        // fetch current profile and update education array
        const profileRes = await fetch("http://localhost:8000/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        const profileData = await profileRes.json();
        const edu = profileData.data?.education || [];
        if (edu[idx]) {
          edu[idx][field] = data.fileUrl;
        }
        // PUT back
        await fetch("http://localhost:8000/api/profile", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ education: edu }) });
        try { localStorage.setItem("educationalInfo", JSON.stringify(edu)); } catch (err) {}
        await fetchProfile();
      } else {
        // simple case: upload endpoint already updated profile.documents and maybe personal/address
        await fetchProfile();
      }

      // update local storage copies to keep app in sync
      try {
        const p = JSON.parse(localStorage.getItem("personalInfo") || "{}");
        if (activeDocKey === "passportPhoto") { p.passportPhoto = data.fileUrl; localStorage.setItem("personalInfo", JSON.stringify(p)); }
        const a = JSON.parse(localStorage.getItem("addressInfo") || "{}");
        if (activeDocKey === "domicile") { a.files = a.files || {}; a.files.domicile = data.fileUrl; localStorage.setItem("addressInfo", JSON.stringify(a)); }
        // educationalInfo handled above when syncing from API
      } catch (err) {}

    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setActiveDocKey(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground mb-6">Upload required documents to complete your profile. All documents must be in PDF or image format.</p>

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />

        <div className="grid gap-4">
          {docsList.map((doc) => {
            const uploaded = !!doc.url;
            return (
              <Card key={doc.key} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${uploaded ? "bg-success/10" : "bg-muted"}`}>
                      {uploaded ? <CheckCircle2 className="w-6 h-6 text-success" /> : <FileText className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.label}</h3>
                      <p className="text-sm text-muted-foreground">{uploaded ? "Uploaded successfully" : "Not uploaded"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.key === "educationalCertificates" ? (
                      (() => {
                        const { count, firstCert } = getEducationInfo();
                        return (
                          <div className="text-sm text-muted-foreground mr-4">{count} certificates{firstCert ? " (preview available)" : ""}</div>
                        );
                      })()
                    ) : null}
                    <Button variant={uploaded ? "outline" : "default"} size="sm" onClick={() => handleChooseFile(doc.key)} disabled={loading}>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploaded ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
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
