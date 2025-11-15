import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Award, 
  Briefcase,
  FileText,
  Edit
} from "lucide-react";

interface ProfileData {
  personalInfo?: {
    fullName?: string;
    fatherName?: string;
    cnic?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    religion?: string;
    maritalStatus?: string;
    contact?: string;
    email?: string;
    passportPhoto?: string;
  };
  addressInfo?: {
    permanentAddress?: {
      address?: string;
      province?: string;
      district?: string;
      city?: string;
      postalCode?: string;
    };
    currentAddress?: {
      address?: string;
      province?: string;
      district?: string;
      city?: string;
      postalCode?: string;
    };
    alternateContact?: string;
    domicileInfo?: {
      district?: string;
      talukaTehsil?: string;
      domicileNo?: string;
      prcDNo?: string;
      issuanceDate?: string;
      prcDIssuanceDate?: string;
      urbanRural?: string;
      originalDuplicate?: string;
    };
  };
  education?: Array<{
    level?: string;
    degree?: string;
    institution?: string;
    board?: string;
    year?: string;
    marks?: string;
  }>;
  certifications?: Array<{
    title?: string;
    issuingOrganization?: string;
    issueDate?: string;
    expiryDate?: string;
    certificateNumber?: string;
  }>;
  experience?: Array<{
    jobTitle?: string;
    company?: string;
    employmentType?: string;
    startDate?: string;
    endDate?: string;
    isCurrentJob?: boolean;
    description?: string;
  }>;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({});

