const multer = require('multer')
const path = require('path')
const createError = require('http-errors')

function uploader(
  subFolderPath,
  allowedFileTypes,
  maxFileSize,
  errorMsg,

) {
  const UploadFolder = `${__dirname}/../public/uploads/${subFolderPath}`

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UploadFolder)
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname)
      const fileName = `${file.originalname.replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-')}-${Date.now()}`
      cb(null, fileName + fileExt)
    },
  })
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(createError(errorMsg))
      }
    },
  })
  return upload
}
module.exports = uploader
