import jwt from "jsonwebtoken"

const clinicianGate = async (req, res, next) => {
  const { dtoken } = req.headers
  if (!dtoken) {
    return res.json({ success: false, message: "Not Authorized Login Again" })
  }

  try {
    const payload = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.body.docId = payload.id
    next()
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: err.message })
  }
}

export default clinicianGate
