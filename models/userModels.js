const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name,email,password,confirm password,photo

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    requird: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-user'],
    default: 'user',
  },
  password: {
    type: String,
    requird: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    requird: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE and SAVE!!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same! ',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //only run this  function if password was actucally modified
  if (!this.isModified('password')) return next();

  //hash the password woth cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//query middle wear
userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//instance method -method that available in all documents

userSchema.methods.correctPassword = async function (
  candiadatePassword,
  userPassword
) {
  return await bcrypt.compare(candiadatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; //100<200
  }

  //false means not Changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 100;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
