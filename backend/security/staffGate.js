import jwt from "jsonwebtoken"

const staffGate = async (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized Login Again" })
    }

    const payload = jwt.verify(atoken, process.env.JWT_SECRET)
    const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    if (payload !== expected) {
      return res.json({ success: false, message: "Not Authorized Login Again" })
    }

    next()
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: err.message })
  }
}

export default staffGate
