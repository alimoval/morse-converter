const express = require('express');
const mongoose = require('mongoose');
const {
  DB,
  DB_USER,
  DB_PASSWORD,
  DB_HOST_PREFIX,
  DB_HOST_SUFFIX,
  DB_PORT,
} = require('../database/config');
const { Message } = require('../database/models');
const {
  countTodayMessages,
  countThisWeekMessages,
  checkCurse,
  convertChars,
} = require('../methods/apiMethods');

mongoose.connect(
  `${DB_HOST_PREFIX}://${DB_USER}:${DB_PASSWORD}@${DB_HOST_SUFFIX}:${DB_PORT}/${DB}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('successfully connected to DB');
});

const router = express.Router();

router.get('/metrics', async (req, res) => {
  const messages = await Message.find((err, messages) => {
    if (err) throw new Error(err);
    return messages;
  });
  let result = {
    totalCount: messages.length,
    todayCount: countTodayMessages(messages),
    thisWeekCount: countThisWeekMessages(messages),
  }
  res.status(200).send(result);
});

router.post('/convert', (request, response) => {
  if (typeof request.body.input !== 'string') throw new Error('Input is not a String type');
  const input = request.body.input.toLowerCase();
  checkCurse(input)
    .then(res => convertChars(res))
    .then(res => {
      const message = new Message({
        input,
        morse: res,
      });
      message.save((err, result) => {
        if (err) throw new Error(err);
        response.status(200).send(result);
      });
    })
    .catch(err => console.error(err));
});

module.exports = router;
