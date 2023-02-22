const mongoose = require("mongoose")

const ConnectDB = async () => {
  const url = process.env.MONGO_URI
  mongoose.set("strictQuery", false)
  const conn = await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.log(`DB Connected Successfully On Host: ${conn.connection.host}`)
}
module.exports = ConnectDB
