import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getProfile, upsertProfile, uploadDocument } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// multer storage config: store in backend/uploads/<userId>/filename
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const userId = req.user ? String(req.user._id) : "anonymous";
		const dest = path.join(__dirname, "..", "..", "uploads", userId);
		// ensure directory exists
		import('fs').then(fs => {
			fs.mkdirSync(dest, { recursive: true });
			cb(null, dest);
		}).catch(err => cb(err));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${file.fieldname}${ext}`);
	},
});

const upload = multer({ storage });

router.get("/", protect, getProfile);
router.put("/", protect, upsertProfile);
router.post("/upload", protect, upload.single("file"), uploadDocument);

export default router;
