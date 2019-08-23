const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true
  }
);

userSchema.method.encryptPassword = async password => {
  const salt = bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

userSchema.method.matchPassword = async password => {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
