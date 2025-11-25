import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { 
  PageHeader, 
  FormInput, 
  FormSelect, 
  FileUploadField, 
  FormNavigation 
} from "./FormComponents"; // Make sure to import from where you saved the file above

// ================== PERSONAL INFO ==================
const PersonalInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    cnic: "",
    dob: "",
    gender: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    contact: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState<any>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate required fields
    const missing: string[] = [];
    if (!formData.fullName && !originalData.fullName) missing.push("Full Name");
    if (!formData.fatherName && !originalData.fatherName) missing.push("Father's Name");
    if (!formData.cnic && !originalData.cnic) missing.push("CNIC Number");
    if (!formData.dob && !originalData.dob) missing.push("Date of Birth");
    if (!formData.gender && !originalData.gender) missing.push("Gender");
    if (!formData.nationality && !originalData.nationality) missing.push("Nationality");
    if (!formData.religion && !originalData.religion) missing.push("Religion");
    if (!formData.maritalStatus && !originalData.maritalStatus) missing.push("Marital Status");
    if (!formData.contact && !originalData.contact) missing.push("Contact Number");
    if (!formData.email && !originalData.email) missing.push("Email Address");
    const photoExists = photoPreview || originalData.passportPhoto;
    if (!photoExists) missing.push("Passport Photo (upload)");

    if (missing.length > 0) {
      toast.error("Please fill the required fields: " + missing.join(", "));
      return;
    }
    // Merge existing saved data with newly entered values (empty fields keep original values)
    const merged = {
      ...originalData,
      ...Object.keys(formData).reduce((acc: any, key) => {
        acc[key] = (formData as any)[key] || originalData[key] || "";
        return acc;
      }, {}),
      passportPhoto: photoPreview || originalData.passportPhoto || "",
    };

    try { localStorage.setItem("personalInfo", JSON.stringify(merged)); } catch (err) {}

    // If user is authenticated, send to backend as well
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("http://localhost:8000/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ personal: merged }),
        });
      }
    } catch (err) {
      // ignore network errors for now
    }

    navigate("/profile/AddressInfo");
  };

  useEffect(() => {
    const load = async () => {
      // First try fetching from backend if token is available
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const res = await fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.personal) {
              setOriginalData(data.data.personal || {});
              if (!formData.email && data.data.personal.email) {
                // keep local email field empty but show placeholder
              }
              return;
            }
          }
        }
      } catch (err) {
        // ignore and fallback to localStorage
      }

      try {
        const saved = localStorage.getItem("personalInfo");
        if (saved) {
          const parsed = JSON.parse(saved);
          setOriginalData(parsed || {});
        }
      } catch (err) {}
      try {
        // Final fallback: userInfo saved at login (username/email)
        const u = localStorage.getItem("userInfo");
        if (u) {
          const parsedUser = JSON.parse(u || "{}");
          setOriginalData((prev: any) => ({ ...parsedUser, ...prev }));
        }
      } catch (err) {}
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <PageHeader title="Personal Information" description="Enter your personal details as per CNIC." />
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid md:grid-cols-3 gap-6">
              <FormInput required id="fullName" label="Full Name" value={formData.fullName} placeholder={originalData.fullName || ""} onChange={handleChange} />
              <FormInput required id="fatherName" label="Father's Name" value={formData.fatherName} placeholder={originalData.fatherName || ""} onChange={handleChange} />
              <FormInput required id="cnic" label="CNIC Number" value={formData.cnic} placeholder={originalData.cnic || ""} onChange={handleChange} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormInput required id="dob" type="date" label="Date of Birth" value={formData.dob} placeholder={originalData.dob || ""} onChange={handleChange} />
              <FormInput required id="gender" label="Gender" value={formData.gender} placeholder={originalData.gender || ""} onChange={handleChange} />
              <FormInput required id="nationality" label="Nationality" value={formData.nationality} placeholder={originalData.nationality || ""} onChange={handleChange} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormInput required id="religion" label="Religion" value={formData.religion} placeholder={originalData.religion || ""} onChange={handleChange} />
              <FormInput required id="maritalStatus" label="Marital Status" value={formData.maritalStatus} placeholder={originalData.maritalStatus || ""} onChange={handleChange} />
              <FormInput required id="contact" label="Contact Number" value={formData.contact} placeholder={originalData.contact || ""} onChange={handleChange} />
            </div>
            <FormInput required id="email" type="email" label="Email Address" className="max-w-md" value={formData.email} placeholder={originalData.email || ""} onChange={handleChange} />

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Upload Passport Photo</h3>
              <div className="max-w-sm">
                <FileUploadField 
                  file={photo} 
                  previewUrl={photoPreview} 
                  onFileSelect={(f: File) => { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)); }} 
                />
              </div>
            </div>
            <FormNavigation onBack={() => navigate("/profile")} backLabel="Cancel" />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// ================== ADDRESS INFO ==================
