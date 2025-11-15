import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, MapPin, Phone, Plus, Trash2 } from "lucide-react";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG, or WEBP)");
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
          <p className="text-muted-foreground">
            Enter your personal details as per CNIC.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  defaultValue="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  placeholder="Michael Doe"
                  defaultValue="Michael Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC Number</Label>
                <Input
                  id="cnic"
                  placeholder="42101-1234567-8"
                  defaultValue="42101-1234567-8"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue="1990-05-15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" placeholder="Male" defaultValue="Male" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  placeholder="Pakistani"
                  defaultValue="Pakistani"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input id="religion" placeholder="Islam" defaultValue="Islam" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Input
                  id="maritalStatus"
                  placeholder="Single"
                  defaultValue="Single"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="+92 300 1234567"
                  defaultValue="+92 300 1234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                defaultValue="john.doe@example.com"
                className="max-w-md"
              />
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">
                Upload Passport Photo
              </h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 max-w-sm bg-muted/30">
                <div className="w-32 h-40 bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">No Photo</span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleButtonClick}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFile ? "Change File" : "Choose File"}
                </Button>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <Button variant="outline" size="lg" onClick={() => navigate("/profile")}>
                Cancel
              </Button>
              <Button 
                size="lg" 
                onClick={(e) => {
                  e.preventDefault();
                  const formData = {
                    fullName: (document.getElementById("fullName") as HTMLInputElement)?.value || "",
                    fatherName: (document.getElementById("fatherName") as HTMLInputElement)?.value || "",
                    cnic: (document.getElementById("cnic") as HTMLInputElement)?.value || "",
                    dob: (document.getElementById("dob") as HTMLInputElement)?.value || "",
                    gender: (document.getElementById("gender") as HTMLInputElement)?.value || "",
                    nationality: (document.getElementById("nationality") as HTMLInputElement)?.value || "",
                    religion: (document.getElementById("religion") as HTMLInputElement)?.value || "",
                    maritalStatus: (document.getElementById("maritalStatus") as HTMLInputElement)?.value || "",
                    contact: (document.getElementById("contact") as HTMLInputElement)?.value || "",
                    email: (document.getElementById("email") as HTMLInputElement)?.value || "",
                    passportPhoto: previewUrl || "",
                  };
                  localStorage.setItem("personalInfo", JSON.stringify(formData));
                  navigate("/profile/AddressInfo");
                }}
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PersonalInfo;

