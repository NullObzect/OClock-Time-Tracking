const uploader = require('../../utilities/singleFileUpload')

function avatarUpload(req, res, next) {
  const upload = uploader('avatars', ['image/jpeg', 'image/jpg', 'image/png'], 1000000, 'Only .jpg, jpeg, png format allowed!')

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      })
    } else {
      next()
    }
  })
}

module.exports = avatarUpload
