const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const userModel = require('../dao/models/users.model');
const HashManager = require('../util/hash');
require('dotenv').config();
const jwt = require('passport-jwt');
const { generateToken } = require('../util/jwt');

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const HashController = new HashManager();

const cookieExtractor = (req) => {
  const token = req && req.cookies ? req.cookies['CookieJWT'] : null;
  console.log('COOKIE EXTRACOR', token);
  return token;
};

/* 
clientID: process.env.clientID,
clientSecret: process.env.clientSecret,
callbackURL: 'http://localhost:8080/githubcallback',
*/

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log('user already existst');
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: HashController.createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
        }
      },
    ),
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
      },

      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log('user doesnt exist');
            return done(null, false);
          }
          if (HashController.isValidPassword(user, password) == false)
            return done(null, false);

          const token = generateToken(user);
          user.token = token;
          return done(null, user);
        } catch (err) {
          console.log(err);
          return done(null, false);
        }
      },
    ),
  );
  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
      },
      async (asccesToken, refreshToken, profile, done) => {
        try {
          if (profile._json.email == null) return done(null, false);
          const user = await userModel.findOne({ email: profile._json.email });
          if (user) {
            const token = generateToken(user);
            user.token = token;
            console.log(user);
            return done(null, user);
          }
          const newUser = {
            first_name: profile._json.name,
            last_name: '',
            email: profile._json.email,
            age: profile._json.age,
            password: HashController.createHash(''),
          };
          const result = await userModel.create(newUser);
          console.log(result);

          return done(null, result);
        } catch (error) {
          console.log('error al iniciar sesion con gituhb' + error);
        }
      },
    ),
  );

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'secret',
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          console.log(error);
          return done(null, false);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

module.exports = initializePassport();
