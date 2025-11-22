import Profile from "../models/profile.model.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(200).json({ success: true, data: null });
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/profile
export const upsertProfile = async (req, res) => {
  try {
    const payload = req.body || {};
    const update = {
      user: req.user._id,
      personal: payload.personal || {},
      address: payload.address || {},
      education: payload.education || [],
      certifications: payload.certifications || [],
      experience: payload.experience || [],
      documents: payload.documents || {},
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Upsert profile error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/profile/upload
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const docKey = req.body.docKey || req.query.docKey;
    const fileUrl = `/uploads/${req.user._id}/${req.file.filename}`;

    // update profile documents or known locations
    const update = {};
    // generic place to store documents
    update[`documents.${docKey}`] = fileUrl;

    // also special-case known fields for backward compatibility
    if (docKey === "passportPhoto") update[`personal.passportPhoto`] = fileUrl;
    if (docKey === "domicile") update[`address.files.domicile`] = fileUrl;

    const profile = await Profile.findOneAndUpdate({ user: req.user._id }, { $set: update }, { upsert: true, new: true });

    return res.status(200).json({ success: true, data: profile, fileUrl });
  } catch (error) {
    console.error("Upload doc error:", error.message);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export default { getProfile, upsertProfile };
