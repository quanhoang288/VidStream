require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const path = require('path');
const http = require('http');

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

const httpServer = http.createServer(app);
// Socket.io realtime
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('SEND_NOTIFICATION', (notification) => {
    console.log('new noti: ', notification);
    socket.broadcast.emit('NEW_NOTIFICATION', notification);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.set('io', io);

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
