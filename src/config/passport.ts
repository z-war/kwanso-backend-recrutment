// const jwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
// const mongoose = require('mongoose')
// const User = mongoose.model('User')
// const keys = require('../config/keys')

// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// opts.secretOrKey = keys.secretOrKey

// module.exports = (passport) => {
//   passport.use(
//     new jwtStrategy(opts, (jwt_payload, done) => {
//       User.findById(jwt_payload.id)
//         .then((user) => {
//           if (user) {
//             return done(null, user)
//           }
//           return done(null, false)
//         })
//         .catch((err) => console.log(err))
//     })
//   )
// }
import passport from 'passport'
import passportLocal from 'passport-local'
// import passportApiKey from "passport-headerapikey";
import passportJwt from 'passport-jwt'
import User from '../models/User'
import config from '../config/keys'
const LocalStrategy = passportLocal.Strategy
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretOrKey,
    },
    function (jwtToken, done) {
      User.findOne(
        { email: jwtToken?.user?.email },
        function (err: any, user: any) {
          if (err) {
            console.log('err', err)
            return done(err, false)
          }
          if (user) {
            console.log('jwt user =>', user)
            return done(undefined, user, jwtToken)
          } else {
            console.log('jwt token =>', jwtToken)
            return done(undefined, false)
          }
        }
      )
    }
  )
)
