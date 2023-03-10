const mongoose = require("mongoose");

const CourseShema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add Course Details"],
  },
  description: {
    type: String,
    required: [true, "Please add Description Details"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add Weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add Tuition"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add minimumSkill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
CourseShema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculating average cost...");
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};
//Calculate average cost after save
CourseShema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//Calculate average cost after remove
CourseShema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseShema);
