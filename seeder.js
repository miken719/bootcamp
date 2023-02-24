const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const Bootcamp = require("./Schema/bootcampSchema");

//Connect MONGO
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//FileSystem Read
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/bootcamps.json`, "utf-8")
);
//Import Data from JSON
const importBootcamps = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Import Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
//Delete all data
const deleteBootcamp = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Destroyed data...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// Command to actions
if (process.argv[2] === "-i") {
  importBootcamps();
}
if (process.argv[2] === "-d") {
  deleteBootcamp();
}
