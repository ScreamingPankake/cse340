import express from "express"
import dotenv from "dotenv"

import staticRoutes from "./routes/staticRoutes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

/* Middleware */
app.use(express.static("public"))

/* View Engine */
app.set("view engine", "ejs")

/* Routes */
app.use("/", staticRoutes)

/* Server */
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})