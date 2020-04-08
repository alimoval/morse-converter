const express = require('express');

const app = express();
const port = 8000;
const apiHandler = require('./src/routes/apiHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiHandler);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});