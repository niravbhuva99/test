const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please enter your password'],
    minLength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'password does not match',
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'please enter your email'],
    validate: [validator.isEmail, 'your email is not valid'],
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minLength: 8,
    select: false,
  },
  photo: {
    type: String,
  },
  passwordUpdatedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  console.log('run middleware');
  if (!this.isModified('password') || this.$isNew) return;
  this.passwordUpdatedAt = Date.now();
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  console.log(this.password);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordUpdatedAt) {
    const passwordChangeAt = parseInt(this.passwordUpdatedAt.getTime() / 1000);
    console.log(passwordChangeAt, jwtTimeStamp);
    return jwtTimeStamp < passwordChangeAt;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpire = Date.now() + 1 * 60 * 60 * 1000;
  console.log(
    resetToken,
    this.passwordResetToken,
    this.passwordResetTokenExpire
  );
  return resetToken;
};

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
