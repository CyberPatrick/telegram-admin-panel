// mongodb+srv://Nikita:<password>@cluster0.n3yh8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const { err } = require('@cyber_patrick/colorfullog');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

module.exports = {
  createStore: function () {
    return new MongoDBStore({
      uri: `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/telegram-panel?retryWrites=true&w=majority`,
      collection: 'session',
      expires: 1000 * 60 * 60 * 24, // 1 day in milliseconds
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    }, function(error) {
      if (error) err('Can`t create session handler ' + error);
    })
  }
}