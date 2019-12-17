import mongoose from 'mongoose';
import uri from './db';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  // autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
};

const connectDBwithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(uri, options).then(() => {
    console.log('MongoDB is connected');
  }).catch((err) => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
    setTimeout(connectDBwithRetry, 5000);
  });
};

// mongoose.connect(uri, {
//   useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
// });


// mongoose.connection.once('open', () => {
//   console.log('connected to MongoDB');
// }).catch((err) => console.error('error MongoDb', err));

export default connectDBwithRetry;
