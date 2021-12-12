require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('socket.io')(3000);
const path = require('path');

const mainRouter = require('./routes');
const { MONGO_URI, PORT } = require('./configs');

// connect to mongodb
mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use('/public/', express.static(path.join(__dirname, 'assets')));

// use middleware to enable cors
app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

// main router
app.use('/', mainRouter);

app.use((err, req, res, next) => {
  console.log(err.name);
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

// Socket.io realtime
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
