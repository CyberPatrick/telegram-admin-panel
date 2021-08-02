const { log, err, warning, success } = require('@cyber_patrick/colorfullog');
const path = require('path');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const parseVariables = require('dotenv-parse-variables');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
process.env = parseVariables(process.env);

const sessionHandler = require('./utils/sessionHandler');
const store = sessionHandler.createStore();
success('Connected to store');

const MongoDb = require('./utils/db');

let db;
let users;
let admin;

(async function() {
  db = await MongoDb();
  users = db.collection('users');
  admin = db.collection('admin');

  app.get('/', (req, res) => {
    if (req.session.login) { res.redirect('/panel'); return; }
    res.status(200).render('login');
  });
  
  app.get('/panel', (req, res) => {
    if (req.session.login) {
      res.status(200).render('panel');
    } else {
      res.sendStatus(403);
    }
  })
  
  app.post('/login', async (req, res) => {
    let data = await admin.findOne({ login: req.body.login });
    if (await bcrypt.compare(req.body.password, data.password)) {  
      req.session.login = req.body.login;
      res.redirect(200, '/panel');
      log(`${req.body.login} logged in as admin`);
    } else {
      log(`Bad password for ${req.body.login}`);
      res.sendStatus(401);
    }
  })

})();

store.on('error', error => {
  err('Can`t create store for session ' + error);
})

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.DEVELOPMENT ? false : true, maxAge: 1000 * 60 * 60 * 24 }
}))

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: 'hbs'
}));

if (process.env.DEVELOPMENT) {
  app.use(express.static('src'));
  app.set('views', './src/views/');
} else {
  app.use(express.static('dist'));
  app.set('views', './dist/views/');
}
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

// app.enable('view cache');

app.listen(process.env.PORT, () => {
  success(`Server started at ${process.env.PORT}`);
})