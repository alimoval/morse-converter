const mongoose = require('mongoose');

const Message = mongoose.model('Message', { value: String });

module.exports = { Message };
