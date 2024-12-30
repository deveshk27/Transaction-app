const express = require("express");
const cors = require('cors');
const rootRouter = require('./routes/index.js');
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser);
app.use(express.json());

app.use('/api/v1', rootRouter);

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})