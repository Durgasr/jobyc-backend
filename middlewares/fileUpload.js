import multer from "multer";
import path from "path";

// Configure storage
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = file.mimetype.startsWith("image/")
      ? "uploads/profileImages"
      : "uploads/resumes";

    // ✅ Create folder if not exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (allow pdf/doc/docx and images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .doc, .docx, .jpg, .jpeg, .png files allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
