var mongoose = require('mongoose');

var dbUrl = 'mongodb://localhost/XiaoMiantiao'
mongoose.connect(dbUrl);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbUrl);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err);
});


mongoose.connection.on('disonnected', function() {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.once('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.kill(process.pid, 'SIGINT');
  });
});

process.once('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.kill(process.pid, 'SIGINT');
  });
});

require ('./characters');
