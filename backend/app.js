import express from "express"
import cors from "cors"
import "dotenv/config"
import openMongo from "./db/mongo.js"
import wireCloudinary from "./db/media.js"
import patientRoutes from "./http/patientRoutes.js"
import clinicianRoutes from "./http/clinicianRoutes.js"
import staffRoutes from "./http/staffRoutes.js"

const app = express()
const listenPort = process.env.PORT || 4000

openMongo()
wireCloudinary()

app.use(express.json())
app.use(cors())

app.use("/api/patients", patientRoutes)
app.use("/api/clinicians", clinicianRoutes)
app.use("/api/staff", staffRoutes)

app.get("/", (_req, res) => {
  res.send("API Working")
})

app.listen(listenPort, () => console.log(`Server started on PORT:${listenPort}`))
