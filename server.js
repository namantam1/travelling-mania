const dotenv = require('dotenv');
const mongoose = require('mongoose');

console.log('Env is ', process.env.NODE_ENV);

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreayeIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successfu!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting Down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
