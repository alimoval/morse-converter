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

const router = express.Router();

mongoose.connect(
  `${DB_HOST_PREFIX}://${DB_USER}:${DB_PASSWORD}@${DB_HOST_SUFFIX}:${DB_PORT}/${DB}`,
  {useNewUrlParser: true, useUnifiedTopology: true}
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('successfully connected to DB');
});

router.get('/metrics', (req, res) => {
  Message.find((err, messages) => {
    if (err) return console.error(err);
    console.log(messages);
    res.status(200).send(messages);
  })
});

router.post('/convert', (req, res) => {
  res.status(200).send('converted string');
});

module.exports = router;