const NodeGeoCoder = require("node-geocoder")

let options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null,
}
const geocoder = NodeGeoCoder(options)

module.exports = geocoder