const AddressInfo = () => {
  const navigate = useNavigate();
  const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Jammu and Kashmir"];
  const [sameAsPermanent, setSameAsPermanent] = useState(true);
  
  const [permanent, setPermanent] = useState({ address: "", province: "", district: "", city: "", postalCode: "" });
  const [current, setCurrent] = useState({ address: "", province: "", district: "", city: "", postalCode: "" });
  const [domicile, setDomicile] = useState<any>({ /* init fields */ });
  const [files, setFiles] = useState<{ [key: string]: { file: File | null, preview: string | null } }>({
    domicile: { file: null, preview: null },
    prc: { file: null, preview: null }
  });

  useEffect(() => { if (sameAsPermanent) setCurrent(permanent); }, [sameAsPermanent, permanent]);

  const [originalAddress, setOriginalAddress] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const res = await fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.address) {
              setOriginalAddress(data.data.address || {});
              // initialize permanent/current local states with merged saved values
              const perm = data.data.address.permanent || {};
              const curr = data.data.address.current || {};
              setPermanent({ address: perm.address || "", province: perm.province || "", district: perm.district || "", city: perm.city || "", postalCode: perm.postalCode || "" });
              setCurrent({ address: curr.address || "", province: curr.province || "", district: curr.district || "", city: curr.city || "", postalCode: curr.postalCode || "" });
              return;
            }
          }
        }
      } catch (err) {}

      try {
        const saved = localStorage.getItem("addressInfo");
        if (saved) {
          const parsed = JSON.parse(saved);
          setOriginalAddress(parsed || {});
          if (parsed.permanent) setPermanent(parsed.permanent);
          if (parsed.current) setCurrent(parsed.current);
        }
      } catch (err) {}
    };
    load();
  }, []);

  const handleAddressChange = (type: 'permanent' | 'current', field: string, value: string) => {
    const setter = type === 'permanent' ? setPermanent : setCurrent;
    const state = type === 'permanent' ? permanent : current;
    setter({ ...state, [field]: value });
  };

  const handleFile = (key: string, file: File) => {
    setFiles(prev => ({ ...prev, [key]: { file, preview: URL.createObjectURL(file) } }));
  };

  const AddressBlock = ({ type, data, disabled }: any) => (
    <div className="space-y-6">
      <FormInput required label="Address" icon={MapPin} value={data.address} placeholder={type === 'permanent' ? (originalAddress.permanent?.address || '') : (originalAddress.current?.address || '')} disabled={disabled} onChange={(e: any) => handleAddressChange(type, "address", e.target.value)} />
      <div className="grid md:grid-cols-2 gap-6">
        <FormSelect required label="Province" options={provinces} value={data.province} placeholder={type === 'permanent' ? (originalAddress.permanent?.province || '') : (originalAddress.current?.province || '')} disabled={disabled} onChange={(v: string) => handleAddressChange(type, "province", v)} />
        <FormInput required label="District" value={data.district} placeholder={type === 'permanent' ? (originalAddress.permanent?.district || '') : (originalAddress.current?.district || '')} disabled={disabled} onChange={(e: any) => handleAddressChange(type, "district", e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <FormInput required label="City/Town" value={data.city} placeholder={type === 'permanent' ? (originalAddress.permanent?.city || '') : (originalAddress.current?.city || '')} disabled={disabled} onChange={(e: any) => handleAddressChange(type, "city", e.target.value)} />
        <FormInput required label="Postal Code" value={data.postalCode} placeholder={type === 'permanent' ? (originalAddress.permanent?.postalCode || '') : (originalAddress.current?.postalCode || '')} disabled={disabled} onChange={(e: any) => handleAddressChange(type, "postalCode", e.target.value)} />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <PageHeader title="Address Information" description="Enter your permanent and current address details." />
        <Card className="p-8">
            <form onSubmit={async (e) => {
                e.preventDefault();
                // validate required address fields
                const missing: string[] = [];
                const perm = permanent;
                if (!perm.address && !originalAddress.permanent?.address) missing.push("Permanent Address");
                if (!perm.province && !originalAddress.permanent?.province) missing.push("Permanent Province");
                if (!perm.district && !originalAddress.permanent?.district) missing.push("Permanent District");
                if (!perm.city && !originalAddress.permanent?.city) missing.push("Permanent City/Town");
                if (!perm.postalCode && !originalAddress.permanent?.postalCode) missing.push("Permanent Postal Code");

                if (!sameAsPermanent) {
                  const cur = current;
                  if (!cur.address && !originalAddress.current?.address) missing.push("Current Address");
                  if (!cur.province && !originalAddress.current?.province) missing.push("Current Province");
                  if (!cur.district && !originalAddress.current?.district) missing.push("Current District");
                  if (!cur.city && !originalAddress.current?.city) missing.push("Current City/Town");
                  if (!cur.postalCode && !originalAddress.current?.postalCode) missing.push("Current Postal Code");
                }

                // require domicile and prc uploads
                if (!files.domicile.preview) missing.push("Domicile upload");
                if (!files.prc.preview) missing.push("PRC-D upload");

                if (missing.length > 0) {
                  toast.error("Please fill the required fields: " + missing.join(", "));
                  return;
                }

                // Merge saved original address with any newly entered values
                const merge = (orig: any = {}, curr: any = {}) => ({
                  address: curr.address || orig.address || "",
                  province: curr.province || orig.province || "",
                  district: curr.district || orig.district || "",
                  city: curr.city || orig.city || "",
                  postalCode: curr.postalCode || orig.postalCode || "",
                });

                const mergedPermanent = merge(originalAddress.permanent || {}, permanent);
                const mergedCurrent = merge(originalAddress.current || {}, (sameAsPermanent ? mergedPermanent : current));

                try { localStorage.setItem("addressInfo", JSON.stringify({ permanent: mergedPermanent, current: mergedCurrent, files })); } catch (err) {}

                // If authenticated, send address to backend
                try {
                  const token = localStorage.getItem("authToken");
                  if (token) {
                    await fetch("http://localhost:8000/api/profile", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ address: { permanent: mergedPermanent, current: mergedCurrent, files } }),
                    });
                  }
                } catch (err) {}

                navigate("/profile/EducationalInfo");
              }}>
            <h2 className="text-xl font-semibold mb-4">Permanent Address</h2>
            <AddressBlock type="permanent" data={permanent} />

            <div className="pt-6 mt-6 border-t space-y-6">
              <h2 className="text-xl font-semibold">Current Address</h2>
              <div className="flex items-center space-x-2">
                <Checkbox checked={sameAsPermanent} onCheckedChange={(c) => setSameAsPermanent(!!c)} id="same" />
                <Label htmlFor="same">Same as permanent</Label>
                
              </div>
              {!sameAsPermanent && <AddressBlock type="current" data={current} />}
            </div>
            
            {/* Condensed Domicile Section for brevity - use FormInput similarly */}
            <div className="pt-6 mt-6 border-t">
               <h2 className="text-xl font-semibold mb-4">Domicile & PRC</h2>
               <div className="grid md:grid-cols-2 gap-6">
                  <FileUploadField label="Upload Domicile" file={files.domicile.file} previewUrl={files.domicile.preview} onFileSelect={(f: File) => handleFile('domicile', f)} />
                  <FileUploadField label="Upload PRC-D" file={files.prc.file} previewUrl={files.prc.preview} onFileSelect={(f: File) => handleFile('prc', f)} />
               </div>
            </div>

            <FormNavigation onBack={() => navigate("/profile/personal")} />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// ================== EDUCATIONAL INFO ==================
