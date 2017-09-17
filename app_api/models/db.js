var mongoose = require('mongoose');
var gracefulShutdown;
//create connection to mongedb
var dbURI = 'mongodb://localhost/Loc8r';
if (process.env.NODE_ENV === 'production') {
  /*
  remote mlab
  To connect using the mongo shell:
  mongo ds139954.mlab.com:39954/loc8r -u <dbuser> -p <dbpassword>
  */
  dbURI = 'mongodb://vcvt:360121@ds139954.mlab.com:39954/loc8r';
}
mongoose.connect(dbURI, {'useMongoClient': true});

gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
  });
};

/*to monitor when tha application stops we need to listen to the node.js process,
listening for an event called SIGINT*/
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  })
});
//connection status listen
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err)
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

//bring in your schemas & models
require('./locations');