const User = require('../models/userModel');
const factory = require('./handlerFactory');
exports.deleteUser = factory.deleteOne(User);
exports.update = factory.updateOne(User);
