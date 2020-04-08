const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    input: String,
    morse: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message };
