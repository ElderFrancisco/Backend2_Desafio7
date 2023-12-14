const express = require('express');
const http = require('http');
const routes = require('./routes');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
//const utilSocket = require('./util/socket');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const cookieParser = require('cookie-parser');
const { config, mongo } = require('./config/config');

class Server {
  constructor() {
    this.app = express();
    this.port = config.port || 3000;
    this.settings();
    this.server = http.createServer(this.app);
    this.connect();
    this.routes();
  }

  settings() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.engine('handlebars', exphbs.engine());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', __dirname + '/views');
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: mongo.mongo_url,
          dbName: mongo.mongo_name,
          ttl: 1100, //tiempo de vida de la sesion
        }),
        secret: config.privatekey,
        resave: true,
        saveUninitialized: true,
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    //utilSocket(this.server);
    this.app.use(cookieParser());
  }

  connect() {
    mongoose
      .connect(mongo.mongo_url, { dbName: mongo.mongo_name })
      .then(() => {
        console.log('db connected');
      })
      .catch((e) => {
        console.log('error al conectar mongo: ' + e);
      });
  }

  routes() {
    routes(this.app);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

module.exports = new Server();
