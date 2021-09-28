const passport =require('passport')
const User = require('./models/user')
const facebookStrategy = require('passport-facebook').Strategy

passport.serializeUser((user, done)=> {
    console.log('serialis #######');
    done(null, user.id);
  });
   
  passport.deserializeUser((id, done)=> {
    console.log('deserialis%%%%%%%');

    User.findById(id,  (err, user)=>{
      done(err, user);
    });
  });
  passport.use(new facebookStrategy({
    clientID: "367548338436116",
    clientSecret: "d9206c8b897cbb44542ed92eecb7cb5b",
    callbackURL: "http://localhost:8080",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
  },  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));