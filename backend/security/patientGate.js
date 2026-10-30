import jwt from "jsonwebtoken"

const patientGate = async (req, res, next) => {
  const { token } = req.headers
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = payload.id
    next()
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: err.message })
  }
}

export default patientGate
