import mongoose from "mongoose"

const openMongo = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"))
  await mongoose.connect(`${process.env.MONGODB_URI}/HealthLink`)
}

export default openMongo
