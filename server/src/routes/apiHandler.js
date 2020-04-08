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
const { charCodes, curseWords } = require('../../dictionary');

mongoose.connect(
  `${DB_HOST_PREFIX}://${DB_USER}:${DB_PASSWORD}@${DB_HOST_SUFFIX}:${DB_PORT}/${DB}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('successfully connected to DB');
});

function checkCurse(input) {
  return new Promise((resolve, reject) => {
    const result = [];
    input.split(' ').some(el => {
      let foo = curseWords.indexOf(el) >= 0 ? '@' : el;
      result.push(foo)
    });
    resolve(result.join(' '));
  });
}

function convertChars(input) {
  return new Promise((resolve, reject) => {
    const chars = input.split('');
    let result = '';
    for (i = 0; i < chars.length; i++) {
      if (chars[i] != ' ') {
        if (charCodes[chars[i]]) {
          result += charCodes[chars[i]] + '   ';
        } else if (chars[i] === '@') {
          result += '@' + '   ';
        }
      } else {
        result += '  ';
      }
    }
    resolve(result);
  });
}

const router = express.Router();

router.get('/metrics', async (req, res) => {
  const result = {};
  await Message.countDocuments((err, count) => {
    if (err) return console.error(err);
    result['count'] = count;
  });
  res.status(200).send(result);
});

router.post('/convert', (request, response) => {
  const input = request.body.input;
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