const EducationalInfo = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);

  const addEntry = () => setEntries([...entries, { id: Date.now(), level: "", institute: "", board: "", startDate: "", endDate: "", obtainedMarks: "", totalMarks: "", seatNo: "", rollNumber: "", marksheet: null, certificate: null }]);
  const updateEntry = (id: number, field: string, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Load saved education from API or localStorage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const res = await fetch("http://localhost:8000/api/profile", { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            if (data && data.data && Array.isArray(data.data.education)) {
              // Map backend entries to local shape (ensure id present)
              const mapped = data.data.education.map((e: any) => ({ id: e.id || Date.now() + Math.random(), ...e }));
              setEntries(mapped);
              return;
            }
          }
        }
      } catch (err) {}

      try {
        const saved = localStorage.getItem("educationalInfo");
        if (saved) setEntries(JSON.parse(saved));
      } catch (err) {}
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validation: at least one entry and required fields per entry
    if (!entries || entries.length === 0) {
      toast.error("Please add at least one educational entry before continuing.");
      return;
    }

    const problems: string[] = [];
    entries.forEach((en, idx) => {
      const missing: string[] = [];
      if (!en.level) missing.push("Level");
      if (!en.institute) missing.push("Institute");
      if (!en.board) missing.push("Board");
      if (!en.startDate) missing.push("Start Date");
      if (!en.endDate) missing.push("End Date");
      if (!en.obtainedMarks) missing.push("Obtained Marks");
      if (!en.totalMarks) missing.push("Total Marks");
      if (missing.length > 0) problems.push(`Entry ${idx + 1}: ${missing.join(", ")}`);
    });

    if (problems.length > 0) {
      toast.error("Please fix required fields:\n" + problems.join("; "));
      return;
    }

    try { localStorage.setItem("educationalInfo", JSON.stringify(entries)); } catch (err) {}

    // Prepare payload (strip File objects, include preview URLs if available)
    const payloadEntries = entries.map(en => ({
      level: en.level || "",
      institute: en.institute || "",
      board: en.board || "",
      startDate: en.startDate || "",
      endDate: en.endDate || "",
      obtainedMarks: en.obtainedMarks || "",
      totalMarks: en.totalMarks || "",
      seatNo: en.seatNo || "",
      rollNumber: en.rollNumber || "",
      marksheet: en.marksheet?.preview || en.marksheet || null,
      certificate: en.certificate?.preview || en.certificate || null,
    }));

    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("http://localhost:8000/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ education: payloadEntries }),
        });
      }
    } catch (err) {}

    navigate("/profile/Certifications");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <PageHeader title="Educational Information" description="Add your educational qualifications." />
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            {entries.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
                <Button type="button" variant="outline" onClick={addEntry}><Plus className="mr-2" /> Add Entry</Button>
              </div>
            )}
            {entries.map((entry, index) => (
              <div key={entry.id} className="pt-6 border-t first:border-0 first:pt-0 mb-8">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setEntries(entries.filter(e => e.id !== entry.id))}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <FormSelect label="Level" options={["Matriculation", "Intermediate", "Graduation"]} value={entry.level} onChange={(v: string) => updateEntry(entry.id, "level", v)} placeholder="Select level" />
                  <FormInput label="Institute Name" value={entry.institute} onChange={(e: any) => updateEntry(entry.id, "institute", e.target.value)} />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <FormInput label="Board Name" value={entry.board} onChange={(e: any) => updateEntry(entry.id, "board", e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Start Date" type="date" value={entry.startDate} onChange={(e: any) => updateEntry(entry.id, "startDate", e.target.value)} />
                    <FormInput label="End Date" type="date" value={entry.endDate} onChange={(e: any) => updateEntry(entry.id, "endDate", e.target.value)} />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-4">
                  <FormInput label="Obtained Marks" value={entry.obtainedMarks} onChange={(e: any) => updateEntry(entry.id, "obtainedMarks", e.target.value)} />
                  <FormInput label="Total Marks" value={entry.totalMarks} onChange={(e: any) => updateEntry(entry.id, "totalMarks", e.target.value)} />
                  {entry.level === "Graduation" ? (
                    <FormInput label="Roll Number" value={entry.rollNumber} onChange={(e: any) => updateEntry(entry.id, "rollNumber", e.target.value)} />
                  ) : (
                    <FormInput label="Seat Number" value={entry.seatNo} onChange={(e: any) => updateEntry(entry.id, "seatNo", e.target.value)} />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FileUploadField label="Marksheet" file={entry.marksheet?.file} previewUrl={entry.marksheet?.preview || entry.marksheet} onFileSelect={(f: File) => updateEntry(entry.id, "marksheet", { file: f, preview: URL.createObjectURL(f) })} />
                  <FileUploadField label="Certificate" file={entry.certificate?.file} previewUrl={entry.certificate?.preview || entry.certificate} onFileSelect={(f: File) => updateEntry(entry.id, "certificate", { file: f, preview: URL.createObjectURL(f) })} />
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={addEntry}><Plus className="mr-2" /> Add Another</Button>
              <div className="flex-1" />
            </div>

            <FormNavigation onBack={() => navigate("/profile/AddressInfo")} />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// ================== CERTIFICATIONS ==================
const Certifications = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);

  // Logic is identical to EducationalInfo, just different fields
  return (
    <DashboardLayout>
       <div className="max-w-5xl">
        <PageHeader title="Certifications" description="Add professional certifications." />
        <Card className="p-8">
          {/* Implement similar map loop as EducationalInfo */}
           <div className="text-center py-8">
              <Button onClick={() => setEntries([...entries, { id: Date.now() }])} variant="outline"><Plus className="mr-2"/> Add Certification</Button>
           </div>
           {/* Render Inputs */}
          <FormNavigation onBack={() => navigate("/profile/EducationalInfo")} onNext={() => {
            if (!entries || entries.length === 0) { toast.error("Please add at least one certification before continuing."); return; }
            try { localStorage.setItem("certifications", JSON.stringify(entries)); } catch (err) {}
            navigate("/profile/Experience");
          }} />
        </Card>
       </div>
    </DashboardLayout>
  )
}

// ================== EXPERIENCE ==================
const Experience = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);

  // Logic is identical to EducationalInfo
  return (
    <DashboardLayout>
       <div className="max-w-5xl">
        <PageHeader title="Experience" description="Add work experience." />
        <Card className="p-8">
           {/* Implement map loop */}
           <div className="text-center py-8">
              <Button onClick={() => setEntries([...entries, { id: Date.now() }])} variant="outline"><Plus className="mr-2"/> Add Experience</Button>
           </div>
          <FormNavigation onBack={() => navigate("/profile/Certifications")} onNext={() => {
            if (!entries || entries.length === 0) { toast.error("Please add at least one experience entry before continuing."); return; }
            try { localStorage.setItem("experience", JSON.stringify(entries)); } catch (err) {}
            navigate("/dashboard");
          }} />
        </Card>
       </div>
    </DashboardLayout>
  )
}

export default PersonalInfo;
export { AddressInfo, EducationalInfo, Certifications, Experience };