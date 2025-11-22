import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: "./.env" })

const app = express()
app.use(express.json())

const mongoUri = process.env.MONGO_URI || ""

mongoose.connect(mongoUri)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log("Mongo error", err))

app.get("/", (req, res) => {
  res.send("Server is working")
})

const PORT = 5000
app.listen(PORT, () => console.log("Server running"))
