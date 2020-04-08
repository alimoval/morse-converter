const express = require('express');
const cors = require('cors');
const apiHandler = require('./src/routes/apiHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiHandler);

const port = 8000;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});