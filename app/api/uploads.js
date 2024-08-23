import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "../../public/Profile_Img");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    upload.single("profilepicture")(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: "File upload failed." });
      }
      const filePath = `/uploads/${req.file.filename}`;
      return res.status(200).json({ path: filePath });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
