import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    personal: {
      fullName: String,
      fatherName: String,
      cnic: String,
      dob: String,
      gender: String,
      nationality: String,
      religion: String,
      maritalStatus: String,
      contact: String,
      email: String,
      passportPhoto: String,
    },
    address: {
      permanent: {
        address: String,
        province: String,
        district: String,
        city: String,
        postalCode: String,
      },
      current: {
        address: String,
        province: String,
        district: String,
        city: String,
        postalCode: String,
      },
      files: Object,
    },
    documents: {
      cnicCopy: String,
      passportPhoto: String,
      domicile: String,
      experienceLetter: String,
      other: Object,
    },
    education: Array,
    certifications: Array,
    experience: Array,
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