  useEffect(() => {
    // Load profile data from localStorage
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo") || "{}");
    const addressInfo = JSON.parse(localStorage.getItem("addressInfo") || "{}");
    const education = JSON.parse(localStorage.getItem("education") || "[]");
    const certifications = JSON.parse(localStorage.getItem("certifications") || "[]");
    const experience = JSON.parse(localStorage.getItem("experience") || "[]");

    setProfileData({
      personalInfo,
      addressInfo,
      education,
      certifications,
      experience,
    });
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-muted-foreground font-medium">{label}:</span>
      <span className="text-foreground">{value || "Not provided"}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
          <Button onClick={() => navigate("/profile/personal")}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Personal Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Personal Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <InfoRow label="Full Name" value={profileData.personalInfo?.fullName} />
              <InfoRow label="Father's Name" value={profileData.personalInfo?.fatherName} />
              <InfoRow label="CNIC Number" value={profileData.personalInfo?.cnic} />
              <InfoRow label="Date of Birth" value={formatDate(profileData.personalInfo?.dob)} />
              <InfoRow label="Gender" value={profileData.personalInfo?.gender} />
            </div>
            <div className="space-y-1">
              <InfoRow label="Nationality" value={profileData.personalInfo?.nationality} />
              <InfoRow label="Religion" value={profileData.personalInfo?.religion} />
              <InfoRow label="Marital Status" value={profileData.personalInfo?.maritalStatus} />
              <InfoRow label="Contact Number" value={profileData.personalInfo?.contact} />
              <InfoRow label="Email Address" value={profileData.personalInfo?.email} />
            </div>
          </div>
          {profileData.personalInfo?.passportPhoto && (
            <div className="mt-4 pt-4 border-t">
              <Label className="text-sm font-medium mb-2 block">Passport Photo</Label>
              <img
                src={profileData.personalInfo.passportPhoto}
                alt="Passport Photo"
                className="w-32 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
        </Card>

        {/* Address Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Address Information</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Permanent Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow 
                  label="Address" 
                  value={profileData.addressInfo?.permanentAddress?.address} 
                />
                <InfoRow 
                  label="Province" 
                  value={profileData.addressInfo?.permanentAddress?.province} 
                />
                <InfoRow 
                  label="District" 
                  value={profileData.addressInfo?.permanentAddress?.district} 
                />
                <InfoRow 
                  label="City/Town" 
                  value={profileData.addressInfo?.permanentAddress?.city} 
                />
                <InfoRow 
                  label="Postal Code" 
                  value={profileData.addressInfo?.permanentAddress?.postalCode} 
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-3">Current Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow 
                  label="Address" 
                  value={profileData.addressInfo?.currentAddress?.address || "Same as permanent"} 
                />
                <InfoRow 
                  label="Province" 
                  value={profileData.addressInfo?.currentAddress?.province || profileData.addressInfo?.permanentAddress?.province} 
                />
                <InfoRow 
                  label="District" 
                  value={profileData.addressInfo?.currentAddress?.district || profileData.addressInfo?.permanentAddress?.district} 
                />
                <InfoRow 
                  label="City/Town" 
                  value={profileData.addressInfo?.currentAddress?.city || profileData.addressInfo?.permanentAddress?.city} 
                />
                <InfoRow 
                  label="Postal Code" 
                  value={profileData.addressInfo?.currentAddress?.postalCode || profileData.addressInfo?.permanentAddress?.postalCode} 
                />
              </div>
            </div>

            {profileData.addressInfo?.alternateContact && (
              <div className="pt-4 border-t">
                <InfoRow 
                  label="Alternate Contact" 
                  value={profileData.addressInfo.alternateContact} 
                />
              </div>
            )}

            {profileData.addressInfo?.domicileInfo && (
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Domicile & PRC-D Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow 
                    label="Domicile District" 
                    value={profileData.addressInfo.domicileInfo.district} 
                  />
                  <InfoRow 
                    label="Taluka/Tehsil" 
                    value={profileData.addressInfo.domicileInfo.talukaTehsil} 
                  />
                  <InfoRow 
                    label="Domicile No" 
                    value={profileData.addressInfo.domicileInfo.domicileNo} 
                  />
                  <InfoRow 
                    label="PRC-D No" 
                    value={profileData.addressInfo.domicileInfo.prcDNo} 
                  />
                  <InfoRow 
                    label="Domicile Issuance Date" 
                    value={formatDate(profileData.addressInfo.domicileInfo.issuanceDate)} 
                  />
                  <InfoRow 
                    label="PRC-D Issuance Date" 
                    value={formatDate(profileData.addressInfo.domicileInfo.prcDIssuanceDate)} 
                  />
                  <InfoRow 
                    label="Urban/Rural" 
                    value={profileData.addressInfo.domicileInfo.urbanRural} 
                  />
                  <InfoRow 
                    label="Original/Duplicate" 
                    value={profileData.addressInfo.domicileInfo.originalDuplicate} 
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Educational Information */}
        {profileData.education && profileData.education.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Educational Information</h2>
            </div>
            <div className="space-y-6">
              {profileData.education.map((edu, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      {edu.level === "higher" ? "Higher" : edu.level === "middle" ? "Middle" : "Education"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Entry {index + 1}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoRow label="Degree/Certificate" value={edu.degree} />
                    <InfoRow label="Institution" value={edu.institution} />
                    <InfoRow label="Board/University" value={edu.board} />
                    <InfoRow label="Year of Completion" value={edu.year} />
                    <InfoRow label="Marks/Percentage" value={edu.marks} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Certifications */}
        {profileData.certifications && profileData.certifications.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Certifications / Diploma</h2>
            </div>
            <div className="space-y-6">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">Certification {index + 1}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoRow label="Title" value={cert.title} />
                    <InfoRow label="Issuing Organization" value={cert.issuingOrganization} />
                    <InfoRow label="Issue Date" value={formatDate(cert.issueDate)} />
                    <InfoRow label="Expiry Date" value={formatDate(cert.expiryDate) || "N/A"} />
                    <InfoRow label="Certificate Number" value={cert.certificateNumber} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Experience */}
        {profileData.experience && profileData.experience.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Experience Information</h2>
            </div>
            <div className="space-y-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">Experience {index + 1}</Badge>
                    {exp.isCurrentJob && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoRow label="Job Title" value={exp.jobTitle} />
                    <InfoRow label="Company" value={exp.company} />
                    <InfoRow label="Employment Type" value={exp.employmentType} />
                    <InfoRow label="Start Date" value={formatDate(exp.startDate)} />
                    <InfoRow 
                      label="End Date" 
                      value={exp.isCurrentJob ? "Present" : formatDate(exp.endDate)} 
                    />
                  </div>
                  {exp.description && (
                    <div className="mt-4 pt-4 border-t">
                      <Label className="text-sm font-medium mb-2 block">Job Description</Label>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {Object.keys(profileData).length === 0 || 
         (!profileData.personalInfo && 
          !profileData.addressInfo && 
          (!profileData.education || profileData.education.length === 0) &&
          (!profileData.certifications || profileData.certifications.length === 0) &&
          (!profileData.experience || profileData.experience.length === 0)) && (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Profile Data Found</h3>
            <p className="text-muted-foreground mb-6">
              Start filling out your profile to see your information here.
            </p>
            <Button onClick={() => navigate("/profile/personal")}>
              Create Profile
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

