const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name:{
        type:String,
        required:true,
    },
    password: {
      type: String,
      required: true,
    },
    habbits: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
