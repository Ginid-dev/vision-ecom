const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  isActive: Boolean,
  phone: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
