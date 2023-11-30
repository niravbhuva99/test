const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

exports.getAllUser = async (req, res) => {
  try {
    const allUser = await User.find().populate('tours');

    res.status(200).json({
      user: allUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordUpdatedAt: req.body.passwordUpdatedAt,
      role: req.body.role,
      passwordResetTokenExpire: req.body.passwordResetTokenExpire,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);

    newUser.password = undefined;

    res.status(200).json({
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1 check if email and password is valid
  if (!email || !password) {
    res.send('you have entered invalid email or password');
  }
  //  2  check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.send('invalid email or password');
  }

  // 3 sending a token and loggedIn
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    token,
    message: 'you loggedIn',
  });
};

exports.protect = async (req, res, next) => {
  // getting token and check if there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res
      .status(500)
      .json({ status: 500, error: 'please send the token with your request' });
  }
  // 2 verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 check if user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    res.send('user is not exist');
  }
  // 4 if user changes password
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    res.status(401).json({
      status: 401,
      message: 'user recently changed password! please log in again.',
    });
  }

  // grant access to protected route
  req.user = freshUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.send('you don"t have a permission to perform this action');
    } else {
      next();
    }
  };
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  // 1 get user based on posted email
  const user = await User.findOne({ email });

  if (!user) {
    res.send('user not found 404');
  }
  //2 generate the random reset token
  user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3 send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `forgot your password submit a patch request with a new password to : ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token(valid is for 10min)',
      message,
    });

    res.send('successfully reset');
  } catch (error) {
    (user.passwordResetToken = undefined),
      (user.passwordResetTokenExpire = undefined);
    await user.save({ validateBeforeSave: false });

    res.send(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1 ger user based on the token7
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  // 2 if token has not expired , and there is user, set the new password

  if (!user) {
    return res.send('token is invalid or expired');
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  // 3 update chagedPasswordAt property for the user used pre middleware

  // 4 log the user in , send jwt
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    jwtToken,
    message: 'you logedIn',
  });
};

exports.updatePassword = async (req, res, next) => {
  // 1 get user from collection

  const user = await User.findById(req.user.id).select('+password');
  // 2 check if posted current password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    res.send('password is not correct');
  }
  //3 if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4 log user in, send jwt
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    jwtToken,
    message: 'you loggedIn',
  });
  next();
};

const filterObj = (body, ...fields) => {
  const newObj = {};
  Object.keys(body).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = body[el];
    }
  });
  return newObj;
};
exports.updateMe = async (req, res, next) => {
  const { name, email, passwordConfirm, password } = req.body;
  if (password || passwordConfirm) res.send('you can not update password here');

  const filterBody = filterObj(req.body, 'name', 'email');

  const user = await User.findOneAndUpdate({ _id: req.user._id }, filterBody, {
    new: true,
    runValidators: true,
  });

  res.json({
    message: 'user updated',
    user,
  });
  next();
};

// delete => when user want to delete query then we don't delete data from the database, what we do is we set a active property to false and when you use find then we dot't show that document in list for that we can use query middleware

exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }, { new: true });

  res.send('user is inactive');
  next();
};
