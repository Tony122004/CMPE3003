import multer from "multer"

const disk = multer.diskStorage({
  filename: (_req, file, done) => done(null, file.originalname),
})

const upload = multer({ storage: disk })

export default upload