// Address Information Section
const AddressInfo = () => {
  const navigate = useNavigate();
  const [sameAsPermanent, setSameAsPermanent] = useState(true);
  const [permanentAddress, setPermanentAddress] = useState({
    address: "123 Royal Street, Blue Area",
    province: "Punjab",
    district: "Lahore",
    city: "Lahore",
    postalCode: "54000",
  });
  const [currentAddress, setCurrentAddress] = useState({
    address: "",
    province: "",
    district: "",
    city: "",
    postalCode: "",
  });
  const [alternateContact, setAlternateContact] = useState("");
  
  // Domicile and PRC-D state
  const [domicileInfo, setDomicileInfo] = useState({
    district: "",
    talukaTehsil: "",
    domicileNo: "",
    prcDNo: "",
    issuanceDate: "",
    prcDIssuanceDate: "",
    urbanRural: "",
    originalDuplicate: "",
  });
  
  const [domicileFile, setDomicileFile] = useState<File | null>(null);
  const [domicilePreview, setDomicilePreview] = useState<string | null>(null);
  const domicileInputRef = useRef<HTMLInputElement>(null);
  
  const [prcDFile, setPrcDFile] = useState<File | null>(null);
  const [prcDPreview, setPrcDPreview] = useState<string | null>(null);
  const prcDInputRef = useRef<HTMLInputElement>(null);

  const provinces = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit-Baltistan",
    "Azad Jammu and Kashmir",
  ];
  
  const urbanRuralOptions = ["Urban", "Rural"];
  const originalDuplicateOptions = ["Original", "Duplicate"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressData = {
      permanentAddress,
      currentAddress: sameAsPermanent ? permanentAddress : currentAddress,
      alternateContact,
      domicileInfo,
    };
    localStorage.setItem("addressInfo", JSON.stringify(addressData));
    navigate("/profile/EducationalInfo");
  };

  const handleBack = () => {
    navigate("/profile/personal");
  };
  
  // File upload handlers for Domicile
  const handleDomicileFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    if (domicilePreview) {
      URL.revokeObjectURL(domicilePreview);
    }

    setDomicileFile(file);
    const url = URL.createObjectURL(file);
    setDomicilePreview(url);
  };

  const handleDomicileButtonClick = () => {
    domicileInputRef.current?.click();
  };
  
  // File upload handlers for PRC-D
  const handlePrcDFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    if (prcDPreview) {
      URL.revokeObjectURL(prcDPreview);
    }

    setPrcDFile(file);
    const url = URL.createObjectURL(file);
    setPrcDPreview(url);
  };

  const handlePrcDButtonClick = () => {
    prcDInputRef.current?.click();
  };

  // Sync current address with permanent when checkbox is checked
  useEffect(() => {
    if (sameAsPermanent) {
      setCurrentAddress(permanentAddress);
    }
  }, [sameAsPermanent, permanentAddress]);
  
  // Cleanup file preview URLs
  useEffect(() => {
    return () => {
      if (domicilePreview) {
        URL.revokeObjectURL(domicilePreview);
      }
      if (prcDPreview) {
        URL.revokeObjectURL(prcDPreview);
      }
    };
  }, [domicilePreview, prcDPreview]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Address Information</h1>
          <p className="text-muted-foreground">
            Enter your permanent and current address details.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Permanent Address Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Permanent Address</h2>
              
              <div className="space-y-2">
                <Label htmlFor="permanent-address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="permanent-address"
                    placeholder="123 Royal Street, Blue Area"
                    value={permanentAddress.address}
                    onChange={(e) =>
                      setPermanentAddress({
                        ...permanentAddress,
                        address: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="permanent-province">Province</Label>
                  <Select
                    value={permanentAddress.province}
                    onValueChange={(value) =>
                      setPermanentAddress({
                        ...permanentAddress,
                        province: value,
                      })
                    }
                  >
                    <SelectTrigger id="permanent-province">
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanent-district">District</Label>
                  <Input
                    id="permanent-district"
                    placeholder="Lahore"
                    value={permanentAddress.district}
                    onChange={(e) =>
                      setPermanentAddress({
                        ...permanentAddress,
                        district: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="permanent-city">City/Town</Label>
                  <Input
                    id="permanent-city"
                    placeholder="Lahore"
                    value={permanentAddress.city}
                    onChange={(e) =>
                      setPermanentAddress({
                        ...permanentAddress,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanent-postal">Postal Code</Label>
                  <Input
                    id="permanent-postal"
                    placeholder="54000"
                    value={permanentAddress.postalCode}
                    onChange={(e) =>
                      setPermanentAddress({
                        ...permanentAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Current Address Section */}
            <div className="pt-6 border-t space-y-6">
              <h2 className="text-xl font-semibold">Current Address</h2>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="same-as-permanent"
                  checked={sameAsPermanent}
                  onCheckedChange={(checked) =>
                    setSameAsPermanent(checked === true)
                  }
                />
                <Label
                  htmlFor="same-as-permanent"
                  className="text-sm font-normal cursor-pointer"
                >
                  Same as permanent
                </Label>
              </div>

              {!sameAsPermanent && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="current-address"
                        placeholder="Enter current address"
                        value={currentAddress.address}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            address: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-province">Province</Label>
                      <Select
                        value={currentAddress.province}
                        onValueChange={(value) =>
                          setCurrentAddress({
                            ...currentAddress,
                            province: value,
                          })
                        }
                      >
                        <SelectTrigger id="current-province">
                          <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-district">District</Label>
                      <Input
                        id="current-district"
                        placeholder="Enter district"
                        value={currentAddress.district}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-city">City/Town</Label>
                      <Input
                        id="current-city"
                        placeholder="Enter city/town"
                        value={currentAddress.city}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-postal">Postal Code</Label>
                      <Input
                        id="current-postal"
                        placeholder="Enter postal code"
                        value={currentAddress.postalCode}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Alternate Contact Number Section */}
            <div className="pt-6 border-t space-y-2">
              <Label htmlFor="alternate-contact">
                Alternate Contact Number (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="alternate-contact"
                  placeholder="e.g., +923XX-XXXXXXX"
                  value={alternateContact}
                  onChange={(e) => setAlternateContact(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
            </div>

            {/* Domicile and PRC-D Information Section */}
            <div className="pt-6 border-t space-y-6">
              <h2 className="text-xl font-semibold">Domicile & PRC-D Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domicile-district">Domicile District</Label>
                  <Input
                    id="domicile-district"
                    placeholder="Enter domicile district"
                    value={domicileInfo.district}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        district: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicile-taluka">Domicile Taluka / Tehsil</Label>
                  <Input
                    id="domicile-taluka"
                    placeholder="Enter taluka/tehsil"
                    value={domicileInfo.talukaTehsil}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        talukaTehsil: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domicile-no">Domicile No</Label>
                  <Input
                    id="domicile-no"
                    placeholder="Enter domicile number"
                    value={domicileInfo.domicileNo}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        domicileNo: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prc-d-no">PRC-D No.</Label>
                  <Input
                    id="prc-d-no"
                    placeholder="Enter PRC-D number"
                    value={domicileInfo.prcDNo}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        prcDNo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domicile-issuance-date">Domicile Issuance Date</Label>
                  <Input
                    id="domicile-issuance-date"
                    type="date"
                    value={domicileInfo.issuanceDate}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        issuanceDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prc-d-issuance-date">PRC-D Issuance Date</Label>
                  <Input
                    id="prc-d-issuance-date"
                    type="date"
                    value={domicileInfo.prcDIssuanceDate}
                    onChange={(e) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        prcDIssuanceDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domicile-urban-rural">Domicile Urban / Rural</Label>
                  <Select
                    value={domicileInfo.urbanRural}
                    onValueChange={(value) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        urbanRural: value,
                      })
                    }
                  >
                    <SelectTrigger id="domicile-urban-rural">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {urbanRuralOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicile-original-duplicate">Domicile Original / Duplicate</Label>
                  <Select
                    value={domicileInfo.originalDuplicate}
                    onValueChange={(value) =>
                      setDomicileInfo({
                        ...domicileInfo,
                        originalDuplicate: value,
                      })
                    }
                  >
                    <SelectTrigger id="domicile-original-duplicate">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {originalDuplicateOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label>Upload Domicile</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {domicilePreview ? (
                        <img
                          src={domicilePreview}
                          alt="Domicile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No File</span>
                      )}
                    </div>
                    <input
                      ref={domicileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={handleDomicileFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handleDomicileButtonClick}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {domicileFile ? "Change File" : "Choose File"}
                    </Button>
                    {domicileFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {domicileFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload PRC-D</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {prcDPreview ? (
                        <img
                          src={prcDPreview}
                          alt="PRC-D Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No File</span>
                      )}
                    </div>
                    <input
                      ref={prcDInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={handlePrcDFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handlePrcDButtonClick}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {prcDFile ? "Change File" : "Choose File"}
                    </Button>
                    {prcDFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {prcDFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button type="submit" size="lg">
                Save & Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export { AddressInfo };

// Educational Information Section
interface EducationEntry {
  id: string;
  level: "higher" | "middle" | "";
  degree: string;
  institution: string;
  board: string;
  year: string;
  marks: string;
  marksheetFile: File | null;
  marksheetPreview: string | null;
  paccaFile: File | null;
  paccaPreview: string | null;
}

const EducationalInfo = () => {
  const navigate = useNavigate();
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
  const fileInputRefs = useRef<{ [key: string]: { marksheet: HTMLInputElement | null; pacca: HTMLInputElement | null } }>({});

  const addEducationEntry = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      level: "",
      degree: "",
      institution: "",
      board: "",
      year: "",
      marks: "",
      marksheetFile: null,
      marksheetPreview: null,
      paccaFile: null,
      paccaPreview: null,
    };
    setEducationEntries([...educationEntries, newEntry]);
  };

  const removeEducationEntry = (id: string) => {
    const entry = educationEntries.find((e) => e.id === id);
    if (entry) {
      if (entry.marksheetPreview) URL.revokeObjectURL(entry.marksheetPreview);
      if (entry.paccaPreview) URL.revokeObjectURL(entry.paccaPreview);
    }
    setEducationEntries(educationEntries.filter((e) => e.id !== id));
  };

  const updateEducationEntry = (id: string, field: keyof EducationEntry, value: any) => {
    setEducationEntries(
      educationEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleMarksheetFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    const entry = educationEntries.find((e) => e.id === id);
    if (entry?.marksheetPreview) {
      URL.revokeObjectURL(entry.marksheetPreview);
    }

    const preview = URL.createObjectURL(file);
    updateEducationEntry(id, "marksheetFile", file);
    updateEducationEntry(id, "marksheetPreview", preview);
  };

  const handlePaccaFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    const entry = educationEntries.find((e) => e.id === id);
    if (entry?.paccaPreview) {
      URL.revokeObjectURL(entry.paccaPreview);
    }

    const preview = URL.createObjectURL(file);
    updateEducationEntry(id, "paccaFile", file);
    updateEducationEntry(id, "paccaPreview", preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const educationData = educationEntries.map(({ marksheetFile, marksheetPreview, paccaFile, paccaPreview, ...rest }) => rest);
    localStorage.setItem("education", JSON.stringify(educationData));
    navigate("/profile/Certifications");
  };

  const handleBack = () => {
    navigate("/profile/AddressInfo");
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      educationEntries.forEach((entry) => {
        if (entry.marksheetPreview) URL.revokeObjectURL(entry.marksheetPreview);
        if (entry.paccaPreview) URL.revokeObjectURL(entry.paccaPreview);
      });
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Educational Information</h1>
          <p className="text-muted-foreground">
            Add your educational qualifications. You can add multiple entries.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {educationEntries.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-4">No education entries added yet.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducationEntry}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education Entry
                </Button>
              </div>
            )}

            {educationEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="pt-6 border-t space-y-6 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Education Entry {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducationEntry(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`education-level-${entry.id}`}>
                    Education Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={entry.level}
                    onValueChange={(value) =>
                      updateEducationEntry(entry.id, "level", value)
                    }
                  >
                    <SelectTrigger id={`education-level-${entry.id}`}>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="higher">Higher</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${entry.id}`}>Degree/Certificate</Label>
                    <Input
                      id={`degree-${entry.id}`}
                      placeholder="e.g., Matriculation, Intermediate, Bachelor's"
                      value={entry.degree}
                      onChange={(e) =>
                        updateEducationEntry(entry.id, "degree", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`institution-${entry.id}`}>Institution</Label>
                    <Input
                      id={`institution-${entry.id}`}
                      placeholder="School/College/University name"
                      value={entry.institution}
                      onChange={(e) =>
                        updateEducationEntry(entry.id, "institution", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`board-${entry.id}`}>Board/University</Label>
                    <Input
                      id={`board-${entry.id}`}
                      placeholder="e.g., BISE Lahore, Punjab University"
                      value={entry.board}
                      onChange={(e) =>
                        updateEducationEntry(entry.id, "board", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`year-${entry.id}`}>Year of Completion</Label>
                    <Input
                      id={`year-${entry.id}`}
                      type="number"
                      placeholder="e.g., 2020"
                      value={entry.year}
                      onChange={(e) =>
                        updateEducationEntry(entry.id, "year", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`marks-${entry.id}`}>Marks/Percentage</Label>
                  <Input
                    id={`marks-${entry.id}`}
                    placeholder="e.g., 850/1100 or 85%"
                    value={entry.marks}
                    onChange={(e) =>
                      updateEducationEntry(entry.id, "marks", e.target.value)
                    }
                  />
                </div>

                {/* Attachments Section */}
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label>Upload Marksheet</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                        {entry.marksheetPreview ? (
                          <img
                            src={entry.marksheetPreview}
                            alt="Marksheet Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">No File</span>
                        )}
                      </div>
                      <input
                        ref={(el) => {
                          if (!fileInputRefs.current[entry.id]) {
                            fileInputRefs.current[entry.id] = { marksheet: null, pacca: null };
                          }
                          fileInputRefs.current[entry.id].marksheet = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                        onChange={(e) => handleMarksheetFileChange(entry.id, e)}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => fileInputRefs.current[entry.id]?.marksheet?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {entry.marksheetFile ? "Change File" : "Choose File"}
                      </Button>
                      {entry.marksheetFile && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {entry.marksheetFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Pacca Certificate</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                        {entry.paccaPreview ? (
                          <img
                            src={entry.paccaPreview}
                            alt="Pacca Certificate Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">No File</span>
                        )}
                      </div>
                      <input
                        ref={(el) => {
                          if (!fileInputRefs.current[entry.id]) {
                            fileInputRefs.current[entry.id] = { marksheet: null, pacca: null };
                          }
                          fileInputRefs.current[entry.id].pacca = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                        onChange={(e) => handlePaccaFileChange(entry.id, e)}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => fileInputRefs.current[entry.id]?.pacca?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {entry.paccaFile ? "Change File" : "Choose File"}
                      </Button>
                      {entry.paccaFile && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {entry.paccaFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {educationEntries.length > 0 && (
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducationEntry}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Education Entry
                </Button>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button type="submit" size="lg">
                Save & Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export { EducationalInfo };

// Certifications / Diploma Section
interface CertificationEntry {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  certificateFile: File | null;
  certificatePreview: string | null;
}

const Certifications = () => {
  const navigate = useNavigate();
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>([]);
  const certificateInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addCertificationEntry = () => {
    const newEntry: CertificationEntry = {
      id: Date.now().toString(),
      title: "",
      issuingOrganization: "",
      issueDate: "",
      expiryDate: "",
      certificateNumber: "",
      certificateFile: null,
      certificatePreview: null,
    };
    setCertificationEntries([...certificationEntries, newEntry]);
  };

  const removeCertificationEntry = (id: string) => {
    const entry = certificationEntries.find((e) => e.id === id);
    if (entry?.certificatePreview) {
      URL.revokeObjectURL(entry.certificatePreview);
    }
    setCertificationEntries(certificationEntries.filter((e) => e.id !== id));
  };

  const updateCertificationEntry = (id: string, field: keyof CertificationEntry, value: any) => {
    setCertificationEntries(
      certificationEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleCertificateFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    const entry = certificationEntries.find((e) => e.id === id);
    if (entry?.certificatePreview) {
      URL.revokeObjectURL(entry.certificatePreview);
    }

    const preview = URL.createObjectURL(file);
    updateCertificationEntry(id, "certificateFile", file);
    updateCertificationEntry(id, "certificatePreview", preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const certificationsData = certificationEntries.map(({ certificateFile, certificatePreview, ...rest }) => rest);
    localStorage.setItem("certifications", JSON.stringify(certificationsData));
    navigate("/profile/Experience");
  };

  const handleBack = () => {
    navigate("/profile/EducationalInfo");
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      certificationEntries.forEach((entry) => {
        if (entry.certificatePreview) URL.revokeObjectURL(entry.certificatePreview);
      });
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Certifications / Diploma</h1>
          <p className="text-muted-foreground">
            Add your professional certifications and diplomas. You can add multiple entries.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {certificationEntries.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-4">No certifications added yet.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertificationEntry}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            )}

            {certificationEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="pt-6 border-t space-y-6 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Certification {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertificationEntry(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`cert-title-${entry.id}`}>
                      Certification / Diploma Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`cert-title-${entry.id}`}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      value={entry.title}
                      onChange={(e) =>
                        updateCertificationEntry(entry.id, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`cert-org-${entry.id}`}>
                      Issuing Organization <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`cert-org-${entry.id}`}
                      placeholder="e.g., Amazon Web Services"
                      value={entry.issuingOrganization}
                      onChange={(e) =>
                        updateCertificationEntry(entry.id, "issuingOrganization", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`cert-issue-date-${entry.id}`}>Issue Date</Label>
                    <Input
                      id={`cert-issue-date-${entry.id}`}
                      type="date"
                      value={entry.issueDate}
                      onChange={(e) =>
                        updateCertificationEntry(entry.id, "issueDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`cert-expiry-date-${entry.id}`}>Expiry Date (if applicable)</Label>
                    <Input
                      id={`cert-expiry-date-${entry.id}`}
                      type="date"
                      value={entry.expiryDate}
                      onChange={(e) =>
                        updateCertificationEntry(entry.id, "expiryDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`cert-number-${entry.id}`}>Certificate Number</Label>
                  <Input
                    id={`cert-number-${entry.id}`}
                    placeholder="Enter certificate number"
                    value={entry.certificateNumber}
                    onChange={(e) =>
                      updateCertificationEntry(entry.id, "certificateNumber", e.target.value)
                    }
                  />
                </div>

                {/* Attachment Section */}
                <div className="space-y-2 pt-4">
                  <Label>Upload Certificate</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {entry.certificatePreview ? (
                        <img
                          src={entry.certificatePreview}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No File</span>
                      )}
                    </div>
                    <input
                      ref={(el) => {
                        certificateInputRefs.current[entry.id] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleCertificateFileChange(entry.id, e)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => certificateInputRefs.current[entry.id]?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {entry.certificateFile ? "Change File" : "Choose File"}
                    </Button>
                    {entry.certificateFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {entry.certificateFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {certificationEntries.length > 0 && (
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertificationEntry}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Certification
                </Button>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button type="submit" size="lg">
                Save & Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export { Certifications };

// Experience Information Section
interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
  experienceLetterFile: File | null;
  experienceLetterPreview: string | null;
}

const Experience = () => {
  const navigate = useNavigate();
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([]);
  const experienceInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

  const addExperienceEntry = () => {
    const newEntry: ExperienceEntry = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: "",
      experienceLetterFile: null,
      experienceLetterPreview: null,
    };
    setExperienceEntries([...experienceEntries, newEntry]);
  };

  const removeExperienceEntry = (id: string) => {
    const entry = experienceEntries.find((e) => e.id === id);
    if (entry?.experienceLetterPreview) {
      URL.revokeObjectURL(entry.experienceLetterPreview);
    }
    setExperienceEntries(experienceEntries.filter((e) => e.id !== id));
  };

  const updateExperienceEntry = (id: string, field: keyof ExperienceEntry, value: any) => {
    setExperienceEntries(
      experienceEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleExperienceLetterFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
      return;
    }

    const entry = experienceEntries.find((e) => e.id === id);
    if (entry?.experienceLetterPreview) {
      URL.revokeObjectURL(entry.experienceLetterPreview);
    }

    const preview = URL.createObjectURL(file);
    updateExperienceEntry(id, "experienceLetterFile", file);
    updateExperienceEntry(id, "experienceLetterPreview", preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const experienceData = experienceEntries.map(({ experienceLetterFile, experienceLetterPreview, ...rest }) => rest);
    localStorage.setItem("experience", JSON.stringify(experienceData));
    navigate("/dashboard");
  };

  const handleBack = () => {
    navigate("/profile/Certifications");
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      experienceEntries.forEach((entry) => {
        if (entry.experienceLetterPreview) URL.revokeObjectURL(entry.experienceLetterPreview);
      });
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Experience Information</h1>
          <p className="text-muted-foreground">
            Add your work experience. You can add multiple entries.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {experienceEntries.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-4">No experience entries added yet.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperienceEntry}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            )}

            {experienceEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="pt-6 border-t space-y-6 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Experience Entry {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperienceEntry(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`exp-job-title-${entry.id}`}>
                      Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`exp-job-title-${entry.id}`}
                      placeholder="e.g., Software Engineer"
                      value={entry.jobTitle}
                      onChange={(e) =>
                        updateExperienceEntry(entry.id, "jobTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exp-company-${entry.id}`}>
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`exp-company-${entry.id}`}
                      placeholder="Company name"
                      value={entry.company}
                      onChange={(e) =>
                        updateExperienceEntry(entry.id, "company", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`exp-type-${entry.id}`}>Employment Type</Label>
                    <Select
                      value={entry.employmentType}
                      onValueChange={(value) =>
                        updateExperienceEntry(entry.id, "employmentType", value)
                      }
                    >
                      <SelectTrigger id={`exp-type-${entry.id}`}>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exp-start-date-${entry.id}`}>Start Date</Label>
                    <Input
                      id={`exp-start-date-${entry.id}`}
                      type="date"
                      value={entry.startDate}
                      onChange={(e) =>
                        updateExperienceEntry(entry.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-current-${entry.id}`}
                      checked={entry.isCurrentJob}
                      onCheckedChange={(checked) =>
                        updateExperienceEntry(entry.id, "isCurrentJob", checked === true)
                      }
                    />
                    <Label
                      htmlFor={`exp-current-${entry.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      I currently work here
                    </Label>
                  </div>
                </div>

                {!entry.isCurrentJob && (
                  <div className="space-y-2">
                    <Label htmlFor={`exp-end-date-${entry.id}`}>End Date</Label>
                    <Input
                      id={`exp-end-date-${entry.id}`}
                      type="date"
                      value={entry.endDate}
                      onChange={(e) =>
                        updateExperienceEntry(entry.id, "endDate", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor={`exp-description-${entry.id}`}>Job Description</Label>
                  <textarea
                    id={`exp-description-${entry.id}`}
                    placeholder="Describe your responsibilities and achievements..."
                    value={entry.description}
                    onChange={(e) =>
                      updateExperienceEntry(entry.id, "description", e.target.value)
                    }
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4}
                  />
                </div>

                {/* Attachment Section */}
                <div className="space-y-2 pt-4">
                  <Label>Upload Experience Letter</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {entry.experienceLetterPreview ? (
                        <img
                          src={entry.experienceLetterPreview}
                          alt="Experience Letter Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No File</span>
                      )}
                    </div>
                    <input
                      ref={(el) => {
                        experienceInputRefs.current[entry.id] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleExperienceLetterFileChange(entry.id, e)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => experienceInputRefs.current[entry.id]?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {entry.experienceLetterFile ? "Change File" : "Choose File"}
                    </Button>
                    {entry.experienceLetterFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {entry.experienceLetterFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {experienceEntries.length > 0 && (
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperienceEntry}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Experience
                </Button>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button type="submit" size="lg">
                Save & Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export { Experience };